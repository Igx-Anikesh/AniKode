const { Lexer } = require('../lexer');
const { Parser } = require('../parser');
const path = require('path');
const fs = require('fs');

console.log("--- STARTING IMPORTS TEST ---");
try {
  // Use absolute path of test_imports.kode to test path resolution
  const testFile = path.resolve(__dirname, '../kode_files/test_imports.kode');
  const sourceCode = fs.readFileSync(testFile, 'utf8');

  const lexer = new Lexer(sourceCode);
  const parser = new Parser(lexer, testFile);
  const ast = parser.parseProgram();

  if (parser.errors.length > 0) {
    console.error("Compilation errors found:");
    parser.errors.forEach(err => console.error(" -", err));
    process.exit(1);
  }

  // Check if AST statements are populated and inline statements exist
  console.log(`Successfully parsed program with ${ast.statements.length} AST statements (fully flattened).`);
  
  // Verify that function declarations from test_lib.kode are present in the AST
  const functions = ast.statements.filter(s => s.type === 'FunctionDeclaration');
  const funcNames = functions.map(f => f.name);
  
  console.log("Found function declarations:", funcNames);
  if (funcNames.includes('doubleValue') && funcNames.includes('addThree')) {
    console.log("--- IMPORTS TEST SUCCESSFUL ---");
  } else {
    throw new Error("Missing expected function declarations from imported file!");
  }
} catch (error) {
  console.error("IMPORTS TEST FAILED:", error.message);
  process.exit(1);
}
