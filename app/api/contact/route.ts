import { NextRequest, NextResponse } from "next/server";
import { ensureConnected } from "@/server/db/sequelize";

// Import your email dependencies
import resend from "@/emails/resend";
import { ContactAlertEmail, ContactConfirmationEmail } from "@/emails";

function parseList(v?: string) {
  return (v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  console.log("📨 Contact form submission received in production");

  try {
    const body = await request.json();

    // Validate required fields
    const required = [
      "name",
      "company",
      "email",
      "phone",
      "service",
      "budget",
      "message",
    ];
    const missing = required.filter((field) => !body[field]?.trim());

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Ensure database connection
    console.log("🔗 Connecting to production database...");
    const sequelize = await ensureConnected();

    // Use raw SQL to avoid model issues
    const [result] = await sequelize.query(
      `INSERT INTO contacts (name, company, email, phone, service, budget, message, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING id, created_at`,
      {
        bind: [
          body.name.trim(),
          body.company.trim(),
          body.email.trim(),
          body.phone.trim(),
          body.service,
          body.budget,
          body.message.trim(),
        ],
        type: "INSERT",
      }
    );

    const contactData = (result as any[])[0];
    const contactId = contactData?.id;
    const createdAt = contactData?.created_at;

    console.log("✅ Production contact created via raw SQL, ID:", contactId);

    // EMAIL FUNCTIONALITY (from your original code)
    const canSend = !!process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM || "Kwilion <noreply@kwilion.com>";
    const staffTo = parseList(process.env.RESEND_STAFF_TO);
    const bcc = parseList(process.env.RESEND_BCC);

    let staffResult: unknown = null;
    let userResult: unknown = null;

    if (canSend) {
      const tasks: Promise<unknown>[] = [];
      const submittedAt = new Date().toISOString();

      // Staff notification email
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

      // User confirmation email
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
      console.log("📧 Emails sent successfully");
    } else {
      console.warn("Skipping email send: RESEND_API_KEY not set.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        id: contactId,
        createdAt: createdAt,
        email: {
          attempted: canSend,
          staff: staffResult,
          user: userResult,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Production POST /api/contact failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to submit contact form. Please try again or contact us directly at info@kwilion.com",
      },
      { status: 500 }
    );
  }
}

// Keep the GET endpoint for health checks
export async function GET() {
  await ensureConnected();
  return NextResponse.json({ ok: true });
}
