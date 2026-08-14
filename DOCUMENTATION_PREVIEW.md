# AniKode Complete Language Reference & Documentation Preview

This document serves as the complete offline reference and visual specification for the **AniKode Documentation Portal** (`/docs`).

---

## Table of Contents
1. [Language Grammar & Comments](#1-language-grammar--comments)
2. [Variable Declarations & Types](#2-variable-declarations--types)
3. [Type Casting & Inspection](#3-type-casting--inspection)
4. [Standard & Propositional Logic Operators](#4-standard--propositional-logic-operators)
5. [Conditionals & Match Pattern Matching](#5-conditionals--match-pattern-matching)
6. [Bounded Range & Collection Loops](#6-bounded-range--collection-loops)
7. [Functions & Native Self-Recursion (recurse)](#7-functions--native-self-recursion-recurse)
8. [Exception Handling & Cleanup (try/catch/finally)](#8-exception-handling--cleanup-trycatchfinally)
9. [Standard Built-in Namespaces (math & file)](#9-standard-built-in-namespaces-math--file)
10. [Dual Compilation Architecture (JS VM & C++20 Native)](#10-dual-compilation-architecture-js-vm--c20-native)

---

## 1. Language Grammar & Comments

AniKode provides two distinct comment delimiters and the `#N#` AST statement disabler.

### Tilde & Backslash Comments
```kode
~ This is a single-line tilde comment ~
let score = 100

~ 
  This is a multi-line tilde comment.
  Safe across line breaks without syntax corruption.
~

\ This is a single-line backslash comment \
\
  Multi-line backslash comment.
  Clean and minimal for mathematical proofs.
\
```

### The `#N#` Statement Disabler
Disables exactly the next $N$ AST statements during parsing:
```kode
say.out("Statement 1: Active")

#2#
say.out("Statement 2: Disabled by #2#")
say.out("Statement 3: Disabled by #2#")

say.out("Statement 4: Active again!")
```
**Output:**
```
Statement 1: Active
Statement 4: Active again!
```

---

## 2. Variable Declarations & Types

AniKode supports 3 interchangeable variable declaration syntaxes and full dynamic typing.

### 3 Variable Styles
```kode
let a = 10           ~ Style 1: Declarative let ~
set b to 20          ~ Style 2: Sentence set ... to ~
c = 30               ~ Style 3: Minimal assignment ~

say.out("Total:", a + b + c)  ~ Output: Total: 60 ~
```

### Primitives & Collections
```kode
let integerVal = 42
let floatVal = 3.14159
let text = "AniKode Language"
let isReady = true
let empty = null

~ Arrays / Lists ~
let fruits = ["Apple", "Mango", "Blueberry"]
say.out("Item 0:", fruits[0])

~ Associative Maps / Dictionaries ~
let user = {
    "username": "anikesh_dev",
    "role": "admin",
    "level": 99
}
say.out("Role:", user.role)
```

---

## 3. Type Casting & Inspection

Built-in explicit casting and reflection functions:
```kode
let numStr = "123"
let convertedInt = int(numStr)         ~ Cast to integer: 123 ~
let convertedFloat = float("45.67")    ~ Cast to float: 45.67 ~
let strVal = str(1000)                 ~ Cast to string: "1000" ~

say.out("Type:", type(convertedInt))   ~ "number" ~
say.out("Type:", type(strVal))         ~ "string" ~
say.out("Type:", type([1, 2, 3]))      ~ "array" ~
```

---

## 4. Standard & Propositional Logic Operators

### Standard Arithmetic & Comparisons
```kode
let x = 15
let y = 4

say.out("Add:", x + y)        ~ 19 ~
say.out("Subtract:", x - y)   ~ 11 ~
say.out("Multiply:", x * y)   ~ 60 ~
say.out("Divide:", x / y)     ~ 3.75 ~
say.out("Modulo:", x % y)     ~ 3 ~
```

### Propositional Logic (`implies`, `iff`, `xor`, `all`, `any`)
```kode
~ Implication (p implies q ≡ not p or q) ~
fn checkPolicy(isAdmin, is2FA) {
    return isAdmin implies is2FA
}

say.out("Admin with 2FA:", checkPolicy(true, true))       ~ true ~
say.out("Admin without 2FA:", checkPolicy(true, false))   ~ false ~
say.out("Non-admin:", checkPolicy(false, false))          ~ true ~

~ Biconditional Equivalence (p iff q ≡ p == q) ~
say.out("IFF Test:", true iff true)    ~ true ~

~ Exclusive OR (p xor q) ~
say.out("XOR Test:", true xor false)   ~ true ~
say.out("XOR Test:", true xor true)    ~ false ~

~ Quantifiers ~
say.out("All True:", all([true, true, true]))   ~ true ~
say.out("Any True:", any([false, true, false])) ~ true ~
```

---

## 5. Conditionals & Match Pattern Matching

```kode
let score = 85

if score >= 90 {
    say.out("Grade: A")
} else if score >= 80 {
    say.out("Grade: B")
} else {
    say.out("Grade: C")
}

let action = "run"
match action {
    case "run" {
        say.out("🏃 Running task...")
    }
    case "pause" {
        say.out("⏸ Task paused.")
    }
    default {
        say.out("❓ Unknown action.")
    }
}
```

---

## 6. Bounded Range & Collection Loops

### Bounded Range Loops (Glitch-Proof & Deterministic)
Bounds are evaluated at entry; step is automatically determined.
```kode
say.out("--- Ascending (1 to 5) ---")
loop i from 1 to 5 {
    say.out("i =", i)
}

say.out("--- Descending (5 to 1) ---")
loop j from 5 to 1 {
    say.out("j =", j)
}
```

### Collection Loops
```kode
let items = ["Alpha", "Beta", "Gamma", "Delta"]

each item in items {
    if item == "Beta" {
        continue
    }
    say.out("Item:", item)
}
```

---

## 7. Functions & Native Self-Recursion (`recurse`)

### Named Functions
```kode
fn calculateArea(width, height) {
    return width * height
}

let area = calculateArea(10, 5)
say.out("Area:", area)  ~ Output: 50 ~
```

### Native Self-Recursion with `recurse()`
Automatically resolves the enclosing function identifier:
```kode
fn factorial(n) {
    if n <= 1 {
        return 1
    }
    return n * recurse(n - 1)
}

say.out("5! =", factorial(5))  ~ Output: 120 ~
```

---

## 8. Exception Handling & Cleanup (`try/catch/finally`)

```kode
fn divide(a, b) {
    if b == 0 {
        throw "Division by zero error!"
    }
    return a / b
}

try {
    say.out("10 / 2 =", divide(10, 2))
    say.out("10 / 0 =", divide(10, 0))
} catch (err) {
    say.out("Caught Error:", err.message)
} finally {
    say.out("Execution finished.")
}
```

---

## 9. Standard Built-in Namespaces (`math` & `file`)

### `math` Built-in Namespace
```kode
say.out("PI:", math.pi)
say.out("E:", math.e)
say.out("Square Root of 144:", math.sqrt(144))
say.out("2^8:", math.pow(2, 8))
say.out("Clamp (150 in 0..100):", math.clamp(150, 0, 100))
say.out("Round 3.7:", math.round(3.7))
say.out("Floor 4.9:", math.floor(4.9))
say.out("Ceil 4.1:", math.ceil(4.1))
say.out("Min(10, 20):", math.min(10, 20))
say.out("Max(10, 20):", math.max(10, 20))
```

### `file` Built-in Namespace (Desktop CLI & C++ Mode)
```kode
file.write("data.txt", "Initial log entry\n")
file.append("data.txt", "Second log entry\n")

if file.exists("data.txt") {
    let content = file.read("data.txt")
    say.out("Content:\n" + content)
}
```

---

## 10. Dual Compilation Architecture

| Mode | Command | Execution Mechanism | Ideal For |
| :--- | :--- | :--- | :--- |
| **Instant VM** | `anikode run script.kode` | In-memory AST evaluation / JS runtime | Rapid prototyping, web playground, scripting |
| **Native C++20** | `anikode build script.kode -o app.exe` | Transpiled to optimized C++20 machine code | Standalone binaries, maximum speed (0.003s startup) |
