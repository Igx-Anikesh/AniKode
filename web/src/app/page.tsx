'use client';

import React, { useState } from 'react';
import { Zap, ShieldCheck, Boxes, Copy, Check, Download, ArrowRight, Play, Terminal } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

export default function HomePage() {
  const [copiedCode, setCopiedCode] = useState(false);

  const heroCode = `~ AniKode High-Performance Fibonacci ~
fn fibonacci(n) {
    if n <= 1 { return n }
    let a = 0
    set b to 1
    loop i from 2 to n {
        let temp = a + b
        a = b
        b = temp
    }
    return b
}

let result = fibonacci(10)
let isValid = (result == 55) implies true
say.out("Fibonacci(10) =", result)
say.out("Verified Logic:", isValid) ~ true ~`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(heroCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(90px, 12vw, 130px) clamp(16px, 4vw, 32px) clamp(40px, 8vw, 80px)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(36px, 6vw, 64px)',
          alignItems: 'center',
        }}>
          {/* Left Hero Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 4vw, 32px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(57, 224, 122, 0.08)',
                border: '1px solid rgba(57, 224, 122, 0.2)',
                color: 'var(--primary)',
                width: 'fit-content',
              }}>
                <Zap size={14} />
                <span className="font-label-caps" style={{ color: 'var(--primary)', letterSpacing: '0.05em' }}>
                  AniKode v1.0.0 is Live
                </span>
              </div>

              <h1 className="font-display-lg" style={{ color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.03em' }}>
                Code at the Speed of Thought
              </h1>
              <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '500px' }}>
                AniKode unites the expressive simplicity of scripting with native C++20 machine speed, mathematical propositional logic, and glitch-proof bounded loops.
              </p>
            </div>

            <div className="hero-buttons-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <a
                href={SITE_CONFIG.links.directDownloadExe}
                download="anikode.exe"
                className="btn-primary-action"
              >
                Download AniKode
              </a>
              <a href="/docs" className="btn-secondary-action">
                View Docs
              </a>
              <a href="/sandbox" className="btn-secondary-action" style={{ color: 'var(--primary)' }}>
                Playground →
              </a>
            </div>

            {/* Small subtle text link for older versions */}
            <div style={{ marginTop: '-12px' }}>
              <a
                href={SITE_CONFIG.links.releases}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px',
                  color: '#ff6b6b',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.2s, opacity 0.2s',
                  opacity: 0.9,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ff9999';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ff6b6b';
                  e.currentTarget.style.opacity = '0.9';
                }}
              >
                <span>See other versions &amp; release notes</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>

          {/* Hero Code Snippet */}
          <div className="code-wrapper">
            <div className="code-box">
              {/* Code Header */}
              <div className="code-box-header">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(65, 71, 82, 0.6)' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(65, 71, 82, 0.6)' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(65, 71, 82, 0.6)' }} />
                </div>

                <span className="font-label-caps" style={{ color: 'var(--outline)' }}>
                  fibonacci.kode
                </span>

                <button
                  onClick={handleCopyCode}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--outline)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--outline)'}
                  title="Copy code"
                  aria-label="Copy code"
                >
                  {copiedCode ? <Check size={16} color="#40ba51" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Code Content in Pure AniKode Syntax (1.25x length) */}
              <div style={{ padding: 'clamp(14px, 3vw, 22px) clamp(14px, 3vw, 24px)', overflowX: 'auto' }}>
                <pre className="font-code-block" style={{ margin: 0, color: 'var(--on-surface-variant)', lineHeight: 1.55, fontSize: 'clamp(12px, 2.5vw, 13.5px)' }}>
                  <code>
                    <span className="hl-comment">~ AniKode High-Performance Fibonacci ~</span>{'\n'}
                    <span className="hl-keyword">fn</span> <span className="hl-function">fibonacci</span>(n) &#123;{'\n'}
                    {'    '}<span className="hl-keyword">if</span> n &lt;= <span className="hl-number">1</span> &#123; <span className="hl-keyword">return</span> n &#125;{'\n'}
                    {'    '}<span className="hl-keyword">let</span> a = <span className="hl-number">0</span>{'\n'}
                    {'    '}<span className="hl-keyword">set</span> b <span className="hl-keyword">to</span> <span className="hl-number">1</span>{'\n'}
                    {'    '}<span className="hl-keyword">loop</span> i <span className="hl-keyword">from</span> <span className="hl-number">2</span> <span className="hl-keyword">to</span> n &#123;{'\n'}
                    {'        '}<span className="hl-keyword">let</span> temp = a + b{'\n'}
                    {'        '}a = b{'\n'}
                    {'        '}b = temp{'\n'}
                    {'    '}&#125;{'\n'}
                    {'    '}<span className="hl-keyword">return</span> b{'\n'}
                    &#125;{'\n'}
                    {'\n'}
                    <span className="hl-keyword">let</span> result = fibonacci(<span className="hl-number">10</span>){'\n'}
                    <span className="hl-keyword">let</span> isValid = (result == <span className="hl-number">55</span>) <span className="hl-operator">implies</span> <span className="hl-keyword">true</span>{'\n'}
                    <span className="hl-function">say.out</span>(<span className="hl-string">&quot;Fibonacci(10) =&quot;</span>, result){'\n'}
                    <span className="hl-function">say.out</span>(<span className="hl-string">&quot;Verified Logic:&quot;</span>, isValid) <span className="hl-comment">~ true ~</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(30px, 6vw, 60px) clamp(16px, 4vw, 32px) clamp(60px, 8vw, 100px)',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 className="font-headline-md" style={{ color: 'var(--on-surface)' }}>
            Why AniKode?
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '20px',
        }}>
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <Zap size={24} />
            </div>
            <h3 className="font-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600, margin: 0 }}>
              Unmatched Performance
            </h3>
            <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
              Transpiles to optimized C++20 machine binaries with 0.003s startup and zero runtime overhead on any architecture.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600, margin: 0 }}>
              Propositional Logic Rules
            </h3>
            <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
              Native first-class boolean algebra operators (implies, iff, xor, all, any) for rigorous access policies and mathematical proofs.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <Boxes size={24} />
            </div>
            <h3 className="font-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600, margin: 0 }}>
              Developer Experience
            </h3>
            <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
              Flexible variable syntax, deterministic range loops, AST statement disablers (#N#), and instant in-browser playgrounds.
            </p>
          </div>
        </div>
      </section>

      {/* Download / CLI Quickstart Banner */}
      <section id="downloads" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 clamp(16px, 4vw, 32px) clamp(60px, 8vw, 100px)',
      }}>
        <div style={{
          backgroundColor: '#161B22',
          border: '1px solid #30363D',
          borderRadius: '16px',
          padding: 'clamp(28px, 6vw, 48px) clamp(16px, 5vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)',
        }}>
          <p className="font-label-caps" style={{ color: 'var(--primary)' }}>
            GET STARTED TODAY
          </p>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)', maxWidth: '600px', margin: 0 }}>
            Install the AniKode CLI
          </h2>
          <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '580px', margin: 0 }}>
            Install globally with npm or download the zero-dependency standalone binary for Windows.
          </p>

          <div style={{
            backgroundColor: '#05070a',
            border: '1px solid var(--outline-variant)',
            borderRadius: '8px',
            padding: '12px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(12px, 2.5vw, 14px)',
            color: 'var(--on-surface)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '100%',
            overflowX: 'auto',
          }}>
            <Terminal size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            <code>npm install -g anikode</code>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', justifyContent: 'center', width: '100%' }}>
            <a
              href={SITE_CONFIG.links.directDownloadExe}
              download="anikode.exe"
              className="btn-primary-action"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} />
              <span>Download Standalone .exe (v1.0.0)</span>
            </a>
            <a href="/sandbox" className="btn-secondary-action">
              <Play size={16} />
              <span>Open Web Playground</span>
            </a>
          </div>

          {/* Secondary Link for All Versions */}
          <div style={{ marginTop: '8px' }}>
            <a
              href={SITE_CONFIG.links.releases}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body-sm"
              style={{
                color: 'var(--on-surface-variant)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
            >
              <span>View all releases &amp; changelogs on GitHub</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
