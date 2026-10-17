import HireForm from './HireForm';

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
          <HireForm idPrefix="contact" />
        </div>
      </div>
    </section>
  );
}

export default Contact;
