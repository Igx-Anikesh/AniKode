const { Lexer } = require('../lexer');

// Sample AniKode code testing comments, all three variable styles, and output/loops.
const code = `
# Testing comments
// More comments

let x = 10.5
set y to 20
z = x + y

say.out("The sum is:")
say.out(z)

if z > 30 {
  say.out("Z is large")
}
`;

console.log("--- STARTING LEXER TEST ---");
try {
  const lexer = new Lexer(code);
  let tok;
  do {
    tok = lexer.nextToken();
    console.log(`Token: Type = ${tok.type.padEnd(12)} | Literal = ${JSON.stringify(tok.literal).padEnd(15)} | Line = ${tok.line} | Col = ${tok.column}`);
  } while (tok.type !== 'EOF');
  console.log("--- LEXER TEST SUCCESSFUL ---");
} catch (error) {
  console.error("LEXER ERROR:", error.message);
}
