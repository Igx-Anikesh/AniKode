/**
 * AniKode In-Browser TypeScript Parser
 */

import { Lexer, Token, TokenType, TokenTypeKey } from './lexer';

export const Precedence = {
  LOWEST: 0,
  ASSIGN: 1,
  OR: 2,
  XOR: 3,
  AND: 4,
  EQUALS: 5,
  LESSGREATER: 6,
  SUM: 7,
  PRODUCT: 8,
  PREFIX: 9,
  CALL: 10,
  DOT: 11,
} as const;

export const TokenPrecedence: Record<string, number> = {
  [TokenType.ASSIGN]: Precedence.ASSIGN,
  [TokenType.DOT]: Precedence.DOT,
  [TokenType.LBRACKET]: Precedence.CALL,
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
  [TokenType.MODULO]: Precedence.PRODUCT,
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

export class Parser {
  lexer: Lexer;
  curToken: any;
  peekToken: any;
  errors: string[] = [];
  disableCount: number = 0;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.curToken = this.peekToken;
    try {
      this.peekToken = this.lexer.nextToken();
    } catch (e: any) {
      this.errors.push(e.message);
      this.peekToken = { type: TokenType.EOF, literal: '', line: this.lexer.line, column: this.lexer.column };
    }
  }

  peekPrecedence(): number {
    return TokenPrecedence[this.peekToken.type] || Precedence.LOWEST;
  }

  curPrecedence(): number {
    return TokenPrecedence[this.curToken.type] || Precedence.LOWEST;
  }

  parseProgram(): any {
    const program = {
      type: 'Program',
      statements: [] as any[]
    };

    while (this.curToken.type !== TokenType.EOF) {
      const stmt = this.parseStatement();
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

  parseStatement(): any {
    if (this.curToken.type === TokenType.DISABLE_NEXT) {
      this.disableCount += Number(this.curToken.literal);
      this.nextToken();
      return this.parseStatement();
    }

    let stmt: any = null;
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
      default:
        stmt = this.parseExpressionStatement();
        break;
    }

    if (stmt !== null && this.disableCount > 0) {
      if (Array.isArray(stmt)) {
        for (const s of stmt) {
          if (this.disableCount > 0) {
            s.disabled = true;
            this.disableCount--;
          }
        }
      } else {
        stmt.disabled = true;
        this.disableCount--;
      }
    }

    return stmt;
  }

  parseVarDeclaration(): any {
    const isSet = this.curToken.type === TokenType.SET;
    this.nextToken();

    if (this.curToken.type !== TokenType.IDENTIFIER) {
      this.errors.push(`Line ${this.curToken.line}: Expected variable name, but found '${this.curToken.literal}'`);
      return null;
    }

    const name = this.curToken.literal;
    if (name === 'math' || name === 'file') {
      this.errors.push(`Line ${this.curToken.line}: Cannot assign to read-only built-in namespace '${name}'.`);
      return null;
    }
    this.nextToken();

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

    this.nextToken();
    const value = this.parseExpression(Precedence.LOWEST);

    return {
      type: 'VarDeclaration',
      name: name,
      value: value,
      line: this.curToken.line
    };
  }

  parseSayOutStatement(): any {
    this.nextToken();

    let hasParen = false;
    if (this.curToken.type === TokenType.LPAREN) {
      hasParen = true;
      this.nextToken();
    }

    const expressions: any[] = [];
    if (hasParen) {
      if (this.curToken.type !== TokenType.RPAREN) {
        expressions.push(this.parseExpression(Precedence.LOWEST));
        while (this.peekToken.type === TokenType.COMMA) {
          this.nextToken();
          this.nextToken();
          expressions.push(this.parseExpression(Precedence.LOWEST));
        }
        if (this.peekToken.type === TokenType.RPAREN) {
          this.nextToken();
        } else {
          this.errors.push(`Line ${this.curToken.line}: Expected closing parenthesis ')' for 'say.out'`);
          return null;
        }
      }
    } else {
      expressions.push(this.parseExpression(Precedence.LOWEST));
      while (this.peekToken.type === TokenType.COMMA) {
        this.nextToken();
        this.nextToken();
        expressions.push(this.parseExpression(Precedence.LOWEST));
      }
    }

    return {
      type: 'SayOutStatement',
      expressions: expressions,
      line: this.curToken.line
    };
  }

  parseIfStatement(): any {
    this.nextToken();
    const condition = this.parseExpression(Precedence.LOWEST);

    if (this.peekToken.type !== TokenType.LBRACE) {
      this.errors.push(`Line ${this.curToken.line}: Expected '{' to start block after if condition`);
      return null;
    }
    this.nextToken();

    const consequence = this.parseBlockStatement();
    let alternative: any = null;

    if (this.peekToken.type === TokenType.ELSE) {
      this.nextToken();
      if (this.peekToken.type === TokenType.IF) {
        this.nextToken();
        alternative = this.parseIfStatement();
      } else if (this.peekToken.type === TokenType.LBRACE) {
        this.nextToken();
        alternative = this.parseBlockStatement();
      } else {
        this.errors.push(`Line ${this.curToken.line}: Expected '{' or 'if' after 'else'`);
        return null;
      }
    }

    return {
      type: 'IfStatement',
      condition,
      consequence,
      alternative,
      line: this.curToken.line
    };
  }

  parseLoopStatement(): any {
    this.nextToken();
    if (this.curToken.type !== TokenType.IDENTIFIER) {
      this.errors.push(`Line ${this.curToken.line}: Expected loop variable name`);
      return null;
    }
    const iterator = this.curToken.literal;
    this.nextToken();

    if (this.curToken.type !== TokenType.FROM) {
      this.errors.push(`Line ${this.curToken.line}: Expected 'from' keyword in loop`);
      return null;
    }
    this.nextToken();

    const start = this.parseExpression(Precedence.LOWEST);
    if (this.peekToken.type !== TokenType.TO) {
      this.errors.push(`Line ${this.curToken.line}: Expected 'to' keyword in loop`);
      return null;
    }
    this.nextToken();
    this.nextToken();

    const end = this.parseExpression(Precedence.LOWEST);
    if (this.peekToken.type !== TokenType.LBRACE) {
      this.errors.push(`Line ${this.curToken.line}: Expected '{' after loop range`);
      return null;
    }
    this.nextToken();

    const body = this.parseBlockStatement();
    return {
      type: 'LoopStatement',
      iterator,
      start,
      end,
      body,
      line: this.curToken.line
    };
  }

  parseEachStatement(): any {
    this.nextToken();
    if (this.curToken.type !== TokenType.IDENTIFIER) {
      this.errors.push(`Line ${this.curToken.line}: Expected variable name after 'each'`);
      return null;
    }
    const iterator = this.curToken.literal;
    this.nextToken();

    if (this.curToken.type !== TokenType.IN) {
      this.errors.push(`Line ${this.curToken.line}: Expected 'in' keyword in each loop`);
      return null;
    }
    this.nextToken();

    const collection = this.parseExpression(Precedence.LOWEST);
    if (this.peekToken.type !== TokenType.LBRACE) {
      this.errors.push(`Line ${this.curToken.line}: Expected '{' to start each loop body`);
      return null;
    }
    this.nextToken();

    const body = this.parseBlockStatement();
    return {
      type: 'EachStatement',
      iterator,
      collection,
      body,
      line: this.curToken.line
    };
  }

  parseFunctionDeclaration(): any {
    this.nextToken();
    if (this.curToken.type !== TokenType.IDENTIFIER) {
      this.errors.push(`Line ${this.curToken.line}: Expected function name after 'fn'`);
      return null;
    }
    const name = this.curToken.literal;
    this.nextToken();

    if (this.curToken.type !== TokenType.LPAREN) {
      this.errors.push(`Line ${this.curToken.line}: Expected '(' after function name`);
      return null;
    }
    this.nextToken();

    const parameters: string[] = [];
    if (this.curToken.type !== TokenType.RPAREN) {
      parameters.push(this.curToken.literal);
      this.nextToken();
      while (this.curToken.type === TokenType.COMMA) {
        this.nextToken();
        parameters.push(this.curToken.literal);
        this.nextToken();
      }
    }

    if (this.curToken.type !== TokenType.RPAREN) {
      this.errors.push(`Line ${this.curToken.line}: Expected ')' after parameter list`);
      return null;
    }
    this.nextToken();

    if (this.curToken.type !== TokenType.LBRACE) {
      this.errors.push(`Line ${this.curToken.line}: Expected '{' to start function body`);
      return null;
    }

    const body = this.parseBlockStatement();
    return {
      type: 'FunctionDeclaration',
      name,
      parameters,
      body,
      line: this.curToken.line
    };
  }

  parseReturnStatement(): any {
    this.nextToken();
    let value = null;
    if (this.curToken.type !== TokenType.RBRACE && this.curToken.type !== TokenType.EOF) {
      value = this.parseExpression(Precedence.LOWEST);
    }
    return {
      type: 'ReturnStatement',
      value,
      line: this.curToken.line
    };
  }

  parseBlockStatement(): any {
    const block = {
      type: 'BlockStatement',
      statements: [] as any[]
    };

    this.nextToken();
    while (this.curToken.type !== TokenType.RBRACE && this.curToken.type !== TokenType.EOF) {
      const stmt = this.parseStatement();
      if (stmt !== null) {
        if (Array.isArray(stmt)) {
          block.statements.push(...stmt);
        } else {
          block.statements.push(stmt);
        }
      }
      this.nextToken();
    }

    return block;
  }

  parseTryStatement(): any {
    this.nextToken();
    if (this.curToken.type !== TokenType.LBRACE) {
      this.errors.push(`Line ${this.curToken.line}: Expected '{' after 'try'`);
      return null;
    }

    const tryBlock = this.parseBlockStatement();
    const catchBlocks: any[] = [];
    let finallyBlock: any = null;

    while (this.peekToken.type === TokenType.CATCH) {
      this.nextToken();
      let errorType = null;
      let errorVariable = 'error';

      if (this.peekToken.type === TokenType.IDENTIFIER || this.peekToken.type === TokenType.ERROR) {
        this.nextToken();
        errorType = this.curToken.literal;
      }

      if (this.peekToken.type === TokenType.IDENTIFIER) {
        this.nextToken();
        errorVariable = this.curToken.literal;
      }

      if (this.peekToken.type !== TokenType.LBRACE) {
        this.errors.push(`Line ${this.curToken.line}: Expected '{' for catch block`);
        return null;
      }
      this.nextToken();

      const catchBody = this.parseBlockStatement();
      catchBlocks.push({
        type: 'CatchBlock',
        errorType,
        errorVariable,
        body: catchBody
      });
    }

    if (this.peekToken.type === TokenType.FINALLY) {
      this.nextToken();
      if (this.peekToken.type !== TokenType.LBRACE) {
        this.errors.push(`Line ${this.curToken.line}: Expected '{' for finally block`);
        return null;
      }
      this.nextToken();
      finallyBlock = this.parseBlockStatement();
    }

    return {
      type: 'TryStatement',
      tryBlock,
      catchBlocks,
      finallyBlock,
      line: this.curToken.line
    };
  }

  parseThrowStatement(): any {
    this.nextToken();
    const value = this.parseExpression(Precedence.LOWEST);
    return {
      type: 'ThrowStatement',
      value,
      line: this.curToken.line
    };
  }

  parseImportStatement(): any {
    this.nextToken();
    const importPath = this.curToken.literal;
    this.errors.push(`Line ${this.curToken.line}: Modular file imports ('import "${importPath}"') are designed for local projects using the AniKode desktop CLI. In the web playground, please write your functions directly in the editor.`);
    return null;
  }

  parseExpressionStatement(): any {
    const expression = this.parseExpression(Precedence.LOWEST);
    return {
      type: 'ExpressionStatement',
      expression,
      line: this.curToken.line
    };
  }

  parseExpression(precedence: number): any {
    let left = this.parsePrefixExpression();
    if (!left) return null;

    while (this.peekToken.type !== TokenType.EOF && precedence < this.peekPrecedence()) {
      left = this.parseInfixExpression(left);
    }

    return left;
  }

  parsePrefixExpression(): any {
    switch (this.curToken.type) {
      case TokenType.IDENTIFIER:
        if (this.curToken.literal === 'say.in') {
          this.nextToken();
          let prompt = null;
          if (this.curToken.type === TokenType.LPAREN) {
            this.nextToken();
            if (this.curToken.type !== TokenType.RPAREN) {
              prompt = this.parseExpression(Precedence.LOWEST);
              if (this.peekToken.type === TokenType.RPAREN) {
                this.nextToken();
              }
            }
          }
          return { type: 'SayInExpression', prompt };
        }
        return { type: 'Identifier', value: this.curToken.literal };

      case TokenType.NUMBER:
        return { type: 'NumberLiteral', value: Number(this.curToken.literal) };

      case TokenType.STRING:
        return { type: 'StringLiteral', value: this.curToken.literal };

      case TokenType.TRUE:
      case TokenType.FALSE:
        return { type: 'BooleanLiteral', value: this.curToken.type === TokenType.TRUE };

      case TokenType.NULL:
        return { type: 'NullLiteral', value: null };

      case TokenType.MINUS:
      case TokenType.NOT:
        const op = this.curToken.literal;
        this.nextToken();
        const right = this.parseExpression(Precedence.PREFIX);
        return { type: 'PrefixExpression', operator: op, right };

      case TokenType.LPAREN:
        this.nextToken();
        const expr = this.parseExpression(Precedence.LOWEST);
        if (this.peekToken.type === TokenType.RPAREN) {
          this.nextToken();
        }
        return expr;

      case TokenType.LBRACKET:
        return this.parseListLiteral();

      case TokenType.LBRACE:
        return this.parseDictionaryLiteral();

      case TokenType.RECURSE:
        this.nextToken();
        const args: any[] = [];
        if (this.curToken.type === TokenType.LPAREN) {
          this.nextToken();
          if (this.curToken.type !== TokenType.RPAREN) {
            args.push(this.parseExpression(Precedence.LOWEST));
            while (this.peekToken.type === TokenType.COMMA) {
              this.nextToken();
              this.nextToken();
              args.push(this.parseExpression(Precedence.LOWEST));
            }
          }
        }
        return { type: 'RecurseExpression', arguments: args };

      default:
        return null;
    }
  }

  parseInfixExpression(left: any): any {
    const prevToken = this.curToken;
    this.nextToken();

    switch (this.curToken.type) {
      case TokenType.PLUS:
      case TokenType.MINUS:
      case TokenType.MULTIPLY:
      case TokenType.DIVIDE:
      case TokenType.MODULO:
      case TokenType.EQ:
      case TokenType.NEQ:
      case TokenType.LT:
      case TokenType.GT:
      case TokenType.LTE:
      case TokenType.GTE:
      case TokenType.AND:
      case TokenType.OR:
      case TokenType.XOR:
      case TokenType.NAND:
      case TokenType.NOR:
      case TokenType.XNOR:
      case TokenType.IMPLIES:
      case TokenType.IFF:
        const op = this.curToken.literal;
        const prec = this.curPrecedence();
        this.nextToken();
        const right = this.parseExpression(prec);
        return { type: 'InfixExpression', left, operator: op, right };

      case TokenType.LBRACKET:
        this.nextToken();
        const indexVal = this.parseExpression(Precedence.LOWEST);
        if (this.peekToken.type === TokenType.RBRACKET) {
          this.nextToken();
        }
        return { type: 'IndexExpression', left, index: indexVal };

      case TokenType.ASSIGN:
        this.nextToken();
        const assignVal = this.parseExpression(Precedence.LOWEST);
        return { type: 'Assignment', left, name: left.value, value: assignVal };

      case TokenType.DOT:
        this.nextToken();
        const property = { type: 'Identifier', value: this.curToken.literal };
        return { type: 'MemberExpression', object: left, property };

      case TokenType.LPAREN:
        const callArgs: any[] = [];
        if (this.peekToken.type !== TokenType.RPAREN) {
          this.nextToken();
          callArgs.push(this.parseExpression(Precedence.LOWEST));
          while (this.peekToken.type === TokenType.COMMA) {
            this.nextToken();
            this.nextToken();
            callArgs.push(this.parseExpression(Precedence.LOWEST));
          }
        }
        if (this.peekToken.type === TokenType.RPAREN) {
          this.nextToken();
        }
        return { type: 'CallExpression', function: left, arguments: callArgs };

      default:
        return left;
    }
  }

  parseListLiteral(): any {
    const elements: any[] = [];
    if (this.peekToken.type !== TokenType.RBRACKET) {
      this.nextToken();
      elements.push(this.parseExpression(Precedence.LOWEST));
      while (this.peekToken.type === TokenType.COMMA) {
        this.nextToken();
        this.nextToken();
        elements.push(this.parseExpression(Precedence.LOWEST));
      }
    }
    if (this.peekToken.type === TokenType.RBRACKET) {
      this.nextToken();
    }
    return { type: 'ListLiteral', elements };
  }

  parseDictionaryLiteral(): any {
    const pairs: any[] = [];
    if (this.peekToken.type !== TokenType.RBRACE) {
      this.nextToken();
      let key = this.curToken.literal;
      this.nextToken();
      if (this.curToken.type === TokenType.COLON) {
        this.nextToken();
      }
      const val = this.parseExpression(Precedence.LOWEST);
      pairs.push({ key, value: val });

      while (this.peekToken.type === TokenType.COMMA) {
        this.nextToken();
        this.nextToken();
        key = this.curToken.literal;
        this.nextToken();
        if (this.curToken.type === TokenType.COLON) {
          this.nextToken();
        }
        pairs.push({ key, value: this.parseExpression(Precedence.LOWEST) });
      }
    }
    if (this.peekToken.type === TokenType.RBRACE) {
      this.nextToken();
    }
    return { type: 'DictionaryLiteral', pairs };
  }
}
