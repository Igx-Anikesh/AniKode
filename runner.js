#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync, execFileSync } = require('child_process');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { CodeGenerator } = require('./codegen');
const { CppCodeGenerator } = require('./cppgen');

/**
 * AniKode Hybrid CLI Runner & Native Compiler
 * 
 * Supports:
 * - Native C++ Compilation (g++ -O3 -> .exe) for max speed (0.003s)
 * - V8 JavaScript Sandbox Fallback
 */

function __say_in(promptText) {
  if (promptText) {
    process.stdout.write(promptText);
  }
  const chunks = [];
  const buffer = Buffer.alloc(1024);
  let bytesRead = 0;
  try {
    while (true) {
      bytesRead = fs.readSync(0, buffer, 0, buffer.length, null);
      if (bytesRead <= 0) break;
      const chunk = buffer.subarray(0, bytesRead);
      chunks.push(chunk);
      if (chunk.includes(10) || bytesRead < buffer.length) break;
    }
  } catch (err) {
    if (chunks.length === 0) return '';
  }
  return Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
}

function findCppCompiler() {
  const compilers = ['g++', 'clang++', 'cl'];
  for (let comp of compilers) {
    try {
      execFileSync(comp, ['--version'], { stdio: 'ignore' });
      return comp;
    } catch (e) {
      // Not found on PATH
    }
  }

  // Check common WinGet package installation directories for g++.exe
  const localAppData = process.env.LOCALAPPDATA || '';
  const searchDirs = [
    path.join(localAppData, 'Temp', 'WinGet'),
    path.join(localAppData, 'Microsoft', 'WinGet', 'Packages'),
    path.join(process.env.ProgramFiles || '', 'WinLibs'),
    'C:\\mingw64\\bin',
    'C:\\MinGW\\bin'
  ];

  for (let dir of searchDirs) {
    if (fs.existsSync(dir)) {
      try {
        const found = findFileRecursive(dir, 'g++.exe', 0, 3);
        if (found) return found;
      } catch (e) {}
    }
  }

  return null;
}

function findFileRecursive(dir, filename, currentDepth = 0, maxDepth = 3) {
  if (currentDepth > maxDepth) return null;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const res = findFileRecursive(fullPath, filename, currentDepth + 1, maxDepth);
        if (res) return res;
      } else if (entry.name.toLowerCase() === filename.toLowerCase()) {
        return fullPath;
      }
    }
  } catch (e) {}
  return null;
}

const PKG_VERSION = '1.0.0';

const args = process.argv.slice(2);

// Handle --version flag
if (args.includes('--version') || args.includes('-v')) {
  console.log(`AniKode v${PKG_VERSION}`);
  process.exit(0);
}

