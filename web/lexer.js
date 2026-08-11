/**
 * AniKode Lexer (Tokenizer) - UMD wrapped
 */

(function() {
  const TokenType = {
    // Keywords
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
    
    // Logical Operators
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

    // Error Handling
    TRY: 'TRY',
    CATCH: 'CATCH',
    FINALLY: 'FINALLY',
    THROW: 'THROW',
    ERROR: 'ERROR',
    
    // Smart IDE Comment Token
    DISABLE_NEXT: 'DISABLE_NEXT', // #N#
    
    // Dynamic Values
    IDENTIFIER: 'IDENTIFIER', 
    NUMBER: 'NUMBER',         
    STRING: 'STRING',         
    
    // Math & Logic Operators
    ASSIGN: 'ASSIGN',         // =
    PLUS: 'PLUS',             // +
    MINUS: 'MINUS',           // -
    MULTIPLY: 'MULTIPLY',     // *
    DIVIDE: 'DIVIDE',         // /
    
    // Comparison Operators
    EQ: 'EQ',                 // ==
    NEQ: 'NEQ',               // !=
    LT: 'LT',                 // <
    GT: 'GT',                 // >
    LTE: 'LTE',               // <=
    GTE: 'GTE',               // >=
    
    // Punctuation
    LPAREN: 'LPAREN',         // (
    RPAREN: 'RPAREN',         // )
    LBRACE: 'LBRACE',         // {
    RBRACE: 'RBRACE',         // }
    LBRACKET: 'LBRACKET',     // [
    RBRACKET: 'RBRACKET',     // ]
    COMMA: 'COMMA',           // ,
    DOT: 'DOT',               // .
    COLON: 'COLON',           // :
    
    EOF: 'EOF',               
  };

  const KEYWORDS = {
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
    
    // Logical
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

    // Error Handling
    'try': TokenType.TRY,
    'catch': TokenType.CATCH,
    'finally': TokenType.FINALLY,
    'throw': TokenType.THROW,
    'Error': TokenType.ERROR,
  };

  class Lexer {
    constructor(input) {
      this.input = input;
      this.position = 0;
      this.readPosition = 0;
      this.ch = '';
      this.line = 1;
      this.column = 0;
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

    peekChar() {
      if (this.readPosition >= this.input.length) {
        return null;
      }
      return this.input[this.readPosition];
    }

    skipWhitespaceAndComments() {
      while (true) {
        if (this.ch === ' ' || this.ch === '\t' || this.ch === '\r' || this.ch === '\n') {
          if (this.ch === '\n') {
            this.line++;
            this.column = 0;
          }
          this.readChar();
        } 
        else if (this.ch === '-' && this.peekChar() === '-') {
          this.readChar(); 
          this.readChar(); 
          while (true) {
            if (this.ch === '-' && this.peekChar() === '-') {
              this.readChar(); 
              this.readChar(); 
              break;
            }
            if (this.ch === null) break;
            if (this.ch === '\n') {
              this.line++;
              this.column = 0;
            }
            this.readChar();
          }
        }
        else if (this.ch === '/' && this.peekChar() === '/') {
          this.readChar();
          this.readChar();
          while (true) {
            if (this.ch === '/' && this.peekChar() === '/') {
              this.readChar();
              this.readChar();
              break;
            }
            if (this.ch === '\n' || this.ch === null) break;
            this.readChar();
          }
        }
        else if (this.ch === '#') {
          // Peek if this is #N# statement disabler
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
            // Leave #N# to be tokenized by nextToken()
            break;
          } else {
            // General hash comment (# comment # or # comment)
            this.readChar(); // Skip starting '#'
            while (true) {
              if (this.ch === '#') {
                this.readChar(); // Skip closing '#'
                break;
              }
              if (this.ch === '\n' || this.ch === null) break;
              this.readChar();
            }
          }
        }
        else if (this.ch === '\\' || this.ch === '~') {
          while (this.ch !== '\n' && this.ch !== null) {
            this.readChar();
          }
        }
        else {
          break;
        }
      }
    }

    readString(quoteChar) {
      this.readChar(); 
      let startPos = this.position;
      while (this.ch !== quoteChar && this.ch !== null) {
        if (this.ch === '\n') {
          this.line++;
          this.column = 0;
        }
        this.readChar();
      }
      
      if (this.ch === null) {
        throw new Error(`Syntax Error: Unterminated string starting at line ${this.line}`);
      }
      
      let str = this.input.slice(startPos, this.position);
      this.readChar(); 
      return str;
    }

    readNumber() {
      let startPos = this.position;
      let hasDot = false;
      while (this.isDigit(this.ch) || (this.ch === '.' && !hasDot)) {
        if (this.ch === '.') hasDot = true;
        this.readChar();
      }
      return this.input.slice(startPos, this.position);
    }

    readIdentifier() {
      let startPos = this.position;
      while (this.isLetterOrDigit(this.ch)) {
        this.readChar();
      }
      return this.input.slice(startPos, this.position);
    }

    isLetter(ch) {
      if (!ch) return false;
      return /[a-zA-Z_]/.test(ch);
    }

    isDigit(ch) {
      if (!ch) return false;
      return /[0-9]/.test(ch);
    }

    isLetterOrDigit(ch) {
      if (!ch) return false;
      return /[a-zA-Z0-9_]/.test(ch);
    }

    nextToken() {
      this.skipWhitespaceAndComments();

      if (this.ch === null) {
        return { type: TokenType.EOF, literal: '', line: this.line, column: this.column };
      }

      let tok = { type: null, literal: '', line: this.line, column: this.column };

      // Check if we are starting say.out or say.in keyword exactly
      if (this.ch === 's') {
        let remaining = this.input.slice(this.position);
        if (remaining.startsWith('say.out')) {
          tok.type = TokenType.SAY_OUT;
          tok.literal = 'say.out';
          tok.line = this.line;
          tok.column = this.column;
          for (let i = 0; i < 7; i++) this.readChar();
          return tok;
        }
        if (remaining.startsWith('say.in')) {
          tok.type = TokenType.SAY_IN;
          tok.literal = 'say.in';
          tok.line = this.line;
          tok.column = this.column;
          for (let i = 0; i < 6; i++) this.readChar();
          return tok;
        }
      }

      switch (this.ch) {
        case '#':
          let startLine = this.line;
          let startCol = this.column;
          this.readChar(); 
          let num = '';
          while (this.isDigit(this.ch)) {
            num += this.ch;
            this.readChar();
          }
          if (num === '' || this.ch !== '#') {
            throw new Error(`Syntax Error: Invalid comment block syntax at line ${startLine}, column ${startCol}. Expected format: #N# where N is an integer.`);
          }
          this.readChar(); 
          tok.type = TokenType.DISABLE_NEXT;
          tok.literal = num;
          break;
        case '=':
          if (this.peekChar() === '=') {
            this.readChar(); 
            tok.type = TokenType.EQ;
            tok.literal = '==';
          } else {
            tok.type = TokenType.ASSIGN;
            tok.literal = '=';
          }
          break;
        case '!':
          if (this.peekChar() === '=') {
            this.readChar(); 
            tok.type = TokenType.NEQ;
            tok.literal = '!=';
          } else {
            throw new Error(`Syntax Error: Unexpected character '!' at line ${this.line}, column ${this.column}. Did you mean '!='?`);
          }
          break;
        case '<':
          if (this.peekChar() === '=') {
            this.readChar();
            tok.type = TokenType.LTE;
            tok.literal = '<=';
          } else {
            tok.type = TokenType.LT;
            tok.literal = '<';
          }
          break;
        case '>':
          if (this.peekChar() === '=') {
            this.readChar();
            tok.type = TokenType.GTE;
            tok.literal = '>=';
          } else {
            tok.type = TokenType.GT;
            tok.literal = '>';
          }
          break;
        case '+':
          tok.type = TokenType.PLUS;
          tok.literal = '+';
          break;
        case '-':
          tok.type = TokenType.MINUS;
          tok.literal = '-';
          break;
        case '*':
          tok.type = TokenType.MULTIPLY;
          tok.literal = '*';
          break;
        case '/':
          tok.type = TokenType.DIVIDE;
          tok.literal = '/';
          break;
        case '(':
          tok.type = TokenType.LPAREN;
          tok.literal = '(';
          break;
        case ')':
          tok.type = TokenType.RPAREN;
          tok.literal = ')';
          break;
        case '{':
          tok.type = TokenType.LBRACE;
          tok.literal = '{';
          break;
        case '}':
          tok.type = TokenType.RBRACE;
          tok.literal = '}';
          break;
        case '[':
          tok.type = TokenType.LBRACKET;
          tok.literal = '[';
          break;
        case ']':
          tok.type = TokenType.RBRACKET;
          tok.literal = ']';
          break;
        case ',':
          tok.type = TokenType.COMMA;
          tok.literal = ',';
          break;
        case '.':
          tok.type = TokenType.DOT;
          tok.literal = '.';
          break;
        case ':':
          tok.type = TokenType.COLON;
          tok.literal = ':';
          break;
        case '"':
        case "'":
          tok.type = TokenType.STRING;
          tok.literal = this.readString(this.ch);
          return tok; 
        default:
          if (this.isLetter(this.ch)) {
            let literal = this.readIdentifier();
            let type = KEYWORDS[literal] || TokenType.IDENTIFIER;
            tok.type = type;
            tok.literal = literal;
            return tok; 
          } 
          else if (this.isDigit(this.ch)) {
            tok.type = TokenType.NUMBER;
            tok.literal = this.readNumber();
            return tok; 
          } 
          else {
            throw new Error(`Syntax Error: Unexpected character '${this.ch}' at line ${this.line}, column ${this.column}`);
          }
      }

      this.readChar(); 
      return tok;
    }
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      TokenType,
      Lexer
    };
  } else {
    window.TokenType = TokenType;
    window.Lexer = Lexer;
  }
})();
