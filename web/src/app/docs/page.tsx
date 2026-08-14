'use client';

import React, { useState } from 'react';
import { 
  Info, 
  Download, 
  Code, 
  BookOpen, 
  Cpu, 
  Copy, 
  Check, 
  Search, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Terminal,
  Zap,
  Layers,
  Repeat,
  AlertTriangle,
  FileCode,
  FunctionSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  description: string;
  syntax?: string;
  codeLang: string;
  code: string;
  output?: string;
  notes?: string[];
}

interface DocTopic {
  id: string;
  category: string;
  title: string;
  icon: React.ElementType;
  description: string;
  featuresTitle?: string;
  featuresDesc?: string;
  bulletPoints?: string[];
  sections: DocSection[];
}

const COMPLETE_DOCS: DocTopic[] = [
  {
    id: 'intro',
    category: 'Getting Started',
    title: 'Introduction & Overview',
    icon: Info,
    description: 'AniKode is a dual-target, developer-first programming language designed to unite the expressive simplicity of dynamic scripting with native C++20 machine speed, mathematical propositional logic, and glitch-proof control flow.',
    featuresTitle: 'Core Language Architecture',
    featuresDesc: 'AniKode features a modular Lexer, Recursive Descent AST Parser, and twin code generators (JavaScript VM & C++20 Native).',
    bulletPoints: [
      'Dual Engine: Run instantaneously in the browser / JS VM, or compile to native C++20 machine binaries with 0.003s startup.',
      'Propositional Logic: Native operators (implies, iff, xor, all, any) treat boolean algebra as first-class citizens.',
      'Deterministic Loops: Range loops (loop i from 1 to N) compute bounds at invocation, preventing infinite lockups.',
      'AST Disabler: #N# annotations cleanly disable the next N AST statements without syntax corruption.',
    ],
    sections: [
      {
        id: 'getting-started-install',
        title: 'Installation & Quickstart',
        description: 'Install the global CLI via npm or download the zero-dependency Windows standalone binary (anikode.exe):',
        syntax: 'npm install -g anikode',
        codeLang: 'bash',
        code: `# Install via npm globally
npm install -g anikode

# Verify version
anikode --version
# Output: AniKode v1.0.0 (x64)

# Run an AniKode script
anikode run main.kode

# Compile to native C++ binary
anikode build main.kode -o app.exe`,
        output: '# Output: Compiled app.exe (Native C++20 Machine Binary in 0.12s)',
        notes: [
          'Requirements for JS mode: Node.js 18+ (zero other dependencies).',
          'Requirements for C++ mode: Any C++20 compiler (g++, clang++, or MSVC cl.exe).'
        ]
      },
      {
        id: 'first-program',
        title: 'Your First Program (main.kode)',
        description: 'Write, inspect, and run a complete AniKode program with variables, functions, and standard output:',
        syntax: 'fn main() { ... }',
        codeLang: 'main.kode',
        code: `~ First AniKode Program ~
fn greet(user) {
    say.out("👋 Hello,", user, "welcome to AniKode!")
}

let developer = "Ayush"
greet(developer)`,
        output: '// Output: 👋 Hello, Ayush welcome to AniKode!'
      }
    ]
  },
  {
    id: 'comments-disablers',
    category: 'Language Grammar',
    title: 'Comments & #N# Disablers',
    icon: Sparkles,
    description: 'AniKode provides flexible comment delimiters (tilde and double backslash) as well as the unique #N# AST statement disabler.',
    featuresTitle: 'Comment Delimiters & AST Disablers',
    featuresDesc: 'Unlike standard line comments, AniKode provides block-safe delimiters and a numerical AST skip system for rapid debugging.',
    bulletPoints: [
      'Tilde Comments: ~ single or multi-line comment ~',
      'Backslash Comments: \\ single or multi-line comment \\',
      'Statement Disabler: #N# disables exactly the next N statements at the AST level.',
    ],
    sections: [
      {
        id: 'comment-styles',
        title: 'Tilde & Backslash Comments',
        description: 'Both single-line and multi-line comments can use either ~ or \\ delimiters:',
        syntax: '~ comment ~ or \\ comment \\',
        codeLang: 'comments.kode',
        code: `~ This is a single-line tilde comment ~
let score = 100

~ 
  This is a multi-line tilde comment.
  It can span across multiple lines safely.
~

\\ This is a backslash comment \\
\\
  Multi-line backslash comments are
  useful when writing mathematical proofs.
\\`,
        output: '// Comments are ignored by the lexer and emit zero bytecode/AST overhead.'
      },
      {
        id: 'n-disabler',
        title: 'The #N# Statement Disabler',
        description: 'Prepend #N# before any statement to temporarily disable the next N AST statements without having to manually wrap them in comment blocks:',
        syntax: '#<count># <statement>',
        codeLang: 'disabler.kode',
        code: `say.out("Statement 1: Active")

#2#
say.out("Statement 2: Disabled by #2#")
say.out("Statement 3: Disabled by #2#")

say.out("Statement 4: Active again!")`,
        output: `// Output:
// Statement 1: Active
// Statement 4: Active again!`
      }
    ]
  },
  {
    id: 'variables-types',
    category: 'Core Language',
    title: 'Variables, Assignment & Types',
    icon: Code,
    description: 'AniKode supports 3 distinct variable declaration styles, dynamic typing, primitive literals, lists, and associative maps.',
    featuresTitle: 'Variable Syntax Flexibility',
    featuresDesc: 'Choose the declaration style that matches your workflow or algorithmic style.',
    bulletPoints: [
      'Declarative Style: let x = 100',
      'Sentence Style: set x to 100',
      'Minimal Style: x = 100',
      'Data Types: Integer, Float, String, Boolean, Array, Map, Null',
    ],
    sections: [
      {
        id: 'var-declaration-styles',
        title: '3 Variable Declaration Styles',
        description: 'All 3 forms compile into identical optimized AST structures:',
        syntax: 'let <var> = <val> | set <var> to <val> | <var> = <val>',
        codeLang: 'variables.kode',
        code: `let a = 10            ~ Declarative 'let' keyword ~
set b to 20           ~ Natural language 'set ... to' syntax ~
c = 30                ~ Direct assignment ~

say.out("a =", a, "b =", b, "c =", c, "total =", a + b + c)`,
        output: '// Output: a = 10 b = 20 c = 30 total = 60'
      },
      {
        id: 'primitives-collections',
        title: 'Primitives, Arrays & Maps',
        description: 'AniKode includes native support for numbers, strings with escape characters, arrays, and nested maps:',
        syntax: 'let arr = [...] | let obj = { ... }',
        codeLang: 'types.kode',
        code: `let integerVal = 42
let floatVal = 3.14159
let text = "AniKode Language"
let isReady = true
let nothing = null

~ Arrays / Lists ~
let fruits = ["Apple", "Mango", "Blueberry"]
say.out("First Fruit:", fruits[0])

~ Associative Maps / Dictionaries ~
let user = {
    "username": "anikesh_dev",
    "role": "admin",
    "level": 99
}
say.out("User Role:", user.role)`,
        output: `// Output:
// First Fruit: Apple
// User Role: admin`
      },
      {
        id: 'type-casting',
        title: 'Type Casting & Inspection (int, float, str, type)',
        description: 'Built-in functions for explicit type conversion and runtime type discovery:',
        syntax: 'int(x) | float(x) | str(x) | type(x)',
        codeLang: 'casting.kode',
        code: `let numStr = "123"
let convertedInt = int(numStr)
let convertedFloat = float("45.67")
let strVal = str(1000)

say.out("Type of convertedInt:", type(convertedInt))
say.out("Type of text:", type(strVal))
say.out("Type of array:", type([1, 2, 3]))`,
        output: `// Output:
// Type of convertedInt: number
// Type of text: string
// Type of array: array`
      }
    ]
  },
  {
    id: 'operators-logic',
    category: 'Logic Programming',
    title: 'Operators & Propositional Logic',
    icon: Cpu,
    description: 'AniKode integrates classical arithmetic and boolean logic alongside first-class Propositional Logic rules (implies, iff, xor, all, any).',
    featuresTitle: 'Propositional Logic Calculus',
    featuresDesc: 'Formulate security policies, mathematical proofs, and business constraints with standard mathematical operators.',
    bulletPoints: [
      'implies (→): Material implication (p implies q ≡ not p or q)',
      'iff (↔): Logical biconditional equivalence (p iff q ≡ p == q)',
      'xor (⊕): Exclusive disjunction (either p or q, not both)',
      'all & any: Universal and existential array quantifiers',
    ],
    sections: [
      {
        id: 'standard-operators',
        title: 'Arithmetic, Comparison & Boolean Operators',
        description: 'Standard operators for mathematical computation and truth evaluation:',
        syntax: '+, -, *, /, %, ==, !=, <, <=, >, >=, and, or, not',
        codeLang: 'operators.kode',
        code: `let x = 15
let y = 4

say.out("Add:", x + y)        ~ 19 ~
say.out("Subtract:", x - y)   ~ 11 ~
say.out("Multiply:", x * y)   ~ 60 ~
say.out("Divide:", x / y)     ~ 3.75 ~
say.out("Modulo:", x % y)     ~ 3 ~

let isGreater = x > 10 and y < 5
say.out("Boolean Condition:", isGreater)`,
        output: '// Output: Add: 19 Subtract: 11 Multiply: 60 Divide: 3.75 Modulo: 3 Boolean Condition: true'
      },
      {
        id: 'propositional-logic-rules',
        title: 'Propositional Logic (implies, iff, xor)',
        description: 'Perform formal verification directly in code without helper functions:',
        syntax: '<expr> implies <expr> | <expr> iff <expr> | <expr> xor <expr>',
        codeLang: 'logic.kode',
        code: `~ Implication: If admin is true, then 2FA must be true ~
fn checkPolicy(isAdmin, is2FA) {
    return isAdmin implies is2FA
}

say.out("Admin + 2FA (true implies true):", checkPolicy(true, true))       ~ true ~
say.out("Admin + No 2FA (true implies false):", checkPolicy(true, false))  ~ false ~
say.out("Non-admin (false implies false):", checkPolicy(false, false))     ~ true ~

~ Biconditional (iff): Both sides must match truth values ~
let statusA = true
let statusB = true
say.out("Equivalence:", statusA iff statusB) ~ true ~

~ Exclusive OR (xor): Exactly one must be true ~
say.out("XOR Test (true xor false):", true xor false)   ~ true ~
say.out("XOR Test (true xor true):", true xor true)     ~ false ~`,
        output: `// Output:
// Admin + 2FA (true implies true): true
// Admin + No 2FA (true implies false): false
// Non-admin (false implies false): true
// Equivalence: true
// XOR Test (true xor false): true
// XOR Test (true xor true): false`
      },
      {
        id: 'quantifiers-all-any',
        title: 'Quantifiers: all & any',
        description: 'Verify collective truth across collections in single expressions:',
        syntax: 'all([list]) | any([list])',
        codeLang: 'quantifiers.kode',
        code: `let testsPassed = [true, true, true]
let hasFailures = [true, false, true]

say.out("All tests passed:", all(testsPassed))
say.out("All with failure:", all(hasFailures))
say.out("Any test passed:", any(hasFailures))`,
        output: `// Output:
// All tests passed: true
// All with failure: false
// Any test passed: true`
      }
    ]
  },
  {
    id: 'control-flow-loops',
    category: 'Control Flow',
    title: 'Conditionals, Match & Safe Loops',
    icon: Repeat,
    description: 'AniKode includes if/else ladders, match/case pattern branching, deterministic bounded range loops, and collection iterators.',
    featuresTitle: 'Deterministic, Safe Iteration',
    featuresDesc: 'Range loops eliminate infinite-loop freeze conditions by evaluating start/end bounds upfront.',
    bulletPoints: [
      'if / else if / else: Standard conditional branching',
      'match / case / default: Clean structural pattern matching',
      'loop i from A to B: Bounded range iteration (ascending or descending)',
      'each item in collection: High-speed collection traversal',
    ],
    sections: [
      {
        id: 'if-else-match',
        title: 'Conditionals (if/else) & Match Statements',
        description: 'Branch your program logic cleanly:',
        syntax: 'if <cond> { ... } else { ... } | match <val> { case <val> { ... } default { ... } }',
        codeLang: 'conditionals.kode',
        code: `let score = 88

if score >= 90 {
    say.out("Grade: A")
} else if score >= 80 {
    say.out("Grade: B")
} else {
    say.out("Grade: C")
}

let command = "start"
match command {
    case "start" {
        say.out("🚀 Engine started.")
    }
    case "stop" {
        say.out("🛑 Engine halted.")
    }
    default {
        say.out("❓ Unknown command.")
    }
}`,
        output: `// Output:
// Grade: B
// 🚀 Engine started.`
      },
      {
        id: 'bounded-range-loops',
        title: 'Bounded Range Loops (loop ... from ... to)',
        description: 'Range loops automatically calculate step direction (incrementing or decrementing):',
        syntax: 'loop <var> from <start> to <end> { ... }',
        codeLang: 'range_loops.kode',
        code: `say.out("--- Ascending Range (1 to 5) ---")
loop i from 1 to 5 {
    say.out("i =", i)
}

say.out("--- Descending Range (5 to 1) ---")
loop j from 5 to 1 {
    say.out("j =", j)
}`,
        output: `// Output:
// --- Ascending Range (1 to 5) ---
// i = 1
// i = 2
// i = 3
// i = 4
// i = 5
// --- Descending Range (5 to 1) ---
// j = 5
// j = 4
// j = 3
// j = 2
// j = 1`
      },
      {
        id: 'each-collection-loops',
        title: 'Collection Loops (each ... in ...)',
        description: 'Iterate over arrays and collections with break and continue support:',
        syntax: 'each <item> in <collection> { ... }',
        codeLang: 'each_loops.kode',
        code: `let languages = ["AniKode", "TypeScript", "C++20", "Rust"]

each lang in languages {
    if lang == "TypeScript" {
        continue ~ Skip TypeScript ~
    }
    say.out("Processing language:", lang)
}`,
        output: `// Output:
// Processing language: AniKode
// Processing language: C++20
// Processing language: Rust`
      }
    ]
  },
  {
    id: 'functions-recursion',
    category: 'Functions & Modular',
    title: 'Functions & recurse()',
    icon: FunctionSquare,
    description: 'Define reusable functions, return values, and utilize the native recurse() keyword for self-recursion.',
    featuresTitle: 'First-Class Functions & Self-Recursion',
    featuresDesc: 'The recurse() keyword resolves the current executing function automatically, making recursive algorithms refactor-proof.',
    bulletPoints: [
      'fn <name>(<args>): Declares named functions',
      'return <expr>: Returns execution results',
      'recurse(<args>): Re-invokes the current function without repeating its name',
    ],
    sections: [
      {
        id: 'function-declarations',
        title: 'Function Declaration & Return',
        description: 'Declare functions with arguments and return values:',
        syntax: 'fn <name>(<params>) { return <value> }',
        codeLang: 'functions.kode',
        code: `fn calculateHypotenuse(a, b) {
    let sumSquares = math.pow(a, 2) + math.pow(b, 2)
    return math.sqrt(sumSquares)
}

let hypotenuse = calculateHypotenuse(3, 4)
say.out("Hypotenuse (3, 4) =", hypotenuse)`,
        output: '// Output: Hypotenuse (3, 4) = 5'
      },
      {
        id: 'recurse-keyword',
        title: 'Native Self-Recursion with recurse()',
        description: 'The recurse() function keyword automatically invokes the current enclosing function:',
        syntax: 'recurse(<args>)',
        codeLang: 'factorial.kode',
        code: `fn factorial(n) {
    if n <= 1 {
        return 1
    }
    ~ Using recurse() instead of factorial(n - 1) ~
    return n * recurse(n - 1)
}

say.out("Factorial of 5 =", factorial(5))
say.out("Factorial of 6 =", factorial(6))`,
        output: `// Output:
// Factorial of 5 = 120
// Factorial of 6 = 720`
      }
    ]
  },
  {
    id: 'exceptions-io',
    category: 'Standard Library',
    title: 'Exceptions, I/O & math / file',
    icon: BookOpen,
    description: 'Robust error handling with try/catch/finally, console I/O with say.out / say.in, and built-in math and file namespaces.',
    featuresTitle: 'Built-in Namespaces & Robust Safety',
    featuresDesc: 'Zero-import built-in namespaces empower immediate productivity.',
    bulletPoints: [
      'try / catch / finally: Full exception trapping and resource cleanup',
      'throw: Raise runtime errors with custom error messages',
      'say.out & say.in: Multi-argument output and interactive terminal input',
      'math: sqrt, pow, min, max, clamp, round, floor, ceil, abs, random, pi, e',
      'file: read, write, append, exists (Desktop CLI & C++ Mode)',
    ],
    sections: [
      {
        id: 'try-catch-finally',
        title: 'Exception Handling (try / catch / finally / throw)',
        description: 'Catch runtime errors and execute deterministic cleanup:',
        syntax: 'try { ... } catch (err) { ... } finally { ... }',
        codeLang: 'exceptions.kode',
        code: `fn safeDivide(num, denom) {
    if denom == 0 {
        throw "Division by zero error!"
    }
    return num / denom
}

try {
    say.out("10 / 2 =", safeDivide(10, 2))
    say.out("10 / 0 =", safeDivide(10, 0))
} catch (err) {
    say.out("Caught Error:", err.message)
} finally {
    say.out("Cleanup: Division routine finished.")
}`,
        output: `// Output:
// 10 / 2 = 5
// Caught Error: Division by zero error!
// Cleanup: Division routine finished.`
      },
      {
        id: 'math-namespace',
        title: 'Built-in math Namespace',
        description: 'Comprehensive mathematical functions and constants available without imports:',
        syntax: 'math.<function>(...)',
        codeLang: 'math_demo.kode',
        code: `say.out("PI Constant:", math.pi)
say.out("E Constant:", math.e)

say.out("Square Root of 144:", math.sqrt(144))
say.out("2 to the power 8:", math.pow(2, 8))
say.out("Clamped (150 in 0..100):", math.clamp(150, 0, 100))
say.out("Rounded 3.75:", math.round(3.75))
say.out("Floor 4.9:", math.floor(4.9))
say.out("Ceil 4.1:", math.ceil(4.1))
say.out("Min of (10, 20):", math.min(10, 20))
say.out("Max of (10, 20):", math.max(10, 20))`,
        output: `// Output:
// PI Constant: 3.141592653589793
// E Constant: 2.718281828459045
// Square Root of 144: 12
// 2 to the power 8: 256
// Clamped (150 in 0..100): 100
// Rounded 3.75: 4
// Floor 4.9: 4
// Ceil 4.1: 5
// Min of (10, 20): 10
// Max of (10, 20): 20`
      },
      {
        id: 'file-namespace',
        title: 'Built-in file Namespace (CLI / Native)',
        description: 'Local filesystem input/output in desktop CLI and C++ compiled modes:',
        syntax: 'file.read(path) | file.write(path, data) | file.append(path, data) | file.exists(path)',
        codeLang: 'file_io.kode',
        code: `~ Write data to a text file ~
file.write("output.txt", "Hello from AniKode Filesystem I/O!\\n")

~ Append additional content ~
file.append("output.txt", "Appending a second line.\\n")

~ Verify existence and read ~
if file.exists("output.txt") {
    let content = file.read("output.txt")
    say.out("File Content:\\n" + content)
}`,
        output: `// Output:
// File Content:
// Hello from AniKode Filesystem I/O!
// Appending a second line.`
      }
    ]
  }
];

