import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn("RESEND_API_KEY is not set. Email sending will be skipped.");
}

const resend = new Resend(process.env.RESEND_API_KEY || ""); // empty is ok; we’ll guard calls
export default resend;
