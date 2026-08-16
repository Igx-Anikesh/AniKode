'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { compileAndExecute } from '@/lib/compiler';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Columns, 
  Rows, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Code2
} from 'lucide-react';

const PRESETS: Record<string, { title: string; fileName: string; code: string }> = {
  calculator: {
    title: 'Calculator & Types',
    fileName: 'calculator.kode',
    code: `~ AniKode Calculator & Type Casting ~
let x = 100
set y to 250

say.out("--- CALCULATOR DEMO ---")
say.out("x value:", x)
say.out("y value:", y)

let sum = x + y
say.out("Sum of x and y:", sum)

#2#
say.out("This statement is disabled by #2#")
say.out("This statement is also disabled")

say.out("Calculations complete!")`
  },
  loops: {
    title: 'Range & Collection Loops',
    fileName: 'loops.kode',
    code: `~ Range and Collection Loops ~
say.out("--- Range Loop (1 to 5) ---")
loop i from 1 to 5 {
  say.out("Count:", i)
}

say.out("--- Collection Loop (each ... in ...) ---")
set fruits = ["Apple", "Mango", "Blueberry", "Dragonfruit"]
each f in fruits {
  say.out("Fruit:", f)
}`
  },
  logic: {
    title: 'Propositional Logic & Rules',
    fileName: 'security.kode',
    code: `~ Propositional Logic in AniKode ~
fn checkAccess(isAdmin, isManager, is2FA, score) {
  \\ Rule: (isAdmin implies is2FA) and score >= 50 \\
  let passed = (isAdmin implies is2FA) and (score >= 50)
  return passed
}

say.out("=== ACCESS VERIFICATION PIPELINE ===")
let u1 = checkAccess(true, false, true, 85)
say.out("Admin with 2FA & 85 Score -> Access:", u1)

let u2 = checkAccess(true, false, false, 95)
say.out("Admin without 2FA -> Access:", u2)

let u3 = checkAccess(false, false, false, 60)
say.out("Regular User with 60 Score -> Access:", u3)`
  },
  recursion: {
    title: 'Recursion with recurse()',
    fileName: 'nesting.kode',
    code: `~ Recursive Nesting Dolls using recurse() ~
fn openDoll(size) {
  if size == 1 {
    return "🎁 Found the prize!"
  }
  say.out("Opened doll of size: " + size)
  return recurse(size - 1)
}

say.out("--- Nesting Doll Test ---")
let result = openDoll(4)
say.out("Final Result:", result)`
  },
  exceptions: {
    title: 'Exception Handling (try/catch)',
    fileName: 'exceptions.kode',
    code: `~ Error Handling in AniKode ~
fn divideNumbers(a, b) {
  if b == 0 {
    throw "Cannot divide by zero!"
  }
  return a / b
}

try {
  say.out("Attempting 10 / 2:", divideNumbers(10, 2))
  say.out("Attempting 10 / 0:")
  say.out(divideNumbers(10, 0))
} catch (err) {
  say.out("Caught Expected Error:", err.message)
} finally {
  say.out("Cleanup complete.")
}`
  }
};

