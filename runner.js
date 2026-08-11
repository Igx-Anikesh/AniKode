#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');
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
  const buffer = Buffer.alloc(1024);
  let bytesRead = 0;
  try {
    bytesRead = fs.readSync(0, buffer, 0, 1024, null);
  } catch (err) {
    return '';
  }
  return buffer.toString('utf8', 0, bytesRead).replace(/\r?\n$/, '');
}

function findCppCompiler() {
  const compilers = ['g++', 'clang++', 'cl'];
  for (let comp of compilers) {
    try {
      execSync(`${comp} --version`, { stdio: 'ignore' });
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
        const found = findFileRecursive(dir, 'g++.exe');
        if (found) return `"${found}"`;
      } catch (e) {}
    }
  }

  return null;
}

function findFileRecursive(dir, filename) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const res = findFileRecursive(fullPath, filename);
      if (res) return res;
    } else if (entry.name.toLowerCase() === filename.toLowerCase()) {
      return fullPath;
    }
  }
  return null;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: anikode run <filename.kode> [--native | --js]");
  console.log("       anikode build <filename.kode>");
  process.exit(1);
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
  const parser = new Parser(lexer);
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

    const buildDir = path.join(__dirname, '.build');
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);

    const cppFile = path.join(buildDir, 'output.cpp');
    const exeFile = path.join(buildDir, process.platform === 'win32' ? 'output.exe' : 'output');

    fs.writeFileSync(cppFile, cppCode);

    // Compile with g++ -O3 -static for max speed & self-contained binary!
    execSync(`${compiler} -O3 -static -std=c++20 "${cppFile}" -o "${exeFile}"`);

    if (mode === 'build') {
      console.log(`✅ Native binary compiled successfully to '${exeFile}'`);
      process.exit(0);
    }

    // Execute native binary directly!
    execSync(`"${exeFile}"`, { stdio: 'inherit' });

  } else {
    // Transpile to JS (V8 Runtime)
    const codegen = new CodeGenerator();
    const compiledJs = codegen.generate(ast);

    const sandbox = {
      console: console,
      __say_in: __say_in,
      int: (x) => parseInt(x, 10),
      float: (x) => parseFloat(x),
      str: (x) => String(x),
      Math: Math,
      require: require
    };

    vm.createContext(sandbox);
    vm.runInContext(compiledJs, sandbox);
  }

} catch (error) {
  console.error("\n💥 Execution Crashed!");
  console.error(error.message);
  process.exit(1);
}
