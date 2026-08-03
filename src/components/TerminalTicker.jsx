import React, { useState, useEffect, useRef } from 'react';

const COMMANDS = [
  'belt new your-app',
  'belt generate scaffold Idea name status description:text',
  'belt deploy',
];

const TYPE_SPEED = 60;
const PAUSE_AFTER_TYPE = 1200;
const PAUSE_BEFORE_RESTART = 3000;

function TerminalTicker() {
  const [completedLines, setCompletedLines] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [phase, setPhase] = useState('typing'); // typing | pausing | restarting
  const commandIndex = useRef(0);
  const charIndex = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function tick() {
      const currentCommand = COMMANDS[commandIndex.current];

      if (phase === 'typing') {
        if (charIndex.current < currentCommand.length) {
          charIndex.current++;
          setCurrentText(currentCommand.slice(0, charIndex.current));
          timeoutRef.current = setTimeout(tick, TYPE_SPEED);
        } else {
          setPhase('pausing');
        }
      }
    }

    if (phase === 'typing') {
      tick();
    } else if (phase === 'pausing') {
      timeoutRef.current = setTimeout(() => {
        // "Submit" the current line
        const finishedCommand = COMMANDS[commandIndex.current];
        setCompletedLines((prev) => [...prev, finishedCommand]);
        setCurrentText('');
        charIndex.current = 0;

        const nextIndex = commandIndex.current + 1;
        if (nextIndex < COMMANDS.length) {
          commandIndex.current = nextIndex;
          setPhase('typing');
        } else {
          setPhase('restarting');
        }
      }, PAUSE_AFTER_TYPE);
    } else if (phase === 'restarting') {
      timeoutRef.current = setTimeout(() => {
        commandIndex.current = 0;
        charIndex.current = 0;
        setCompletedLines([]);
        setCurrentText('');
        setPhase('typing');
      }, PAUSE_BEFORE_RESTART);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [phase]);

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
          {completedLines.map((line, i) => (
            <div key={i} className="terminal-ticker-line">
              <span className="terminal-ticker-prompt">$</span>
              <span className="terminal-ticker-text">{line}</span>
            </div>
          ))}
          <div className="terminal-ticker-line terminal-ticker-active">
            <span className="terminal-ticker-prompt">$</span>
            <span className="terminal-ticker-text">{currentText}</span>
            <span
              className="terminal-ticker-cursor"
              style={{ opacity: cursorVisible ? 1 : 0 }}
            >
              ▋
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TerminalTicker;
