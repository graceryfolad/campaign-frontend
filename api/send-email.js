export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { toEmail, subject, body } = req.body || {};
    if (!toEmail) {
      return res.status(400).json({ message: 'toEmail is required.' });
    }

    const response = await fetch('https://emailservice.ecosystem.com.ng/api/Email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toEmail,
        subject,
        body,
      }),
    });

    const data = await response.json().catch(() => ({ message: 'Email sent successfully.' }));
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Serverless email error:', err);
    return res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
}
