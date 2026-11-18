import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const ses = new SESClient({});
const dynamo = new DynamoDBClient({});

const RECIPIENT = process.env.CONTACT_RECIPIENT;
const SENDER = process.env.CONTACT_SENDER;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const RATE_LIMIT_TABLE = process.env.RATE_LIMIT_TABLE;

const MAX_LEN = 5000;

// Per-IP limit: at most RATE_LIMIT_MAX POSTs per RATE_LIMIT_WINDOW_SECONDS.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 600;

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

// Counts this request against the caller's IP in a fixed time window and
// reports whether it is over the limit. Fails open: if the counter is
// unavailable we would rather take the message than lose a real inquiry.
async function isRateLimited(ip) {
  if (!RATE_LIMIT_TABLE || !ip) return false;

  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % RATE_LIMIT_WINDOW_SECONDS);

  try {
    const result = await dynamo.send(
      new UpdateItemCommand({
        TableName: RATE_LIMIT_TABLE,
        Key: { pk: { S: `${ip}#${windowStart}` } },
        UpdateExpression:
          'ADD hits :one SET expires_at = if_not_exists(expires_at, :expires)',
        ExpressionAttributeValues: {
          ':one': { N: '1' },
          // Keep the row a little past the window, then let TTL remove it.
          ':expires': { N: String(windowStart + RATE_LIMIT_WINDOW_SECONDS * 2) },
        },
        ReturnValues: 'UPDATED_NEW',
      })
    );
    return Number(result.Attributes?.hits?.N || 0) > RATE_LIMIT_MAX;
  } catch (err) {
    console.error('Rate limit check failed, allowing request', err);
    return false;
  }
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

  if (await isRateLimited(event.requestContext?.http?.sourceIp)) {
    return response(429, {
      error: 'Too many messages from this connection. Please try again later.',
    });
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

  // Name is untrusted: collapse whitespace so it can't break the subject line.
  const subject = `New project inquiry from ${name.replace(/\s+/g, ' ')}`;
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