export default function PlaygroundPage() {
  const [activePresetKey, setActivePresetKey] = useState('calculator');
  const [code, setCode] = useState(PRESETS.calculator.code);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Split layout state: 'horizontal' (side-by-side) or 'vertical' (stacked)
  const [splitDirection, setSplitDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  // Percentage for the first pane (editor): 20 to 80
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [isDragging, setIsDragging] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'output'>('editor');

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCount = code.split('\n').length;

  const runWithCode = (codeToRun: string) => {
    setIsRunning(true);
    // On small screens, automatically switch to output tab
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setMobileTab('output');
    }
    setTimeout(() => {
      const result = compileAndExecute(codeToRun);
      setOutput(result.output);
      setErrors(result.errors);
      setExecutionTime(result.executionTimeMs);
      setIsRunning(false);
    }, 10);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCode = sessionStorage.getItem('anikode_sandbox_code');
      if (savedCode) {
        setCode(savedCode);
        sessionStorage.removeItem('anikode_sandbox_code');
        runWithCode(savedCode);
        return;
      }
    }
    runWithCode(code);
  }, []);

  const handleSelectPreset = (key: string) => {
    setActivePresetKey(key);
    setCode(PRESETS[key].code);
    setOutput([]);
    setErrors([]);
    setExecutionTime(undefined);
  };

  const handleReset = () => {
    setCode(PRESETS[activePresetKey].code);
    setOutput([]);
    setErrors([]);
    setExecutionTime(undefined);
  };

  const handleRun = () => {
    runWithCode(code);
  };

  const handleClearTerminal = () => {
    setOutput([]);
    setErrors([]);
    setExecutionTime(undefined);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard tab support in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);

      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
    // Ctrl+Enter or Cmd+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  // Drag to resize split pane
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (splitDirection === 'horizontal') {
        const offset = e.clientX - rect.left;
        const total = rect.width;
        const newRatio = Math.max(20, Math.min(80, (offset / total) * 100));
        setSplitRatio(newRatio);
      } else {
        const offset = e.clientY - rect.top;
        const total = rect.height;
        const newRatio = Math.max(20, Math.min(80, (offset / total) * 100));
        setSplitRatio(newRatio);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, splitDirection]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      marginTop: '64px',
      backgroundColor: 'var(--surface-container-lowest)',
      overflow: 'hidden',
      userSelect: isDragging ? 'none' : 'auto',
    }}>
      {/* IDE Toolbar */}
      <div style={{
        height: '48px',
        borderBottom: '1px solid var(--outline-variant)',
        backgroundColor: 'var(--surface-container)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(12px, 3vw, 24px)',
        flexShrink: 0,
        gap: '10px',
      }}>
        {/* Left Side: Preset selector & File Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: '1 1 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--outline-variant)',
            borderRadius: '6px',
            overflow: 'hidden',
            fontSize: '13px',
            maxWidth: '100%',
          }}>
            <span className="hide-on-mobile" style={{
              padding: '6px 12px',
              borderRight: '1px solid var(--outline-variant)',
              color: 'var(--on-surface-variant)',
              backgroundColor: 'var(--surface-container-low)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              whiteSpace: 'nowrap',
            }}>
              {PRESETS[activePresetKey]?.fileName || 'main.kode'}
            </span>

            <select
              value={activePresetKey}
              onChange={(e) => handleSelectPreset(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--on-surface)',
                border: 'none',
                padding: '6px 24px 6px 10px',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '180px',
              }}
            >
              {Object.keys(PRESETS).map((k) => (
                <option key={k} value={k} style={{ backgroundColor: '#10141a', color: '#dfe2eb' }}>
                  {PRESETS[k].title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center / Right: Split Mode Toggles & Execution Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Split Mode Toggle Buttons (Desktop only) */}
          <div className="hide-on-mobile" style={{
            backgroundColor: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
            borderRadius: '6px',
            padding: '2px',
          }}>
            <button
              onClick={() => setSplitDirection('horizontal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: splitDirection === 'horizontal' ? 'var(--surface-container-high)' : 'transparent',
                color: splitDirection === 'horizontal' ? 'var(--primary)' : 'var(--on-surface-variant)',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
              title="Side-by-Side (Horizontal Split)"
            >
              <Columns size={14} />
              <span>Side</span>
            </button>

            <button
              onClick={() => setSplitDirection('vertical')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: splitDirection === 'vertical' ? 'var(--surface-container-high)' : 'transparent',
                color: splitDirection === 'vertical' ? 'var(--primary)' : 'var(--on-surface-variant)',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
              title="Stacked (Vertical Split)"
            >
              <Rows size={14} />
              <span>Stack</span>
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              border: '1px solid var(--outline-variant)',
              color: 'var(--on-surface-variant)',
              backgroundColor: 'transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--on-surface)';
              e.currentTarget.style.backgroundColor = 'var(--surface-container-high)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--on-surface-variant)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Reset code to preset default"
          >
            <RotateCcw size={14} />
            <span className="hide-on-mobile">Reset</span>
          </button>

          {/* Run Button */}
          <button
            onClick={handleRun}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: 'var(--primary)',
              color: 'var(--on-primary)',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              boxShadow: '0 0 15px rgba(162, 201, 255, 0.3)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            title="Execute Code (Ctrl + Enter)"
          >
            <Play size={14} fill="currentColor" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (< 768px) */}
      <div className="mobile-only" style={{
        backgroundColor: 'var(--surface-container-low)',
        borderBottom: '1px solid var(--outline-variant)',
        padding: '6px 12px',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setMobileTab('editor')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: mobileTab === 'editor' ? 'var(--primary-container)' : 'transparent',
              color: mobileTab === 'editor' ? '#ffffff' : 'var(--on-surface-variant)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Code2 size={14} />
            <span>Code Editor</span>
          </button>
          <button
            onClick={() => setMobileTab('output')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: mobileTab === 'output' ? 'var(--primary-container)' : 'transparent',
              color: mobileTab === 'output' ? '#ffffff' : 'var(--on-surface-variant)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Clock size={14} />
            <span>Output {output.length > 0 ? `(${output.length})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Resizable Split Pane Container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: splitDirection === 'horizontal' ? 'row' : 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left / Top Pane: Code Editor */}
        <div
          className="desktop-pane-editor"
          style={{
            flex: `0 0 ${splitRatio}%`,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--code-bg)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Editor Sub-Header */}
          <div style={{
            height: '36px',
            backgroundColor: 'var(--code-header-bg)',
            borderBottom: '1px solid rgba(65, 71, 82, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
          }}>
            <span className="font-label-caps" style={{ color: 'var(--outline)', fontSize: '11px' }}>
              AniKode Script Editor
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
                gap: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--outline)'}
              title="Copy Code"
            >
              {copied ? <Check size={12} color="#40ba51" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Editor Body with Line Numbers */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
            {/* Line Numbers */}
            <div style={{
              width: '44px',
              backgroundColor: 'var(--surface-container-lowest)',
              borderRight: '1px solid rgba(65, 71, 82, 0.3)',
              padding: '16px 8px 16px 4px',
              textAlign: 'right',
              color: 'rgba(192, 199, 212, 0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.6',
              userSelect: 'none',
              overflowY: 'hidden',
            }}>
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Input Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              placeholder="Write your AniKode code here..."
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--on-surface)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: '1.6',
                resize: 'none',
                whiteSpace: 'pre',
                overflowY: 'auto',
              }}
            />
          </div>
        </div>

        {/* Resizer Handle (Draggable Divider - Desktop only) */}
        <div
          className="desktop-resizer hide-on-mobile"
          onMouseDown={startResizing}
          style={{
            flexShrink: 0,
            width: splitDirection === 'horizontal' ? '6px' : '100%',
            height: splitDirection === 'horizontal' ? '100%' : '6px',
            backgroundColor: isDragging ? 'var(--primary)' : 'var(--outline-variant)',
            cursor: splitDirection === 'horizontal' ? 'col-resize' : 'row-resize',
            transition: 'background-color 0.15s',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            if (!isDragging) e.currentTarget.style.backgroundColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            if (!isDragging) e.currentTarget.style.backgroundColor = 'var(--outline-variant)';
          }}
          title="Drag to resize panes"
        />

        {/* Right / Bottom Pane: Terminal / Output Console */}
        <div
          className="desktop-pane-output"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--surface-container-lowest)',
            overflow: 'hidden',
          }}
        >
          {/* Console Header Bar */}
          <div style={{
            height: '36px',
            backgroundColor: 'rgba(28, 32, 38, 0.7)',
            borderBottom: '1px solid var(--outline-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-label-caps" style={{ color: 'var(--on-surface-variant)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code2 size={13} color="var(--primary)" />
                Console Output
              </span>
              {executionTime !== undefined && (
                <span style={{
                  fontSize: '11px',
                  color: '#67df70',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Clock size={11} />
                  {executionTime}ms
                </span>
              )}
            </div>

            <button
              onClick={handleClearTerminal}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--on-surface-variant)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--on-surface)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
              title="Clear Console Output"
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          </div>

          {/* Console Output Screen */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.6',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {output.length === 0 && errors.length === 0 && !isRunning && (
              <div style={{ color: 'rgba(192, 199, 212, 0.4)', fontStyle: 'italic' }}>
                Click &ldquo;Run&rdquo; (or press Ctrl+Enter) to compile and execute your AniKode program.
              </div>
            )}

            {isRunning && (
              <div style={{ color: 'var(--primary)' }}>
                Compiling and executing script...
              </div>
            )}

            {/* Standard Output Lines */}
            {output.map((line, i) => (
              <div key={i} style={{ color: 'var(--on-surface)', whiteSpace: 'pre-wrap' }}>
                {line}
              </div>
            ))}

            {/* Runtime or Syntax Errors */}
            {errors.map((err, i) => (
              <div key={i} style={{
                color: 'var(--error)',
                backgroundColor: 'rgba(147, 0, 10, 0.2)',
                borderLeft: '3px solid var(--error)',
                padding: '6px 10px',
                borderRadius: '0 4px 4px 0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}>
                <AlertCircle size={15} color="var(--error)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{err}</span>
              </div>
            ))}

            {/* Execution Completion Success Banner */}
            {output.length > 0 && errors.length === 0 && (
              <div style={{
                marginTop: '12px',
                color: '#67df70',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <CheckCircle2 size={13} color="#67df70" />
                <span>✓ Program finished successfully ({executionTime}ms)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-pane-editor {
            display: ${mobileTab === 'editor' ? 'flex' : 'none'} !important;
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          .desktop-pane-output {
            display: ${mobileTab === 'output' ? 'flex' : 'none'} !important;
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          .desktop-resizer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
