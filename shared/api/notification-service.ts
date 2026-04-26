import { Resend } from "resend";
import { Job } from "../../entities/job/types";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendVerificationNotification(
  job: Job,
  userEmail: string,
) {
  const subject = `[SYSTEM ALERT] Job Verified: ${job.legacy_id} | ${job.client_name}`;
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; border: 2px solid #000000; font-family: sans-serif; background-color: #ffffff; color: #000000;">
      <div style="background-color: #000000; padding: 20px; text-align: center;">
        <span style="color: #cda03a; font-size: 24px; font-weight: 900; font-family: monospace; letter-spacing: 0.1em;">RS | FIELD OPS</span>
      </div>
      <div style="padding: 30px;">
        <h2 style="margin-top: 0; font-size: 20px; text-transform: uppercase;">Job Verification Successful</h2>
        <div style="border: 1px solid #000000; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0; font-family: monospace; font-size: 16px;"><strong>ID:</strong> ${job.legacy_id}</p>
          <p style="margin: 0 0 10px 0;"><strong>Client:</strong> ${job.client_name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${job.address}</p>
          <p style="margin: 0 0 10px 0;"><strong>Verified By:</strong> ${
            job.installer_id || "Unassigned"
          }</p>
          <p style="margin: 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">VERIFIED</span></p>
        </div>
        <p style="font-size: 12px; color: #666666; margin-bottom: 30px;">Site record is now immutable. All documentation has been synced to the Command Center.</p>
        
        <a href="https://rs-field-ops.netlify.app/admin/reports/${job.id}" style="display: block; width: 100%; box-sizing: border-box; background-color: #000000; color: #ffffff; text-align: center; padding: 15px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-family: monospace; letter-spacing: 0.1em;">OPEN COMMAND CENTER</a>
      </div>
    </div>
  `;

  if (!resend) {
    console.log("[DEMO MODE] Notification Email Payload:");
    console.log("To:", ["4tekguyz@gmail.com"]);
    console.log("Subject:", subject);
    console.log("Content:", htmlContent);
    return { success: true, message: "Demo mode: email logged to console" };
  }

  try {
    const data = await resend.emails.send({
      from: "Field Ops <noreply@realstone.com>",
      to: ["4tekguyz@gmail.com"], // Hardcoded for testing as requested
      subject,
      html: htmlContent,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error }; // Graceful failure as requested
  }
}
