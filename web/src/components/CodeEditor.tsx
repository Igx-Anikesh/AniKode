'use client';

import React, { useRef } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  fileName?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, fileName = 'main.kode', readOnly = false }: CodeEditorProps) {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCount = value.split('\n').length;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);

      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="code-window" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Window Top Bar */}
      <div className="code-window-header">
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2D3748' }} />
          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2D3748' }} />
          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2D3748' }} />
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: '#8B949E',
        }}>
          {fileName}
        </div>

        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8B949E',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Copy Code"
        >
          {copied ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Editor Body */}
      <div style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Line Numbers Column */}
        <div style={{
          padding: '16px 8px 16px 14px',
          textAlign: 'right',
          color: '#475569',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          userSelect: 'none',
          background: '#07090E',
          borderRight: '1px solid var(--border)',
          minWidth: '40px',
        }}>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck="false"
          placeholder="Write your AniKode code here..."
          style={{
            flex: 1,
            padding: '16px',
            background: '#07090E',
            border: 'none',
            outline: 'none',
            color: '#F8FAFC',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            resize: 'none',
            whiteSpace: 'pre',
            overflowY: 'auto',
          }}
        />
      </div>
    </div>
  );
}
