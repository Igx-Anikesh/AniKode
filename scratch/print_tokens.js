const fs = require('fs');
const path = require('path');
const { Lexer } = require('../lexer');

const sourceCode = fs.readFileSync(path.join(__dirname, '../kode_files/complex_demo.kode'), 'utf8');
const lexer = new Lexer(sourceCode);
let tok;
do {
  tok = lexer.nextToken();
  console.log(`Line ${tok.line}, Col ${tok.column}: Type = ${tok.type}, Literal = '${tok.literal}'`);
} while (tok.type !== 'EOF');
