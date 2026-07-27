import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <svg className="footer-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="currentColor" />
            <path d="M8 14h24v3H8zM8 20h24v3H8zM8 26h24v3H8z" fill="var(--color-bg)" />
            <circle cx="14" cy="15.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="26" cy="15.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="14" cy="21.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="26" cy="21.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="14" cy="27.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="26" cy="27.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
          </svg>
          <span>Conveyor Belt</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com/stowzilla/terraform-provider-conveyor-belt">GitHub</a>
          <a href="https://registry.terraform.io/providers/stowzilla/conveyor-belt">Terraform Registry</a>
          <a href="/tutorial">Tutorial</a>
          <a href="https://github.com/stowzilla/terraform-provider-conveyor-belt/issues">Issues</a>
          <a href="https://github.com/stowzilla/terraform-provider-conveyor-belt/blob/main/LICENSE">License (MIT)</a>
        </div>
        <p className="footer-copyright">
          Forged with ♥ and Ruby — somewhere out in the black. Conveyor Belt is open source under the MIT license.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
