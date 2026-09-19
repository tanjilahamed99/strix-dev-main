import nodemailer from "nodemailer";

export interface ConsultationBookingData {
    name: string;
    email: string;
    topic: string;
    date: string;
    timeSlot: string;
    timezone?: string;
    message?: string;
    googleMeetUrl?: string;
}

export interface ContactInquiryData {
    name: string;
    email: string;
    message: string;
}

/**
 * Creates Nodemailer transporter using environment variables.
 * If credentials are missing, falls back to ethereal / dev mock.
 */
function getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
        });
    }

    // Dev fallback if SMTP not configured yet
    return null;
}

/**
 * Generates an RFC 5545 iCalendar (.ics) string for the Google Meet consultation.
 */
export function generateIcsContent(data: ConsultationBookingData): string {
    const meetUrl =
        data.googleMeetUrl ||
        process.env.NEXT_PUBLIC_GOOGLE_MEET_URL ||
        "https://meet.google.com/strix-devs-meet";

    // Parse date & time into basic format
    // data.date: YYYY-MM-DD, data.timeSlot: e.g. "10:00 AM" or "14:00"
    const [time, meridiem] = (data.timeSlot || "10:00 AM").split(" ");
    let [hours, minutes] = (time || "10:00").split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    const validDate = new Date(`${data.date}T00:00:00`);
    validDate.setHours(hours, minutes, 0, 0);

    const startIso = validDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate = new Date(validDate.getTime() + 30 * 60 * 1000); // 30 minutes
    const endIso = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const nowIso = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Strix Devs//Consultation Booking//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:REQUEST",
        "BEGIN:VEVENT",
        `UID:strix-consultation-${Date.now()}@strixdevs.com`,
        `DTSTAMP:${nowIso}`,
        `DTSTART:${startIso}`,
        `DTEND:${endIso}`,
        `ORGANIZER;CN="Strix Devs":mailto:${process.env.SMTP_USER || "info@strixdevs.com"}`,
        `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${data.name}":mailto:${data.email}`,
        `SUMMARY:Strix Devs Free Consultation: ${data.topic}`,
        `DESCRIPTION:30-minute strategic consultation with Strix Devs engineering team.\\n\\nGoogle Meet link: ${meetUrl}\\nTopic: ${data.topic}\\nClient: ${data.name} (${data.email})\\nNotes: ${data.message || "None provided"}`,
        `LOCATION:${meetUrl}`,
        "STATUS:CONFIRMED",
        "SEQUENCE:0",
        "BEGIN:VALARM",
        "TRIGGER:-PT15M",
        "ACTION:DISPLAY",
        "DESCRIPTION:Reminder: Strix Devs Free Consultation in 15 minutes",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");
}

/**
 * Builds Google Calendar quick "Add to Calendar" link
 */
