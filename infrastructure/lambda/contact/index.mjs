import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({});

const RECIPIENT = process.env.CONTACT_RECIPIENT;
const SENDER = process.env.CONTACT_SENDER;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const MAX_LEN = 5000;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json',
  };
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body),
  };
}

function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_LEN) : '';
}

export const handler = async (event) => {
  const method =
    event.requestContext?.http?.method || event.httpMethod || 'POST';

  // CORS preflight
  if (method === 'OPTIONS') {
    return response(204, {});
  }

  if (method !== 'POST') {
    return response(405, { error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return response(400, { error: 'Invalid JSON body' });
  }

  const name = clean(payload.name);
  const email = clean(payload.email);
  const project = clean(payload.project);
  const help = clean(payload.help);
  const timeline = clean(payload.timeline);

  // Honeypot: bots fill hidden fields. Silently accept, don't email.
  if (clean(payload.company)) {
    return response(200, { ok: true });
  }

  if (!name || !isValidEmail(email) || !project) {
    return response(400, {
      error: 'Please provide your name, a valid email, and a project description.',
    });
  }

  const subject = `New project inquiry from ${name}`;
  const textBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Where they need help: ${help || '(not specified)'}`,
    `Ideal timeline: ${timeline || '(not specified)'}`,
    '',
    'What they are building:',
    project,
  ].join('\n');

  try {
    await ses.send(
      new SendEmailCommand({
        Source: SENDER,
        Destination: { ToAddresses: [RECIPIENT] },
        ReplyToAddresses: [email],
        Message: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: { Text: { Data: textBody, Charset: 'UTF-8' } },
        },
      })
    );
    return response(200, { ok: true });
  } catch (err) {
    console.error('SES send failed', err);
    return response(502, {
      error: 'We could not send your message right now. Please try again later.',
    });
  }
};
