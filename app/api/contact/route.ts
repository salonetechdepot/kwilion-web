import { NextRequest, NextResponse } from "next/server";
import { ensureConnected } from "@/server/db/sequelize";

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
       RETURNING id`,
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

    const contactId = (result as any[])[0]?.id;
    console.log("✅ Production contact created via raw SQL, ID:", contactId);

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        id: contactId,
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
