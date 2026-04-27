"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendJobVerifiedEmail(job: any, userEmail: string = "4tekguyz@gmail.com") {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return { success: false, error: "Configuration error" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "RSG Work Order System <onboarding@resend.dev>", // Replace with verified domain in prod
      to: [userEmail],
      subject: `Verified: Work Order #${job.legacy_id}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; color: #111;">
          <h2 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #000; padding-bottom: 20px;">Work Order Verified</h2>
          <p style="font-size: 14px; color: #666; font-family: monospace; margin-top: 20px;">ID: ${job.legacy_id}</p>
          <h1 style="font-size: 24px; margin: 10px 0;">${job.client_name}</h1>
          <p style="font-size: 16px; margin: 4px 0;">${job.address}</p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 30px 0; border-left: 4px solid #E2B710;">
            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #888; text-transform: uppercase;">Job Scope</h3>
            <p style="margin: 0; font-weight: bold;">${job.job_type || 'N/A'}</p>
          </div>

          <p style="font-size: 13px; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            This is an automated notification from the RSG Operations Command Center.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email processing failed:", error);
    return { success: false, error };
  }
}