export default function DocsPage() {
  const [activeTopicId, setActiveTopicId] = useState('intro');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentTopicIndex = COMPLETE_DOCS.findIndex(t => t.id === activeTopicId);
  const currentTopic = COMPLETE_DOCS[currentTopicIndex] || COMPLETE_DOCS[0];
  const prevTopic = currentTopicIndex > 0 ? COMPLETE_DOCS[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex < COMPLETE_DOCS.length - 1 ? COMPLETE_DOCS[currentTopicIndex + 1] : null;

  const handleCopy = (code: string, sectionId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const filteredTopics = COMPLETE_DOCS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.sections.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 64px)' }}>
      {/* 3-Column Documentation Layout Matching code.html */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '96px 32px 64px',
        display: 'flex',
        flexDirection: 'row',
        gap: '32px',
        position: 'relative',
      }}>
        {/* Left Column: SideNavBar */}
        <aside style={{
          width: '280px',
          flexShrink: 0,
          position: 'sticky',
          top: '80px',
          height: 'calc(100vh - 100px)',
          backgroundColor: 'var(--surface-container-low)',
          borderRight: '1px solid var(--outline-variant)',
          padding: '24px 16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }} className="hidden md:flex">
          <div style={{ marginBottom: '16px', paddingLeft: '8px' }}>
            <h2 className="font-headline-md" style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '4px' }}>
              Documentation
            </h2>
            <p className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: '13px' }}>
              v1.0.0 Specification Reference
            </p>
          </div>

          {/* Quick Search inside Sidebar */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)' }} />
            <input
              type="text"
              placeholder="Search syntax, operators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-container-lowest)',
                border: '1px solid var(--outline-variant)',
                borderRadius: '6px',
                padding: '6px 12px 6px 32px',
                fontSize: '13px',
                color: 'var(--on-surface)',
                outline: 'none',
              }}
            />
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredTopics.map((topic) => {
              const isActive = topic.id === activeTopicId;
              const Icon = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--secondary-container)' : 'transparent',
                    color: isActive ? 'var(--on-secondary-container)' : 'var(--on-surface-variant)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--surface-container-high)';
                      e.currentTarget.style.color = 'var(--on-surface)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--on-surface-variant)';
                    }
                  }}
                >
                  <Icon size={16} />
                  <span>{topic.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Center Column: Main Content Area */}
        <main style={{ flex: 1, minWidth: 0, paddingBottom: '64px' }}>
          <article>
            {/* Header */}
            <header style={{ marginBottom: '32px' }}>
              <p className="font-label-caps" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
                {currentTopic.category}
              </p>
              <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: '16px' }}>
                {currentTopic.title}
              </h1>
              <p className="font-body-lg" style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
                {currentTopic.description}
              </p>
            </header>

            {/* Glass Highlight Panel */}
            {currentTopic.featuresTitle && (
              <div className="glass-panel" style={{
                padding: '24px',
                borderRadius: '8px',
                marginBottom: '36px',
                backgroundColor: 'rgba(22, 27, 34, 0.6)',
                border: '1px solid rgba(48, 54, 61, 0.5)',
              }}>
                <h2 className="font-headline-md" style={{ fontSize: '22px', color: 'var(--on-surface)', marginBottom: '10px' }}>
                  {currentTopic.featuresTitle}
                </h2>
                <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
                  {currentTopic.featuresDesc}
                </p>
                {currentTopic.bulletPoints && (
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--on-surface-variant)' }}>
                    {currentTopic.bulletPoints.map((pt, i) => (
                      <li key={i} className="font-body-md" style={{ lineHeight: 1.5 }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Content Sections & Code Blocks */}
            {currentTopic.sections.map((sec) => (
              <section key={sec.id} id={sec.id} style={{ marginBottom: '44px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h2 className="font-headline-md" style={{ fontSize: '24px', color: 'var(--on-surface)', margin: 0 }}>
                    {sec.title}
                  </h2>
                </div>

                <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: '12px' }}>
                  {sec.description}
                </p>

                {sec.syntax && (
                  <div style={{
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: 'var(--on-surface-variant)',
                  }}>
                    <span className="font-label-caps" style={{ color: 'var(--primary)', fontSize: '11px' }}>SYNTAX:</span>
                    <code style={{
                      backgroundColor: 'rgba(49, 53, 60, 0.5)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--outline-variant)',
                      color: 'var(--on-surface)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                    }}>
                      {sec.syntax}
                    </code>
                  </div>
                )}

                {/* Code Block Component matching code.html */}
                <div style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--outline-variant)',
                  backgroundColor: 'var(--code-bg)',
                  marginBottom: '16px',
                }}>
                  {/* Code Header Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    backgroundColor: 'var(--surface-container-high)',
                    borderBottom: '1px solid var(--outline-variant)',
                  }}>
                    <span className="font-label-caps" style={{ color: 'var(--on-surface-variant)' }}>
                      {sec.codeLang}
                    </span>
                    <button
                      onClick={() => handleCopy(sec.code, sec.id)}
                      className="font-label-caps"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--on-surface-variant)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
                      title="Copy code"
                    >
                      {copiedSection === sec.id ? <Check size={14} color="#40ba51" /> : <Copy size={14} />}
                      <span>{copiedSection === sec.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Code Snippet */}
                  <div style={{ padding: '16px', overflowX: 'auto' }}>
                    <pre className="font-code-block" style={{ margin: 0, color: 'var(--on-surface)', lineHeight: 1.6 }}>
                      <code>{sec.code}</code>
                    </pre>
                    {sec.output && (
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(65, 71, 82, 0.4)',
                        color: '#67df70',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        whiteSpace: 'pre-wrap',
                      }}>
                        {sec.output}
                      </div>
                    )}
                  </div>
                </div>

                {sec.notes && (
                  <ul style={{
                    margin: '8px 0 0',
                    paddingLeft: '20px',
                    fontSize: '13px',
                    color: 'var(--outline)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}>
                    {sec.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          {/* Next / Previous Pagination Footer matching code.html */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: '1px solid var(--outline-variant)',
          }}>
            {prevTopic ? (
              <button
                onClick={() => setActiveTopicId(prevTopic.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
              >
                <ArrowLeft size={16} />
                <div>
                  <p className="font-label-caps" style={{ opacity: 0.7, margin: 0 }}>Previous</p>
                  <p className="font-body-md" style={{ fontWeight: 600, margin: 0 }}>{prevTopic.title}</p>
                </div>
              </button>
            ) : <div />}

            {nextTopic && (
              <button
                onClick={() => setActiveTopicId(nextTopic.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  textAlign: 'right',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--on-surface-variant)'}
              >
                <div>
                  <p className="font-label-caps" style={{ opacity: 0.7, margin: 0 }}>Next</p>
                  <p className="font-body-md" style={{ fontWeight: 600, margin: 0 }}>{nextTopic.title}</p>
                </div>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </main>

        {/* Right Column: Table of Contents (TOC) */}
        <aside style={{
          width: '210px',
          flexShrink: 0,
          position: 'sticky',
          top: '96px',
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
        }} className="hidden xl:block">
          <h4 className="font-label-caps" style={{ color: 'var(--on-surface-variant)', marginBottom: '16px', textTransform: 'uppercase' }}>
            On this page
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href="#"
              className="font-body-sm"
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                borderLeft: '2px solid var(--primary)',
                paddingLeft: '12px',
                transition: 'color 0.2s',
              }}
            >
              Overview
            </a>
            {currentTopic.sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="font-body-sm"
                style={{
                  color: 'var(--on-surface-variant)',
                  textDecoration: 'none',
                  borderLeft: '2px solid transparent',
                  paddingLeft: '12px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--on-surface)';
                  e.currentTarget.style.borderLeftColor = 'var(--outline-variant)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--on-surface-variant)';
                  e.currentTarget.style.borderLeftColor = 'transparent';
                }}
              >
                {sec.title}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
