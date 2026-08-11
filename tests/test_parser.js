const { Lexer } = require('../lexer');
const { Parser } = require('../parser');

// Sample AniKode code testing parser structure
const code = `
let x = 10 + 5 * 2
set y to 50
z = x == y

say.out(z)

if x > 15 {
  say.out("X is larger than 15")
  x = 0
} else {
  say.out("X is smaller")
}
`;

console.log("--- STARTING PARSER TEST ---");
try {
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  const program = parser.parseProgram();

  if (parser.errors.length > 0) {
    console.error("PARSER ENCOUNTERED ERRORS:");
    parser.errors.forEach(err => console.error("  -", err));
  } else {
    console.log("Abstract Syntax Tree (AST):");
    console.log(JSON.stringify(program, null, 2));
    console.log("\n--- PARSER TEST SUCCESSFUL ---");
  }
} catch (error) {
  console.error("PARSER COMPILER CRASH:", error.stack);
}
