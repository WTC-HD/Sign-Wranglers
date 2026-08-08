import { Resend } from "resend";

const resendAPIKey = process.env.RESEND_API_KEY;

export const resend = new Resend(resendAPIKey);