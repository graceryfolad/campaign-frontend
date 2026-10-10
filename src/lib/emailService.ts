/**
 * Email Service for Saheed Oladele Campaign Organization
 * Interacts with https://emailservice.ecosystem.com.ng/swagger/index.html
 * Endpoint: POST https://emailservice.ecosystem.com.ng/api/Email/send
 */

export interface EmailRequest {
  toEmail: string;
  subject: string;
  body: string;
}

export interface DonationEmailData {
  toEmail: string;
  donorName: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  paymentReference: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  narration?: string;
}

export interface SendEmailResult {
  success: boolean;
  message?: string;
  error?: string;
}

const DIRECT_EMAIL_API_URL = 'https://emailservice.ecosystem.com.ng/api/Email/send';
const PROXY_EMAIL_API_URL = '/api/email-proxy';
const SERVERLESS_EMAIL_API_URL = '/api/send-email';

/**
 * Format currency with symbol
 */
function formatCurrency(amount: number, currency: string): string {
  const formatted = amount.toLocaleString('en-US');
  switch (currency.toUpperCase()) {
    case 'NGN':
      return `₦${formatted}`;
    case 'USD':
      return `$${formatted}`;
    case 'GBP':
      return `£${formatted}`;
    case 'EUR':
      return `€${formatted}`;
    default:
      return `${formatted} ${currency}`;
  }
}

/**
 * Generate a responsive, professional HTML email body for campaign donation acknowledgement
 */
