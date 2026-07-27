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
          <svg className="nav-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="currentColor" />
            <path d="M8 14h24v3H8zM8 20h24v3H8zM8 26h24v3H8z" fill="var(--color-bg)" />
            <circle cx="14" cy="15.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="26" cy="15.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="14" cy="21.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="26" cy="21.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="14" cy="27.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
            <circle cx="26" cy="27.5" r="2.5" fill="var(--color-brass)" stroke="var(--color-bg)" strokeWidth="0.5" />
          </svg>
          <span className="nav-name">Conveyor Belt</span>
        </div>
        <div className="nav-links">
          <a href="https://github.com/stowzilla/terraform-provider-conveyor-belt" className="nav-link">Source</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="/tutorial" className="nav-link">Tutorial</a>
          <a href="#get-started" className="nav-link">Get Started</a>
        </div>
      </nav>

      <div className="hero-content">
        <h1 className="hero-title">
          Out here in the black,<br />
          infrastructure ain't gonna <span className="hero-highlight">wrangle itself</span>.
        </h1>
        <p className="hero-subtitle">
          Conveyor Belt is a Terraform provider and CLI that hitches your Ruby DSL to real AWS
          infrastructure. <code>belt new</code>, <code>belt generate</code>, <code>belt deploy</code> —
          from empty directory to production API in minutes. Zero boilerplate. Saddle up and ship.
        </p>
        <div className="hero-actions">
          <a href="#get-started" className="btn btn-primary">⚙ Saddle Up</a>
          <a href="/tutorial" className="btn btn-secondary">
            ☆ Build a Chat App in 15 Minutes
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