export function buildGoogleCalendarUrl(data: ConsultationBookingData): string {
    const meetUrl =
        data.googleMeetUrl ||
        process.env.NEXT_PUBLIC_GOOGLE_MEET_URL ||
        "https://meet.google.com/strix-devs-meet";

    const parsedDate = new Date(`${data.date} ${data.timeSlot}`);
    const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    const endDate = new Date(validDate.getTime() + 30 * 60 * 1000);

    const formatCalDate = (d: Date) =>
        d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const title = `Strix Devs Free Consultation: ${data.topic}`;
    const details = `30-Minute Free Strategy Consultation with Strix Devs.\n\nGoogle Meet: ${meetUrl}\nTopic: ${data.topic}\nNotes: ${data.message || "N/A"}\nWhatsApp Support: +880 1518933208`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title
    )}&dates=${formatCalDate(validDate)}/${formatCalDate(
        endDate
    )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(meetUrl)}`;
}

/**
 * Modern Dark-Themed Branded HTML Template for Client Auto-Reply
 */
export function buildClientConfirmationHtml(data: ConsultationBookingData): string {
    const meetUrl =
        data.googleMeetUrl ||
        process.env.NEXT_PUBLIC_GOOGLE_MEET_URL ||
        "https://meet.google.com/strix-devs-meet";
    const googleCalUrl = buildGoogleCalendarUrl(data);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Confirmed - Strix Devs</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0a0a0a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e5e5e5;
    }
    .wrapper {
      width: 100%;
      background-color: #0a0a0a;
      padding: 40px 10px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #121212;
      border: 1px solid #262626;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }
    .header {
      padding: 32px 32px 24px;
      border-bottom: 1px solid #222222;
      background: linear-gradient(180deg, #171717 0%, #121212 100%);
      text-align: center;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
    }
    .brand-sub {
      color: #a3a3a3;
      font-weight: 300;
      margin-left: 4px;
    }
    .badge {
      display: inline-block;
      margin-top: 14px;
      padding: 6px 14px;
      background-color: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 999px;
      color: #34d399;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .content {
      padding: 32px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    p {
      color: #a3a3a3;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .meeting-card {
      background-color: #171717;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .meeting-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #222222;
      font-size: 14px;
    }
    .meeting-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .meeting-label {
      color: #737373;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.1em;
      font-weight: 600;
    }
    .meeting-val {
      color: #ffffff;
      font-weight: 500;
      text-align: right;
    }
    .btn-primary {
      display: block;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      background-color: #ffffff;
      color: #000000 !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 24px;
      border-radius: 8px;
      margin-bottom: 12px;
      transition: background-color 0.2s;
    }
    .btn-secondary {
      display: block;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      background-color: transparent;
      border: 1px solid #333333;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 8px;
      margin-bottom: 28px;
    }
    .agenda-box {
      border-left: 2px solid #34d399;
      padding-left: 16px;
      margin-bottom: 28px;
    }
    .agenda-title {
      font-size: 13px;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }
    .agenda-list {
      margin: 0;
      padding-left: 18px;
      color: #a3a3a3;
      font-size: 14px;
      line-height: 1.8;
    }
    .footer {
      padding: 24px 32px;
      background-color: #0c0c0c;
      border-top: 1px solid #1e1e1e;
      text-align: center;
      font-size: 12px;
      color: #525252;
    }
    .footer a {
      color: #737373;
      text-decoration: none;
      margin: 0 8px;
    }
    .contact-line {
      margin-top: 10px;
      color: #737373;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-title">STRIX<span class="brand-sub">DEVS</span></div>
        <div class="badge">Google Meet Consultation Confirmed</div>
      </div>
      <div class="content">
        <h1>Hi ${data.name}, your appointment is set!</h1>
        <p>
          Thank you for scheduling a consultation with Strix Devs. We have reserved a 30-minute dedicated strategy session on Google Meet to analyze your requirements and discuss the best architecture for your project.
        </p>

        <div class="meeting-card">
          <table width="100%" cellpadding="6" cellspacing="0" style="color: #e5e5e5; font-size: 14px;">
            <tr>
              <td style="color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Focus Topic</td>
              <td style="text-align: right; font-weight: 600; color: #ffffff;">${data.topic}</td>
            </tr>
            <tr>
              <td style="color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Date</td>
              <td style="text-align: right; font-weight: 600; color: #ffffff;">${data.date}</td>
            </tr>
            <tr>
              <td style="color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Time Slot</td>
              <td style="text-align: right; font-weight: 600; color: #34d399;">${data.timeSlot} ${data.timezone ? `(${data.timezone})` : ""}</td>
            </tr>
            <tr>
              <td style="color: #737373; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Platform</td>
              <td style="text-align: right; font-weight: 600; color: #ffffff;">Google Meet (Video Call)</td>
            </tr>
          </table>
        </div>

        <a href="${meetUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">
          Join Google Meet Call
        </a>

        <a href="${googleCalUrl}" class="btn-secondary" target="_blank" rel="noopener noreferrer">
          📅 Add to Google Calendar
        </a>

        <div class="agenda-box">
          <div class="agenda-title">What We Will Cover in 30 Minutes</div>
          <ol class="agenda-list">
            <li>Analyze your product goals, users, and core technical requirements</li>
            <li>Explore recommended modern tech stack options (Next.js, AI/RAG, APIs, Cloud)</li>
            <li>Define realistic development milestones, timeline, and preliminary budget</li>
            <li>Open technical Q&A with our engineering lead</li>
          </ol>
        </div>

        <p style="font-size: 13px; color: #737373; margin-bottom: 0;">
          Need to reschedule or have immediate questions? Reach us anytime directly via WhatsApp at
          <a href="https://wa.me/+8801518933208" style="color: #34d399; text-decoration: none;">+880 1518933208</a>
          or reply to this email.
        </p>
      </div>
      <div class="footer">
        <div>© ${new Date().getFullYear()} Strix Devs — Modern Web & AI Development Agency</div>
        <div class="contact-line">
          <a href="https://strixdevs.com">Website</a> •
          <a href="https://linkedin.com/company/strixdevs">LinkedIn</a> •
          <a href="mailto:info@strixdevs.com">info@strixdevs.com</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Team Notification HTML Template
 */
export function buildTeamNotificationHtml(data: ConsultationBookingData): string {
    const meetUrl =
        data.googleMeetUrl ||
        process.env.NEXT_PUBLIC_GOOGLE_MEET_URL ||
        "https://meet.google.com/strix-devs-meet";

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0f0f0f; color: #f3f3f3; padding: 20px; }
    .card { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 24px; max-width: 600px; margin: 0 auto; }
    h2 { color: #34d399; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    td { padding: 8px 0; border-bottom: 1px solid #262626; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; width: 140px; }
    .val { color: #fff; font-weight: bold; }
    .btn { display: inline-block; margin-top: 20px; background: #34d399; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🚀 New Google Meet Consultation Booked!</h2>
    <p>A new client has scheduled a free consultation session.</p>
    <table>
      <tr><td class="label">Client Name</td><td class="val">${data.name}</td></tr>
      <tr><td class="label">Client Email</td><td class="val"><a href="mailto:${data.email}" style="color: #38bdf8;">${data.email}</a></td></tr>
      <tr><td class="label">Topic</td><td class="val">${data.topic}</td></tr>
      <tr><td class="label">Date</td><td class="val">${data.date}</td></tr>
      <tr><td class="label">Time Slot</td><td class="val">${data.timeSlot} ${data.timezone ? `(${data.timezone})` : ""}</td></tr>
      <tr><td class="label">Google Meet</td><td class="val"><a href="${meetUrl}" style="color: #38bdf8;">${meetUrl}</a></td></tr>
      <tr><td class="label">Client Notes</td><td class="val">${data.message || "No notes provided"}</td></tr>
    </table>
    <a href="${meetUrl}" class="btn" target="_blank">Open Google Meet Room</a>
  </div>
</body>
</html>
`;
}

