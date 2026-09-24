const CONTACT_EMAIL = 'contact@stowzilla.com';

const hireSubject = encodeURIComponent('Project inquiry for Stowzilla');
const hireBody = encodeURIComponent(`Hi Stowzilla,

I'd like to talk about working together.

What I'm building:
[Add a short description]

Where I could use help:
[Planning, architecture, development, deployment, or something else]

Ideal timeline:
[Add your timeline]

A good way to reach me:
[Email, phone, or video call]

Thanks,
[Your name]`);
const directMailto = `mailto:${CONTACT_EMAIL}`;
const hireMailto = `${directMailto}?subject=${hireSubject}&body=${hireBody}`;

function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-content">
        <div className="contact-copy">
          <p className="contact-eyebrow">Hire Stowzilla</p>
          <h2 id="contact-title">Build with the people behind Belt.</h2>
          <p className="contact-intro">
            Starting a Belt project or bringing us a tough Ruby and AWS problem?
            Stowzilla can help you shape the plan, do the work, and get it shipped.
          </p>
          <ul className="contact-services">
            <li>Belt apps from first scaffold to production</li>
            <li>Serverless Ruby and AWS architecture</li>
            <li>Focused engineering support for difficult builds</li>
          </ul>
        </div>

        <div className="contact-card">
          <p className="contact-card-kicker">Have a project in mind?</p>
          <h3>Tell us where you’re headed.</h3>
          <p>
            Share what you’re building, where you need help, and your ideal timeline.
            We’ll take it from there.
          </p>
          <a className="btn btn-contact" href={hireMailto}>
            Email Stowzilla <span aria-hidden="true">→</span>
          </a>
          <p className="contact-email">
            Or write directly to <a href={directMailto}>{CONTACT_EMAIL}</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
