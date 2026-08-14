'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--surface-container-lowest)',
      width: '100%',
      padding: '48px 0',
      borderTop: '1px solid var(--outline-variant)',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px',
      }}>
        {/* Brand / Copyright */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            className="font-headline-md"
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--on-surface)',
              letterSpacing: '-0.02em',
            }}
          >
            AniKode
          </span>
          <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
            © 2026 AniKode Foundation. Built for performance.
          </span>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/Igx-Anikesh/AniKode"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body-sm"
            style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
          >
            GitHub
          </a>
          <a
            href="/docs"
            className="font-body-sm"
            style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
          >
            Documentation
          </a>
          <a
            href="/community"
            className="font-body-sm"
            style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
          >
            Community
          </a>
          <a
            href="/license"
            className="font-body-sm"
            style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
          >
            License
          </a>
        </nav>
      </div>
    </footer>
  );
}
