'use client';

import React, { useState } from 'react';
import { Zap, ShieldCheck, Boxes, Copy, Check, Download, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [copiedCode, setCopiedCode] = useState(false);

  const heroCode = `fn fibonacci(n) {
    if n <= 1 {
        return n
    }
    
    let mut a = 0
    let mut b = 1
    
    loop _ from 2 to n {
        let temp = a + b
        a = b
        b = temp
    }
    
    return b
}

fn main() {
    let result = fibonacci(10)
    say.out("Fib(10) =", result) // Outputs 55
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(heroCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '120px 32px 80px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}>
          {/* Hero Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>
                Code at the Speed of Thought
              </h1>
              <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '500px' }}>
                AniKode brings memory safety, fearless concurrency, and blazing fast execution to modern systems programming. Build reliable software faster than ever before.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <a href="#downloads" className="btn-primary-action">
                Download AniKode
              </a>
              <a href="/docs" className="btn-secondary-action">
                View Docs
              </a>
              <a href="/sandbox" className="btn-secondary-action" style={{ color: 'var(--primary)' }}>
                Playground →
              </a>
            </div>
          </div>

          {/* Hero Code Snippet with Subtle Glow on Hover */}
          <div className="code-wrapper">
            <div className="code-glow" />
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

              {/* Code Content */}
              <div style={{ padding: '24px', overflowX: 'auto' }}>
                <pre className="font-code-block" style={{ margin: 0, color: 'var(--on-surface-variant)' }}>
                  <code>
                    <span className="hl-keyword">fn</span> <span className="hl-function">fibonacci</span>(n: <span className="hl-keyword">u32</span>) -&gt; <span className="hl-keyword">u32</span> &#123;{'\n'}
                    {'    '}<span className="hl-keyword">if</span> n &lt;= <span className="hl-number">1</span> &#123;{'\n'}
                    {'        '}<span className="hl-keyword">return</span> n;{'\n'}
                    {'    '}&#125;{'\n'}
                    {'\n'}
                    {'    '}<span className="hl-keyword">let mut</span> a = <span className="hl-number">0</span>;{'\n'}
                    {'    '}<span className="hl-keyword">let mut</span> b = <span className="hl-number">1</span>;{'\n'}
                    {'\n'}
                    {'    '}<span className="hl-keyword">loop</span> _ <span className="hl-keyword">from</span> <span className="hl-number">2</span> <span className="hl-keyword">to</span> n &#123;{'\n'}
                    {'        '}<span className="hl-keyword">let</span> temp = a + b;{'\n'}
                    {'        '}a = b;{'\n'}
                    {'        '}b = temp;{'\n'}
                    {'    '}&#125;{'\n'}
                    {'\n'}
                    {'    '}<span className="hl-keyword">return</span> b;{'\n'}
                    &#125;{'\n'}
                    {'\n'}
                    <span className="hl-keyword">fn</span> <span className="hl-function">main</span>() &#123;{'\n'}
                    {'    '}<span className="hl-keyword">let</span> result = fibonacci(<span className="hl-number">10</span>);{'\n'}
                    {'    '}<span className="hl-function">say.out</span>(<span className="hl-string">&quot;Fib(10) =&quot;</span>, result); <span className="hl-comment">// Outputs 55</span>{'\n'}
                    &#125;
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
        padding: '60px 32px 100px',
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 className="font-headline-md" style={{ color: 'var(--on-surface)' }}>
            Why AniKode?
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <Zap size={24} />
            </div>
            <h3 className="font-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
              Unmatched Performance
            </h3>
            <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Compiles to highly optimized machine code. Near-zero runtime overhead ensures your applications run at peak efficiency on any architecture.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
              Guaranteed Safety
            </h3>
            <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
              A strictly enforced borrow checker and advanced type system eliminate null pointer dereferences and data races at compile time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-box">
              <Boxes size={24} />
            </div>
            <h3 className="font-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
              Developer Experience
            </h3>
            <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
              Modern syntax, powerful macro system, and a built-in package manager designed to get out of your way and let you build.
            </p>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section id="downloads" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '20px 32px 100px',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 className="font-headline-md" style={{ color: 'var(--on-surface)' }}>
            Get Started with AniKode
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          <div className="feature-card" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 className="font-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
                Windows Standalone (.exe)
              </h3>
              <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                Zero Node.js dependency. Download the compiled executable ready for Windows x64.
              </p>
            </div>
            <a
              href="https://github.com/Igx-Anikesh/AniKode/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-action"
              style={{ marginTop: '16px', gap: '8px' }}
            >
              <Download size={16} />
              <span>Download anikode.exe</span>
            </a>
          </div>

          <div className="feature-card" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 className="font-body-lg" style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
                Global NPM Package
              </h3>
              <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)' }}>
                Install globally on any system with Node.js and execute scripts anywhere.
              </p>
            </div>
            <div style={{
              backgroundColor: 'var(--surface-container-lowest)',
              border: '1px solid var(--outline-variant)',
              borderRadius: '4px',
              padding: '10px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--primary)',
              textAlign: 'center',
              marginTop: '16px',
            }}>
              npm install -g anikode
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
