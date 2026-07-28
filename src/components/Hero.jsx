import React from 'react';
import TerminalTicker from './TerminalTicker';

function Hero() {
  return (
    <section className="hero">
      <div className="asteroid-field">
        <div className="asteroid" style={{ top: '6%', left: '5%' }} />
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
          {/* <img className="nav-logo" src="/small-ruby-belt.jpg" alt="Belt" /> */}
          <span className="nav-name">Ruby Belt</span>
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
        <img className="hero-logo" src="/ruby-belt-hero.png" alt="Belt — Cloud infrastructure for Ruby programmers" />
        <h1 className="hero-title">
          Serverless optimized<br />
          for <span className="hero-highlight">developer happiness</span>.
        </h1>
        
        <TerminalTicker />
        
        <div className="hero-subtitle">
          Belt is a Ruby gem that scaffolds, generates, and deploys complete AWS serverless
          apps. From empty directory to production API in minutes.
        </div>
        
        <div className="hero-actions">
          <a href="/tutorial" className="btn btn-primary">
            Build a Chat App in 15 Minutes
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