/**
 * Dispatch consultation emails to both Client and Team
 */
export async function sendConsultationEmails(data: ConsultationBookingData) {
    const transporter = getTransporter();
    const teamReceiver = process.env.CONTACT_RECEIVER_EMAIL || "info@strixdevs.com";
    const sender = process.env.SMTP_USER || "info@strixdevs.com";
    const icsContent = generateIcsContent(data);

    const clientHtml = buildClientConfirmationHtml(data);
    const teamHtml = buildTeamNotificationHtml(data);

    if (!transporter) {
        console.warn(
            "[DEV MODE] SMTP credentials not set in .env.local. Simulating consultation email delivery:",
            {
                client: data.email,
                team: teamReceiver,
                topic: data.topic,
                date: data.date,
                time: data.timeSlot,
            }
        );
        return { success: true, mode: "simulated" };
    }

    // 1. Send confirmation to user with calendar .ics attachment
    const clientMailPromise = transporter.sendMail({
        from: `"Strix Devs" <${sender}>`,
        to: data.email,
        subject: `Confirmed: Free Strategy Consultation on Google Meet (${data.topic})`,
        html: clientHtml,
        attachments: [
            {
                filename: "strix-devs-consultation.ics",
                content: icsContent,
                contentType: "text/calendar; charset=utf-8; method=REQUEST",
            },
        ],
    });

    // 2. Send notification to Strix Devs team
    const teamMailPromise = transporter.sendMail({
        from: `"Strix Devs Booking" <${sender}>`,
        to: teamReceiver,
        replyTo: data.email,
        subject: `New Google Meet Consultation: ${data.name} - ${data.topic}`,
        html: teamHtml,
        attachments: [
            {
                filename: "strix-devs-consultation.ics",
                content: icsContent,
                contentType: "text/calendar; charset=utf-8; method=REQUEST",
            },
        ],
    });

    await Promise.all([clientMailPromise, teamMailPromise]);
    return { success: true, mode: "smtp" };
}

