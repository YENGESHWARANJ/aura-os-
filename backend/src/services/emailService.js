const nodemailer = require("nodemailer");

let transporter = null;

/**
 * Initializes or returns the cached Nodemailer transporter
 */
const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  } else {
    // Development / fallback logger transporter so operations never fail
    transporter = {
      sendMail: async (mailOptions) => {
        console.log("--------------------------------------------------");
        console.log("📧 [AURA OS Email Service - Dev / Mock Mode]");
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Preview: ${mailOptions.text || mailOptions.html.slice(0, 120)}...`);
        console.log("--------------------------------------------------");
        return { messageId: `mock-email-${Date.now()}` };
      },
    };
  }

  return transporter;
};

/**
 * Builds AURA OS branded responsive dark HTML email template
 */
const buildAuraEmailHtml = ({
  title,
  message,
  senderName = null,
  targetRoute = "/dashboard/notifications",
  actionLabel = "Open in AURA OS",
  notificationType = "Academic Notification",
}) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const actionUrl = `${frontendUrl.replace(/\/$/, "")}${targetRoute.startsWith("/") ? targetRoute : "/" + targetRoute}`;
  const currentYear = new Date().getFullYear();
  const formattedDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #020617;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #020617;
      padding: 30px 10px;
    }
    .main-card {
      max-width: 560px;
      margin: 0 auto;
      background-color: #091224;
      border: 1px solid #1e293b;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #0369a1 0%, #06b6d4 100%);
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 4px 0 0 0;
      color: #e0f2fe;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .body-content {
      padding: 30px 24px;
    }
    .type-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      background-color: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 16px;
      text-transform: uppercase;
    }
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }
    .message {
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .meta-box {
      background-color: #0d1a33;
      border-left: 3px solid #06b6d4;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 24px;
      font-size: 12px;
      color: #cbd5e1;
    }
    .meta-item {
      margin: 4px 0;
    }
    .meta-label {
      color: #64748b;
      font-weight: 600;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 10px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .footer {
      border-top: 1px solid #1e293b;
      padding: 20px 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="header">
        <h1>AURA OS</h1>
        <p>AI Academic Management Platform</p>
      </div>
      <div class="body-content">
        <span class="type-badge">${notificationType}</span>
        <h2 class="title">${title}</h2>
        <p class="message">${message}</p>
        
        <div class="meta-box">
          ${senderName ? `<div class="meta-item"><span class="meta-label">From:</span> ${senderName}</div>` : ""}
          <div class="meta-item"><span class="meta-label">Timestamp:</span> ${formattedDate}</div>
          <div class="meta-item"><span class="meta-label">Delivery Channel:</span> Verified Transactional Email</div>
        </div>

        <div class="btn-container">
          <a href="${actionUrl}" class="btn">${actionLabel} &rarr;</a>
        </div>
      </div>
      <div class="footer">
        <p>This is an automated notification from your institution's AURA OS instance.</p>
        <p>&copy; ${currentYear} AURA OS • Continuous Academic Intelligence</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

/**
 * Sends a transactional email notification
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.title - Email subject / title
 * @param {string} params.message - Email body text
 * @param {string} [params.senderName] - Optional sender display name
 * @param {string} [params.targetRoute] - Deep link route in the app
 * @param {string} [params.notificationType] - Category / type label
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
const sendEmailNotification = async ({
  to,
  title,
  message,
  senderName = null,
  targetRoute = "/dashboard/notifications",
  notificationType = "Academic Notification",
}) => {
  if (!to) {
    return { success: false, error: "Missing recipient email" };
  }

  try {
    const client = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"AURA OS" <notifications@aura.edu>';

    const htmlContent = buildAuraEmailHtml({
      title,
      message,
      senderName,
      targetRoute,
      notificationType,
    });

    const info = await client.sendMail({
      from: fromAddress,
      to,
      subject: `[AURA OS] ${title}`,
      text: `${title}\n\n${message}\n\nOpen in AURA OS: ${(process.env.FRONTEND_URL || "http://localhost:5173") + targetRoute}`,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[EmailService] Error sending email notification:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendEmailNotification,
  buildAuraEmailHtml,
};
