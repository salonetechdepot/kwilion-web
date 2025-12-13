// import { NextRequest, NextResponse } from "next/server";
// import { Resend } from "resend";

// export const runtime = "nodejs";

// const resend = new Resend(process.env.RESEND_API_KEY!);

// export async function POST(req: NextRequest) {
//   // IMPORTANT: use the RAW body for signature verification
//   const payload = await req.text();

//   const svix_id = req.headers.get("svix-id") ?? "";
//   const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
//   const svix_signature = req.headers.get("svix-signature") ?? "";

//   let event: any;
//   try {
//     event = resend.webhooks.verify({
//       payload,
//       headers: {
//         id: svix_id,
//         timestamp: svix_timestamp,
//         signature: svix_signature,
//       },
//       webhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
//     });
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Invalid webhook signature" },
//       { status: 401 }
//     );
//   }

//   // Example: inbound receiving event
//   if (event.type === "email.received") {
//     const { email_id, to, from, subject } = event.data;

//     // Webhook payload does NOT include full HTML/text body — you must fetch content via the Receiving API. :contentReference[oaicite:4]{index=4}
//     // TODO: store metadata in DB, then fetch full email content using Resend receiving endpoints.

//     // Route by "to" address:
//     const primaryTo = (Array.isArray(to) ? to[0] : to)?.toLowerCase?.() ?? "";
//     if (primaryTo.startsWith("contact@")) {
//       // handle contact inbox pipeline
//     } else if (primaryTo.startsWith("info@")) {
//       // handle info inbox pipeline
//     } else {
//       // handle employee inbox pipeline
//     }

//     return NextResponse.json({ ok: true });
//   }

//   // For all other event types
//   return NextResponse.json({ ok: true });
// }
