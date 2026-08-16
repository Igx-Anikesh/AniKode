'use client';

import React, { useState } from 'react';
import SnippetCard from '@/components/SnippetCard';
import { COMMUNITY_SNIPPETS, Snippet } from '@/lib/snippets';
import { useRouter } from 'next/navigation';
import { Search, Plus, X, Layers, CheckCircle2 } from 'lucide-react';

export default function LibraryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [snippetsList, setSnippetsList] = useState<Snippet[]>(COMMUNITY_SNIPPETS);
  
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Math' | 'Logic' | 'Algorithms' | 'Utilities' | 'Games'>('Utilities');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newTags, setNewTags] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ['All', 'Algorithms', 'Logic', 'Math', 'Utilities', 'Games'];

  const filteredSnippets = snippetsList.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenInSandbox = (code: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('anikode_sandbox_code', code);
      router.push(`/sandbox?t=${Date.now()}`);
    }
  };

  const handleAddSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    const newSnippet: Snippet = {
      id: 'custom-' + Date.now(),
      title: newTitle,
      description: newDesc || 'Community contributed AniKode function.',
      category: newCategory,
      author: newAuthor || 'Anikesh',
      code: newCode,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    setSnippetsList([newSnippet, ...snippetsList]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewAuthor('');
      setNewCode('');
      setNewTags('');
    }, 1200);
  };

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 64px)' }}>
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 32px) 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '36px',
        width: '100%',
        overflowX: 'hidden',
      }}>
        {/* Header Banner */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}>
          <div>
            <p className="font-label-caps" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
              Ecosystem
            </p>
            <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '8px' }}>
              Function &amp; Script Library
            </h1>
            <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '640px' }}>
              Explore and run open-source algorithms, mathematical routines, and propositional logic models directly in your browser.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--primary)',
              color: 'var(--on-primary)',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '13px',
              boxShadow: '0 0 15px rgba(162, 201, 255, 0.25)',
              transition: 'filter 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
          >
            <Plus size={16} />
            <span>Submit Function</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          backgroundColor: '#161B22',
          border: '1px solid #30363D',
          borderRadius: '10px',
          padding: '12px 16px',
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '480px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
            <input
              type="text"
              placeholder="Search functions, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0D1117',
                border: '1px solid #30363D',
                borderRadius: '6px',
                padding: '8px 12px 8px 36px',
                fontSize: '14px',
                color: 'var(--on-surface)',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="font-label-caps"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--primary)' : '#30363D',
                    backgroundColor: isSelected ? 'var(--secondary-container)' : 'transparent',
                    color: isSelected ? 'var(--on-secondary-container)' : 'var(--on-surface-variant)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--outline-variant)';
                      e.currentTarget.style.color = 'var(--on-surface)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#30363D';
                      e.currentTarget.style.color = 'var(--on-surface-variant)';
                    }
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Snippet Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '24px',
        }}>
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onOpenInSandbox={handleOpenInSandbox}
            />
          ))}
        </div>

        {filteredSnippets.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '64px 20px',
            color: 'var(--on-surface-variant)',
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '12px',
          }}>
            <Layers size={36} color="var(--outline)" style={{ marginBottom: '12px' }} />
            <h3 className="font-headline-md" style={{ fontSize: '20px', color: 'var(--on-surface)', marginBottom: '6px' }}>
              No matching functions found
            </h3>
            <p className="font-body-md" style={{ margin: 0 }}>
              Try searching with another keyword or category filter.
            </p>
          </div>
        )}
      </main>

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 7, 10, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '12px',
            padding: '32px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)',
            position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 className="font-headline-md" style={{ fontSize: '22px', color: 'var(--on-surface)' }}>
                Share Your Function
              </h2>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {submitSuccess ? (
              <div style={{
                textAlign: 'center',
                padding: '32px 0',
                color: '#67df70',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}>
                <CheckCircle2 size={48} color="#67df70" />
                <h3 className="font-headline-md" style={{ fontSize: '20px', color: 'var(--on-surface)' }}>
                  Function Added!
                </h3>
                <p className="font-body-md" style={{ color: 'var(--on-surface-variant)' }}>
                  Your contribution is now available in the live library list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddSnippet} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="font-label-caps" style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '6px' }}>
                    Function Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Binary Search Tree"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0D1117',
                      border: '1px solid #30363D',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'var(--on-surface)',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="font-label-caps" style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '6px' }}>
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      style={{
                        width: '100%',
                        backgroundColor: '#0D1117',
                        border: '1px solid #30363D',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        color: 'var(--on-surface)',
                        fontSize: '14px',
                      }}
                    >
                      <option value="Algorithms">Algorithms</option>
                      <option value="Logic">Logic</option>
                      <option value="Math">Math</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Games">Games</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-label-caps" style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '6px' }}>
                      Your Name / Handle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. dev_user"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#0D1117',
                        border: '1px solid #30363D',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        color: 'var(--on-surface)',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-caps" style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '6px' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Brief summary of what this code accomplishes..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0D1117',
                      border: '1px solid #30363D',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'var(--on-surface)',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div>
                  <label className="font-label-caps" style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '6px' }}>
                    AniKode Source Code
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="fn myAlgorithm() {&#10;    ...&#10;}"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#05070a',
                      border: '1px solid #30363D',
                      borderRadius: '6px',
                      padding: '10px',
                      color: 'var(--on-surface)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      lineHeight: '1.5',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: 'transparent',
                      border: '1px solid #30363D',
                      color: 'var(--on-surface-variant)',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 20px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary)',
                      color: 'var(--on-primary)',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Publish Snippet
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
