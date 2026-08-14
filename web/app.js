// Playground Code Templates
const EXAMPLES = {
  logic: `\\ Conditional Logic & Comparisons \\
set score = 85

say.out("Your score is: " + score)

if score >= 90 {
  say.out("Grade: A")
} else if score >= 80 {
  say.out("Grade: B")
} else {
  say.out("Grade: C or lower")
}`,

  calculator: `\\ AniKode Calculator & Variables \\
let x = 100
set y to 250

\\ say.in() returns a string, so we cast it to an integer using int() \\
let z = int(say.in("Enter z value: "))
let result = x + y + z

say.out("--- CALCULATOR OUTPUT ---")
say.out("x value:")
say.out(x)
say.out("y value:")
say.out(y)
say.out("z value:")
say.out(z)
say.out("Sum of x, y, and z:")
say.out(result)

#2#
say.out("This line is disabled by #2#")
say.out("This line is also disabled")

say.out("Calculations complete!")`,

  loops: `\\ Range Loops (protected against infinite loop freezes) \\
say.out("--- Counting up from 1 to 5 ---")
loop i from 1 to 5 {
  say.out(i)
}

say.out("--- Counting down from 5 to 1 ---")
loop i from 5 to 1 {
  say.out(i)
}`,

  each: `\\ Iterating over Lists with each ... in ... \\
set programmingLanguages = ["AniKode", "Python", "JavaScript", "Rust"]

say.out("Awesome languages:")
each lang in programmingLanguages {
  say.out("- " + lang)
}`,

  nesting_dolls: `\\ Recursion using the recurse() keyword \\
fn openDoll(size) {
  if size == 1 {
    return "Found the prize!"
  }
  say.out("Opened doll of size: " + size)
  return recurse(size - 1)
}

say.out("--- Nesting Doll Test ---")
let result = openDoll(4)
say.out("Result:")
say.out(result)`
};

// UI Elements
const codeEditor = document.getElementById('code-editor');
const terminalOutput = document.getElementById('terminal-output');

// Loads a preset code example into the editor
function loadExample(name) {
  if (!EXAMPLES[name]) return;
  
  // Update editor value
  codeEditor.value = EXAMPLES[name];
  
  // Highlight active button
  document.querySelectorAll('.btn-example').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.getElementById(`btn-example-${name}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Print info line in terminal
  appendTerminalLine(`Loaded example: '${name}'`, 'info');
}

// Clears the simulated terminal screen
function clearTerminal() {
  terminalOutput.innerHTML = '';
}

// Appends a line of text to our custom terminal UI
function appendTerminalLine(text, type = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  line.textContent = text;
  terminalOutput.appendChild(line);
  
  // Auto-scroll to the bottom
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// The core compilation and run engine
function compileAndRun() {
  const code = codeEditor.value;
  
  appendTerminalLine("\n>>> Compiling & Executing AniKode program...", "info");
  
  try {
    // 1. Lexing
    const lexer = new Lexer(code);
    
    // 2. Parsing
    const parser = new Parser(lexer);
    const ast = parser.parseProgram();
    
    // 3. Catch grammar/syntax errors
    if (parser.errors.length > 0) {
      appendTerminalLine(`❌ Compilation Failed! Found ${parser.errors.length} error(s):`, "error");
      parser.errors.forEach((err, index) => {
        appendTerminalLine(`  ${index + 1}. ${err}`, "error");
      });
      return;
    }
    
    // 4. Code Generation (transpiling to JS)
    const codegen = new CodeGenerator();
    const compiledJs = codegen.generate(ast);
    
    // 5. Execution Sandbox
    // Overriding console.log to print inside our visual terminal
    const customConsole = {
      log: function(...args) {
        const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
        appendTerminalLine(text);
      }
    };
    
    // Mapping say.in to browser prompt() synchronous dialog
    const customSayIn = function(promptText) {
      const response = prompt(promptText);
      return response !== null ? response : '';
    };

    // File handlers in browser (helpful notice)
    const customFileRead = function(filePath) {
      appendTerminalLine(`⚠️ file.read("${filePath}"): File system access is not available in the web playground. Use the desktop CLI ('anikode run') for file I/O.`, 'error');
      throw new Error(`FileError: file.read is not supported in the web playground`);
    };

    const customFileWrite = function(filePath, content) {
      appendTerminalLine(`⚠️ file.write("${filePath}"): File system access is not available in the web playground. Use the desktop CLI ('anikode run') for file I/O.`, 'error');
      throw new Error(`FileError: file.write is not supported in the web playground`);
    };
    
    // Execute the transpiled JS code inside an isolated function wrapper
    // Shadowing window and document prevents accidental DOM manipulation from user script
    const runnerFunction = new Function(
      'console', '__say_in', '__file_read', '__file_write', 'Math', 'int', 'float', 'str', 'window', 'document',
      compiledJs
    );
    
    // Run the compiled code!
    runnerFunction(
      customConsole, 
      customSayIn, 
      customFileRead,
      customFileWrite,
      Math, 
      (x) => parseInt(x, 10), 
      (x) => parseFloat(x), 
      (x) => String(x),
      undefined,
      undefined
    );
    
    appendTerminalLine("🚀 Program execution finished successfully.", "success");
    
  } catch (error) {
    appendTerminalLine(`💥 Runtime Error: ${error.message}`, "error");
    console.error(error);
  }
}

// Initial Page Load: Load calculator example
window.addEventListener('DOMContentLoaded', () => {
  loadExample('calculator');
});
