// import { NextRequest, NextResponse } from "next/server";
// import { Resend } from "resend";

// export const runtime = "nodejs";

// const resend = new Resend(process.env.RESEND_API_KEY!);

// export async function POST(req: NextRequest) {
//   const payloadText = await req.text();

//   // Resend uses Svix headers; verify to secure your endpoint. :contentReference[oaicite:9]{index=9}
//   const svixId = req.headers.get("svix-id") || "";
//   const svixTimestamp = req.headers.get("svix-timestamp") || "";
//   const svixSignature = req.headers.get("svix-signature") || "";

//   let event: any;
//   try {
//     event = resend.webhooks.verify({
//       payload: payloadText,
//       headers: {
//         id: svixId,
//         timestamp: svixTimestamp,
//         signature: svixSignature,
//       },
//       webhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
//     });
//   } catch {
//     return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//   }

//   if (event.type !== "email.received") {
//     return NextResponse.json({ ok: true });
//   }

//   const { email_id, to, from, subject, attachments } = event.data;

//   // Route based on the recipient local-part
//   // Example: "contact@..." -> contact pipeline, "info@..." -> info pipeline, etc. :contentReference[oaicite:10]{index=10}
//   const recipients: string[] = to || [];
//   const primaryTo = recipients[0]?.toLowerCase() || "";

//   // 1) store metadata in DB (tickets/messages table)
//   // 2) fetch full content via Receiving API (body not in webhook) :contentReference[oaicite:11]{index=11}
//   // const full = await resend.emails.receiving.get({ emailId: email_id }) // (method name per docs)
//   // const att = await resend.emails.receiving.attachments.list({ emailId: email_id })

//   // Example routing logic:
//   if (primaryTo.startsWith("contact@")) {
//     // create/update a "Contact Us" conversation + notify your team
//   } else if (primaryTo.startsWith("info@")) {
//     // info inbox pipeline
//   } else {
//     // employee inbox pipeline (firstname.lastname@)
//   }

//   return NextResponse.json({ ok: true });
// }
