import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDesktop } from '../context/DesktopContext';

const WELCOME_TEXT = [
  '',
  '  ╔═══════════════════════════════════════════╗',
  '  ║          Welcome to AK Terminal            ║',
  '  ║     Alexey Khromin — Portfolio OS           ║',
  '  ╚═══════════════════════════════════════════╝',
  '',
  "  Type 'help' to see available commands.",
  '',
];

function getNeofetch() {
  const res = `${window.innerWidth}x${window.innerHeight}`;
  return [
    '',
    '       ████████████           alexey@portfolio-os',
    '     ██            ██         ─────────────────────',
    '   ██    ██████      ██       OS: Portfolio OS 1.0 (React)',
    '  ██   ██      ██     ██      Kernel: Vite 8.0.3',
    '  ██  ██        ██    ██      Shell: AK Terminal v1.0',
    `  ██  ██        ██    ██      Resolution: ${res}`,
    '  ██   ██      ██     ██      DE: Desktop Environment 1.0',
    '   ██    ██████      ██       Theme: Portfolio Light [GTK3]',
    '     ██            ██         Terminal: terminal.sh',
    '       ████████████           Packages: 8 (desktop)',
    '                               Memory: 256MB / 512MB',
    '                               Uptime: since 2026',
    '',
  ];
}

const HELP_TEXT = [
  '',
  '  Available commands:',
  '  ──────────────────────────────────────',
  '  help           Show this help message',
  '  clear          Clear the terminal',
  '  whoami         Display user info',
  '  neofetch       System information',
  '  about          Open About window',
  '  projects       Open Projects window',
  '  education      Open Education window',
  '  skills         Open Skills window',
  '  contact        Open Contact window',
  '  date           Show current date/time',
  '  history        Show command history',
  '  snake          Launch Snake game',
  '  minesweeper    Launch Minesweeper game',
  '  sudo hire alexey   ???',
  '  ──────────────────────────────────────',
  '',
];


const WHOAMI_OUTPUT = [
  '',
  '  Alexey Khromin',
  '  ─────────────────',
  '  CS Student @ King\'s College London',
  '  Specializing in AI, Deep Learning & Full-Stack Development',
  '  Building software that makes a meaningful difference.',
  '',
];

const SUDO_HIRE = [
  '',
  '  ✅ Permission granted.',
  '  📧 Sending offer letter to alexey...',
  '  🎉 Congratulations! You made a great decision.',
  '  📬 Check contact.exe to get in touch!',
  '',
];

const PROMPT = 'alexey@portfolio-os ~ % ';

function Terminal() {
  const { openWindow } = useDesktop();
  const [lines, setLines] = useState([...WELCOME_TEXT]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus the input whenever the terminal container is clicked
  const focusInput = useCallback(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const processCommand = useCallback(
    (cmd) => {
      const trimmed = cmd.trim();
      const lower = trimmed.toLowerCase();
      const newLines = [`${PROMPT}${trimmed}`];

      switch (lower) {
        case '':
          break;
        case 'help':
          newLines.push(...HELP_TEXT);
          break;
        case 'clear':
          setLines([]);
          return;
        case 'whoami':
          newLines.push(...WHOAMI_OUTPUT);
          break;
        case 'neofetch':
          newLines.push(...getNeofetch());
          break;
        case 'about':
          openWindow('about');
          newLines.push('  Opening about_me.txt...');
          break;
        case 'projects':
          openWindow('projects');
          newLines.push('  Opening Projects/...');
          break;
        case 'education':
          openWindow('education');
          newLines.push('  Opening Education/...');
          break;
        case 'skills':
          openWindow('skills');
          newLines.push('  Opening skills.json...');
          break;
        case 'contact':
          openWindow('contact');
          newLines.push('  Opening contact.exe...');
          break;
        case 'date':
          newLines.push(`  ${new Date().toString()}`);
          break;
        case 'history':
          if (commandHistory.length === 0) {
            newLines.push('  No command history yet.');
          } else {
            commandHistory.forEach((c, i) => {
              newLines.push(`  ${String(i + 1).padStart(4)}  ${c}`);
            });
          }
          break;
        case 'snake':
          openWindow('snake');
          newLines.push('  Launching snake.game...');
          break;
        case 'minesweeper':
          openWindow('minesweeper');
          newLines.push('  Launching minesweeper.game...');
          break;
        case 'sudo hire alexey':
          newLines.push(...SUDO_HIRE);
          break;
        default:
          newLines.push(`  zsh: command not found: ${trimmed}`);
          break;
      }

      setLines((prev) => [...prev, ...newLines]);
    },
    [openWindow, commandHistory]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = input;
        if (cmd.trim()) {
          setCommandHistory((prev) => [...prev, cmd.trim()]);
        }
        processCommand(cmd);
        setInput('');
        setHistoryIndex(-1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const newIndex = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;
        if (historyIndex >= commandHistory.length - 1) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    },
    [input, commandHistory, historyIndex, processCommand]
  );

  return (
    <div className="terminal-container" onClick={focusInput}>
      <div className="terminal-output" ref={scrollRef}>
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">
            <pre>{line}</pre>
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="terminal-input"
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setHistoryIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

export default Terminal;
