const fs = require('fs');
const path = require('path');
const { Lexer } = require('../lexer');
const { Parser } = require('../parser');
const { CodeGenerator } = require('../codegen');

const sourceCode = fs.readFileSync(path.join(__dirname, '../kode_files/test_extensions.kode'), 'utf8');
const lexer = new Lexer(sourceCode);
const parser = new Parser(lexer);
const ast = parser.parseProgram();

if (parser.errors.length > 0) {
  console.log("Errors:", parser.errors);
  process.exit(1);
}

const codegen = new CodeGenerator();
const compiledJs = codegen.generate(ast);
console.log(compiledJs);