export function buildDonationEmailHtml(data: DonationEmailData): string {
  const formattedAmount = formatCurrency(data.amount, data.currency);
  const formattedDate = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Lagos',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Notification Received - Saheed Oladele Campaign Organization</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%); padding: 36px 28px; text-align: center; color: #ffffff;">
              <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #6ee7b7; margin-bottom: 8px;">
                Official Campaign Acknowledgment
              </div>
              <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 900; line-height: 1.3; color: #ffffff; letter-spacing: -0.5px;">
                Saheed Oladele Campaign Organization
              </h1>
              <p style="margin: 0; font-size: 13px; font-weight: 600; color: #a7f3d0;">
                Oloye Saheed Oladele | Ba&agrave;m&egrave;k&oacute; of Ibadanland
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 1px;">
                Oyo State AAC Gubernatorial Candidate
              </p>
            </td>
          </tr>

          <!-- Primary Notice Banner -->
          <tr>
            <td style="background-color: #ecfdf5; border-bottom: 2px solid #a7f3d0; padding: 18px 28px; text-align: center;">
              <span style="display: inline-block; font-size: 14px; font-weight: 800; color: #047857;">
                &#10003; Thanks while we confirm via email or sms.
              </span>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px 28px;">
              <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #1e293b;">
                Dear <strong>${escapeHtml(data.donorName)}</strong>,
              </p>
              
              <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; color: #334155;">
                We have received your payment notification for 
                <strong style="color: #047857; font-size: 16px;">${formattedAmount}</strong>. 
                Thank you immensely for standing with the youth and supporting the vision to transform Oyo State through accountable, people-driven governance.
              </p>

              <!-- Payment Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td colspan="2" style="background-color: #0f172a; color: #f8fafc; padding: 12px 18px; font-size: 12px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                    Payment Notification Details
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    Reference Number:
                  </td>
                  <td style="padding: 12px 18px; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace;">
                    ${escapeHtml(data.paymentReference)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    Amount Transferred:
                  </td>
                  <td style="padding: 12px 18px; font-size: 15px; color: #047857; font-weight: 900; text-align: right; border-bottom: 1px solid #e2e8f0;">
                    ${formattedAmount}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    Designated Bank:
                  </td>
                  <td style="padding: 12px 18px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; border-bottom: 1px solid #e2e8f0;">
                    ${escapeHtml(data.bankName)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    Account Number:
                  </td>
                  <td style="padding: 12px 18px; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right; border-bottom: 1px solid #e2e8f0; font-family: monospace;">
                    ${escapeHtml(data.accountNumber)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    Account Name:
                  </td>
                  <td style="padding: 12px 18px; font-size: 13px; color: #0f172a; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">
                    ${escapeHtml(data.accountName)}
                  </td>
                </tr>
                ${data.donorPhone ? `
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    Donor Phone:
                  </td>
                  <td style="padding: 12px 18px; font-size: 13px; color: #0f172a; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">
                    ${escapeHtml(data.donorPhone)}
                  </td>
                </tr>` : ''}
                ${data.narration ? `
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">
                    Transfer Note:
                  </td>
                  <td style="padding: 12px 18px; font-size: 13px; color: #0f172a; font-weight: 600; text-align: right; border-bottom: 1px solid #e2e8f0;">
                    ${escapeHtml(data.narration)}
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 12px 18px; font-size: 13px; color: #64748b; font-weight: 600;">
                    Submitted At:
                  </td>
                  <td style="padding: 12px 18px; font-size: 13px; color: #0f172a; font-weight: 600; text-align: right;">
                    ${formattedDate}
                  </td>
                </tr>
              </table>

              <!-- Campaign Philosophy Box -->
              <div style="background-color: #f1f5f9; border-left: 4px solid #059669; padding: 16px 20px; border-radius: 0 10px 10px 0; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; font-style: italic; color: #334155; line-height: 1.6;">
                  &ldquo;Financing elections has been a major hurdle for every aspiring Nigerian youth. We choose CROWDFUNDING &mdash; making us accountable only to the masses we pledge to serve.&rdquo;
                </p>
              </div>

              <!-- Next Steps Notice -->
              <p style="font-size: 13px; line-height: 1.6; color: #475569; margin: 0 0 12px 0;">
                <strong>What happens next?</strong> Our campaign treasury team is cross-checking bank records to confirm the transfer. An official electronic receipt will be dispatched to your email and SMS as soon as reconciliation is complete.
              </p>
            </td>
          </tr>

          <!-- Footer & Enquiries -->
          <tr>
            <td style="background-color: #0f172a; color: #94a3b8; padding: 24px 28px; text-align: center; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0; color: #e2e8f0; font-weight: 700;">
                Saheed Oladele Campaign Organization
              </p>
              <p style="margin: 0 0 10px 0;">
                For enquiries or confirmation updates, please contact:<br>
                Email: <a href="mailto:greatsaheed2004@gmail.com" style="color: #34d399; text-decoration: none; font-weight: bold;">greatsaheed2004@gmail.com</a> &bull; 
                Phone: <a href="tel:08062211125" style="color: #fb923c; text-decoration: none; font-weight: bold;">08062211125</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Thank you for your patriotic support towards a brighter, more prosperous Oyo State.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Send donation confirmation email using the Swagger Email Service:
 * https://emailservice.ecosystem.com.ng/swagger/index.html
 * 
 * Implements a robust 3-tier delivery strategy:
 * 1. Direct POST to https://emailservice.ecosystem.com.ng/api/Email/send
 * 2. Vercel edge rewrite proxy /api/email-proxy (bypasses browser CORS restrictions)
 * 3. Vercel serverless function /api/send-email
 */
export async function sendDonationConfirmationEmail(
  data: DonationEmailData
): Promise<SendEmailResult> {
  if (!data.toEmail || !data.toEmail.includes('@')) {
    return {
      success: false,
      error: 'Invalid recipient email address.',
    };
  }

  const subject = `Payment Notification Received [Ref: ${data.paymentReference}] - Saheed Oladele Campaign`;
  const body = buildDonationEmailHtml(data);

  const payload: EmailRequest = {
    toEmail: data.toEmail.trim(),
    subject,
    body,
  };

  // Determine endpoints to try in sequence
  // In production on the domain (e.g. Vercel), trying same-origin proxy first avoids any CORS preflight errors
  const endpoints = [
    { url: PROXY_EMAIL_API_URL, name: 'Vercel Rewrite Proxy' },
    { url: DIRECT_EMAIL_API_URL, name: 'Direct Swagger API' },
    { url: SERVERLESS_EMAIL_API_URL, name: 'Serverless Function' },
  ];

  let lastError: string = 'Unknown error';

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({ message: 'Email sent successfully.' }));
        return {
          success: true,
          message: result.message || 'Email sent successfully.',
        };
      }

      // If response returned 404 or 405 on proxy, continue to next endpoint
      const errText = await response.text().catch(() => '');
      lastError = `${endpoint.name} returned HTTP ${response.status}: ${errText}`;
      console.warn(`[EmailService] ${endpoint.name} failed:`, lastError);
    } catch (err: any) {
      lastError = `${endpoint.name} network error: ${err.message || err}`;
      console.warn(`[EmailService] ${endpoint.name} error:`, err);
    }
  }

  return {
    success: false,
    error: lastError,
  };
}
