/**
 * AniKode In-Browser TypeScript Lexer
 */

export const TokenType = {
  LET: 'LET',
  SET: 'SET',
  TO: 'TO',
  SAY_OUT: 'SAY_OUT',
  SAY_IN: 'SAY_IN',
  IF: 'IF',
  ELSE: 'ELSE',
  WHILE: 'WHILE',
  FN: 'FN',
  RETURN: 'RETURN',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  NULL: 'NULL',
  LOOP: 'LOOP',
  FROM: 'FROM',
  RECURSE: 'RECURSE',
  EACH: 'EACH',
  IN: 'IN',
  IMPORT: 'IMPORT',

  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  XOR: 'XOR',
  NAND: 'NAND',
  NOR: 'NOR',
  XNOR: 'XNOR',
  IMPLIES: 'IMPLIES',
  IFF: 'IFF',
  ALL: 'ALL',
  ANY: 'ANY',

  TRY: 'TRY',
  CATCH: 'CATCH',
  FINALLY: 'FINALLY',
  THROW: 'THROW',
  ERROR: 'ERROR',

  DISABLE_NEXT: 'DISABLE_NEXT',

  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',

  ASSIGN: 'ASSIGN',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  MODULO: 'MODULO',

  EQ: 'EQ',
  NEQ: 'NEQ',
  LT: 'LT',
  GT: 'GT',
  LTE: 'LTE',
  GTE: 'GTE',

  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  LBRACE: 'LBRACE',
  RBRACE: 'RBRACE',
  LBRACKET: 'LBRACKET',
  RBRACKET: 'RBRACKET',
  COMMA: 'COMMA',
  DOT: 'DOT',
  COLON: 'COLON',

  EOF: 'EOF',
} as const;

export type TokenTypeKey = typeof TokenType[keyof typeof TokenType];

export interface Token {
  type: TokenTypeKey;
  literal: string;
  line: number;
  column: number;
}

const KEYWORDS: Record<string, TokenTypeKey> = {
  'let': TokenType.LET,
  'set': TokenType.SET,
  'to': TokenType.TO,
  'say.out': TokenType.SAY_OUT,
  'say.in': TokenType.SAY_IN,
  'if': TokenType.IF,
  'else': TokenType.ELSE,
  'while': TokenType.WHILE,
  'fn': TokenType.FN,
  'return': TokenType.RETURN,
  'true': TokenType.TRUE,
  'false': TokenType.FALSE,
  'null': TokenType.NULL,
  'loop': TokenType.LOOP,
  'from': TokenType.FROM,
  'recurse': TokenType.RECURSE,
  'each': TokenType.EACH,
  'in': TokenType.IN,
  'import': TokenType.IMPORT,

  'and': TokenType.AND,
  'or': TokenType.OR,
  'not': TokenType.NOT,
  'xor': TokenType.XOR,
  'nand': TokenType.NAND,
  'nor': TokenType.NOR,
  'xnor': TokenType.XNOR,
  'implies': TokenType.IMPLIES,
  'iff': TokenType.IFF,
  'all': TokenType.ALL,
  'any': TokenType.ANY,

  'try': TokenType.TRY,
  'catch': TokenType.CATCH,
  'finally': TokenType.FINALLY,
  'throw': TokenType.THROW,
  'Error': TokenType.ERROR,
};

export class Lexer {
  input: string;
  position: number = 0;
  readPosition: number = 0;
  ch: string | null = '';
  line: number = 1;
  column: number = 0;

  constructor(input: string) {
    this.input = input;
    this.readChar();
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = null;
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition++;
    this.column++;
  }

  peekChar(): string | null {
    if (this.readPosition >= this.input.length) {
      return null;
    }
    return this.input[this.readPosition];
  }

