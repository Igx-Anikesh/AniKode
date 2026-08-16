'use client';

import React, { useState, useEffect } from 'react';
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
  HelpCircle,
  ListFilter
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
  tabs?: { label: string; code: string }[];
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
    featuresDesc: 'AniKode features a modular Lexer, Recursive Descent AST Parser, and twin execution targets (JavaScript V8 VM & C++20 Native).',
    bulletPoints: [
      'Dual Engine: Run instantaneously in the browser / JS VM, or compile to native C++20 machine binaries with 0.003s startup.',
      'Propositional Logic: Native operators (implies, iff, xor, nand, nor, xnor, all, any) treat boolean algebra as first-class citizens.',
      'Deterministic Loops: Range loops (loop i from 1 to N) compute bounds at invocation, preventing infinite lockups.',
      'AST Disabler: #N# annotations cleanly disable the next N AST statements without syntax corruption.',
    ],
    sections: [
      {
        id: 'overview-philosophy',
        title: 'Why AniKode Was Created',
        description: 'Traditional scripting languages often sacrifice raw performance and lack native tools for formal logic, while low-level systems languages require heavy boilerplate for simple scripts. AniKode bridges this gap by providing an intuitive syntax that compiles directly to optimized C++20 machine code or runs instantly in a lightweight sandbox.',
        codeLang: 'philosophy.kode',
        code: `~ Expressive yet blazing fast ~
fn verifyAccess(isAdmin, is2FA, score) {
    return (isAdmin implies is2FA) and (score >= 50)
}

let userAllowed = verifyAccess(true, true, 85)
say.out("Access Granted:", userAllowed)  ~ Output: true ~`,
        output: '// Instant execution: 1.2ms (JS VM) | 0.003s (C++20 Native Machine Binary)'
      }
    ]
  },
  {
    id: 'installation',
    category: 'Getting Started',
    title: 'Installation & Setup',
    icon: Download,
    description: 'There are two primary ways to install and run AniKode on your machine: via the global package manager CLI (recommended for all platforms) or by downloading the standalone Windows binary with zero external dependencies.',
    featuresTitle: 'Choose Your Installation Method',
    featuresDesc: 'AniKode is distributed as a global CLI package and as a self-contained native executable.',
    bulletPoints: [
      'Method 1 (Recommended): Package Manager CLI (npm, pnpm, yarn, bun) for cross-platform compatibility.',
      'Method 2: Standalone Windows Executable (.exe) requiring zero node/runtime dependencies.',
      'Method 3: Optional C++20 Toolchain (GCC/Clang/MSVC) for building standalone native machine binaries.',
    ],
    sections: [
      {
        id: 'method-cli',
        title: 'Method 1: Package Manager CLI (Recommended)',
        description: 'The easiest way to install AniKode globally is using your preferred JavaScript package manager. This automatically adds the `anikode` command to your system terminal path:',
        syntax: 'npm install -g anikode',
        codeLang: 'bash',
        code: 'npm install -g anikode',
        tabs: [
          { label: 'npm', code: 'npm install -g anikode' },
          { label: 'pnpm', code: 'pnpm add -g anikode' },
          { label: 'yarn', code: 'yarn global add anikode' },
          { label: 'bun', code: 'bun add -g anikode' },
        ],
        notes: [
          'Requires Node.js 18.0.0 or later installed on your machine.',
          'Installs the official runner, lexer, parser, code generator, and C++ transpiler.'
        ]
      },
      {
        id: 'method-standalone',
        title: 'Method 2: Standalone Windows Binary (Zero-Dependency)',
        description: 'If you do not have Node.js or want a portable executable with 0% runtime overhead, install the standalone binary:',
        syntax: 'irm https://.../install.ps1 | iex',
        codeLang: 'powershell',
        code: `# Automated 1-Liner PowerShell Installer:
irm https://raw.githubusercontent.com/Igx-Anikesh/AniKode/main/install.ps1 | iex

# Direct 1-Click Binary Download:
# https://github.com/Igx-Anikesh/AniKode/releases/latest/download/anikode.exe

# View All Releases & Changelogs:
# https://github.com/Igx-Anikesh/AniKode/releases`,
        output: '# Automatically downloads anikode.exe to $HOME/bin and updates PATH.',
        notes: [
          'Packaged via Node.js Single Executable Application (SEA).',
          'Runs on Windows x64 out of the box with zero external dependencies.'
        ]
      },
      {
        id: 'verify-installation',
        title: 'Verify Your Installation',
        description: 'Once installed, open a new terminal window and verify that the `anikode` binary is accessible:',
        syntax: 'anikode --version',
        codeLang: 'bash',
        code: 'anikode --version\n# Output: AniKode v1.0.0 (x64)',
        output: 'AniKode v1.0.0 (x64)'
      },
      {
        id: 'project-structure',
        title: 'Standard Project Structure',
        description: 'After installing, initialize your workspace with the recommended AniKode directory hierarchy:',
        syntax: 'Directory Layout',
        codeLang: 'text',
        code: `my-anikode-project/
├── kode_files/             ~ Source code files (.kode) ~
│   ├── main.kode           ~ Application entry point ~
│   ├── math_utils.kode     ~ Custom functions & math ~
│   └── security.kode       ~ Propositional logic rules ~
├── dist/                   ~ Compiled native binaries ~
│   └── app.exe             ~ Machine executable (0.003s startup) ~
├── package.json            ~ Optional npm metadata ~
└── README.md`,
        notes: [
          'All AniKode source files should use the .kode extension.',
          'Native compiled C++ executables are output to the dist/ directory by default.'
        ]
      },
      {
        id: 'first-program-steps',
        title: 'Step-by-Step: Your First Program',
        description: 'Follow these 4 steps to create and run your first AniKode program from scratch:',
        syntax: 'anikode run main.kode',
        codeLang: 'main.kode',
        code: `~ Step 1: Create main.kode and write your code ~
fn calculateScore(base, multiplier) {
    return base * multiplier
}

fn main() {
    let username = "Developer"
    set totalScore to calculateScore(100, 1.5)
    
    say.out("👋 Welcome,", username)
    say.out("Your Final Score:", totalScore)
}

main()`,
        output: `// Step 2: Run via CLI in instant JS VM mode:
$ anikode run main.kode
👋 Welcome, Developer
Your Final Score: 150

// Step 3 (Optional): Compile to native C++20 machine binary:
$ anikode build main.kode -o app.exe
Compiled app.exe (Native C++20 Machine Binary in 0.12s)`
      }
    ]
  },
  {
    id: 'comments-disablers',
    category: 'Language Grammar',
    title: 'Comments & #N# Disablers',
    icon: Sparkles,
    description: 'AniKode provides 5 flexible comment formats as well as the unique #N# AST statement disabler.',
    featuresTitle: 'Comment Delimiters & AST Disablers',
    featuresDesc: 'Unlike standard line comments, AniKode provides block-safe delimiters and a numerical AST skip system for rapid debugging.',
    bulletPoints: [
      'Tilde Comments: ~ single or multi-line comment ~',
      'Backslash Comments: \\ single or multi-line comment \\',
      'Double Hyphen: -- block comment --',
      'Double Slash: // single line //',
      'Hash: # block or line #',
      'Statement Disabler: #N# disables exactly the next N statements at the AST level.',
    ],
    sections: [
      {
        id: 'comment-styles',
        title: 'Comment Formats',
        description: 'Both single-line and multi-line comments can use tilde, backslash, or traditional delimiters:',
        syntax: '~ comment ~ | \\ comment \\ | -- comment -- | // comment',
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
    description: 'AniKode integrates classical arithmetic and boolean logic alongside first-class Propositional Logic rules (implies, iff, xor, nand, nor, xnor, all, any).',
    featuresTitle: 'Propositional Logic Calculus',
    featuresDesc: 'Formulate security policies, mathematical proofs, circuit simulation, and business constraints with standard mathematical operators.',
    bulletPoints: [
      'implies (→): Material implication (p implies q ≡ not p or q)',
      'iff (↔): Logical biconditional equivalence (p iff q ≡ p == q)',
      'xor (⊕): Exclusive disjunction (either p or q, not both)',
      'nand (⊼): Negated AND (not (p and q))',
      'nor (⊽): Negated OR (not (p or q))',
      'xnor (⊙): Negated XOR / Equivalence (not (p xor q))',
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
        title: 'Propositional Logic Gates (implies, iff, xor, nand, nor, xnor)',
        description: 'Perform formal verification directly in code without helper functions:',
        syntax: 'p implies q | p iff q | p xor q | p nand q | p nor q | p xnor q',
        codeLang: 'logic.kode',
        code: `~ Implication (implies): If admin is true, 2FA must be true ~
fn checkPolicy(isAdmin, is2FA) {
    return isAdmin implies is2FA
}
say.out("Admin + 2FA:", checkPolicy(true, true))       ~ true ~
say.out("Admin + No 2FA:", checkPolicy(true, false))  ~ false ~

~ Biconditional (iff): Both sides have equal truth ~
say.out("Biconditional:", true iff true)               ~ true ~

~ Exclusive OR (xor): Exactly one is true ~
say.out("XOR (true xor false):", true xor false)       ~ true ~
say.out("XOR (true xor true):", true xor true)         ~ false ~

~ NAND: True unless both are true ~
say.out("NAND (true nand true):", true nand true)       ~ false ~

~ NOR: True only when both are false ~
say.out("NOR (false nor false):", false nor false)     ~ true ~

~ XNOR: True when inputs are identical ~
say.out("XNOR (false xnor false):", false xnor false)  ~ true ~`,
        output: `// Output:
// Admin + 2FA: true
// Admin + No 2FA: false
// Biconditional: true
// XOR (true xor false): true
// XOR (true xor true): false
// NAND (true nand true): false
// NOR (false nor false): true
// XNOR (false xnor false): true`
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
    id: 'collections-api',
    category: 'Collections & Methods',
    title: 'Collections & Methods (Lists, Strings, Maps)',
    icon: ListFilter,
    description: 'AniKode provides built-in polymorphic methods for Lists, Strings, and Dictionaries without needing external libraries.',
    featuresTitle: 'Built-in Polymorphic Methods',
    featuresDesc: 'Methods work seamlessly across collections and strings with high-performance runtime execution.',
    bulletPoints: [
      'Polymorphic: .len(), .has(x), .remove(x), .clear(), .empty(), .replace(), .reverse(), .count(x)',
      'List API: .add(), .insert(), .removeAt(), .pop(), .find(), .first(), .last(), .slice(), .sort(), .unique(), .swap(), .join()',
      'String API: .upper(), .lower(), .trim(), .split(), .startsWith(), .endsWith(), .repeat()',
      'Map API: .keys(), .values()',
    ],
    sections: [
      {
        id: 'polymorphic-methods',
        title: 'Polymorphic Methods (.len, .has, .remove, .empty, .count)',
        description: 'These methods adapt automatically whether invoked on a String, List, or Dictionary:',
        syntax: 'obj.len() | obj.has(x) | obj.remove(x) | obj.empty() | obj.count(x)',
        codeLang: 'polymorphic.kode',
        code: `let strData = "Hello World"
let listData = [10, 20, 30, 20, 40]
let mapData = { "a": 1, "b": 2 }

say.out("String Length:", strData.len())            ~ 11 ~
say.out("List Length:", listData.len())              ~ 5 ~
say.out("Map Length:", mapData.len())                ~ 2 ~

say.out("String has 'World':", strData.has("World")) ~ true ~
say.out("List has 20:", listData.has(20))            ~ true ~
say.out("Map has key 'a':", mapData.has("a"))        ~ true ~

say.out("Count 20 in list:", listData.count(20))     ~ 2 ~
say.out("Count 'l' in string:", strData.count("l"))  ~ 3 ~`,
        output: `// Output:
// String Length: 11
// List Length: 5
// Map Length: 2
// String has 'World': true
// List has 20: true
// Map has key 'a': true
// Count 20 in list: 2
// Count 'l' in string: 3`
      },
      {
        id: 'list-methods',
        title: 'List Methods (.add, .pop, .sort, .unique, .slice, .swap)',
        description: 'Comprehensive manipulation functions for arrays and collections:',
        syntax: 'list.add(val) | list.pop() | list.sort() | list.unique() | list.slice(s, e) | list.join(sep)',
        codeLang: 'lists.kode',
        code: `let items = [5, 2, 8, 1, 9, 2, 8]

items.add(10)                           ~ Appends 10 ~
say.out("After Add:", items)

let sortedItems = items.sort()          ~ Returns sorted copy ~
say.out("Sorted:", sortedItems)

let uniqueItems = items.unique()        ~ Removes duplicates ~
say.out("Unique:", uniqueItems)

say.out("First Item:", items.first())   ~ First element ~
say.out("Last Item:", items.last())     ~ Last element ~

let sliced = items.slice(1, 4)          ~ Sub-slice from 1 to 4 ~
say.out("Slice [1..4]:", sliced)

items.swap(0, 1)                        ~ Swaps elements at index 0 and 1 ~
say.out("After Swap(0, 1):", items)

let joinedStr = ["AniKode", "is", "fast"].join(" ")
say.out("Joined:", joinedStr)`,
        output: `// Output:
// After Add: [5, 2, 8, 1, 9, 2, 8, 10]
// Sorted: [1, 2, 2, 5, 8, 8, 9, 10]
// Unique: [5, 2, 8, 1, 9, 10]
// First Item: 5
// Last Item: 10
// Slice [1..4]: [2, 8, 1]
// After Swap(0, 1): [2, 5, 8, 1, 9, 2, 8, 10]
// Joined: AniKode is fast`
      },
      {
        id: 'string-methods',
        title: 'String Methods (.upper, .lower, .trim, .split, .startsWith, .endsWith)',
        description: 'Full text formatting and inspection tools:',
        syntax: 'str.upper() | str.lower() | str.trim() | str.split(sep) | str.startsWith(sub)',
        codeLang: 'strings.kode',
        code: `let raw = "   AniKode Language System   "

let clean = raw.trim()
say.out("Trimmed:", clean)
say.out("Upper:", clean.upper())
say.out("Lower:", clean.lower())

let words = clean.split(" ")
say.out("Words Array:", words)

say.out("Starts with 'Ani':", clean.startsWith("Ani"))
say.out("Ends with 'System':", clean.endsWith("System"))
say.out("Repeated (3x):", "Kode!".repeat(3))`,
        output: `// Output:
// Trimmed: AniKode Language System
// Upper: ANIKODE LANGUAGE SYSTEM
// Lower: anikode language system
// Words Array: ["AniKode", "Language", "System"]
// Starts with 'Ani': true
// Ends with 'System': true
// Repeated (3x): Kode!Kode!Kode!`
      },
      {
        id: 'map-methods',
        title: 'Map / Dictionary Methods (.keys, .values)',
        description: 'Inspect and extract data from associative key-value dictionaries:',
        syntax: 'map.keys() | map.values()',
        codeLang: 'maps.kode',
        code: `let config = {
    "host": "localhost",
    "port": 8080,
    "ssl": true
}

let keys = config.keys()
let values = config.values()

say.out("Keys:", keys)
say.out("Values:", values)`,
        output: `// Output:
// Keys: ["host", "port", "ssl"]
// Values: ["localhost", 8080, true]`
      }
    ]
  },
  {
    id: 'control-flow-loops',
    category: 'Control Flow',
    title: 'Conditionals, While & Safe Loops',
    icon: Repeat,
    description: 'AniKode includes if/else ladders, while loops, deterministic bounded range loops, and collection iterators with break and continue.',
    featuresTitle: 'Deterministic, Safe Iteration',
    featuresDesc: 'Range loops eliminate infinite-loop freeze conditions by evaluating start/end bounds upfront.',
    bulletPoints: [
      'if / else if / else: Standard conditional branching',
      'while <cond>: Standard boolean condition loop with break/continue',
      'loop i from A to B: Bounded range iteration (ascending or descending)',
      'each item in collection: High-speed collection traversal',
    ],
    sections: [
      {
        id: 'if-else-branching',
        title: 'Conditionals (if / else if / else)',
        description: 'Branch your program logic cleanly:',
        syntax: 'if <cond> { ... } else if <cond> { ... } else { ... }',
        codeLang: 'conditionals.kode',
        code: `let score = 88

if score >= 90 {
    say.out("Grade: A")
} else if score >= 80 {
    say.out("Grade: B")
} else {
    say.out("Grade: C")
}`,
        output: '// Output: Grade: B'
      },
      {
        id: 'while-loops',
        title: 'While Loops with break & continue',
        description: 'Standard conditional iteration for indeterminate cycles:',
        syntax: 'while <condition> { ... }',
        codeLang: 'while_demo.kode',
        code: `let counter = 0

while counter < 10 {
    counter = counter + 1
    if counter == 3 {
        continue ~ Skip 3 ~
    }
    if counter == 6 {
        break    ~ Stop at 6 ~
    }
    say.out("Counter:", counter)
}`,
        output: `// Output:
// Counter: 1
// Counter: 2
// Counter: 4
// Counter: 5`
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
    title: 'Functions, recurse() & Modules',
    icon: FunctionSquare,
    description: 'Define reusable functions, return values, utilize recurse() for self-recursion, and split code across files with import.',
    featuresTitle: 'First-Class Functions, Self-Recursion & Modular Code',
    featuresDesc: 'The recurse() keyword resolves the current executing function automatically, making recursive algorithms refactor-proof.',
    bulletPoints: [
      'fn <name>(<args>): Declares named functions',
      'return <expr>: Returns execution results',
      'recurse(<args>): Re-invokes current function without repeating its name',
      'import "file.kode": Seamlessly imports modular code files',
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
      },
      {
        id: 'import-modules',
        title: 'Modular Imports (import "file.kode")',
        description: 'Split your application into modular files and import them seamlessly:',
        syntax: 'import "<path.kode>"',
        codeLang: 'main.kode',
        code: `~ math_helpers.kode ~
fn add(a, b) { return a + b }

~ main.kode ~
import "math_helpers.kode"

let sum = add(40, 2)
say.out("Sum from imported module:", sum)`,
        output: '// Output: Sum from imported module: 42'
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
      'throw: Raise runtime errors with custom error messages or Error objects',
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
        id: 'terminal-io',
        title: 'Standard Console I/O (say.out & say.in)',
        description: 'Print multi-argument output or prompt for interactive user terminal input:',
        syntax: 'say.out(...) | say.in("<prompt>")',
        codeLang: 'io_demo.kode',
        code: `say.out("System Status:", "Online", "Code:", 200)

let userName = say.in("Enter your name: ")
say.out("👋 Hello,", userName)`,
        output: `// Output:
// System Status: Online Code: 200
// Enter your name: Ayush
// 👋 Hello, Ayush`
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
say.out("Max of (10, 20):", math.max(10, 20))
say.out("Absolute (-42):", math.abs(-42))
say.out("Random Float (0..1):", math.random())`,
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
// Max of (10, 20): 20
// Absolute (-42): 42
// Random Float: 0.742819...`
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
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({ 'method-cli': 'npm' });

  // Automatically scroll to the top smoothly whenever active topic changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTopicId]);

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
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'clamp(80px, 10vw, 100px) clamp(16px, 3vw, 32px) 60px', width: '100%', overflowX: 'hidden' }}>
      
      {/* Mobile Topic Selector Dropdown (< 1024px) */}
      <div className="mobile-only" style={{
        marginBottom: '24px',
        width: '100%',
        backgroundColor: 'var(--surface-container)',
        border: '1px solid var(--outline-variant)',
        borderRadius: '8px',
        padding: '12px 16px',
      }}>
        <label className="font-label-caps" style={{ color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
          Select Documentation Topic
        </label>
        <select
          value={activeTopicId}
          onChange={(e) => setActiveTopicId(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'var(--surface-container-high)',
            border: '1px solid var(--outline-variant)',
            color: 'var(--on-surface)',
            padding: '10px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {COMPLETE_DOCS.map((t, idx) => (
            <option key={t.id} value={t.id} style={{ backgroundColor: '#1c2026', color: '#dfe2eb' }}>
              {idx + 1}. {t.title}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 40px)', position: 'relative' }}>
        {/* Left Column: Sidebar Navigation (Desktop) */}
        <aside style={{
          width: '260px',
          flexShrink: 0,
          position: 'sticky',
          top: '96px',
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }} className="docs-sidebar-desktop">
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
        <main className="docs-main-content" style={{ flex: 1, minWidth: 0, paddingBottom: '64px' }}>
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
            {currentTopic.sections.map((sec) => {
              const activeTabKey = activeTabs[sec.id] || (sec.tabs ? sec.tabs[0].label : null);
              const displayedCode = sec.tabs 
                ? (sec.tabs.find(t => t.label === activeTabKey)?.code || sec.code)
                : sec.code;

              return (
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
                    {/* Code Header Bar with Optional Tabs */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 16px',
                      backgroundColor: 'var(--surface-container-high)',
                      borderBottom: '1px solid var(--outline-variant)',
                    }}>
                      {sec.tabs ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {sec.tabs.map((tab) => (
                            <button
                              key={tab.label}
                              onClick={() => setActiveTabs({ ...activeTabs, [sec.id]: tab.label })}
                              className="font-label-caps"
                              style={{
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: (activeTabs[sec.id] || sec.tabs![0].label) === tab.label 
                                  ? 'var(--surface-container-highest)' 
                                  : 'transparent',
                                color: (activeTabs[sec.id] || sec.tabs![0].label) === tab.label 
                                  ? 'var(--primary)' 
                                  : 'var(--on-surface-variant)',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'all 0.2s',
                              }}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="font-label-caps" style={{ color: 'var(--on-surface-variant)' }}>
                          {sec.codeLang}
                        </span>
                      )}

                      <button
                        onClick={() => handleCopy(displayedCode, sec.id)}
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
                        <code>{displayedCode}</code>
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
              );
            })}
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
        }} className="docs-toc-desktop">
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
