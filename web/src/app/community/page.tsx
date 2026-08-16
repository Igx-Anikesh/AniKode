'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Rss, 
  MessageSquare, 
  Github, 
  HeartHandshake, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  Code
} from 'lucide-react';

interface ArticleItem {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  alt: string;
}

const ARTICLES: ArticleItem[] = [
  {
    id: 'release-1-0',
    tag: 'Release Notes',
    tagColor: 'var(--primary)',
    title: 'AniKode v1.0 is Now Available',
    description: 'Introducing the native C++20 compiler engine, zero-cost memory safety, propositional logic verification pipeline, and glitch-proof bounded loops.',
    date: 'August 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    alt: 'Modern high performance server room with glowing lights'
  },
  {
    id: 'spotlight-q3',
    tag: 'Community',
    tagColor: 'var(--tertiary)',
    title: 'Spotlight: Top AniKode Modules & Algorithms',
    description: 'Discover the most innovative packages created by community contributors, ranging from mathematical proof engines to algorithmic simulation suites.',
    date: 'August 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    alt: 'Abstract digital code architecture and geometric neon planes'
  }
];

export default function CommunityPage() {
  const [registryQuery, setRegistryQuery] = useState('');

  const handleRegistrySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (registryQuery.trim()) {
      window.location.href = `/library?search=${encodeURIComponent(registryQuery)}`;
    }
  };

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 64px)' }}>
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 32px) 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
        width: '100%',
        overflowX: 'hidden',
      }}>
        {/* Hero Section */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>
            Connect &amp; Create
          </h1>
          <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '640px' }}>
            Join developers building high-speed applications with AniKode. Explore modules, read compiler release updates, and contribute to the core ecosystem.
          </p>
        </section>

        {/* Package Registry Search Component */}
        <section className="glow-hover" style={{
          backgroundColor: '#161B22',
          border: '1px solid #30363D',
          borderRadius: '12px',
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={22} color="var(--primary)" />
            <h2 className="font-headline-md" style={{ fontSize: '24px', color: 'var(--on-surface)' }}>
              Package &amp; Function Registry
            </h2>
          </div>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', textAlign: 'center', maxWidth: '580px' }}>
            Search community-driven packages, algorithms, and modules to supercharge your next AniKode project.
          </p>

          <form onSubmit={handleRegistrySearch} style={{ width: '100%', maxWidth: '640px', position: 'relative', marginTop: '12px' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
            <input
              type="text"
              value={registryQuery}
              onChange={(e) => setRegistryQuery(e.target.value)}
              placeholder="Search for packages (e.g. math-utils, fibonacci, sort, matrix)..."
              style={{
                width: '100%',
                backgroundColor: '#0D1117',
                border: '1px solid #30363D',
                borderRadius: '6px',
                padding: '14px 100px 14px 48px',
                fontSize: '15px',
                fontFamily: 'var(--font-body)',
                color: 'var(--on-surface)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = '#30363D'}
            />
            <button
              type="submit"
              className="font-label-caps"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#30363D',
                color: 'var(--on-surface)',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#414752'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#30363D'}
            >
              Search
            </button>
          </form>
        </section>

        {/* Bento Grid: Blog & Contribution */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
        }}>
          {/* Latest Updates (Span 8) */}
          <div className="glow-hover lg:col-span-8" style={{
            gridColumn: 'span 12',
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            transition: 'all 0.3s ease',
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
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #30363D',
              paddingBottom: '16px',
            }}>
              <h2 className="font-headline-md" style={{ fontSize: '22px', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Rss size={20} color="var(--primary)" />
                Latest Updates
              </h2>
              <Link href="/docs" className="font-label-caps" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '13px' }}>
                View All →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ARTICLES.map((art) => (
                <div
                  key={art.id}
                  className="group"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '20px',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid transparent',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#21262D';
                    e.currentTarget.style.borderColor = '#30363D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{
                    width: '128px',
                    height: '96px',
                    borderRadius: '6px',
                    backgroundColor: '#30363D',
                    flexShrink: 0,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.image}
                      alt={art.alt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="font-label-caps" style={{ color: art.tagColor, fontSize: '12px' }}>
                        {art.tag}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                        {art.date} · {art.readTime}
                      </span>
                    </div>

                    <h3 className="font-body-lg" style={{ fontWeight: 600, color: 'var(--on-surface)', margin: 0 }}>
                      {art.title}
                    </h3>
                    <p className="font-body-sm" style={{
                      color: 'var(--on-surface-variant)',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.5,
                    }}>
                      {art.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Discussion & Contribution Guide (Span 4) */}
          <div style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }} className="lg:col-span-4">
            {/* Join Discussion Card */}
            <div className="glow-hover" style={{
              backgroundColor: '#161B22',
              border: '1px solid #30363D',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              transition: 'all 0.3s ease',
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid #30363D',
                paddingBottom: '12px',
              }}>
                <MessageSquare size={18} color="var(--secondary)" />
                <h2 className="font-headline-md" style={{ fontSize: '18px', color: 'var(--on-surface)' }}>
                  Join the Discussion
                </h2>
              </div>
              <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
                Connect with maintainers and other AniKode developers in real-time.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid #30363D',
                    textDecoration: 'none',
                    backgroundColor: 'transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = '#21262D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#30363D';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MessageSquare size={16} color="var(--on-surface-variant)" />
                    <span className="font-body-md" style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: '14px' }}>
                      Discord Server
                    </span>
                  </div>
                  <ArrowRight size={14} color="var(--outline)" />
                </a>

                <a
                  href="https://github.com/Igx-Anikesh/AniKode/discussions"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid #30363D',
                    textDecoration: 'none',
                    backgroundColor: 'transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = '#21262D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#30363D';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Github size={16} color="var(--on-surface-variant)" />
                    <span className="font-body-md" style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: '14px' }}>
                      GitHub Discussions
                    </span>
                  </div>
                  <ArrowRight size={14} color="var(--outline)" />
                </a>
              </div>
            </div>

            {/* Contribution Guide Card */}
            <div className="glow-hover" style={{
              background: 'linear-gradient(135deg, #161B22 0%, #21262D 100%)',
              border: '1px solid rgba(162, 201, 255, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(162, 201, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(162, 201, 255, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                position: 'absolute',
                top: '-32px',
                right: '-32px',
                width: '120px',
                height: '120px',
                backgroundColor: 'rgba(162, 201, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: '1px solid rgba(48, 54, 61, 0.5)',
                paddingBottom: '12px',
                position: 'relative',
                zIndex: 1,
              }}>
                <HeartHandshake size={18} color="var(--primary)" />
                <h2 className="font-headline-md" style={{ fontSize: '18px', color: 'var(--on-surface)' }}>
                  Contribution Guide
                </h2>
              </div>
              <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)', margin: 0, position: 'relative', zIndex: 1, lineHeight: 1.5 }}>
                Want to help shape AniKode? Read our guidelines for submitting PRs, reporting bugs, and proposing new language features.
              </p>

              <a
                href="https://github.com/Igx-Anikesh/AniKode"
                target="_blank"
                rel="noreferrer"
                className="font-label-caps"
                style={{
                  marginTop: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'filter 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
              >
                Read Guidelines <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
