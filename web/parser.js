/**
 * AniKode Parser - UMD wrapped
 */

(function() {
  let parser_TokenType;
  if (typeof require !== 'undefined') {
    parser_TokenType = require('./lexer').TokenType;
  } else {
    parser_TokenType = window.TokenType;
  }
  const TokenType = parser_TokenType;

  // 1. Defining Precedence (Operator Precedence)
  const Precedence = {
    LOWEST: 0,
    ASSIGN: 1,         // =
    OR: 2,             // or, nor, implies
    XOR: 3,            // xor, xnor, iff
    AND: 4,            // and, nand
    EQUALS: 5,         // == or !=
    LESSGREATER: 6,     // > or < or >= or <=
    SUM: 7,            // + or -
    PRODUCT: 8,        // * or /
    PREFIX: 9,         // -x or not x
    CALL: 10,          // myFunction(x)
    DOT: 11,           // object.property
  };

  // Maps token types to their precedence levels
  const TokenPrecedence = {
    [TokenType.ASSIGN]: Precedence.ASSIGN,
    [TokenType.DOT]: Precedence.DOT,
    [TokenType.EQ]: Precedence.EQUALS,
    [TokenType.NEQ]: Precedence.EQUALS,
    [TokenType.LT]: Precedence.LESSGREATER,
    [TokenType.GT]: Precedence.LESSGREATER,
    [TokenType.LTE]: Precedence.LESSGREATER,
    [TokenType.GTE]: Precedence.LESSGREATER,
    [TokenType.PLUS]: Precedence.SUM,
    [TokenType.MINUS]: Precedence.SUM,
    [TokenType.MULTIPLY]: Precedence.PRODUCT,
    [TokenType.DIVIDE]: Precedence.PRODUCT,
    [TokenType.AND]: Precedence.AND,
    [TokenType.NAND]: Precedence.AND,
    [TokenType.XOR]: Precedence.XOR,
    [TokenType.XNOR]: Precedence.XOR,
    [TokenType.OR]: Precedence.OR,
    [TokenType.NOR]: Precedence.OR,
    [TokenType.IMPLIES]: Precedence.OR,
    [TokenType.IFF]: Precedence.XOR,
    [TokenType.LPAREN]: Precedence.CALL,
  };

  class Parser {
    constructor(lexer, currentFile = '') {
      this.lexer = lexer;
      this.currentFile = currentFile;
      this.curToken = null;   // The token we are currently checking
      this.peekToken = null;  // The next token in line
      this.errors = [];       // List of grammatical errors we find
      this.disableCount = 0;   // Tracks statement disabling (#N#)
      this.visitedFiles = new Set();

      // Read the first two tokens to populate curToken and peekToken
      this.nextToken();
      this.nextToken();
    }

    // Advances to the next token
    nextToken() {
      this.curToken = this.peekToken;
      try {
        this.peekToken = this.lexer.nextToken();
      } catch (e) {
        this.errors.push(e.message);
        this.peekToken = { type: TokenType.EOF, literal: '', line: this.lexer.line, column: this.lexer.column };
      }
    }

    // Gets the precedence level of the next token
    peekPrecedence() {
      return TokenPrecedence[this.peekToken.type] || Precedence.LOWEST;
    }

    // Gets the precedence level of the current token
    curPrecedence() {
      return TokenPrecedence[this.curToken.type] || Precedence.LOWEST;
    }

    // The main entry point: parses the whole code file into a 'Program' AST node
    parseProgram() {
      let program = {
        type: 'Program',
        statements: []
      };

      while (this.curToken.type !== TokenType.EOF) {
        let stmt = this.parseStatement();
        if (stmt !== null) {
          if (Array.isArray(stmt)) {
            program.statements.push(...stmt);
          } else {
            program.statements.push(stmt);
          }
        }
        this.nextToken();
      }

      return program;
    }

    // Decides how to parse the current statement based on its starting token
    parseStatement() {
      if (this.curToken.type === TokenType.DISABLE_NEXT) {
        this.disableCount += Number(this.curToken.literal);
        this.nextToken(); // Move past '#N#'
        return this.parseStatement(); // Recursively parse actual statements
      }

      let stmt = null;
      switch (this.curToken.type) {
        case TokenType.LET:
        case TokenType.SET:
          stmt = this.parseVarDeclaration();
          break;
        case TokenType.SAY_OUT:
          stmt = this.parseSayOutStatement();
          break;
        case TokenType.IF:
          stmt = this.parseIfStatement();
          break;
        case TokenType.LOOP:
          stmt = this.parseLoopStatement();
          break;
        case TokenType.EACH:
          stmt = this.parseEachStatement();
          break;
        case TokenType.FN:
          stmt = this.parseFunctionDeclaration();
          break;
        case TokenType.RETURN:
          stmt = this.parseReturnStatement();
          break;
        case TokenType.TRY:
          stmt = this.parseTryStatement();
          break;
        case TokenType.THROW:
          stmt = this.parseThrowStatement();
          break;
        case TokenType.IMPORT:
          stmt = this.parseImportStatement();
          break;
        case TokenType.IDENTIFIER:
          stmt = this.parseExpressionStatement();
          break;
        default:
          stmt = this.parseExpressionStatement();
          break;
      }

      if (stmt !== null && this.disableCount > 0) {
        if (Array.isArray(stmt)) {
          for (let s of stmt) {
            if (this.disableCount > 0) {
              s.disabled = true;
              this.disableCount--;
            } else {
              break;
            }
          }
        } else {
          stmt.disabled = true;
          this.disableCount--;
        }
      }

      return stmt;
    }

    // Parses a variable definition statement
    parseVarDeclaration() {
      const isSet = this.curToken.type === TokenType.SET;
      this.nextToken(); // Move past let/set

      if (this.curToken.type !== TokenType.IDENTIFIER) {
        this.errors.push(`Line ${this.curToken.line}: Expected variable name, but found '${this.curToken.literal}'`);
        return null;
      }

      let name = this.curToken.literal;
      if (name === 'math' || name === 'file') {
        this.errors.push(`Line ${this.curToken.line}: Compilation Error: Cannot assign to read-only built-in namespace.`);
        return null;
      }
      this.nextToken(); // Move past variable name

      if (isSet) {
        if (this.curToken.type !== TokenType.ASSIGN && this.curToken.type !== TokenType.TO) {
          this.errors.push(`Line ${this.curToken.line}: Expected '=' or 'to' in variable declaration for '${name}'`);
          return null;
        }
      } else {
        if (this.curToken.type !== TokenType.ASSIGN) {
          this.errors.push(`Line ${this.curToken.line}: Expected '=' after 'let ${name}'`);
          return null;
        }
      }

      this.nextToken(); // Move past '=' or 'to'
      let value = this.parseExpression(Precedence.LOWEST);

      return {
        type: 'VarDeclaration',
        name: name,
        value: value
      };
    }

    // Parses assignment infix expressions
    parseAssignmentExpression(left) {
      this.nextToken(); // Move past '='
      let value = this.parseExpression(Precedence.LOWEST);
      
      // Enforce read-only namespace protection
      if (left.type === 'MemberExpression') {
        let obj = left.object;
        if (obj.type === 'Identifier' && (obj.value === 'math' || obj.value === 'file')) {
          this.errors.push(`Line ${this.curToken.line}: Compilation Error: Cannot assign to read-only built-in namespace.`);
          return null;
        }
      }
      if (left.type === 'Identifier') {
        if (left.value === 'math' || left.value === 'file') {
          this.errors.push(`Line ${this.curToken.line}: Compilation Error: Cannot assign to read-only built-in namespace.`);
          return null;
        }
        return {
          type: 'Assignment',
          name: left.value,
          value: value
        };
      }
      return {
        type: 'Assignment',
        left: left,
        value: value
      };
    }

    // Parses try-catch-finally statement
    parseTryStatement() {
      this.nextToken(); // Move past 'try'
      if (this.curToken.type !== TokenType.LBRACE) {
        this.errors.push(`Line ${this.curToken.line}: Expected '{' to start try block`);
        return null;
      }
      let tryBlock = this.parseBlockStatement();

      let catchBlocks = [];
      let finallyBlock = null;

      // Parse catch blocks (can have multiple)
      while (this.peekToken.type === TokenType.CATCH) {
        this.nextToken(); // Move curToken to 'catch'
        this.nextToken(); // Move past 'catch'

        let errorType = 'Error'; // Default error type
        let errorVar = 'error';

        // Check if specific error type is caught: catch DivisionByZeroError error { ... }
        if (this.curToken.type === TokenType.IDENTIFIER && this.peekToken.type === TokenType.IDENTIFIER) {
          errorType = this.curToken.literal;
          this.nextToken(); // Move past type to variable name
        }

        if (this.curToken.type !== TokenType.IDENTIFIER) {
          this.errors.push(`Line ${this.curToken.line}: Expected variable name in catch block`);
          return null;
        }
        errorVar = this.curToken.literal;
        this.nextToken(); // Move past errorVar

        if (this.curToken.type !== TokenType.LBRACE) {
          this.errors.push(`Line ${this.curToken.line}: Expected '{' to start catch block`);
          return null;
        }
        let body = this.parseBlockStatement();

        catchBlocks.push({
          type: 'CatchBlock',
          errorType: errorType,
          errorVar: errorVar,
          body: body
        });
      }

      // Parse finally block (optional)
      if (this.peekToken.type === TokenType.FINALLY) {
        this.nextToken(); // Move curToken to 'finally'
        this.nextToken(); // Move past 'finally'
        if (this.curToken.type !== TokenType.LBRACE) {
          this.errors.push(`Line ${this.curToken.line}: Expected '{' to start finally block`);
          return null;
        }
        finallyBlock = this.parseBlockStatement();
      }

      if (catchBlocks.length === 0 && !finallyBlock) {
        this.errors.push(`Line ${this.curToken.line}: try block must be followed by at least one catch or finally block`);
        return null;
      }

      return {
        type: 'TryStatement',
        tryBlock: tryBlock,
        catchBlocks: catchBlocks,
        finallyBlock: finallyBlock
      };
    }

    // Parses throw statement
    parseThrowStatement() {
      this.nextToken(); // Move past 'throw'
      let value = this.parseExpression(Precedence.LOWEST);
      return {
        type: 'ThrowStatement',
        value: value
      };
    }

    // Parses Error expression
    parseErrorExpression() {
      this.nextToken(); // Move past 'Error'
      if (this.curToken.type !== TokenType.LPAREN) {
        this.errors.push(`Line ${this.curToken.line}: Expected '(' after 'Error'`);
        return null;
      }
      this.nextToken(); // Move past '('
      let message = this.parseExpression(Precedence.LOWEST);
      if (this.peekToken.type === TokenType.RPAREN) {
        this.nextToken(); // Move to ')'
      } else {
        if (this.peekToken.type === TokenType.RPAREN) {
          this.nextToken(); // Move to ')'
        } else {
          this.errors.push(`Line ${this.curToken.line}: Expected closing parenthesis ')'`);
          return null;
        }
      }
      return {
        type: 'ErrorExpression',
        message: message
      };
    }

    // Parses printing statements: say.out(a, b, c) or say.out a, b, c
    parseSayOutStatement() {
      this.nextToken(); // Move past 'say.out'

      let hasParen = false;
      if (this.curToken.type === TokenType.LPAREN) {
        hasParen = true;
        this.nextToken(); // Move past '('
      }

      let expressions = [];
      if (hasParen) {
        if (this.curToken.type !== TokenType.RPAREN) {
          expressions.push(this.parseExpression(Precedence.LOWEST));
          while (this.peekToken.type === TokenType.COMMA) {
            this.nextToken(); // Move curToken to ','
            this.nextToken(); // Move past ','
            expressions.push(this.parseExpression(Precedence.LOWEST));
          }
          if (this.peekToken.type === TokenType.RPAREN) {
            this.nextToken(); // Move curToken to ')'
          } else {
            this.errors.push(`Line ${this.curToken.line}: Expected closing parenthesis ')' for 'say.out'`);
            return null;
          }
        }
      } else {
        expressions.push(this.parseExpression(Precedence.LOWEST));
        while (this.peekToken.type === TokenType.COMMA) {
          this.nextToken(); // Move curToken to ','
          this.nextToken(); // Move past ',' to next expression
          expressions.push(this.parseExpression(Precedence.LOWEST));
        }
      }

      return {
        type: 'SayOutStatement',
        expressions: expressions
      };
    }

    // Parses if statements
    parseIfStatement() {
      this.nextToken(); // Move past 'if'
      let condition = this.parseExpression(Precedence.LOWEST);

      if (this.peekToken.type !== TokenType.LBRACE) {
        this.errors.push(`Line ${this.curToken.line}: Expected '{' to start block after if condition`);
        return null;
      }
      this.nextToken(); // Move curToken to '{'

      let consequence = this.parseBlockStatement();

      let alternative = null;
      if (this.peekToken.type === TokenType.ELSE) {
        this.nextToken(); // Move curToken to 'else'
        
        if (this.peekToken.type === TokenType.IF) {
          this.nextToken(); // Move curToken to 'if'
          alternative = this.parseIfStatement();
        } 
        else if (this.peekToken.type === TokenType.LBRACE) {
          this.nextToken(); // Move curToken to '{'
          alternative = this.parseBlockStatement();
        } else {
          this.errors.push(`Line ${this.curToken.line}: Expected '{' or 'if' after 'else'`);
          return null;
        }
      }

      return {
        type: 'IfStatement',
        condition: condition,
        consequence: consequence,
        alternative: alternative
      };
    }

    // Parses loops: loop i from 0 to 5 { body }
    parseLoopStatement() {
      this.nextToken(); // Move past 'loop'

      if (this.curToken.type !== TokenType.IDENTIFIER) {
        this.errors.push(`Line ${this.curToken.line}: Expected loop iterator variable name, found '${this.curToken.literal}'`);
        return null;
      }
      let iterator = this.curToken.literal;
      this.nextToken(); // Move past iterator name

      if (this.curToken.type !== TokenType.FROM) {
        this.errors.push(`Line ${this.curToken.line}: Expected 'from' keyword after loop variable '${iterator}'`);
        return null;
      }
      this.nextToken(); // Move past 'from'

      let start = this.parseExpression(Precedence.LOWEST);
      this.nextToken(); // Move past start expression (curToken becomes 'to')

      if (this.curToken.type !== TokenType.TO) {
        this.errors.push(`Line ${this.curToken.line}: Expected 'to' keyword in loop range, found '${this.curToken.literal}'`);
        return null;
      }
      this.nextToken(); // Move past 'to'

      let end = this.parseExpression(Precedence.LOWEST);

      if (this.peekToken.type !== TokenType.LBRACE) {
        this.errors.push(`Line ${this.curToken.line}: Expected '{' to start loop body`);
        return null;
      }
      this.nextToken(); // Move curToken to '{'

      let body = this.parseBlockStatement();

      return {
        type: 'LoopStatement',
        iterator: iterator,
        start: start,
        end: end,
        body: body
      };
    }

    // Parses each statement: each fruit in fruits { body }
    parseEachStatement() {
      this.nextToken(); // Move past 'each'

      if (this.curToken.type !== TokenType.IDENTIFIER) {
        this.errors.push(`Line ${this.curToken.line}: Expected loop variable name after 'each', found '${this.curToken.literal}'`);
        return null;
      }
      let iterator = this.curToken.literal;
      this.nextToken(); // Move past iterator name

      if (this.curToken.type !== TokenType.IN) {
        this.errors.push(`Line ${this.curToken.line}: Expected 'in' keyword after variable '${iterator}'`);
        return null;
      }
      this.nextToken(); // Move past 'in'

      let collection = this.parseExpression(Precedence.LOWEST);
      
      if (this.peekToken.type !== TokenType.LBRACE) {
        this.errors.push(`Line ${this.curToken.line}: Expected '{' to start each loop body`);
        return null;
      }
      this.nextToken(); // Move curToken to '{'

      let body = this.parseBlockStatement();

      return {
        type: 'EachStatement',
        iterator: iterator,
        collection: collection,
        body: body
      };
    }

    // Parses function declarations: fn myFunc(a, b) { body }
    parseFunctionDeclaration() {
      this.nextToken(); // Move past 'fn'
      if (this.curToken.type !== TokenType.IDENTIFIER) {
        this.errors.push(`Line ${this.curToken.line}: Expected function name after 'fn'`);
        return null;
      }
      let name = this.curToken.literal;
      this.nextToken(); // Move past function name

      if (this.curToken.type !== TokenType.LPAREN) {
        this.errors.push(`Line ${this.curToken.line}: Expected '(' after function name '${name}'`);
        return null;
      }
      this.nextToken(); // Move past '('

      let parameters = [];
      if (this.curToken.type !== TokenType.RPAREN) {
        if (this.curToken.type !== TokenType.IDENTIFIER) {
          this.errors.push(`Line ${this.curToken.line}: Expected parameter variable name`);
          return null;
        }
        parameters.push(this.curToken.literal);
        this.nextToken(); // Move past parameter

        while (this.curToken.type === TokenType.COMMA) {
          this.nextToken(); // Move past ','
          if (this.curToken.type !== TokenType.IDENTIFIER) {
            this.errors.push(`Line ${this.curToken.line}: Expected parameter variable name after ','`);
            return null;
          }
          parameters.push(this.curToken.literal);
          this.nextToken(); // Move past parameter
        }
      }

      if (this.curToken.type !== TokenType.RPAREN) {
        this.errors.push(`Line ${this.curToken.line}: Expected closing parenthesis ')' after parameters`);
        return null;
      }
      this.nextToken(); // Move past ')'

      if (this.curToken.type !== TokenType.LBRACE) {
        this.errors.push(`Line ${this.curToken.line}: Expected '{' to start function body, found '${this.curToken.literal}'`);
        return null;
      }

      let body = this.parseBlockStatement();

      return {
        type: 'FunctionDeclaration',
        name: name,
        parameters: parameters,
        body: body
      };
    }

    // Parses return statements
    parseReturnStatement() {
      this.nextToken(); // Move past 'return'
      let value = null;
      if (this.curToken.type !== TokenType.RBRACE && this.curToken.type !== TokenType.EOF) {
        value = this.parseExpression(Precedence.LOWEST);
      }
      return {
        type: 'ReturnStatement',
        value: value
      };
    }

    // Parses code blocks inside braces
    parseBlockStatement() {
      let block = {
        type: 'BlockStatement',
        statements: []
      };

      this.nextToken(); // Move past '{'

      while (this.curToken.type !== TokenType.RBRACE && this.curToken.type !== TokenType.EOF) {
        let stmt = this.parseStatement();
        if (stmt !== null) {
          if (Array.isArray(stmt)) {
            block.statements.push(...stmt);
          } else {
            block.statements.push(stmt);
          }
        }
        this.nextToken();
      }

      if (this.curToken.type !== TokenType.RBRACE) {
        this.errors.push(`Line ${this.curToken.line}: Expected closing brace '}'`);
        return null;
      }

      return block;
    }

    // Parses import statements: import "path"
    parseImportStatement() {
      this.nextToken(); // Move past 'import'
      if (this.curToken.type !== TokenType.STRING) {
        this.errors.push(`Line ${this.curToken.line}: Expected string literal after 'import', found '${this.curToken.literal}'`);
        return null;
      }
      let importPath = this.curToken.literal;
      
      let resolvedPath = importPath;
      let fileContent = "";
      
      if (typeof require !== 'undefined') {
        const fs = require('fs');
        const path = require('path');
        
        try {
          let currentDir = process.cwd();
          if (this.currentFile) {
            currentDir = path.dirname(this.currentFile);
          }
          resolvedPath = path.resolve(currentDir, importPath);
          
          if (!this.visitedFiles) {
            this.visitedFiles = new Set();
          }
          if (this.currentFile) {
            this.visitedFiles.add(path.resolve(this.currentFile));
          }
          
          let absPath = path.resolve(resolvedPath);
          if (this.visitedFiles.has(absPath)) {
            // Already imported in this compilation run, skip duplicates
            return [];
          }
          
          if (!fs.existsSync(absPath)) {
            this.errors.push(`Line ${this.curToken.line}: Imported file not found: '${importPath}' (Resolved: '${absPath}')`);
            return null;
          }
          
          fileContent = fs.readFileSync(absPath, 'utf8');
          
          // Mark as visited in the shared compilation set
          this.visitedFiles.add(absPath);
          
          const { Lexer } = require('./lexer');
          const subLexer = new Lexer(fileContent);
          const subParser = new Parser(subLexer, absPath);
          subParser.visitedFiles = this.visitedFiles;
          
          const subProgram = subParser.parseProgram();
          if (subParser.errors.length > 0) {
            this.errors.push(...subParser.errors);
            return null;
          }
          
          return subProgram.statements;
          
        } catch (err) {
          this.errors.push(`Line ${this.curToken.line}: Error reading imported file '${importPath}': ${err.message}`);
          return null;
        }
      } else {
        // Browser playground environment - notify user about CLI multi-file workflow
        this.errors.push(`Line ${this.curToken.line}: Modular file imports ('import "${importPath}"') are designed for local projects using the AniKode desktop CLI. In the web playground, please write your functions directly in the editor.`);
        return null;
      }
    }

    // Standard wrapper for standalone expression statements
    parseExpressionStatement() {
      let expression = this.parseExpression(Precedence.LOWEST);
      return {
        type: 'ExpressionStatement',
        expression: expression
      };
    }

    // Parses expressions using prefix and infix lookup functions
    parseExpression(precedence) {
      let prefixFn = this.getPrefixFn(this.curToken.type);
      if (!prefixFn) {
        this.errors.push(`Line ${this.curToken.line}: Cannot start expression with '${this.curToken.literal}'`);
        return null;
      }

      let leftExp = prefixFn.call(this);

      while (this.peekToken.type !== TokenType.EOF && precedence < this.peekPrecedence()) {
        let infixFn = this.getInfixFn(this.peekToken.type);
        if (!infixFn) {
          return leftExp;
        }
        this.nextToken(); // Move to the infix operator
        leftExp = infixFn.call(this, leftExp);
      }

      return leftExp;
    }

    // Identifiers
    parseIdentifier() {
      return { type: 'Identifier', value: this.curToken.literal };
    }

    // Number literals
    parseNumberLiteral() {
      return { type: 'NumberLiteral', value: Number(this.curToken.literal) };
    }

    // String literals
    parseStringLiteral() {
      return { type: 'StringLiteral', value: this.curToken.literal };
    }

    // Boolean literals
    parseBooleanLiteral() {
      return { type: 'BooleanLiteral', value: this.curToken.type === TokenType.TRUE };
    }

    // Null literals
    parseNullLiteral() {
      return { type: 'NullLiteral', value: null };
    }

    // say.in input expression
    parseSayInExpression() {
      this.nextToken(); // Move past 'say.in'
      let promptText = null;
      let hasParen = false;

      if (this.curToken.type === TokenType.LPAREN) {
        hasParen = true;
        this.nextToken(); // Move past '('
        if (this.curToken.type !== TokenType.RPAREN) {
          promptText = this.parseExpression(Precedence.LOWEST);
          if (this.peekToken.type === TokenType.RPAREN) {
            this.nextToken(); // Move to ')'
          } else {
            this.errors.push(`Line ${this.curToken.line}: Expected closing parenthesis ')' for 'say.in'`);
            return null;
          }
        }
      }

      return {
        type: 'SayInExpression',
        prompt: promptText
      };
    }

    // Prefix operators
    parsePrefixExpression() {
      let operator = this.curToken.literal;
      this.nextToken(); // Move past operator
      let right = this.parseExpression(Precedence.PREFIX);
      
      return {
        type: 'PrefixExpression',
        operator: operator,
        right: right
      };
    }

    // Grouped expressions inside parentheses
    parseGroupedExpression() {
      this.nextToken(); // Move past '('
      let exp = this.parseExpression(Precedence.LOWEST);
      
      if (this.peekToken.type !== TokenType.RPAREN) {
        this.errors.push(`Line ${this.curToken.line}: Expected closing parenthesis ')'`);
        return null;
      }
      this.nextToken(); // Move past ')'
      return exp;
    }

    // Infix operators
    parseInfixExpression(left) {
      let operator = this.curToken.literal;
      let precedence = this.curPrecedence();
      this.nextToken(); // Move past the operator
      let right = this.parseExpression(precedence);
      
      return {
        type: 'InfixExpression',
        left: left,
        operator: operator,
        right: right
      };
    }

    // Parses function calls
    parseCallExpression(left) {
      this.nextToken(); // Move past '('
      let args = [];

      if (this.curToken.type !== TokenType.RPAREN) {
        args.push(this.parseExpression(Precedence.LOWEST));
        
        while (this.peekToken.type === TokenType.COMMA) {
          this.nextToken(); // Move curToken to ','
          this.nextToken(); // Move past ','
          args.push(this.parseExpression(Precedence.LOWEST));
        }

        if (this.peekToken.type !== TokenType.RPAREN) {
          this.errors.push(`Line ${this.curToken.line}: Expected closing parenthesis ')' after function arguments`);
          return null;
        }
        this.nextToken(); // Move curToken to ')'
      }
      
      return {
        type: 'CallExpression',
        function: left,
        arguments: args
      };
    }

    // Parses recursive call shortcut
    parseRecurseExpression() {
      this.nextToken(); // Move past 'recurse'
      let args = [];

      if (this.curToken.type !== TokenType.LPAREN) {
        this.errors.push(`Line ${this.curToken.line}: Expected '(' after 'recurse' keyword`);
        return null;
      }
      this.nextToken(); // Move past '('

      if (this.curToken.type !== TokenType.RPAREN) {
        args.push(this.parseExpression(Precedence.LOWEST));
        
        while (this.peekToken.type === TokenType.COMMA) {
          this.nextToken(); // Move curToken to ','
          this.nextToken(); // Move past ','
          args.push(this.parseExpression(Precedence.LOWEST));
        }

        if (this.peekToken.type !== TokenType.RPAREN) {
          this.errors.push(`Line ${this.curToken.line}: Expected closing parenthesis ')' after recurse arguments`);
          return null;
        }
        this.nextToken(); // Move curToken to ')'
      }

      return {
        type: 'RecurseExpression',
        arguments: args
      };
    }

    // Parses array literals: [1, 2, 3]
    parseArrayLiteral() {
      this.nextToken(); // Move past '['
      let elements = [];

      if (this.curToken.type !== TokenType.RBRACKET) {
        elements.push(this.parseExpression(Precedence.LOWEST));
        
        while (this.peekToken.type === TokenType.COMMA) {
          this.nextToken(); // Move to ','
          this.nextToken(); // Move past ','
          elements.push(this.parseExpression(Precedence.LOWEST));
        }

        if (this.peekToken.type !== TokenType.RBRACKET) {
          this.errors.push(`Line ${this.curToken.line}: Expected closing bracket ']' for array literal`);
          return null;
        }
        this.nextToken(); // Move curToken to ']'
      }
      return {
        type: 'ArrayLiteral',
        elements: elements
      };
    }

    // Parses member access dot expressions: left.property
    parseMemberExpression(left) {
      this.nextToken(); // Move past '.'
      if (this.curToken.type !== TokenType.IDENTIFIER) {
        this.errors.push(`Line ${this.curToken.line}: Expected identifier after '.'`);
        return null;
      }
      let property = { type: 'Identifier', value: this.curToken.literal };
      return {
        type: 'MemberExpression',
        object: left,
        property: property
      };
    }

    // Parses logical operators (and, or, xor, nand, nor, xnor, implies, iff)
    parseLogicalExpression(left) {
      let operator = this.curToken.literal;
      let tokenType = this.curToken.type;
      let precedence = this.curPrecedence();
      this.nextToken();
      let right = this.parseExpression(precedence);
      
      let typeMap = {
        [TokenType.AND]: 'AndExpression',
        [TokenType.OR]: 'OrExpression',
        [TokenType.XOR]: 'XorExpression',
        [TokenType.NAND]: 'NandExpression',
        [TokenType.NOR]: 'NorExpression',
        [TokenType.XNOR]: 'XnorExpression',
        [TokenType.IMPLIES]: 'ImpliesExpression',
        [TokenType.IFF]: 'IffExpression'
      };

      return {
        type: typeMap[tokenType],
        left: left,
        right: right
      };
    }

    // Parses prefix logical not expression: not x
    parseNotExpression() {
      this.nextToken(); // Move past 'not'
      let right = this.parseExpression(Precedence.PREFIX);
      return {
        type: 'NotExpression',
        right: right
      };
    }

    // Parses dictionary literals: { "key": value }
    parseDictionaryLiteral() {
      this.nextToken(); // Move past '{'
      let pairs = [];

      if (this.curToken.type !== TokenType.RBRACE) {
        let pair = this.parseKeyValuePair();
        if (pair) pairs.push(pair);

        while (this.peekToken.type === TokenType.COMMA) {
          this.nextToken(); // Move to ','
          this.nextToken(); // Move past ','
          pair = this.parseKeyValuePair();
          if (pair) pairs.push(pair);
        }

        if (this.peekToken.type !== TokenType.RBRACE) {
          this.errors.push(`Line ${this.curToken.line}: Expected closing brace '}' for dictionary`);
          return null;
        }
        this.nextToken(); // Move curToken to '}'
      }
      return {
        type: 'DictionaryLiteral',
        pairs: pairs
      };
    }

    parseKeyValuePair() {
      if (this.curToken.type !== TokenType.STRING && this.curToken.type !== TokenType.IDENTIFIER) {
        this.errors.push(`Line ${this.curToken.line}: Expected string or identifier key in dictionary`);
        return null;
      }
      let key = this.curToken.literal;
      this.nextToken(); // Move past key

      if (this.curToken.type !== TokenType.COLON) {
        this.errors.push(`Line ${this.curToken.line}: Expected ':' after key '${key}'`);
        return null;
      }
      this.nextToken(); // Move past ':'

      let value = this.parseExpression(Precedence.LOWEST);
      return { key: key, value: value };
    }

    // Map prefix tokens to their parser functions
    getPrefixFn(tokenType) {
      switch (tokenType) {
        case TokenType.LBRACKET:
          return this.parseArrayLiteral;
        case TokenType.RECURSE:
          return this.parseRecurseExpression;
        case TokenType.SAY_IN:
          return this.parseSayInExpression;
        case TokenType.IDENTIFIER:
        case TokenType.ALL:
        case TokenType.ANY:
          return this.parseIdentifier;
        case TokenType.NUMBER:
          return this.parseNumberLiteral;
        case TokenType.STRING:
          return this.parseStringLiteral;
        case TokenType.TRUE:
        case TokenType.FALSE:
          return this.parseBooleanLiteral;
        case TokenType.NULL:
          return this.parseNullLiteral;
        case TokenType.NOT:
          return this.parseNotExpression;
        case TokenType.LBRACE:
          return this.parseDictionaryLiteral;
        case TokenType.ERROR:
          return this.parseErrorExpression;
        case TokenType.MINUS:
          return this.parsePrefixExpression;
        case TokenType.LPAREN:
          return this.parseGroupedExpression;
        default:
          return null;
      }
    }

    // Map infix tokens to their parser functions
    getInfixFn(tokenType) {
      switch (tokenType) {
        case TokenType.LPAREN:
          return this.parseCallExpression;
        case TokenType.DOT:
          return this.parseMemberExpression;
        case TokenType.ASSIGN:
          return this.parseAssignmentExpression;
        case TokenType.AND:
        case TokenType.NAND:
        case TokenType.XOR:
        case TokenType.XNOR:
        case TokenType.OR:
        case TokenType.NOR:
        case TokenType.IMPLIES:
        case TokenType.IFF:
          return this.parseLogicalExpression;
        case TokenType.PLUS:
        case TokenType.MINUS:
        case TokenType.MULTIPLY:
        case TokenType.DIVIDE:
        case TokenType.EQ:
        case TokenType.NEQ:
        case TokenType.LT:
        case TokenType.GT:
        case TokenType.LTE:
        case TokenType.GTE:
          return this.parseInfixExpression;
        default:
          return null;
      }
    }
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      Parser
    };
  } else {
    window.Parser = Parser;
  }
})();
