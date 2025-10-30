// app/api/contact/route.ts
import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { ensureConnected, Contact } from "@/server/db/sequelize";

// Avoid barrels to prevent duplicate module copies
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

    // ⛑️ Guarantees a live connection and model registration
    await ensureConnected();

    // ✅ Use the bound class directly (no sequelize.models lookup)
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
