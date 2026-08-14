'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function LicensePage() {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '60px 24px 100px',
    }}>
      {/* Top Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#FFFFFF' }}>
          MIT Open Source License
        </h1>
        <p style={{ color: '#8B949E', fontSize: '1.05rem', lineHeight: 1.6 }}>
          AniKode is proudly released as free and open-source software under the standard MIT License.
        </p>
      </div>

      {/* Permissions Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        <div className="dev-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>🚀</div>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px' }}>Commercial & Private Use</h3>
          <p style={{ color: '#8B949E', fontSize: '0.875rem' }}>
            Free to use in personal, educational, and commercial software projects.
          </p>
        </div>

        <div className="dev-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>✏️</div>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px' }}>Modification</h3>
          <p style={{ color: '#8B949E', fontSize: '0.875rem' }}>
            Free to modify, extend, and adapt the compiler and standard library.
          </p>
        </div>

        <div className="dev-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>📦</div>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px' }}>Distribution</h3>
          <p style={{ color: '#8B949E', fontSize: '0.875rem' }}>
            Free to package, distribute, or bundle with other tools and binaries.
          </p>
        </div>
      </div>

      {/* Official License Text Block */}
      <div className="code-window" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '16px' }}>
          The MIT License (MIT)
        </h3>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.875rem',
          lineHeight: '1.7',
          color: '#8B949E',
          whiteSpace: 'pre-wrap',
        }}>
{`Copyright (c) 2026 AniKode Open Source Project & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
        </div>
      </div>
    </div>
  );
}
