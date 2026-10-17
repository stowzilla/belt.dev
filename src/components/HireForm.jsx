import React, { useState } from 'react';

const CONTACT_EMAIL = 'contact@stowzilla.com';

// AWS contact endpoint (API Gateway -> Lambda -> SES). Set at build time from
// the Terraform `contact_api_url` output. Without it, the form gracefully
// falls back to opening the visitor's mail client.
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL;

const HELP_OPTIONS = [
  'Planning & architecture',
  'Development',
  'Deployment & infrastructure',
  'Something else',
];

function buildMailto({ name, email, project, help, timeline }) {
  const subject = encodeURIComponent('Project inquiry for Stowzilla');
  const body = encodeURIComponent(
    `Hi Stowzilla,

I'd like to talk about working together.

What I'm building:
${project || '[Add a short description]'}

Where I could use help:
${help || '[Planning, architecture, development, deployment, or something else]'}

Ideal timeline:
${timeline || '[Add your timeline]'}

A good way to reach me:
${email || '[Email, phone, or video call]'}

Thanks,
${name || '[Your name]'}`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

function HireForm({ idPrefix = 'hire' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    project: '',
    help: '',
    timeline: '',
    company: '', // honeypot — real users leave this empty
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  function updateField(field) {
    return (event) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // No API endpoint configured — fall back to the visitor's mail client.
    if (!CONTACT_API_URL) {
      window.location.href = buildMailto(form);
      return;
    }

    setStatus('submitting');
    setError('');

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          project: form.project,
          help: form.help,
          timeline: form.timeline,
          company: form.company,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setForm({
          name: '',
          email: '',
          project: '',
          help: '',
          timeline: '',
          company: '',
        });
        return;
      }

      const data = await response.json().catch(() => null);
      setError(
        data?.error ||
          'Something went wrong. Please try again or email us directly.'
      );
      setStatus('error');
    } catch {
      setError(
        'We couldn’t reach the server. Please try again or email us directly.'
      );
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="hire-form-success" role="status">
        <p className="hire-form-success-title">Message sent. 🚀</p>
        <p>
          Thanks for reaching out — we’ll get back to you soon. In the meantime,
          you can also write directly to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="hire-form" onSubmit={handleSubmit} noValidate>
      <div className="hire-form-field">
        <label htmlFor={`${idPrefix}-name`}>Name</label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          name="name"
          value={form.name}
          onChange={updateField('name')}
          placeholder="Your name"
          required
        />
      </div>

      <div className="hire-form-field">
        <label htmlFor={`${idPrefix}-email`}>Email</label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          name="email"
          value={form.email}
          onChange={updateField('email')}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="hire-form-field">
        <label htmlFor={`${idPrefix}-project`}>What are you building?</label>
        <textarea
          id={`${idPrefix}-project`}
          name="project"
          value={form.project}
          onChange={updateField('project')}
          placeholder="A short description of your project"
          rows={3}
          required
        />
      </div>

      <div className="hire-form-field">
        <label htmlFor={`${idPrefix}-help`}>Where could you use help?</label>
        <select
          id={`${idPrefix}-help`}
          name="help"
          value={form.help}
          onChange={updateField('help')}
        >
          <option value="">Select an area</option>
          {HELP_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="hire-form-field">
        <label htmlFor={`${idPrefix}-timeline`}>Ideal timeline</label>
        <input
          id={`${idPrefix}-timeline`}
          type="text"
          name="timeline"
          value={form.timeline}
          onChange={updateField('timeline')}
          placeholder="e.g. Next month, Q3, flexible"
        />
      </div>

      {/* Honeypot: hidden from users, catches bots. */}
      <div className="hire-form-hp" aria-hidden="true">
        <label htmlFor={`${idPrefix}-company`}>Company</label>
        <input
          id={`${idPrefix}-company`}
          type="text"
          name="company"
          value={form.company}
          onChange={updateField('company')}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === 'error' && (
        <p className="hire-form-error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-contact"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
        <span aria-hidden="true">→</span>
      </button>

      <p className="contact-email">
        Prefer email? Write directly to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </form>
  );
}

export default HireForm;
