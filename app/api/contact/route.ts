// app/api/contact/route.ts
import "server-only";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ensureConnected, getContactModel } from "@/server/db/sequelize";

// Direct imports (avoid barrels to prevent duplicate copies)
import resend from "@/emails/resend";
import { ContactAlertEmail, ContactConfirmationEmail } from "@/emails";

function parseList(v?: string) {
  return (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

type ContactBody = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactBody;

    for (const k of [
      "name",
      "company",
      "email",
      "phone",
      "service",
      "budget",
      "message",
    ] as const) {
      if (!body?.[k]) {
        return NextResponse.json(
          { ok: false, error: `Missing field: ${k}` },
          { status: 400 }
        );
      }
    }

    // ⛑️ Guarantees connection + model registration on THIS instance
    await ensureConnected();
    const Contact = getContactModel();

    const row = await Contact.create({
      name: body.name!,
      company: body.company!,
      email: body.email!,
      phone: body.phone!,
      service: body.service!,
      budget: body.budget!,
      message: body.message!,
    });

    // Emails (best-effort)
    const canSend = !!process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || "Kwilion <noreply@example.com>";
    const staffTo = parseList(process.env.RESEND_STAFF_TO);
    const bcc = parseList(process.env.RESEND_BCC);

    let staffResult: unknown = null;
    let userResult: unknown = null;

    if (canSend) {
      const tasks: Promise<unknown>[] = [];
      const submittedAt = new Date().toISOString();

      if (staffTo.length > 0) {
        tasks.push(
          resend.emails
            .send({
              from,
              to: staffTo,
              ...(bcc.length ? { bcc } : {}),
              subject: `New Contact: ${body.name} • ${body.service || "General"}`,
              react: ContactAlertEmail({
                name: body.name!,
                email: body.email!,
                phone: body.phone!,
                company: body.company!,
                service: body.service!,
                budget: body.budget!,
                message: body.message!,
                submittedAt,
              }),
            })
            .then((r) => (staffResult = r))
            .catch((err) => {
              console.error("Resend staff email failed:", err);
              staffResult = { error: String(err) };
            })
        );
      }

      tasks.push(
        resend.emails
          .send({
            from,
            to: body.email!,
            subject: "Thanks — we received your inquiry",
            react: ContactConfirmationEmail({
              name: body.name!,
              email: body.email!,
              phone: body.phone!,
              company: body.company!,
              message: body.message!,
            }),
          })
          .then((r) => (userResult = r))
          .catch((err) => {
            console.error("Resend user email failed:", err);
            userResult = { error: String(err) };
          })
      );

      await Promise.all(tasks);
    } else {
      console.warn("Skipping email send: RESEND_API_KEY not set.");
    }

    return NextResponse.json(
      {
        ok: true,
        id: row.id,
        createdAt: row.createdAt,
        email: { attempted: canSend, staff: staffResult, user: userResult },
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("POST /api/contact failed", e);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await ensureConnected();
  return NextResponse.json({ ok: true });
}

// // app/api/contact/route.ts

// // example: app/api/contact/route.ts
// import "server-only"; // makes it clear this file is server-only

// export const runtime = "nodejs"; // ✅ ensure Node.js runtime, not Edge
// export const dynamic = "force-dynamic"; // ✅ never statically pre-render

// import { NextResponse } from "next/server";
// import getSequelize from "@/server/db/sequelize";

// // Direct imports (avoid barrels to prevent duplicate module copies)
// import resend from "@/emails/resend";
// import { ContactAlertEmail, ContactConfirmationEmail } from "@/emails";

// // Helper: comma-separated env vars -> string[]
// function parseList(v?: string) {
//   return (v || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
// }

// type ContactBody = {
//   name?: string;
//   company?: string;
//   email?: string;
//   phone?: string;
//   service?: string;
//   budget?: string;
//   message?: string;
// };

// export async function POST(req: Request) {
//   try {
//     // 1) Parse + validate
//     const body = (await req.json()) as ContactBody;
//     const { name, company, email, phone, service, budget, message } =
//       body || {};

//     for (const [k, v] of Object.entries({
//       name,
//       company,
//       email,
//       phone,
//       service,
//       budget,
//       message,
//     })) {
//       if (!v) {
//         return NextResponse.json(
//           { ok: false, error: `Missing field: ${k}` },
//           { status: 400 }
//         );
//       }
//     }

//     // 2) DB: ensure connection, use the model registered on this instance
//     const sequelize = getSequelize();
//     await sequelize.authenticate();

//     const ContactModel = (sequelize.models as any).Contact;
//     if (!ContactModel) {
//       console.error(
//         "Contact model not found. Registered models:",
//         Object.keys(sequelize.models)
//       );
//       return NextResponse.json(
//         { ok: false, error: "Contact model not registered" },
//         { status: 500 }
//       );
//     }

//     const row = await ContactModel.create({
//       name,
//       company,
//       email,
//       phone,
//       service,
//       budget,
//       message,
//     });

//     // 3) Emails (best-effort; do not fail the request if email errors)
//     const canSend = !!process.env.RESEND_API_KEY;
//     const from = process.env.RESEND_FROM || "Kwilion <noreply@example.com>";
//     const staffTo = parseList(process.env.RESEND_STAFF_TO); // e.g. "info@kwilion.com,sales@kwilion.com"
//     const bcc = parseList(process.env.RESEND_BCC);
//     const submittedAt = new Date().toISOString();

//     let staffResult: unknown = null;
//     let userResult: unknown = null;

//     if (canSend) {
//       const tasks: Promise<unknown>[] = [];

//       // Staff alert (only if recipients configured)
//       if (staffTo.length > 0) {
//         tasks.push(
//           resend.emails
//             .send({
//               from,
//               to: staffTo,
//               ...(bcc.length ? { bcc } : {}),
//               subject: `New Contact: ${name} • ${service || "General"}`,
//               react: ContactAlertEmail({
//                 name: name!,
//                 email: email!,
//                 phone: phone!,
//                 company: company!,
//                 service: service!,
//                 budget: budget!,
//                 message: message!,
//                 submittedAt,
//               }),
//             })
//             .then((res) => (staffResult = res))
//             .catch((err) => {
//               console.error("Resend staff email failed:", err);
//               staffResult = { error: String(err) };
//             })
//         );
//       }

//       // User confirmation
//       tasks.push(
//         resend.emails
//           .send({
//             from,
//             to: email!,
//             subject: "Thanks — we received your inquiry",
//             react: ContactConfirmationEmail({
//               name: name!,
//               email: email!,
//               phone: phone!,
//               company: company!,
//               message: message!,
//             }),
//           })
//           .then((res) => (userResult = res))
//           .catch((err) => {
//             console.error("Resend user email failed:", err);
//             userResult = { error: String(err) };
//           })
//       );

//       await Promise.all(tasks);
//     } else {
//       console.warn("Skipping email send: RESEND_API_KEY not set.");
//     }

//     // 4) Success response
//     return NextResponse.json(
//       {
//         ok: true,
//         id: row.id,
//         createdAt: row.createdAt,
//         email: {
//           attempted: canSend,
//           staff: staffResult,
//           user: userResult,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (e) {
//     console.error("POST /api/contact failed", e);
//     return NextResponse.json(
//       { ok: false, error: "Server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   const sequelize = getSequelize();
//   await sequelize.authenticate();
//   return NextResponse.json({ ok: true });
// }
