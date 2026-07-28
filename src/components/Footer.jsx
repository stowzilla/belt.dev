import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="https://github.com/stowzilla/belt" className="footer-link-with-logo" aria-label="Belt on GitHub">
            <img src="/github-mark-white.svg" alt="GitHub" className="footer-link-logo" />
            <span>GitHub</span>
          </a>
          <a href="https://registry.terraform.io/providers/stowzilla/conveyor-belt/latest" className="footer-link-with-logo" aria-label="Conveyor Belt on Terraform Registry">
            <img src="/terraform-logo.svg" alt="Terraform" className="footer-link-logo" />
            <span>Terraform Registry</span>
          </a>
          <a href="/tutorial">Tutorial</a>
          <a href="https://github.com/stowzilla/belt/issues">Issues</a>
          <a href="https://github.com/stowzilla/belt/blob/main/LICENSE">License (MIT)</a>
        </div>
        <p className="footer-copyright">
          Cloud infrastructure for Ruby programmers. Belt is open source under the MIT license.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
