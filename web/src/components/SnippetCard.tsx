'use client';

import React, { useState } from 'react';
import { Snippet } from '@/lib/snippets';
import { Copy, Check, Play } from 'lucide-react';

interface SnippetCardProps {
  snippet: Snippet;
  onOpenInSandbox: (code: string) => void;
}

export default function SnippetCard({ snippet, onOpenInSandbox }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="glow-hover"
      style={{
        backgroundColor: '#161B22',
        border: '1px solid #30363D',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = '0 0 15px rgba(162, 201, 255, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#30363D';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <span className="font-label-caps" style={{
            fontSize: '11px',
            color: 'var(--primary)',
            marginBottom: '4px',
            display: 'block',
          }}>
            {snippet.category}
          </span>
          <h3 className="font-body-lg" style={{ fontSize: '18px', color: 'var(--on-surface)', fontWeight: 600, margin: 0 }}>
            {snippet.title}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid var(--outline-variant)',
              color: 'var(--on-surface-variant)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--on-surface)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
            title="Copy Code"
          >
            {copied ? <Check size={13} color="#40ba51" /> : <Copy size={13} />}
          </button>

          <button
            onClick={() => onOpenInSandbox(snippet.code)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: 'var(--primary)',
              color: 'var(--on-primary)',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'filter 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            title="Run in Playground"
          >
            <Play size={12} fill="currentColor" />
            <span>Try</span>
          </button>
        </div>
      </div>

      <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px', flex: 1, lineHeight: 1.5 }}>
        {snippet.description}
      </p>

      {/* Code Preview Block */}
      <div style={{
        backgroundColor: '#05070a',
        borderRadius: '6px',
        border: '1px solid var(--outline-variant)',
        padding: '12px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--on-surface-variant)',
        maxHeight: '130px',
        overflowY: 'hidden',
        whiteSpace: 'pre',
        position: 'relative',
        marginBottom: '14px',
      }}>
        {snippet.code.split('\n').slice(0, 5).join('\n')}
        {snippet.code.split('\n').length > 5 && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35px',
            background: 'linear-gradient(transparent, #05070a)',
          }} />
        )}
      </div>

      {/* Footer Details */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '10px',
        borderTop: '1px solid var(--outline-variant)',
        fontSize: '12px',
        color: 'var(--on-surface-variant)',
      }}>
        <span>By {snippet.author}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {snippet.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{ color: 'var(--outline)' }}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
