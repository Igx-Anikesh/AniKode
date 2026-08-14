'use client';

import React from 'react';
import { 
  Terminal, 
  Code, 
  Cpu, 
  Repeat, 
  Layers, 
  Boxes, 
  ShieldAlert, 
  Wrench, 
  Zap,
  BookOpen
} from 'lucide-react';

export interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
}

export const DOC_SECTIONS: DocSection[] = [
  { id: 'quickstart', title: 'Quick Start & Install', icon: Zap },
  { id: 'literals', title: 'Lexical Grammar & Types', icon: Code },
  { id: 'variables', title: 'Variables (3 Styles)', icon: Layers },
  { id: 'comments', title: 'Comments & #N# Disabler', icon: Terminal },
  { id: 'control-flow', title: 'Conditionals & Loops', icon: Repeat },
  { id: 'functions', title: 'Functions & recurse()', icon: Boxes },
  { id: 'logic', title: 'Propositional Logic Rules', icon: Cpu },
  { id: 'exceptions', title: 'Exception Handling', icon: ShieldAlert },
  { id: 'namespaces', title: 'Standard Namespaces', icon: Wrench },
  { id: 'cli', title: 'Native C++ CLI Compiler', icon: BookOpen },
];

interface DocSidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export default function DocSidebar({ activeSection, onSelectSection }: DocSidebarProps) {
  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      background: '#07090E',
      borderRight: '1px solid var(--border)',
      padding: '24px 16px',
      height: 'calc(100vh - 68px)',
      position: 'sticky',
      top: '68px',
      overflowY: 'auto',
    }}>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#6E7681',
        marginBottom: '14px',
        paddingLeft: '10px',
      }}>
        Documentation
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {DOC_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                color: isActive ? '#60A5FA' : '#8B949E',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#8B949E';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span>{section.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