// Handle --help flag
if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     AniKode Compiler v${PKG_VERSION}              ║
  ╚══════════════════════════════════════════╝

  Usage:
    anikode run <filename.kode>              Run a .kode file
    anikode run <filename.kode> --native     Force C++ native compilation
    anikode run <filename.kode> --js         Force JavaScript VM execution
    anikode build <filename.kode>            Compile to native binary (.exe)

  Options:
    --version, -v    Show version number
    --help, -h       Show this help message
    --native         Use C++ compiler (g++/clang++) for execution
    --js             Use V8 JavaScript sandbox for execution

  Examples:
    anikode run hello.kode
    anikode build my_program.kode
  `);
  process.exit(args.length === 0 ? 1 : 0);
}

let mode = 'auto'; // 'auto', 'native', 'js', 'build'
let filePath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === 'run') continue;
  if (args[i] === 'build') {
    mode = 'build';
    continue;
  }
  if (args[i] === '--native') {
    mode = 'native';
    continue;
  }
  if (args[i] === '--js') {
    mode = 'js';
    continue;
  }
  if (!filePath) {
    filePath = args[i];
  }
}

if (!filePath) {
  console.error("Error: Missing input .kode file path.");
  process.exit(1);
}

const absolutePath = path.resolve(filePath);
if (!fs.existsSync(absolutePath)) {
  console.error(`Error: File not found at '${absolutePath}'`);
  process.exit(1);
}

const sourceCode = fs.readFileSync(absolutePath, 'utf8');

try {
  // A. Lexing
  const lexer = new Lexer(sourceCode);
  
  // B. Parsing
  const parser = new Parser(lexer, absolutePath);
  const ast = parser.parseProgram();

  // C. Syntax Errors Check
  if (parser.errors.length > 0) {
    console.error(`\n❌ Compilation Failed! We found ${parser.errors.length} syntax error(s):\n`);
    parser.errors.forEach((err, idx) => {
      console.error(`   ${idx + 1}. ${err}`);
    });
    console.error("");
    process.exit(1);
  }

  const compiler = findCppCompiler();
  const shouldRunNative = (mode === 'native' || mode === 'build' || (mode === 'auto' && compiler !== null));

  if (shouldRunNative) {
    if (!compiler) {
      console.error("Error: C++ compiler (g++ / clang++) not found on PATH. Install MinGW or run with --js flag.");
      process.exit(1);
    }

    // Transpile to C++20
    const cppGen = new CppCodeGenerator();
    const cppCode = cppGen.generate(ast);

    const buildDir = path.join(path.dirname(absolutePath), '.build');
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);

    const cppFile = path.join(buildDir, 'output.cpp');
    const exeFile = path.join(buildDir, process.platform === 'win32' ? 'output.exe' : 'output');

    fs.writeFileSync(cppFile, cppCode);

    // Compile with g++ -O3 -static for max speed & self-contained binary!
    execFileSync(compiler, ['-O3', '-static', '-std=c++20', cppFile, '-o', exeFile], { stdio: 'inherit' });

    if (mode === 'build') {
      console.log(`✅ Native binary compiled successfully to '${exeFile}'`);
      process.exit(0);
    }

    // Execute native binary directly!
    execFileSync(exeFile, [], { stdio: 'inherit' });

  } else {
    // Transpile to JS (V8 Runtime)
    const codegen = new CodeGenerator();
    const compiledJs = codegen.generate(ast);

    const sandbox = {
      console: console,
      __say_in: __say_in,
      __file_read: (filePath) => {
        const resolved = path.resolve(path.dirname(absolutePath), filePath);
        if (!fs.existsSync(resolved)) {
          throw new Error(`FileError: File not found '${filePath}'`);
        }
        return fs.readFileSync(resolved, 'utf8');
      },
      __file_write: (filePath, content) => {
        const resolved = path.resolve(path.dirname(absolutePath), filePath);
        fs.writeFileSync(resolved, String(content));
        return null;
      },
      int: (x) => parseInt(x, 10),
      float: (x) => parseFloat(x),
      str: (x) => String(x),
      Math: Math,
      math: {
        abs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
        round: Math.round,
        sqrt: Math.sqrt,
        pow: Math.pow,
        random: (min, max) => {
          if (min === undefined) return Math.random();
          if (Number.isInteger(min) && Number.isInteger(max)) return Math.floor(Math.random() * (max - min + 1)) + min;
          return Math.random() * ((max || 1) - min) + min;
        },
        min: Math.min,
        max: Math.max,
        clamp: (v, min, max) => Math.min(Math.max(v, min), max),
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log,
        log10: Math.log10 || Math.log,
        exp: Math.exp,
        pi: Math.PI,
        PI: Math.PI,
        e: Math.E,
        E: Math.E
      }
      // NOTE: `require` intentionally NOT exposed — prevents arbitrary code execution
    };

    vm.createContext(sandbox);
    vm.runInContext(compiledJs, sandbox);
  }

} catch (error) {
  console.error("\n💥 Execution Crashed!");
  console.error(error.message);
  process.exit(1);
}
