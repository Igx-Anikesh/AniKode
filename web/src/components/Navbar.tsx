'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Docs', href: '/docs' },
    { name: 'Playground', href: '/sandbox' },
    { name: 'Library', href: '/library' },
    { name: 'Community', href: '/community' },
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 50,
      backgroundColor: 'rgba(16, 20, 26, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--outline-variant)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 clamp(16px, 4vw, 32px)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <a
          href="/"
          className="font-headline-md"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--on-surface)',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
          }}
        >
          AniKode
        </a>

        {/* Navigation Links (Desktop) */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '24px',
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                className="font-label-caps"
                style={{
                  color: isActive ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                  padding: '4px 0',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--on-surface)'}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--on-surface-variant)';
                }}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Trailing Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href={SITE_CONFIG.links.directDownloadExe}
            download="anikode.exe"
            className="btn-primary-action"
            style={{
              padding: '8px 16px',
            }}
          >
            Download
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--on-surface)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            className="mobile-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          padding: '16px 32px',
          background: 'var(--surface-container-lowest)',
          borderTop: '1px solid var(--outline-variant)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-label-caps"
              style={{
                color: 'var(--on-surface-variant)',
                textDecoration: 'none',
                padding: '6px 0',
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