/**
 * Send standard general contact inquiry email
 */
export async function sendGeneralContactEmail(data: ContactInquiryData) {
    const transporter = getTransporter();
    const primaryReceiver = "ajshajimmax@gmail.com";
    const strixCcEmail = process.env.CONTACT_RECEIVER_EMAIL || "info@strixdevs.com";
    const sender = process.env.SMTP_USER || "info@strixdevs.com";

    const userReplyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #eee; margin: 0; padding: 24px; }
    .card { background: #121212; border: 1px solid #262626; border-radius: 12px; padding: 32px; max-width: 580px; margin: 0 auto; }
    .brand { font-size: 20px; font-weight: 800; letter-spacing: 0.15em; color: #fff; text-transform: uppercase; margin-bottom: 24px; border-bottom: 1px solid #222; padding-bottom: 16px; }
    h2 { color: #fff; font-size: 20px; margin-top: 0; }
    p { color: #a3a3a3; line-height: 1.6; font-size: 14px; }
    .highlight { background: #181818; border: 1px solid #2a2a2a; border-radius: 8px; padding: 16px; margin: 20px 0; color: #e5e5e5; font-size: 13px; }
    .footer { margin-top: 30px; font-size: 12px; color: #555; border-top: 1px solid #1e1e1e; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">STRIX DEVS</div>
    <h2>Thank You for Contacting Strix Devs</h2>
    <p>Hi ${data.name},</p>
    <p>We have received your message regarding your project. An engineering lead from our team is reviewing your requirements and will reply with recommendations within 24 hours.</p>
    <div class="highlight">
      <strong>Your Message:</strong><br>
      <span style="white-space: pre-wrap; color: #ccc;">${data.message}</span>
    </div>
    <p>If your inquiry is time-sensitive or you prefer a quick discussion, reach our lead engineer directly on WhatsApp: <a href="https://wa.me/+8801518933208" style="color: #34d399; text-decoration: none;">+880 1518933208</a>.</p>
    <div class="footer">
      © ${new Date().getFullYear()} Strix Devs • Modern Web Applications, SaaS & AI Systems<br>
      Toronto, Canada • Operating Worldwide
    </div>
  </div>
</body>
</html>`;

    const teamAlertHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0b0b; color: #f3f3f3; padding: 24px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #161616; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; }
    .header { background: #1f1f1f; padding: 20px 24px; border-bottom: 1px solid #2d2d2d; }
    .title { margin: 0; color: #34d399; font-size: 18px; font-weight: bold; }
    .content { padding: 24px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    td { padding: 10px 0; border-bottom: 1px solid #262626; }
    .label { color: #888; text-transform: uppercase; font-size: 11px; width: 120px; }
    .val { color: #fff; font-weight: 600; }
    .msg-box { background: #1e1e1e; border: 1px solid #2e2e2e; border-radius: 8px; padding: 16px; white-space: pre-wrap; font-size: 13px; line-height: 1.6; color: #e0e0e0; }
    .footer { padding: 16px 24px; background: #111; font-size: 11px; color: #666; border-top: 1px solid #222; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h3 class="title">📬 New Contact Form Message</h3>
    </div>
    <div class="content">
      <table>
        <tr><td class="label">Sender Name</td><td class="val">${data.name}</td></tr>
        <tr><td class="label">Email</td><td class="val"><a href="mailto:${data.email}" style="color: #38bdf8;">${data.email}</a></td></tr>
        <tr><td class="label">Received At</td><td class="val">${new Date().toLocaleString()}</td></tr>
      </table>
      <div style="font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 6px;">Message Content:</div>
      <div class="msg-box">${data.message}</div>
      <div style="margin-top: 20px; text-align: center;">
        <a href="mailto:${data.email}?subject=Re: Your Inquiry with Strix Devs" style="display: inline-block; background: #34d399; color: #000; padding: 10px 20px; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 13px;">Reply to Client</a>
      </div>
    </div>
    <div class="footer">
      Sent to ${primaryReceiver} with CC to ${strixCcEmail}. Saved to Strix Devs Database.
    </div>
  </div>
</body>
</html>`;

    if (!transporter) {
        console.warn(
            "[DEV MODE] Simulating general contact email delivery:",
            {
                client: data.email,
                primaryAdmin: primaryReceiver,
                cc: strixCcEmail,
                name: data.name,
            }
        );
        return { success: true, mode: "simulated" };
    }

    await Promise.all([
        // Confirmation to client
        transporter.sendMail({
            from: `"Strix Devs" <${sender}>`,
            to: data.email,
            subject: `Thank you for contacting Strix Devs — Message Received`,
            html: userReplyHtml,
        }),
        // Alert to ajshajimmax@gmail.com with strixdevs CC
        transporter.sendMail({
            from: `"Strix Devs Inquiries" <${sender}>`,
            to: primaryReceiver,
            cc: strixCcEmail,
            replyTo: data.email,
            subject: `📬 New Contact Inquiry from ${data.name}`,
            html: teamAlertHtml,
        }),
    ]);

    return { success: true, mode: "smtp" };
}

/**
 * Visitor: Booking Request Received (Pending Admin Confirmation)
 */
export function buildClientPendingHtml(data: ConsultationBookingData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e5e5e5; }
    .wrapper { width: 100%; background-color: #0a0a0a; padding: 40px 10px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #262626; border-radius: 12px; overflow: hidden; }
    .header { padding: 32px; border-bottom: 1px solid #222; background: #171717; text-align: center; }
    .brand-title { font-size: 22px; font-weight: 800; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase; }
    .brand-sub { color: #a3a3a3; font-weight: 300; }
    .badge { display: inline-block; margin-top: 14px; padding: 6px 14px; background-color: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.4); border-radius: 999px; color: #facc15; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .content { padding: 32px; }
    h1 { font-size: 22px; color: #ffffff; margin-top: 0; }
    p { color: #a3a3a3; font-size: 15px; line-height: 1.6; }
    .card { background-color: #171717; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px; margin: 24px 0; font-size: 14px; }
    .card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #222; }
    .card-row:last-child { border-bottom: none; }
    .label { color: #737373; text-transform: uppercase; font-size: 11px; font-weight: 600; }
    .val { color: #ffffff; font-weight: 500; }
    .notice { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 16px; color: #93c5fd; font-size: 13px; line-height: 1.5; margin: 20px 0; }
    .footer { padding: 24px; background-color: #0c0c0c; border-top: 1px solid #1e1e1e; text-align: center; font-size: 12px; color: #525252; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-title">STRIX<span class="brand-sub">DEVS</span></div>
        <div class="badge">Request Received • Pending Review</div>
      </div>
      <div class="content">
        <h1>Hi ${data.name}, we received your consultation request!</h1>
        <p>Thank you for reaching out to Strix Devs. Our engineering team has received your requested consultation slot and is reviewing engineering lead availability.</p>
        
        <div class="card">
          <table width="100%" cellpadding="6" cellspacing="0" style="color: #e5e5e5; font-size: 14px;">
            <tr><td style="color: #737373; font-size: 11px; text-transform: uppercase; font-weight: 600;">Focus Topic</td><td style="text-align: right; color: #fff; font-weight: 600;">${data.topic}</td></tr>
            <tr><td style="color: #737373; font-size: 11px; text-transform: uppercase; font-weight: 600;">Requested Date</td><td style="text-align: right; color: #fff; font-weight: 600;">${data.date}</td></tr>
            <tr><td style="color: #737373; font-size: 11px; text-transform: uppercase; font-weight: 600;">Requested Time</td><td style="text-align: right; color: #facc15; font-weight: 600;">${data.timeSlot} ${data.timezone ? `(${data.timezone})` : ""}</td></tr>
          </table>
        </div>

        <div class="notice">
          ℹ️ <strong>What happens next:</strong> We will review your project brief and confirm this slot. As soon as approved, you will receive a calendar invitation (.ics) with a direct Google Meet room link.
        </div>

        <p style="font-size: 13px; color: #737373;">
          Need to make an immediate change? Reach us directly on WhatsApp at <a href="https://wa.me/+8801518933208" style="color: #34d399; text-decoration: none;">+880 1518933208</a> or reply to this email.
        </p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Strix Devs — Modern Web & AI Agency
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Admin: New Booking Request Notification with Review Link
 */
export function buildAdminPendingNotificationHtml(data: ConsultationBookingData, dashboardUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0f0f0f; color: #f3f3f3; padding: 20px; }
    .card { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 24px; max-width: 600px; margin: 0 auto; }
    h2 { color: #facc15; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    td { padding: 8px 0; border-bottom: 1px solid #262626; }
    .label { color: #888; font-size: 12px; text-transform: uppercase; width: 140px; }
    .val { color: #fff; font-weight: bold; }
    .btn { display: inline-block; margin-top: 24px; background: #34d399; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🔔 New Consultation Booking Request!</h2>
    <p>A new visitor has submitted a consultation request and is awaiting your confirmation.</p>
    <table>
      <tr><td class="label">Client Name</td><td class="val">${data.name}</td></tr>
      <tr><td class="label">Client Email</td><td class="val"><a href="mailto:${data.email}" style="color: #38bdf8;">${data.email}</a></td></tr>
      <tr><td class="label">Topic</td><td class="val">${data.topic}</td></tr>
      <tr><td class="label">Requested Date</td><td class="val">${data.date}</td></tr>
      <tr><td class="label">Time Slot</td><td class="val">${data.timeSlot} ${data.timezone ? `(${data.timezone})` : ""}</td></tr>
      <tr><td class="label">Notes</td><td class="val">${data.message || "No notes provided"}</td></tr>
    </table>
    <div style="text-align: center;">
      <a href="${dashboardUrl}" class="btn">Open Dashboard to Accept or Decline</a>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Visitor: Consultation Request Declined
 */
export function buildClientDeclinedHtml(data: ConsultationBookingData, reason?: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e5e5e5; }
    .wrapper { width: 100%; background-color: #0a0a0a; padding: 40px 10px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #262626; border-radius: 12px; overflow: hidden; }
    .header { padding: 32px; border-bottom: 1px solid #222; background: #171717; text-align: center; }
    .brand-title { font-size: 22px; font-weight: 800; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase; }
    .content { padding: 32px; }
    h1 { font-size: 22px; color: #ffffff; margin-top: 0; }
    p { color: #a3a3a3; font-size: 15px; line-height: 1.6; }
    .box { background: #171717; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .footer { padding: 24px; background-color: #0c0c0c; border-top: 1px solid #1e1e1e; text-align: center; font-size: 12px; color: #525252; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-title">STRIX DEVS</div>
      </div>
      <div class="content">
        <h1>Update Regarding Your Consultation Request</h1>
        <p>Hi ${data.name},</p>
        <p>Thank you for your interest in scheduling a technical strategy session with Strix Devs.</p>
        <div class="box">
          <p style="margin: 0; color: #e5e5e5;">
            Unfortunately, our engineering lead is unavailable for the requested time: <strong>${data.date} at ${data.timeSlot}</strong>.
          </p>
          ${reason ? `<p style="margin-top: 12px; color: #a3a3a3; font-size: 13px;"><em>Note from team: ${reason}</em></p>` : ""}
        </div>
        <p>
          We would love to connect at an alternate time. Feel free to reply directly to this email or reach out on WhatsApp at <a href="https://wa.me/+8801518933208" style="color: #34d399;">+880 1518933208</a> to arrange a time that suits your schedule.
        </p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Strix Devs
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Direct Message Template from Admin to Lead
 */
export function buildDirectMessageHtml(recipientName: string, bodyText: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #0a0a0a; color: #eee; padding: 24px; }
    .card { background: #141414; border: 1px solid #2b2b2b; border-radius: 8px; padding: 28px; max-width: 580px; margin: 0 auto; }
    .title { color: #fff; font-size: 20px; font-weight: bold; margin-bottom: 16px; }
    .body-content { color: #ccc; line-height: 1.7; font-size: 15px; white-space: pre-wrap; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #222; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">Message from Strix Devs</div>
    <p>Hi ${recipientName || "there"},</p>
    <div class="body-content">${bodyText}</div>
    <div class="footer">
      Strix Devs • Modern Web & AI Development Agency<br>
      Reply directly to this email or reach us on WhatsApp: +880 1518933208
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Dispatch "Pending Review" emails to both Client and Admin
 */
export async function sendBookingPendingEmails(data: ConsultationBookingData) {
    const transporter = getTransporter();
    const teamReceiver = process.env.CONTACT_RECEIVER_EMAIL || "info@strixdevs.com";
    const sender = process.env.SMTP_USER || "info@strixdevs.com";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
    const dashboardUrl = `${siteUrl}/admin`;

    const clientHtml = buildClientPendingHtml(data);
    const adminHtml = buildAdminPendingNotificationHtml(data, dashboardUrl);

    if (!transporter) {
        console.warn("[DEV MODE] Simulating Pending consultation emails:", {
            client: data.email,
            admin: teamReceiver,
            topic: data.topic,
            date: data.date,
            timeSlot: data.timeSlot,
        });
        return { success: true, mode: "simulated" };
    }

    await Promise.all([
        transporter.sendMail({
            from: `"Strix Devs" <${sender}>`,
            to: data.email,
            subject: `Request Received: Free Strategy Consultation (${data.topic})`,
            html: clientHtml,
        }),
        transporter.sendMail({
            from: `"Strix Devs Booking" <${sender}>`,
            to: teamReceiver,
            replyTo: data.email,
            subject: `🔔 Action Required: New Consultation Request from ${data.name}`,
            html: adminHtml,
        }),
    ]);

    return { success: true, mode: "smtp" };
}

/**
 * Dispatch "Booking Confirmed" email to Visitor and Admin (with Meet Link & ICS)
 */
export async function sendBookingConfirmedEmails(data: ConsultationBookingData) {
    return sendConsultationEmails(data);
}

/**
 * Dispatch "Booking Declined" email to Visitor
 */
export async function sendBookingDeclinedEmail(data: ConsultationBookingData, reason?: string) {
    const transporter = getTransporter();
    const sender = process.env.SMTP_USER || "info@strixdevs.com";

    const clientHtml = buildClientDeclinedHtml(data, reason);

    if (!transporter) {
        console.warn("[DEV MODE] Simulating Declined consultation email to:", data.email);
        return { success: true, mode: "simulated" };
    }

    await transporter.sendMail({
        from: `"Strix Devs" <${sender}>`,
        to: data.email,
        subject: `Update regarding your consultation request with Strix Devs`,
        html: clientHtml,
    });

    return { success: true, mode: "smtp" };
}

/**
 * Dispatch Direct Message to Lead
 */
export async function sendDirectVisitorEmail(params: {
    to: string;
    name?: string;
    subject: string;
    message: string;
}) {
    const transporter = getTransporter();
    const sender = process.env.SMTP_USER || "info@strixdevs.com";
    const teamReceiver = process.env.CONTACT_RECEIVER_EMAIL || "info@strixdevs.com";

    const html = buildDirectMessageHtml(params.name || "", params.message);

    if (!transporter) {
        console.warn("[DEV MODE] Simulating direct message to:", params.to, params.subject);
        return { success: true, mode: "simulated" };
    }

    await transporter.sendMail({
        from: `"Strix Devs" <${sender}>`,
        to: params.to,
        replyTo: teamReceiver,
        subject: params.subject,
        html,
    });

    return { success: true, mode: "smtp" };
}

