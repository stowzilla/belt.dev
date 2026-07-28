import React from 'react';

function GetStarted() {
  return (
    <section className="get-started" id="get-started">
      <div className="get-started-content">
        <h2>Ready to ride?</h2>
        <p className="get-started-subtitle">
          Install Belt and go from empty directory to production API in minutes.
        </p>
        <div className="get-started-install">
          <code>gem install belt</code>
        </div>
        <div className="get-started-links">
          <a href="https://github.com/stowzilla/belt" className="btn btn-primary">
            View Documentation
          </a>
          <a href="/tutorial" className="btn btn-secondary">
            Tutorial
          </a>
          <a href="https://registry.terraform.io/providers/stowzilla/conveyor-belt/latest" className="btn btn-secondary">
            Terraform Registry
          </a>
        </div>
      </div>
    </section>
  );
}

export default GetStarted;
