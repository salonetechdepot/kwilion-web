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

    // Ensure database connection with production debugging
    console.log("🔗 Connecting to production database...");
    const sequelize = await ensureConnected();

    // Get the Contact model
    const Contact = sequelize.model("Contact");
    console.log("✅ Contact model found in production");

    // Create contact entry
    const contact = await Contact.create({
      name: body.name.trim(),
      company: body.company.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      service: body.service,
      budget: body.budget,
      message: body.message.trim(),
    });

    // FIX: Use toJSON() to get plain JavaScript object, not Sequelize instance
    const contactData = contact.toJSON();
    const contactId = contactData.id;

    console.log("✅ Production contact created, ID:", contactId);

    // FIX: Return a clean, serializable response
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

// import { NextRequest, NextResponse } from "next/server";
// import { ensureConnected } from "@/server/db/sequelize";

// export async function POST(request: NextRequest) {
//   console.log("📨 Contact form submission received in production");

//   try {
//     const body = await request.json();

//     // Validate required fields
//     const required = [
//       "name",
//       "company",
//       "email",
//       "phone",
//       "service",
//       "budget",
//       "message",
//     ];
//     const missing = required.filter((field) => !body[field]?.trim());

//     if (missing.length > 0) {
//       return NextResponse.json(
//         { error: `Missing required fields: ${missing.join(", ")}` },
//         { status: 400 }
//       );
//     }

//     // Ensure database connection with production debugging
//     console.log("🔗 Connecting to production database...");
//     const sequelize = await ensureConnected();

//     // Production-specific model check
//     const modelNames = sequelize.modelManager.all.map((m) => m.name);
//     console.log("📊 Production models available:", modelNames);

//     if (!modelNames.includes("Contact")) {
//       // Try to force re-register models
//       console.log("🔄 Contact model missing, attempting to re-register...");
//       const { Contact } = await import("@/server/models/Contact.model");
//       sequelize.addModels([Contact]);

//       // Check again
//       const updatedModels = sequelize.modelManager.all.map((m) => m.name);
//       console.log("📊 Models after re-registration:", updatedModels);

//       if (!updatedModels.includes("Contact")) {
//         throw new Error("Contact model could not be registered in production");
//       }
//     }

//     // Get the Contact model
//     const Contact = sequelize.model("Contact");
//     console.log("✅ Contact model found in production");

//     // Create contact entry
//     const contact = await Contact.create({
//       name: body.name.trim(),
//       company: body.company.trim(),
//       email: body.email.trim(),
//       phone: body.phone.trim(),
//       service: body.service,
//       budget: body.budget,
//       message: body.message.trim(),
//     });

//     const contactId = contact.get("id");
//     console.log("✅ Production contact created, ID:", contactId);

//     return NextResponse.json(
//       {
//         message: "Contact form submitted successfully",
//         id: contactId,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("❌ Production POST /api/contact failed:", error);

//     // More detailed production logging
//     if (error instanceof Error) {
//       console.error("Production error details:", {
//         name: error.name,
//         message: error.message,
//         stack: error.stack,
//       });
//     }

//     return NextResponse.json(
//       {
//         error:
//           "Failed to submit contact form. Please try again or contact us directly at info@kwilion.com",
//       },
//       { status: 500 }
//     );
//   }
// }
