import { NextRequest, NextResponse } from "next/server";
import { resend, FROM, isAllowedFrom } from "@/lib/email/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    from, // e.g. "contact@roarbyte.com" or "firstname.lastname@roarbyte.com"
    to, // string or string[]
    subject,
    html,
    text,
    replyTo, // optional
  } = body ?? {};

  if (!from || !isAllowedFrom(from)) {
    return NextResponse.json(
      { error: "Invalid from address" },
      { status: 400 }
    );
  }

  const { data, error } = await resend.emails.send({
    from: `Roar Byte <${from}>`,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
    replyTo, // useful if you want replies to go elsewhere
  });

  if (error) return NextResponse.json(error, { status: 400 });
  return NextResponse.json(data);
}
