# AniKode: Official Specification & Reference Manual

Welcome to the definitive reference manual for **AniKode**. This document serves as a complete technical specification of the language syntax, grammar, comments resolver, JS/C++ compiler backends, and command-line interfaces. 

Save or refer to this manual when building official documentation sites, tutorials, or IDE extensions.

---

## 🗺️ 1. Lexical Specifications & Data Types

AniKode is a dynamically typed programming language supporting standard primitives, lists, and a special null literal.

### Literal Rules
* **String Literals:** Wrapped in double quotes `"` or single quotes `'` (e.g., `"Hello"`, `'world'`).
* **Integer Literals:** Standard numeric digits (e.g., `100`, `-5`).
* **Float/Decimal Literals:** Numbers containing a decimal point (e.g., `3.14159`, `0.005`).
* **Boolean Literals:** Exact keywords `true` and `false`.
* **Null Literal:** The keyword `null` representing empty or uninitialized variables.

---

## ✍️ 2. Variables & Assignment Syntax

AniKode supports three distinct assignment styles. The parser translates all of them into identical AST structures:

| Style | Syntax | Notes |
| :--- | :--- | :--- |
| **Style A (Declarative)** | `let x = 10` | Standard modern syntax. |
| **Style B (Readable)** | `set x to 10` | Human-readable English sentence structure. |
| **Style C (Minimalist)** | `x = 10` | Implicit declaration on first use; assignments modify existing scope thereafter. |

---

## 💬 3. The Unified Comments Resolution Engine

AniKode features a highly robust comments engine that supports block, inline, and AST-level comments.

### Comment Syntaxes
* **Single-Line Comments:** `~ comment` or `\ docstring`. Ignored by the lexer until the end of the line.
* **Block Comments:** Matches enclosed pairs. The following block syntax styles are fully parsed and discarded as whitespace:
  - `-- comment --`
  - `# comment #` (Safe: only treated as comment if not followed immediately by digits and a closing `#`).
  - `// comment //`

### Smart Statement Disabler (`#N#`)
Writing `#N#` (where `N` is an integer) acts as an AST statement skipper:
- It instructs the parser to count the next `N` executable statements (ignoring comments) and mark their AST nodes as `disabled: true`.
- During compilation, code generators completely bypass any disabled AST nodes, generating `""` (empty string).
- **Resilience:** If statements are added or edited inside the disabled region, it anchors to AST nodes, not physical lines, maintaining stability.

---

## 🔄 4. Control Flow & Loops

### Conditionals (`if / else`)
Matches standard conditional branches. Parentheses are optional:
```kode
if x > 10 {
  say.out("Large")
} else if x == 10 {
  say.out("Ten")
} else {
  say.out("Small")
}
```

### Numeric Range Loops
Protects programs from infinite-loop crashes by determining increments/decrements statically at startup:
```kode
loop i from 1 to 5 {
  say.out(i)  ~ Auto-increments from 1 to 5 ~
}
```
* **C++ Compiler Target:** Automatically compiles to:
  `for (long long i = start; start <= end ? i <= end : i >= end; start <= end ? i++ : i--)`

### Collection Loops
Iterates directly over arrays and collections:
```kode
each item in [1, 2, 3] {
  say.out(item)
}
```

---

## 📦 5. Functions & Recursion

### Function Declarations
Defined using the `fn` keyword. Functions return values explicitly using the `return` statement:
```kode
fn add(a, b) {
  return a + b
}
```

### Recursion Auto-Reference (`recurse`)
The keyword `recurse(...)` is a smart shortcut:
- It can only be used inside a function block.
- It automatically resolves to the name of the containing function.
- This protects recursive calls if you rename the function later:
```kode
fn factorial(n) {
  if n <= 1 { return 1 }
  return n * recurse(n - 1)  ~ Safe if factorial is renamed! ~
}
```

---

## 📥 6. Input / Output & Type Casting

### Comma-Separated Output (`say.out`)
`say.out` accepts multiple arguments separated by commas. It prints them natively separated by spaces:
```kode
say.out("User", name, "is", age)
```

### Input Reader (`say.in`)
Blocks execution and reads keyboard input synchronously:
```kode
let response = say.in("Your prompt: ")
```

### Type Casting built-ins
Since `say.in` returns raw string inputs, AniKode provides three casting functions to guarantee mathematical calculations:
* `int(x)`: Converts strings/decimals to integers.
* `float(x)`: Converts strings/integers to decimal floats.
* `str(x)`: Converts numbers/booleans to standard strings.

---

## ⚙️ 7. Compiler Backend Code Generation

### A. JavaScript Backend (`codegen.js`)
* Maps AniKode AST straight to standard JS equivalents.
* Emits isolated IIFE modules (`(function() { ... })()`) to avoid declaring global namespace variables, ensuring compatibility when multiple files load sequentially in a web browser.

### B. C++20 Backend (`cppgen.js`)
* Generates optimized C++20 template code.
* Uses a custom polymorphic `Value` class to handle dynamic typing (Integers, Floats, Strings, Booleans, Vectors, and Null/NIL) with zero garbage collector latency.
* **Implicit Operators:** Implements operator overloading (`+`, `-`, `*`, `/`, `==`, `<`, etc.) and a boolean cast operator (`operator bool() const`) to support raw conditional blocks.

---

## 🛠️ 8. CLI Runner Commands

You can run AniKode programs using the global `anikode` command:

```powershell
# Run with Native C++ compilation (Max Performance)
anikode run --native main.kode

# Run with V8 JavaScript engine (Instant Startup)
anikode run --js main.kode

# Build into a self-contained static executable binary
anikode build main.kode
```
