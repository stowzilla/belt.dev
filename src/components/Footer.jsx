import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <img className="footer-logo" src="/ruby-belt.png" alt="Belt" />
          <span>Belt</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com/stowzilla/belt">GitHub</a>
          <a href="https://registry.terraform.io/providers/stowzilla/conveyor-belt">Terraform Registry</a>
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
