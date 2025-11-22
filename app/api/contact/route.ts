import { NextRequest, NextResponse } from "next/server";
import { ensureConnected } from "@/server/db/sequelize";

export async function POST(request: NextRequest) {
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
    const missing = required.filter((field) => !body[field]);

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Ensure database connection and get the initialized Sequelize instance
    const sequelize = await ensureConnected();

    // Get the Contact model that's properly bound to the Sequelize instance
    const Contact = sequelize.model("Contact");

    // Create contact entry using the bound model
    const contact = await Contact.create({
      name: body.name,
      company: body.company,
      email: body.email,
      phone: body.phone,
      service: body.service,
      budget: body.budget,
      message: body.message,
    });

    console.log("Contact created:", contact.get("id"));

    return NextResponse.json(
      { message: "Contact form submitted successfully", id: contact.get("id") },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact failed", error);

    // More specific error handling
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