  skipWhitespaceAndComments() {
    while (true) {
      const c = this.ch as string | null;
      if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
        if (c === '\n') {
          this.line++;
          this.column = 0;
        }
        this.readChar();
      } else if (c === '-' && this.peekChar() === '-') {
        this.readChar();
        this.readChar();
        while (true) {
          const inner: string | null = this.ch;
          if (inner === '-' && this.peekChar() === '-') {
            this.readChar();
            this.readChar();
            break;
          }
          if (inner === null) break;
          if (inner === '\n') {
            this.line++;
            this.column = 0;
          }
          this.readChar();
        }
      } else if (c === '/' && this.peekChar() === '/') {
        this.readChar();
        this.readChar();
        while (true) {
          const inner: string | null = this.ch;
          if (inner === '/' && this.peekChar() === '/') {
            this.readChar();
            this.readChar();
            break;
          }
          if (inner === '\n' || inner === null) break;
          this.readChar();
        }
      } else if (c === '#') {
        let peekIdx = this.readPosition;
        let isDisableNext = false;
        let tempDigits = '';
        while (peekIdx < this.input.length && /[0-9]/.test(this.input[peekIdx])) {
          tempDigits += this.input[peekIdx];
          peekIdx++;
        }
        if (tempDigits.length > 0 && peekIdx < this.input.length && this.input[peekIdx] === '#') {
          isDisableNext = true;
        }

        if (isDisableNext) {
          break;
        }

        this.readChar();
        while (true) {
          const inner: string | null = this.ch;
          if (inner === '#') {
            this.readChar();
            break;
          }
          if (inner === null) break;
          if (inner === '\n') {
            this.line++;
            this.column = 0;
          }
          this.readChar();
        }
      } else if (c === '~' || c === '\\') {
        while (this.ch !== '\n' && this.ch !== null) {
          this.readChar();
        }
      } else {
        break;
      }
    }
  }

  nextToken(): Token {
    this.skipWhitespaceAndComments();

    let tok: Token;
    const startLine = this.line;
    const startCol = this.column;

    if (this.ch === 's') {
      const remaining = this.input.slice(this.position);
      if (remaining.startsWith('say.out')) {
        for (let i = 0; i < 7; i++) this.readChar();
        return { type: TokenType.SAY_OUT, literal: 'say.out', line: startLine, column: startCol };
      }
      if (remaining.startsWith('say.in')) {
        for (let i = 0; i < 6; i++) this.readChar();
        return { type: TokenType.SAY_IN, literal: 'say.in', line: startLine, column: startCol };
      }
    }

    switch (this.ch) {
      case '=':
        if (this.peekChar() === '=') {
          this.readChar();
          tok = { type: TokenType.EQ, literal: '==', line: startLine, column: startCol };
        } else {
          tok = { type: TokenType.ASSIGN, literal: '=', line: startLine, column: startCol };
        }
        break;
      case '!':
        if (this.peekChar() === '=') {
          this.readChar();
          tok = { type: TokenType.NEQ, literal: '!=', line: startLine, column: startCol };
        } else {
          tok = { type: TokenType.NOT, literal: '!', line: startLine, column: startCol };
        }
        break;
      case '<':
        if (this.peekChar() === '=') {
          this.readChar();
          tok = { type: TokenType.LTE, literal: '<=', line: startLine, column: startCol };
        } else {
          tok = { type: TokenType.LT, literal: '<', line: startLine, column: startCol };
        }
        break;
      case '>':
        if (this.peekChar() === '=') {
          this.readChar();
          tok = { type: TokenType.GTE, literal: '>=', line: startLine, column: startCol };
        } else {
          tok = { type: TokenType.GT, literal: '>', line: startLine, column: startCol };
        }
        break;
      case '+':
        tok = { type: TokenType.PLUS, literal: '+', line: startLine, column: startCol };
        break;
      case '-':
        tok = { type: TokenType.MINUS, literal: '-', line: startLine, column: startCol };
        break;
      case '*':
        tok = { type: TokenType.MULTIPLY, literal: '*', line: startLine, column: startCol };
        break;
      case '/':
        tok = { type: TokenType.DIVIDE, literal: '/', line: startLine, column: startCol };
        break;
      case '%':
        tok = { type: TokenType.MODULO, literal: '%', line: startLine, column: startCol };
        break;
      case '(':
        tok = { type: TokenType.LPAREN, literal: '(', line: startLine, column: startCol };
        break;
      case ')':
        tok = { type: TokenType.RPAREN, literal: ')', line: startLine, column: startCol };
        break;
      case '{':
        tok = { type: TokenType.LBRACE, literal: '{', line: startLine, column: startCol };
        break;
      case '}':
        tok = { type: TokenType.RBRACE, literal: '}', line: startLine, column: startCol };
        break;
      case '[':
        tok = { type: TokenType.LBRACKET, literal: '[', line: startLine, column: startCol };
        break;
      case ']':
        tok = { type: TokenType.RBRACKET, literal: ']', line: startLine, column: startCol };
        break;
      case ',':
        tok = { type: TokenType.COMMA, literal: ',', line: startLine, column: startCol };
        break;
      case '.':
        tok = { type: TokenType.DOT, literal: '.', line: startLine, column: startCol };
        break;
      case ':':
        tok = { type: TokenType.COLON, literal: ':', line: startLine, column: startCol };
        break;
      case '"':
      case "'":
        const quoteChar = this.ch;
        const strVal = this.readString(quoteChar);
        return { type: TokenType.STRING, literal: strVal, line: startLine, column: startCol };
      case '#':
        let numStr = '';
        this.readChar();
        while (this.ch !== null && /[0-9]/.test(this.ch)) {
          numStr += this.ch;
          this.readChar();
        }
        if (numStr.length > 0 && this.ch === '#') {
          this.readChar();
          return { type: TokenType.DISABLE_NEXT, literal: numStr, line: startLine, column: startCol };
        }
        return { type: TokenType.EOF, literal: '', line: startLine, column: startCol };
      case null:
        tok = { type: TokenType.EOF, literal: '', line: startLine, column: startCol };
        break;
      default:
        if (this.isLetter(this.ch)) {
          const ident = this.readIdentifier();
          const type = KEYWORDS[ident] || TokenType.IDENTIFIER;
          return { type, literal: ident, line: startLine, column: startCol };
        } else if (this.isDigit(this.ch)) {
          const num = this.readNumber();
          return { type: TokenType.NUMBER, literal: num, line: startLine, column: startCol };
        } else {
          tok = { type: TokenType.EOF, literal: this.ch, line: startLine, column: startCol };
        }
    }

    this.readChar();
    return tok;
  }

  readIdentifier(): string {
    const startPos = this.position;
    while (this.ch !== null && (this.isLetter(this.ch) || this.isDigit(this.ch) || this.ch === '_')) {
      this.readChar();
    }
    return this.input.slice(startPos, this.position);
  }

  readNumber(): string {
    const startPos = this.position;
    let hasDot = false;
    while (this.ch !== null && (this.isDigit(this.ch) || (this.ch === '.' && !hasDot))) {
      if (this.ch === '.') hasDot = true;
      this.readChar();
    }
    return this.input.slice(startPos, this.position);
  }

  readString(quote: string): string {
    let result = '';
    this.readChar();
    while (this.ch !== quote && this.ch !== null) {
      const current: string = this.ch;
      if (current === '\\') {
        this.readChar();
        const esc: string | null = this.ch;
        if (esc === 'n') result += '\n';
        else if (esc === 't') result += '\t';
        else if (esc === 'r') result += '\r';
        else if (esc === quote) result += quote;
        else if (esc === '\\') result += '\\';
        else if (esc !== null) result += esc;
      } else {
        result += current;
      }
      this.readChar();
    }
    this.readChar();
    return result;
  }

  isLetter(ch: string): boolean {
    return /^[a-zA-Z_]$/.test(ch);
  }

  isDigit(ch: string): boolean {
    return /^[0-9]$/.test(ch);
  }
}
