import React, { useState, useEffect, useRef } from 'react';

const PREFIX = 'belt ';
const subcommands = ['new', 'generate', 'deploy'];

const TYPE_SPEED = 80;
const DELETE_SPEED = 50;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

function TerminalTicker() {
  const [displayed, setDisplayed] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const phase = useRef('typingPrefix'); // typingPrefix | typing | pausing | deleting
  const commandIndex = useRef(0);
  const charIndex = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function tick() {
      const currentSub = subcommands[commandIndex.current];

      if (phase.current === 'typingPrefix') {
        // Type "belt " first, then move to typing the subcommand
        if (charIndex.current < PREFIX.length) {
          charIndex.current++;
          setDisplayed(PREFIX.slice(0, charIndex.current));
          timeoutRef.current = setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex.current = 0;
          phase.current = 'typing';
          timeoutRef.current = setTimeout(tick, TYPE_SPEED);
        }
      } else if (phase.current === 'typing') {
        if (charIndex.current < currentSub.length) {
          charIndex.current++;
          setDisplayed(PREFIX + currentSub.slice(0, charIndex.current));
          timeoutRef.current = setTimeout(tick, TYPE_SPEED);
        } else {
          phase.current = 'pausing';
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_TYPE);
        }
      } else if (phase.current === 'pausing') {
        phase.current = 'deleting';
        timeoutRef.current = setTimeout(tick, DELETE_SPEED);
      } else if (phase.current === 'deleting') {
        if (charIndex.current > 0) {
          charIndex.current--;
          setDisplayed(PREFIX + currentSub.slice(0, charIndex.current));
          timeoutRef.current = setTimeout(tick, DELETE_SPEED);
        } else {
          commandIndex.current = (commandIndex.current + 1) % subcommands.length;
          phase.current = 'typing';
          timeoutRef.current = setTimeout(tick, PAUSE_AFTER_DELETE);
        }
      }
    }

    tick();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-ticker">
      <div className="terminal-ticker-window">
        <div className="terminal-ticker-header">
          <span className="terminal-ticker-dot red" />
          <span className="terminal-ticker-dot yellow" />
          <span className="terminal-ticker-dot green" />
          <span className="terminal-ticker-title">terminal</span>
        </div>
        <div className="terminal-ticker-body">
          <span className="terminal-ticker-prompt">$</span>
          <span className="terminal-ticker-text">{displayed}</span>
          <span
            className="terminal-ticker-cursor"
            style={{ opacity: cursorVisible ? 1 : 0 }}
          >
            ▋
          </span>
        </div>
      </div>
    </div>
  );
}

export default TerminalTicker;
