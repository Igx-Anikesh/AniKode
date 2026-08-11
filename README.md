# AniKode Programming Language (v2.0)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language: Javascript](https://img.shields.io/badge/Language-Javascript-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Backend: C++20](https://img.shields.io/badge/Backend-C%2B%2B20-blue.svg)](https://en.cppreference.com/w/cpp/20)

**AniKode** is a modern, dynamically-typed programming language engineered for safety, speed, and cross-platform flexibility. It features dual compilation targets, allowing you to compile directly to **native C++20 standard machine code** (with 0% Garbage Collection overhead) or execute in a **V8 JavaScript sandbox** for instant startup times.

---

## ✨ Key Features

* 🚀 **Dual Compiler Backends:** Run instantly under JavaScript (V8 VM engine) or compile natively to C++20 template-optimized machine code (`g++ -O3 -static`) with zero GC latency.
* 🛡️ **Statically Protected Loops:** A built-in guardrail system that automatically deduces range loop direction at startup, preventing infinite freezes.
* 📦 **Auto-Referencing Recursion:** The `recurse(...)` keyword dynamically references the containing function's namespace. Rename functions freely without breaking recursion.
* 💬 **AST-Level Skips (`#N#`):** Compiler-level directives allowing statements to be skipped based on AST node count rather than raw lines, maintaining comments integrity.
* 🔍 **Diagnostics Line-Tracking:** Standardized line-accurate tracking injected before C++ statement generation for stack-trace level runtime debugging.
* 📁 **Namespace File System:** Built-in synchronous `file.read(path)` and `file.write(path, content)` functions.
* 🧬 **Rich Data Types:** Full support for Lists (with 26 built-in methods), Dictionaries/Objects (curly brace literals), and specific `try/catch/finally` exception recovery.

---

## 🏎️ Quick Start Code Examples

### 1. Variables & Input/Output
AniKode supports declarative (`let`), readable (`set ... to`), and minimalist implicit declarations:
```kode
let name = "Ayush"
set age to 21
score = 95.5

say.out("Hello", name, "Score is", score)
```

### 2. Safeguarded Loops
Loop increments are calculated statically to prevent infinite hangs:
```kode
~ Safely counts down from 5 to 1
loop i from 5 to 1 {
  say.out("Countdown:", i)
}
```

### 3. Smart Recursion
The `recurse` keyword links dynamically to the parent function name:
```kode
fn factorial(n) {
  if n <= 1 { return 1 }
  return n * recurse(n - 1)  ~ Safe if factorial is renamed! ~
}
```

### 4. Exception Handling
Structured, type-specific catching with optional finally blocks:
```kode
try {
  let result = 100 / divisor
} catch DivisionByZeroError err {
  say.out("Error caught:", err.message)
} catch err {
  say.out("General error:", err.message)
} finally {
  say.out("Cleanup complete!")
}
```

---

## 🛠️ Installation & Command-Line Usage

Clone the repository and run AniKode files using the node-based CLI runner:

```bash
# Run using the sandboxed V8 JavaScript engine (Fast Startup)
node runner.js run kode_files/sample.kode --js

# Compile and run natively via C++ compiler (Maximum Performance)
node runner.js run kode_files/sample.kode --native

# Build a self-contained static executable binary (.exe)
node runner.js build kode_files/sample.kode
```

---

## 🖥️ Live Web Playground
The project contains an interactive web sandbox in the `web/` directory. 
* Serve the folder locally: `node web/server.js` and open `http://localhost:8080/`.
* Alternatively, host it on GitHub Pages for free online compiler access.

---

## 📄 License
This project is open-source and licensed under the **MIT License**.
