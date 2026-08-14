# AniKode Complete Language Reference & Specification Manual

This document serves as the complete reference manual and visual specification for the **AniKode Language** and its **Documentation Portal** (`/docs`). Every single keyword, operator, built-in function, collection method, error mechanism, and grammar rule is fully detailed below.

---

## Table of Contents
1. [Language Philosophy & Architecture](#1-language-philosophy--architecture)
2. [Installation & Project Setup](#2-installation--project-setup)
3. [Comments & Statement Disablers](#3-comments--statement-disablers)
4. [Variables & Assignment Styles](#4-variables--assignment-styles)
5. [Data Types & Type System](#5-data-types--type-system)
6. [Type Casting & Inspection](#6-type-casting--inspection)
7. [Operators & Propositional Logic Gates](#7-operators--propositional-logic-gates)
8. [Collections API (Lists, Strings, Maps)](#8-collections-api-lists-strings-maps)
9. [Control Flow (if, while, loop, each, break, continue)](#9-control-flow-if-while-loop-each-break-continue)
10. [Functions, recurse() & Modules](#10-functions-recurse--modules)
11. [Exception Handling (try, catch, finally, throw)](#11-exception-handling-try-catch-finally-throw)
12. [Standard Built-in Namespaces (say, math, file)](#12-standard-built-in-namespaces-say-math-file)
13. [Dual Engine Execution (JS VM vs. Native C++20)](#13-dual-engine-execution-js-vm-vs-native-c20)

---

## 1. Language Philosophy & Architecture

AniKode is designed to combine the rapid prototyping and natural syntax of dynamic scripting with the deterministic memory safety, formal propositional logic calculus, and zero-overhead native C++20 machine speed.

- **Modular AST Pipeline:** Lexer $\to$ Recursive Descent Parser $\to$ AST $\to$ Dual Code Generation (JavaScript V8 VM & C++20).
- **Zero-Dependency Startup:** 0.003s startup in native compiled binaries.

---

## 2. Installation & Project Setup

### Package Manager CLI (Cross-Platform)
```bash
npm install -g anikode
# or
pnpm add -g anikode
# or
yarn global add anikode
# or
bun add -g anikode
```

### Standalone Windows Executable (.exe)
```powershell
irm https://raw.githubusercontent.com/Igx-Anikesh/AniKode/main/install.ps1 | iex
```

### Project Directory Hierarchy
```
my-anikode-project/
├── kode_files/             ~ Source code files (.kode) ~
│   ├── main.kode           ~ Application entry point ~
│   ├── math_utils.kode     ~ Custom functions & math ~
│   └── security.kode       ~ Propositional logic rules ~
├── dist/                   ~ Compiled native binaries ~
│   └── app.exe             ~ Machine executable (0.003s startup) ~
├── package.json            ~ Optional npm metadata ~
└── README.md
```

---

## 3. Comments & Statement Disablers

AniKode supports 5 comment formats and the AST statement disabler:

| Format | Syntax Example | Use Case |
| :--- | :--- | :--- |
| **Tilde** | `~ Single or multi-line comment ~` | Standard codebase comments |
| **Backslash** | `\ Single or multi-line comment \` | Mathematical proof annotations |
| **Double Hyphen** | `-- Block comment --` | Block commentary |
| **Double Slash** | `// Single line comment` | Traditional C-style line comments |
| **Hash** | `# Hash comment #` | Python-style hash blocks |

### AST Statement Disabler (`#N#`)
Prepend `#N#` to cleanly disable the next $N$ statements at the Abstract Syntax Tree level:
```kode
say.out("Statement 1: Active")

#2#
say.out("Statement 2: Disabled by #2#")
say.out("Statement 3: Disabled by #2#")

say.out("Statement 4: Active again!")
```

---

## 4. Variables & Assignment Styles

AniKode provides 3 interchangeable variable declaration syntaxes:

```kode
let a = 10           ~ Style 1: Declarative let ~
set b to 20          ~ Style 2: Natural language set ... to ~
c = 30               ~ Style 3: Minimal direct assignment ~

say.out("Sum:", a + b + c)  ~ Output: Sum: 60 ~
```

---

## 5. Data Types & Type System

AniKode is dynamically typed with first-class primitives and associative collections:

| Type | Example Literals | Description |
| :--- | :--- | :--- |
| **Number** | `42`, `3.14159`, `-10` | 64-bit IEEE floating point & signed integers |
| **String** | `"Hello"`, `'AniKode'`, `"Line\nBreak"` | UTF-8 text strings |
| **Boolean** | `true`, `false` | First-class boolean truth values |
| **Null** | `null` | Absence of value |
| **Array (List)** | `[1, 2, "three", true]` | Ordered dynamic lists |
| **Map (Dict)** | `{ "name": "Ayush", "role": "admin" }` | Associative key-value dictionary |

---

## 6. Type Casting & Inspection

```kode
let numStr = "123"
let integerVal = int(numStr)         ~ Cast to integer: 123 ~
let floatVal = float("45.67")        ~ Cast to float: 45.67 ~
let text = str(1000)                 ~ Cast to string: "1000" ~

say.out("Type:", type(integerVal))   ~ "number" ~
say.out("Type:", type(text))         ~ "string" ~
say.out("Type:", type([1, 2, 3]))    ~ "array" ~
say.out("Type:", type({ "a": 1 }))   ~ "object" ~
```

---

## 7. Operators & Propositional Logic Gates

### Standard Operators
- **Arithmetic:** `+`, `-`, `*`, `/`, `%`
- **Comparison:** `==`, `!=`, `<`, `<=`, `>`, `>=`
- **Boolean:** `and`, `or`, `not`

### Propositional Logic Calculus
AniKode embeds boolean algebra and logic gates as native grammar operators:

| Operator | Math Notation | Truth Definition | Code Example | Result |
| :--- | :--- | :--- | :--- | :--- |
| **`implies`** | $p \implies q$ | $\neg p \lor q$ (False only when $p=\text{true}$ and $q=\text{false}$) | `true implies false` | `false` |
| **`iff`** | $p \iff q$ | $p = q$ (True when both operands match) | `true iff true` | `true` |
| **`xor`** | $p \oplus q$ | Exactly one operand is true | `true xor false` | `true` |
| **`nand`** | $p \barwedge q$ | $\neg (p \land q)$ (False only when both are true) | `true nand true` | `false` |
| **`nor`** | $p \barlor q$ | $\neg (p \lor q)$ (True only when both are false) | `false nor false` | `true` |
| **`xnor`** | $p \odot q$ | $\neg (p \oplus q)$ (True when operands are equal) | `false xnor false` | `true` |

### Quantifiers
- **`all([list])`**: Returns `true` if every element in the list evaluates to true.
- **`any([list])`**: Returns `true` if at least one element in the list evaluates to true.

---

## 8. Collections API (Lists, Strings, Maps)

### Polymorphic Methods (Work across Lists, Strings, and Maps)
- **`obj.len()`**: Number of items in list/map, or number of characters in string.
- **`obj.has(val)`**: Checks if element exists in list, substring in string, or key in map.
- **`obj.remove(val)`**: Removes item from list or key from map.
- **`obj.clear()`**: Clears all elements from list or map.
- **`obj.empty()`**: Returns `true` if length is 0.
- **`obj.replace(old, new)`**: Replaces occurrences in string or elements in list.
- **`obj.reverse()`**: Returns reversed copy of list or string.
- **`obj.count(val)`**: Returns number of occurrences of `val`.

### List-Specific Methods
- **`list.add(val)`**: Appends `val` to the end of the list.
- **`list.insert(index, val)`**: Inserts `val` at `index`.
- **`list.removeAt(index)`**: Removes and returns element at `index`.
- **`list.removeIf(val)`**: Removes all occurrences of `val`.
- **`list.pop()`**: Removes and returns the last element.
- **`list.find(val)`**: Returns index of first occurrence or `-1`.
- **`list.first()`**: Returns first element.
- **`list.last()`**: Returns last element.
- **`list.get(index)`**: Retrieves element at `index`.
- **`list.set(index, val)`**: Overwrites element at `index`.
- **`list.copy()`**: Returns shallow copy of list.
- **`list.slice(start, end)`**: Returns sub-array from `start` up to `end`.
- **`list.sort()`**: Returns sorted copy of list.
- **`list.shuffle()`**: Returns randomized copy of list.
- **`list.unique()`**: Returns list with duplicate values removed.
- **`list.swap(idxA, idxB)`**: Swaps elements at indices `idxA` and `idxB`.
- **`list.join(sep)`**: Concatenates list elements into a string using `sep`.
- **`list.random()`**: Returns a random element from the list.

### String-Specific Methods
- **`str.upper()`**: Returns uppercase string.
- **`str.lower()`**: Returns lowercase string.
- **`str.trim()`**: Strips leading and trailing whitespace.
- **`str.split(sep)`**: Splits string into a list of strings by `sep`.
- **`str.replaceFirst(old, new)`**: Replaces first occurrence of `old` with `new`.
- **`str.char(index)`**: Returns character at `index`.
- **`str.repeat(count)`**: Repeats string `count` times.
- **`str.startsWith(prefix)`**: Returns `true` if string starts with `prefix`.
- **`str.endsWith(suffix)`**: Returns `true` if string ends with `suffix`.

### Map-Specific Methods
- **`map.keys()`**: Returns list of all dictionary keys.
- **`map.values()`**: Returns list of all dictionary values.

---

## 9. Control Flow

### Branching (`if / else if / else`)
```kode
if score >= 90 {
    say.out("A")
} else if score >= 80 {
    say.out("B")
} else {
    say.out("C")
}
```

### While Loops (`while <cond>`)
```kode
let count = 0
while count < 5 {
    count = count + 1
    if count == 2 { continue }
    if count == 4 { break }
    say.out("Count:", count)
}
```

### Bounded Range Loops (`loop ... from ... to`)
```kode
~ Ascending Range ~
loop i from 1 to 5 {
    say.out("i =", i)
}

~ Descending Range ~
loop j from 5 to 1 {
    say.out("j =", j)
}
```

### Collection Loops (`each ... in ...`)
```kode
let fruits = ["Apple", "Mango", "Banana"]
each fruit in fruits {
    say.out("Fruit:", fruit)
}
```

---

## 10. Functions, `recurse()` & Modules

### Named Functions & Return
```kode
fn multiply(a, b) {
    return a * b
}
let result = multiply(6, 7)  ~ 42 ~
```

### Native Self-Recursion (`recurse`)
The `recurse()` keyword automatically refers to the current enclosing function without hardcoding its name:
```kode
fn factorial(n) {
    if n <= 1 { return 1 }
    return n * recurse(n - 1)
}
say.out("5! =", factorial(5))  ~ 120 ~
```

### Modular Code Imports
```kode
import "math_utils.kode"
let val = calculateHypotenuse(3, 4)
```

---

## 11. Exception Handling (`try/catch/finally/throw`)

```kode
fn divide(a, b) {
    if b == 0 {
        throw "Division by zero error!"
    }
    return a / b
}

try {
    say.out(divide(10, 0))
} catch (err) {
    say.out("Caught Error:", err.message)
} finally {
    say.out("Cleanup routine completed.")
}
```

---

## 12. Standard Built-in Namespaces

### Standard Output & Interactive Input
- **`say.out(...)`**: Prints comma-separated arguments to standard output.
- **`say.in("Prompt: ")`**: Prompts the user and reads interactive terminal input.

### Built-in `math` Namespace
- `math.sqrt(x)`, `math.pow(base, exp)`, `math.abs(x)`
- `math.min(a, b)`, `math.max(a, b)`, `math.clamp(val, min, max)`
- `math.round(x)`, `math.floor(x)`, `math.ceil(x)`
- `math.random()` (returns random float $0 \le x < 1$)
- `math.pi` ($\approx 3.141592653589793$), `math.e` ($\approx 2.718281828459045$)

### Built-in `file` Namespace (Desktop CLI & Native Mode)
- **`file.read(path)`**: Reads text from file.
- **`file.write(path, data)`**: Writes text to file.
- **`file.append(path, data)`**: Appends text to file.
- **`file.exists(path)`**: Returns `true` if file exists.

---

## 13. Dual Engine Execution

| Mode | Command | Target Engine | Characteristics |
| :--- | :--- | :--- | :--- |
| **Instant VM** | `anikode run main.kode` | V8 JS Sandbox | Zero compilation step, browser playground compatible |
| **Native C++20** | `anikode build main.kode -o app.exe` | Clang/GCC/MSVC C++20 | 0.003s startup, zero runtime memory overhead, standalone binary |
