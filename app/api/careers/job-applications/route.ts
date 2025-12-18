import { NextRequest, NextResponse } from "next/server";
import { ensureConnected } from "@/server/db/sequelize";
import { QueryTypes } from "sequelize";
import crypto from "crypto";

import resend from "@/emails/resend";
import { TeamNotificationEmail, ApplicantConfirmationEmail } from "@/emails";
import { uploadToGCS } from "@/lib/gcs";

export const runtime = "nodejs";

/* ------------------------------ helpers ------------------------------ */

function parseList(v?: string) {
  return (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getString(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function getOptionalString(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : null;
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

function safeSlug(v?: string | null) {
  return (v || "general")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normEmail(v?: string | null) {
  return String(v || "")
    .trim()
    .toLowerCase();
}

function normPhone(v?: string | null) {
  return String(v || "").replace(/\D/g, ""); // digits only
}

function normName(first?: string | null, last?: string | null) {
  return `${String(first || "")
    .trim()
    .toLowerCase()} ${String(last || "")
    .trim()
    .toLowerCase()}`.trim();
}

/** dob in YYYY-MM-DD. returns NaN if invalid. */
function calcAgeFromISODate(dobISO: string) {
  const dob = new Date(`${dobISO}T00:00:00.000Z`);
  if (!Number.isFinite(dob.getTime())) return NaN;

  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const m = now.getUTCMonth() - dob.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}

type JobRow = {
  id: string;
  jobCode: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "closed";
  publishedAt: string | null;
  closesAt: string | null;
};

export async function POST(request: NextRequest) {
  try {
    /* ---------------------- content-type + form-data ---------------------- */
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { ok: false, error: "multipart/form-data required (resume upload)." },
        { status: 415 }
      );
    }

    const form = await request.formData();

    /* --------------------------- resume required -------------------------- */
    const resumeFile = form.get("resume");
    if (!(resumeFile instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Resume/CV is required." },
        { status: 400 }
      );
    }

    /* --------------------------- jobPostingId ----------------------------- */
    const jobPostingId = getOptionalString(form, "jobPostingId");
    if (jobPostingId && !isUuid(jobPostingId)) {
      return NextResponse.json(
        { ok: false, error: "Invalid jobPostingId" },
        { status: 400 }
      );
    }

    /* ------------------------------ body --------------------------------- */
    const body = {
      jobPostingId: jobPostingId || null,

      // fallback only (for general application)
      position:
        getOptionalString(form, "position") ||
        getOptionalString(form, "positionKey") ||
        null,

      firstName: getString(form, "firstName"),
      middleName: getOptionalString(form, "middleName"),
      lastName: getString(form, "lastName"),
      gender: getString(form, "gender"),
      dob: getString(form, "dob"),
      email: getString(form, "email"),
      phone: getString(form, "phone"),
      addressLine1: getString(form, "addressLine1"),
      city: getString(form, "city"),
      districtOrProvince: getString(form, "districtOrProvince"),
      country: getOptionalString(form, "country"),

      // Reference / Guarantor
      refRelationship: getString(form, "refRelationship"), // ✅ NEW
      refFirstName: getOptionalString(form, "refFirstName"),
      refLastName: getOptionalString(form, "refLastName"),
      refPhone: getOptionalString(form, "refPhone"),
      refEmail: getOptionalString(form, "refEmail"),
      refAddressLine1: getOptionalString(form, "refAddressLine1"),
      refCity: getOptionalString(form, "refCity"),
      refDistrictOrProvince: getOptionalString(form, "refDistrictOrProvince"),

      coverLetter: getOptionalString(form, "coverLetter"),
      experience: getString(form, "experience"),
      availability: getString(form, "availability"),
    };

    /* ------------------------ required fields check ----------------------- */
    type Body = typeof body;
    type RequiredKey =
      | "firstName"
      | "lastName"
      | "gender"
      | "dob"
      | "email"
      | "phone"
      | "addressLine1"
      | "city"
      | "districtOrProvince"
      | "experience"
      | "availability"
      | "refRelationship"; // ✅ NEW required

    const required: RequiredKey[] = [
      "firstName",
      "lastName",
      "gender",
      "dob",
      "email",
      "phone",
      "addressLine1",
      "city",
      "districtOrProvince",
      "experience",
      "availability",
      "refRelationship",
    ];

    const missing = required.filter((k) => !body[k].trim());
    if (missing.length) {
      return NextResponse.json(
        { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    /* ------------------------- VALIDATION: 18+ ---------------------------- */
    const age = calcAgeFromISODate(body.dob);
    if (!Number.isFinite(age)) {
      return NextResponse.json(
        { ok: false, error: "Invalid date of birth." },
        { status: 400 }
      );
    }
    if (age < 18) {
      return NextResponse.json(
        {
          ok: false,
          error: "Applicants must be at least 18 years old to apply.",
        },
        { status: 400 }
      );
    }

    /* -------- VALIDATION: applicant cannot be their own reference --------- */
    const applicantName = normName(body.firstName, body.lastName);
    const refName = normName(body.refFirstName, body.refLastName);

    const sameName = applicantName && refName && applicantName === refName;
    const sameEmail =
      normEmail(body.email) &&
      normEmail(body.refEmail) &&
      normEmail(body.email) === normEmail(body.refEmail);

    const samePhone =
      normPhone(body.phone) &&
      normPhone(body.refPhone) &&
      normPhone(body.phone) === normPhone(body.refPhone);

    if (sameName || sameEmail || samePhone) {
      return NextResponse.json(
        { ok: false, error: "Reference/guarantor cannot be the applicant." },
        { status: 400 }
      );
    }

    /* --------------------- resume validation (size/type) ------------------ */
    const maxBytes = 5 * 1024 * 1024;
    if (resumeFile.size > maxBytes) {
      return NextResponse.json(
        { ok: false, error: "Resume file too large (max 5MB)." },
        { status: 400 }
      );
    }

    const allowed = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);
    if (resumeFile.type && !allowed.has(resumeFile.type)) {
      return NextResponse.json(
        { ok: false, error: "Invalid file type. Allowed: PDF, DOC, DOCX." },
        { status: 400 }
      );
    }

    const sequelize = await ensureConnected();

    /* ------------------- Validate job posting if provided ------------------- */
    let job: JobRow | null = null;

    if (body.jobPostingId) {
      const rows = (await sequelize.query(
        `
        SELECT
          id,
          job_code AS "jobCode",
          title,
          slug,
          status,
          published_at AS "publishedAt",
          closes_at AS "closesAt"
        FROM job_postings
        WHERE id = $1
          AND status = 'published'
          AND (closes_at IS NULL OR closes_at >= NOW())
        LIMIT 1
        `,
        { bind: [body.jobPostingId], type: QueryTypes.SELECT }
      )) as any[];

      job = (rows?.[0] as JobRow) ?? null;

      if (!job) {
        return NextResponse.json(
          {
            ok: false,
            error: "Job not found, not published, or already closed.",
          },
          { status: 400 }
        );
      }
    }

    const positionLabel = job?.title || body.position || "General Application";
    const positionKey = job?.slug || safeSlug(body.position || "general");

    /* ---------------------------- GCS upload ---------------------------- */
    const bucketName = process.env.GCS_BUCKET_NAME;
    if (!bucketName) throw new Error("GCS_BUCKET_NAME is not set");

    const prefix = process.env.GCS_UPLOAD_PREFIX || "careers/resumes";
    const ext = resumeFile.name?.includes(".")
      ? resumeFile.name.split(".").pop()
      : "bin";

    const rand = crypto.randomBytes(12).toString("hex");
    const objectPath = `${prefix}/${positionKey}/${rand}.${ext}`;

    const buffer = Buffer.from(await resumeFile.arrayBuffer());

    const storageUrl = await uploadToGCS({
      bucketName,
      objectPath,
      buffer,
      contentType: resumeFile.type || undefined,
    });

    /* ---------------------------- DB insert ---------------------------- */
    type CreatedRow = { id: string; reference: string };

    const createdRows = await sequelize.query<CreatedRow>(
      `
      INSERT INTO job_applications (
        id,
        reference,
        job_posting_id,
        position_key,
        first_name,
        middle_name,
        last_name,
        gender,
        dob,
        email,
        phone,
        address_line_1,
        city,
        district_or_province,
        country,

        ref_relationship,
        ref_first_name,
        ref_last_name,
        ref_phone,
        ref_email,
        ref_address_line_1,
        ref_city,
        ref_district_or_province,

        cover_letter,
        experience,
        availability,
        status,
        raw_data,
        created_at,
        updated_at
      )
      VALUES (
        gen_random_uuid(),
        DEFAULT,
        $1, $2,
        $3, $4, $5,
        $6, $7,
        $8, $9,
        $10, $11, $12, $13,

        $14, $15, $16, $17, $18, $19, $20, $21,

        $22, $23, $24,
        'submitted',
        $25::jsonb,
        NOW(), NOW()
      )
      RETURNING id, reference
      `,
      {
        bind: [
          body.jobPostingId, // $1 job_posting_id
          job?.slug || body.position || null, // $2 position_key

          body.firstName, // $3
          body.middleName || null, // $4
          body.lastName, // $5
          body.gender, // $6
          body.dob, // $7
          body.email, // $8
          body.phone, // $9
          body.addressLine1, // $10
          body.city, // $11
          body.districtOrProvince, // $12
          body.country || null, // $13

          body.refRelationship || null, // $14 ✅ NEW
          body.refFirstName || null, // $15
          body.refLastName || null, // $16
          body.refPhone || null, // $17
          body.refEmail || null, // $18
          body.refAddressLine1 || null, // $19
          body.refCity || null, // $20
          body.refDistrictOrProvince || null, // $21

          body.coverLetter || null, // $22
          body.experience, // $23
          body.availability, // $24

          JSON.stringify({
            ...body,
            positionLabel,
            job: job
              ? {
                  id: job.id,
                  jobCode: job.jobCode,
                  title: job.title,
                  slug: job.slug,
                  publishedAt: job.publishedAt,
                  closesAt: job.closesAt,
                }
              : null,
            resume: {
              originalName: resumeFile.name,
              size: resumeFile.size,
              type: resumeFile.type,
              storageUrl,
              objectPath,
              bucketName,
            },
          }), // $25
        ],
        type: QueryTypes.SELECT,
      }
    );

    const created = createdRows?.[0];
    if (!created?.id || !created?.reference) {
      throw new Error("Insert failed: no id/reference returned.");
    }

    /* -------------------------- attachment record -------------------------- */
    await sequelize.query(
      `
      INSERT INTO job_application_attachments (
        id,
        application_id,
        kind,
        original_name,
        storage_url,
        mime_type,
        size_bytes,
        created_at,
        updated_at
      )
      VALUES (
        gen_random_uuid(),
        $1,
        'resume',
        $2,
        $3,
        $4,
        $5,
        NOW(), NOW()
      )
      `,
      {
        bind: [
          created.id,
          resumeFile.name,
          storageUrl,
          resumeFile.type || null,
          resumeFile.size || null,
        ],
        type: QueryTypes.INSERT,
      }
    );

    /* ------------------------------ emails ------------------------------ */
    const canSend = !!process.env.RESEND_API_KEY;
    const from =
      process.env.RESEND_FROM ||
      "Roar Byte Tech Solution <noreply@roarbyte.com>";

    const staffTo = parseList(process.env.RESEND_STAFF_TO);
    const bcc = parseList(process.env.RESEND_BCC);

    const applicationDate = new Date().toISOString();
    const jobCode = job?.jobCode || undefined;

    if (canSend) {
      const tasks: Promise<any>[] = [];

      if (staffTo.length) {
        tasks.push(
          resend.emails.send({
            from,
            to: staffTo,
            ...(bcc.length ? { bcc } : {}),
            subject: `New Job Application: ${body.firstName} ${body.lastName} • ${positionLabel}`,
            react: TeamNotificationEmail({
              firstName: body.firstName,
              lastName: body.lastName,
              email: body.email,
              phone: body.phone,
              position: positionLabel,
              location: `${body.city}, ${body.districtOrProvince}`,
              availability: body.availability,
              coverLetter: body.coverLetter || undefined,
              experience: body.experience || undefined,
              applicationDate,
              applicationId: created.id,
              applicationReference: created.reference,
              jobCode,
            }),
          })
        );
      }

      tasks.push(
        resend.emails.send({
          from,
          to: body.email,
          subject: "Thanks — we received your application",
          react: ApplicantConfirmationEmail({
            firstName: body.firstName,
            lastName: body.lastName,
            position: positionLabel,
            reference: created.reference, // requires prop in template
          } as any),
        })
      );

      await Promise.allSettled(tasks);
    }

    return NextResponse.json(
      {
        ok: true,
        reference: created.reference,
        resume: { storageUrl, bucket: bucketName, objectPath },
        email: { attempted: canSend },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/careers/job-applications failed:", error);

    const message =
      process.env.NODE_ENV === "development"
        ? error instanceof Error
          ? error.message
          : String(error)
        : "Failed to submit application";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { ensureConnected } from "@/server/db/sequelize";
// import { QueryTypes } from "sequelize";
// import crypto from "crypto";

// import resend from "@/emails/resend";
// import { TeamNotificationEmail, ApplicantConfirmationEmail } from "@/emails";
// import { uploadToGCS } from "@/lib/gcs";

// export const runtime = "nodejs";

// /* ------------------------------ helpers ------------------------------ */

// function parseList(v?: string) {
//   return (v || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
// }

// function getString(form: FormData, key: string) {
//   const v = form.get(key);
//   return typeof v === "string" ? v.trim() : "";
// }

// function getOptionalString(form: FormData, key: string) {
//   const v = form.get(key);
//   return typeof v === "string" ? v.trim() : null;
// }

// function isUuid(v: string) {
//   return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
//     v
//   );
// }

// function safeSlug(v?: string | null) {
//   return (v || "general")
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");
// }

// type JobRow = {
//   id: string;
//   jobCode: string;
//   title: string;
//   slug: string;
//   status: "draft" | "published" | "closed";
//   publishedAt: string | null;
//   closesAt: string | null;
// };

// export async function POST(request: NextRequest) {
//   try {
//     const contentType = request.headers.get("content-type") || "";
//     if (!contentType.includes("multipart/form-data")) {
//       return NextResponse.json(
//         { ok: false, error: "multipart/form-data required (resume upload)." },
//         { status: 415 }
//       );
//     }

//     const form = await request.formData();

//     const resumeFile = form.get("resume");
//     if (!(resumeFile instanceof File)) {
//       return NextResponse.json(
//         { ok: false, error: "Resume/CV is required." },
//         { status: 400 }
//       );
//     }

//     // ✅ NEW: jobPostingId is the source of truth (from Apply page)
//     const jobPostingId = getOptionalString(form, "jobPostingId");
//     if (jobPostingId && !isUuid(jobPostingId)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid jobPostingId" },
//         { status: 400 }
//       );
//     }

//     const body = {
//       jobPostingId: jobPostingId || null,

//       // Keep this for "general application" fallback only.
//       // Do NOT rely on it for real postings.
//       position:
//         getOptionalString(form, "position") ||
//         getOptionalString(form, "positionKey") ||
//         null,

//       firstName: getString(form, "firstName"),
//       middleName: getOptionalString(form, "middleName"),
//       lastName: getString(form, "lastName"),
//       gender: getString(form, "gender"),
//       dob: getString(form, "dob"),
//       email: getString(form, "email"),
//       phone: getString(form, "phone"),
//       addressLine1: getString(form, "addressLine1"),
//       city: getString(form, "city"),
//       districtOrProvince: getString(form, "districtOrProvince"),
//       country: getOptionalString(form, "country"),

//       refFirstName: getOptionalString(form, "refFirstName"),
//       refLastName: getOptionalString(form, "refLastName"),
//       refPhone: getOptionalString(form, "refPhone"),
//       refEmail: getOptionalString(form, "refEmail"),
//       refAddressLine1: getOptionalString(form, "refAddressLine1"),
//       refCity: getOptionalString(form, "refCity"),
//       refDistrictOrProvince: getOptionalString(form, "refDistrictOrProvince"),

//       coverLetter: getOptionalString(form, "coverLetter"),
//       experience: getString(form, "experience"),
//       availability: getString(form, "availability"),
//     };

//     type Body = typeof body;
//     type RequiredKey =
//       | "firstName"
//       | "lastName"
//       | "gender"
//       | "dob"
//       | "email"
//       | "phone"
//       | "addressLine1"
//       | "city"
//       | "districtOrProvince"
//       | "experience"
//       | "availability";

//     const required: RequiredKey[] = [
//       "firstName",
//       "lastName",
//       "gender",
//       "dob",
//       "email",
//       "phone",
//       "addressLine1",
//       "city",
//       "districtOrProvince",
//       "experience",
//       "availability",
//     ];

//     const missing = required.filter((k) => !body[k].trim());
//     if (missing.length) {
//       return NextResponse.json(
//         { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
//         { status: 400 }
//       );
//     }

//     // size/type validation
//     const maxBytes = 5 * 1024 * 1024;
//     if (resumeFile.size > maxBytes) {
//       return NextResponse.json(
//         { ok: false, error: "Resume file too large (max 5MB)." },
//         { status: 400 }
//       );
//     }

//     const allowed = new Set([
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ]);
//     if (resumeFile.type && !allowed.has(resumeFile.type)) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid file type. Allowed: PDF, DOC, DOCX." },
//         { status: 400 }
//       );
//     }

//     const sequelize = await ensureConnected();

//     /* ------------------- Validate job posting if provided ------------------- */
//     let job: JobRow | null = null;

//     if (body.jobPostingId) {
//       const rows = (await sequelize.query(
//         `
//         SELECT
//           id,
//           job_code AS "jobCode",
//           title,
//           slug,
//           status,
//           published_at AS "publishedAt",
//           closes_at AS "closesAt"
//         FROM job_postings
//         WHERE id = $1
//           AND status = 'published'
//           AND (closes_at IS NULL OR closes_at >= NOW())
//         LIMIT 1
//         `,
//         { bind: [body.jobPostingId], type: QueryTypes.SELECT }
//       )) as any[];

//       job = (rows?.[0] as JobRow) ?? null;

//       if (!job) {
//         return NextResponse.json(
//           {
//             ok: false,
//             error: "Job not found, not published, or already closed.",
//           },
//           { status: 400 }
//         );
//       }
//     }

//     const positionLabel = job?.title || body.position || "General Application";
//     const positionKey = job?.slug || safeSlug(body.position || "general");

//     /* ---------------------------- GCS upload ---------------------------- */

//     const bucketName = process.env.GCS_BUCKET_NAME;
//     if (!bucketName) throw new Error("GCS_BUCKET_NAME is not set");

//     const prefix = process.env.GCS_UPLOAD_PREFIX || "careers/resumes";
//     const ext = resumeFile.name?.includes(".")
//       ? resumeFile.name.split(".").pop()
//       : "bin";

//     const rand = crypto.randomBytes(12).toString("hex");
//     const objectPath = `${prefix}/${positionKey}/${rand}.${ext}`;

//     const buffer = Buffer.from(await resumeFile.arrayBuffer());

//     const storageUrl = await uploadToGCS({
//       bucketName,
//       objectPath,
//       buffer,
//       contentType: resumeFile.type || undefined,
//     });

//     /* ---------------------------- DB insert ---------------------------- */

//     type CreatedRow = { id: string; reference: string };

//     const createdRows = await sequelize.query<CreatedRow>(
//       `
//       INSERT INTO job_applications (
//         id,
//         reference,
//         job_posting_id,
//         position_key,
//         first_name,
//         middle_name,
//         last_name,
//         gender,
//         dob,
//         email,
//         phone,
//         address_line_1,
//         city,
//         district_or_province,
//         country,
//         ref_first_name,
//         ref_last_name,
//         ref_phone,
//         ref_email,
//         ref_address_line_1,
//         ref_city,
//         ref_district_or_province,
//         cover_letter,
//         experience,
//         availability,
//         status,
//         raw_data,
//         created_at,
//         updated_at
//       )
//       VALUES (
//         gen_random_uuid(),
//         DEFAULT,
//         $1, $2,
//         $3, $4, $5,
//         $6, $7,
//         $8, $9,
//         $10, $11, $12, $13,
//         $14, $15, $16, $17, $18, $19, $20,
//         $21, $22, $23,
//         'submitted',
//         $24::jsonb,
//         NOW(), NOW()
//       )
//       RETURNING id, reference
//       `,
//       {
//         bind: [
//           body.jobPostingId, // $1 job_posting_id
//           job?.slug || body.position || null, // $2 position_key (keep your column)
//           body.firstName,
//           body.middleName || null,
//           body.lastName,
//           body.gender,
//           body.dob,
//           body.email,
//           body.phone,
//           body.addressLine1,
//           body.city,
//           body.districtOrProvince,
//           body.country || null,
//           body.refFirstName || null,
//           body.refLastName || null,
//           body.refPhone || null,
//           body.refEmail || null,
//           body.refAddressLine1 || null,
//           body.refCity || null,
//           body.refDistrictOrProvince || null,
//           body.coverLetter || null,
//           body.experience,
//           body.availability,
//           JSON.stringify({
//             ...body,
//             positionLabel,
//             job: job
//               ? {
//                   id: job.id,
//                   jobCode: job.jobCode,
//                   title: job.title,
//                   slug: job.slug,
//                   publishedAt: job.publishedAt,
//                   closesAt: job.closesAt,
//                 }
//               : null,
//             resume: {
//               originalName: resumeFile.name,
//               size: resumeFile.size,
//               type: resumeFile.type,
//               storageUrl,
//               objectPath,
//               bucketName,
//             },
//           }),
//         ],
//         type: QueryTypes.SELECT,
//       }
//     );

//     const created = createdRows?.[0];
//     if (!created?.id || !created?.reference) {
//       throw new Error("Insert failed: no id/reference returned.");
//     }

//     /* -------------------------- attachment record -------------------------- */

//     await sequelize.query(
//       `
//       INSERT INTO job_application_attachments (
//         id,
//         application_id,
//         kind,
//         original_name,
//         storage_url,
//         mime_type,
//         size_bytes,
//         created_at,
//         updated_at
//       )
//       VALUES (
//         gen_random_uuid(),
//         $1,
//         'resume',
//         $2,
//         $3,
//         $4,
//         $5,
//         NOW(), NOW()
//       )
//       `,
//       {
//         bind: [
//           created.id,
//           resumeFile.name,
//           storageUrl,
//           resumeFile.type || null,
//           resumeFile.size || null,
//         ],
//         type: QueryTypes.INSERT,
//       }
//     );

//     /* ------------------------------ emails ------------------------------ */

//     const canSend = !!process.env.RESEND_API_KEY;
//     const from =
//       process.env.RESEND_FROM ||
//       "Roar Byte Tech Solution <noreply@roarbyte.com>";

//     const staffTo = parseList(process.env.RESEND_STAFF_TO);
//     const bcc = parseList(process.env.RESEND_BCC);

//     const applicationDate = new Date().toISOString();
//     const jobCode = job?.jobCode || null;

//     if (canSend) {
//       const tasks: Promise<any>[] = [];

//       if (staffTo.length) {
//         tasks.push(
//           resend.emails.send({
//             from,
//             to: staffTo,
//             ...(bcc.length ? { bcc } : {}),
//             subject: `New Job Application: ${body.firstName} ${body.lastName} • ${positionLabel}`,
//             react: TeamNotificationEmail({
//               firstName: body.firstName,
//               lastName: body.lastName,
//               email: body.email,
//               phone: body.phone,
//               position: positionLabel,
//               location: `${body.city}, ${body.districtOrProvince}`,
//               availability: body.availability,
//               coverLetter: body.coverLetter || undefined,
//               experience: body.experience || undefined,
//               applicationDate,
//               applicationId: created.id,
//               applicationReference: created.reference, // ✅ add to email template
//               jobCode: jobCode || undefined, // ✅ optional
//             }),
//           })
//         );
//       }

//       tasks.push(
//         resend.emails.send({
//           from,
//           to: body.email,
//           subject: "Thanks — we received your application",
//           react: ApplicantConfirmationEmail({
//             firstName: body.firstName,
//             lastName: body.lastName,
//             position: positionLabel,
//             reference: created.reference, // ✅ add to template
//           }),
//         })
//       );

//       await Promise.allSettled(tasks);
//     }

//     return NextResponse.json(
//       {
//         ok: true,
//         reference: created.reference, // ✅ UI uses this
//         resume: { storageUrl, bucket: bucketName, objectPath },
//         email: { attempted: canSend },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ POST /api/careers/job-applications failed:", error);

//     const message =
//       process.env.NODE_ENV === "development"
//         ? error instanceof Error
//           ? error.message
//           : String(error)
//         : "Failed to submit application";

//     return NextResponse.json({ ok: false, error: message }, { status: 500 });
//   }
// }
