import React from 'react';

function Hero() {
  return (
    <section className="hero">
      <div className="asteroid-field">
        <div className="asteroid" style={{ top: '15%', left: '10%' }} />
        <div className="asteroid" />
        <div className="asteroid" />
        <div className="asteroid" />
        <div className="asteroid" />
        <div className="asteroid" />
        <div className="asteroid" />
        <div className="asteroid" />
      </div>

      <nav className="nav">
        <div className="nav-brand">
          <img className="nav-logo" src="/ruby-belt.png" alt="Belt" />
          <span className="nav-name">Belt</span>
        </div>
        <div className="nav-links">
          <a href="https://github.com/stowzilla/belt" className="nav-link">Source</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="/tutorial" className="nav-link">Tutorial</a>
          <a href="#get-started" className="nav-link">Get Started</a>
        </div>
      </nav>

      <div className="hero-content">
        <h1 className="hero-title">
          Cloud infrastructure<br />
          for <span className="hero-highlight">Ruby programmers</span>.
        </h1>
        <p className="hero-subtitle">
          Belt is a Terraform provider and CLI that turns a Rails-like Ruby DSL into complete AWS
          serverless infrastructure. <code>belt new</code>, <code>belt generate</code>, <code>belt deploy</code> —
          from empty directory to production API in minutes. Zero boilerplate.
        </p>
        <div className="hero-actions">
          <a href="#get-started" className="btn btn-primary">Get Started</a>
          <a href="/tutorial" className="btn btn-secondary">
            Build a Chat App in 15 Minutes
          </a>
        </div>
        <div className="hero-version">
          <span className="version-badge">Terraform Registry</span>
          <code>stowzilla/conveyor-belt</code>
        </div>
      </div>

      <div className="belt-divider" />
    </section>
  );
}

export default Hero;
