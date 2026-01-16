import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  // Reuse if already created
  if (transporter) return transporter;

  // If email is not configured, disable email safely
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_PORT ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    console.warn("Email not configured. Skipping email sending.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}

export async function sendOtpEmail(to: string, otp: string) {
  const transporter = getTransporter();

  // ⛔ During build or when email is not configured
  if (!transporter) return;

  const subject = "Verify your account";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>${subject}</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for <b>5 minutes</b>.</p>
      <p>If you didn’t request this, ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM as string,
    to,
    subject,
    html,
  });
}




// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// if(!process.env.RESEND_API_KEY){
//     throw new Error("RESEND_API_KEY is not defined");
// }

// export async function sendOtpEmail(
//     to:string,
//     otp:string,
//     purpose:"signup"|"login"
// ){
//     const subject= purpose==="signup" ? "Verify your account" : "Your login verification code" ;

//     const html = `
//     <div style="font-family: Arial, sans-serif;">
//       <h2>${subject}</h2>
//       <p>Your OTP is:</p>
//       <h1>${otp}</h1>
//       <p>This OTP is valid for <b>5 minutes</b>.</p>
//       <p>If you didn’t request this, ignore this email.</p>
//     </div>
//   `;

//     try {
//         const response = await resend.emails.send({
//             from: process.env.EMAIL_FROM as string,
//             to,
//             subject,
//             html,
//         });
        
//         console.log("Email sent successfully:", response);
//         return response;
//     } catch (error) {
//         console.error("Failed to send OTP email:", error);
//         throw new Error(`Failed to send OTP email: ${error}`);
//     }
// }