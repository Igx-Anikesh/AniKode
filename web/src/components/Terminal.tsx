'use client';

import React from 'react';
import { Terminal as TerminalIcon, Trash2, Clock } from 'lucide-react';

interface TerminalProps {
  output: string[];
  errors: string[];
  executionTimeMs?: number;
  onClear: () => void;
  isRunning?: boolean;
}

export default function Terminal({
  output,
  errors,
  executionTimeMs,
  onClear,
  isRunning = false,
}: TerminalProps) {
  const hasOutput = output.length > 0 || errors.length > 0;

  return (
    <div className="code-window" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Terminal Header */}
      <div className="code-window-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalIcon size={14} color="#8B949E" />
          <span style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: '#8B949E',
          }}>
            terminal
          </span>
          {executionTimeMs !== undefined && (
            <span style={{
              fontSize: '0.75rem',
              color: '#34D399',
              fontFamily: 'var(--font-mono)',
            }}>
              ({executionTimeMs}ms)
            </span>
          )}
        </div>

        <button
          onClick={onClear}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8B949E',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
          }}
          title="Clear Output"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>

      {/* Terminal Output */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        lineHeight: '1.6',
        background: '#07090E',
      }}>
        {!hasOutput && !isRunning && (
          <div style={{ color: '#475569', fontStyle: 'italic' }}>
            Click &ldquo;Run Program&rdquo; to execute your AniKode code.
          </div>
        )}

        {isRunning && (
          <div style={{ color: '#60A5FA' }}>
            ⚡ Running...
          </div>
        )}

        {output.map((line, idx) => (
          <div key={idx} style={{ color: '#E2E8F0', whiteSpace: 'pre-wrap', marginBottom: '4px' }}>
            {line}
          </div>
        ))}

        {errors.map((err, idx) => (
          <div
            key={idx}
            style={{
              color: '#FF7B72',
              marginTop: '4px',
            }}
          >
            {err}
          </div>
        ))}
      </div>
    </div>
  );
}
