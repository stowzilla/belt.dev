import React, { useEffect, useRef } from 'react';
import TerminalTicker from './TerminalTicker';

const ASTEROID_CONFIG = [
  { size: 4, color: 'ruby', speed: 0.8, glowSize: 6 },
  { size: 5, color: 'ruby', speed: 1.0, glowSize: 8 },
  { size: 6, color: 'brass', speed: 0.5, glowSize: 10 },
  { size: 4, color: 'ruby', speed: 1.2, glowSize: 6 },
  { size: 5, color: 'copper', speed: 0.6, glowSize: 8 },
  { size: 4, color: 'ruby', speed: 0.4, glowSize: 6 },
  { size: 6, color: 'brass', speed: 1.3, glowSize: 10 },
  { size: 4, color: 'ruby', speed: 0.7, glowSize: 6 },
];

const COLOR_MAP = {
  ruby: { bg: '#cc342d', glow: 'rgba(204, 52, 45, 0.8)' },
  brass: { bg: '#c5943a', glow: 'rgba(197, 148, 58, 0.8)' },
  copper: { bg: '#b87333', glow: 'rgba(184, 115, 51, 0.8)' },
};

function useAsteroids(containerRef, config) {
  const asteroidsRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize asteroids with random positions
    asteroidsRef.current = config.map((cfg) => ({
      x: Math.random() * 120 - 10, // -10% to 110% (allow starting off-screen)
      y: Math.random() * 100,
      ...cfg,
    }));

    let animationId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000; // seconds
      lastTime = currentTime;

      asteroidsRef.current.forEach((asteroid) => {
        // Move diagonally (left and slightly down)
        asteroid.x -= asteroid.speed * 3 * delta;
        asteroid.y += asteroid.speed * 1.5 * delta;

        // Respawn off the right edge when it goes off the left
        if (asteroid.x < -5) {
          asteroid.x = 105 + Math.random() * 10;
          asteroid.y = Math.random() * 100;
        }
        // Also respawn if it goes off the bottom
        if (asteroid.y > 105) {
          asteroid.x = 105 + Math.random() * 10;
          asteroid.y = Math.random() * 50;
        }
      });

      // Update DOM
      const elements = container.querySelectorAll('.asteroid');
      elements.forEach((el, i) => {
        const asteroid = asteroidsRef.current[i];
        if (asteroid) {
          el.style.left = `${asteroid.x}%`;
          el.style.top = `${asteroid.y}%`;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [containerRef, config]);

  return asteroidsRef;
}

function AsteroidField() {
  const containerRef = useRef(null);
  useAsteroids(containerRef, ASTEROID_CONFIG);

  return (
    <div className="asteroid-field" ref={containerRef}>
      {ASTEROID_CONFIG.map((cfg, i) => {
        const colors = COLOR_MAP[cfg.color];
        return (
          <div
            key={i}
            className="asteroid"
            style={{
              width: cfg.size,
              height: cfg.size,
              background: colors.bg,
              boxShadow: `0 0 ${cfg.glowSize}px ${colors.glow}`,
              opacity: 0.5 + cfg.speed * 0.15,
            }}
          />
        );
      })}
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <AsteroidField />

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
          Built by Rails developers who wanted AWS without leaving Ruby. Belt scaffolds,
          generates, and deploys complete serverless apps — from empty directory to
          production API in minutes.
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
