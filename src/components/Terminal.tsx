import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { io } from 'socket.io-client';
import 'xterm/css/xterm.css';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && terminalRef.current && !xtermRef.current) {
      const term = new XTerm({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#1e1e1e',
          foreground: '#ffffff',
          cursor: '#ffffff',
          // selection: '#444444',
        },
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);

      term.open(terminalRef.current);
      fitAddon.fit();

      // Connect to WebSocket server
      socketRef.current = io("https://server-terminal.onrender.com/");

      socketRef.current.on('connect', () => {
        socketRef.current.emit('start-session');
      });

      socketRef.current.on('session-started', () => {
        term.write('Connected to EC2 instance\r\n');
      });

      socketRef.current.on('terminal-output', (data: string) => {
        term.write(data);
      });

      socketRef.current.on('error', (error: string) => {
        term.write(`\r\nError: ${error}\r\n`);
      });

      socketRef.current.on('session-ended', () => {
        term.write('\r\nSession ended\r\n');
      });

      term.onData((data) => {
        socketRef.current.emit('terminal-input', data);
      });

      xtermRef.current = term;

      const handleResize = () => {
        fitAddon.fit();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        term.dispose();
        xtermRef.current = null;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-4 w-[800px] h-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <div ref={terminalRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default Terminal;