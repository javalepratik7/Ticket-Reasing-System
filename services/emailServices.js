const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async verifyConnection() {
    await this.transporter.verify();
    console.log('✅ Email server is ready');
  }

  async sendEmail({ to, subject, text, html }) {
    return this.transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html
    });
  }

  async sendTicketCreatedEmail({
    to,
    subject,
    description,
    status,
    orderId,
    ticketUrl
  }) {
    return this.sendEmail({
      to,
      subject: `🎫 Ticket Raised Successfully - Order #${orderId}`,
      text: `
      Thank you for raising the ticket.

      Ticket Information:
      Subject: ${subject}
      Description: ${description}
      Status: ${status}
      Order ID: ${orderId}

      You can check the ticket status here:
      ${ticketUrl}

      We will keep you updated on the status via email.
          `,
            html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 10px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:#4f46e5; padding:20px; border-radius:8px 8px 0 0; color:#ffffff;">
                      <h2 style="margin:0; font-size:22px;">🎫 Ticket Created Successfully</h2>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:24px; color:#333333;">
                      <p style="font-size:14px;">
                        Hello,
                      </p>

                      <p style="font-size:14px;">
                        Thank you for raising the ticket. Your request has been successfully created.
                      </p>

                      <h3 style="font-size:16px; margin-top:24px;">📄 Ticket Details</h3>

                      <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
                        <tr style="background:#f9fafb;">
                          <td><strong>Subject</strong></td>
                          <td>${subject}</td>
                        </tr>
                        <tr>
                          <td><strong>Description</strong></td>
                          <td>${description}</td>
                        </tr>
                        <tr style="background:#f9fafb;">
                          <td><strong>Status</strong></td>
                          <td>${status}</td>
                        </tr>
                        <tr>
                          <td><strong>Order ID</strong></td>
                          <td>${orderId}</td>
                        </tr>
                      </table>

                      <!-- CTA -->
                      <div style="text-align:center; margin:30px 0;">
                        <a href="${ticketUrl}"
                          target="_blank"
                          style="
                            background:#4f46e5;
                            color:#ffffff;
                            padding:12px 24px;
                            text-decoration:none;
                            border-radius:6px;
                            font-size:14px;
                            display:inline-block;
                          ">
                          View Ticket Status
                        </a>
                      </div>

                      <p style="font-size:13px; color:#555555;">
                        We will keep you updated on the ticket status via email.
                      </p>

                      <p style="font-size:13px; margin-top:30px;">
                        Regards,<br/>
                        <strong>${process.env.APP_NAME}</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#777777; border-radius:0 0 8px 8px;">
                      This is an automated message. Please do not reply.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
    });
  }

}

module.exports = new EmailService();
