/**
 * AniKode Code Generator - UMD wrapped
 */

(function() {
  class CodeGenerator {
    constructor() {
      // Scope Tracking:
      // To support your option C variable style (e.g. z = 10 with no let/set keyword),
      // we keep a stack of "scopes". Each scope is a Set containing the names of declared variables.
      // If a variable is assigned for the first time, we generate 'let z = 10;'.
      // If it was already declared, we generate 'z = 10;'.
      this.scopes = [new Set()]; // Starts with the global scope (index 0)
      this.currentFunctionName = null; // Tracks the name of the function we are currently compiling
    }

    // Push a new local scope (e.g., when entering an 'if' block)
    pushScope() {
      this.scopes.push(new Set());
    }

    // Pop the innermost scope when leaving a block
    popScope() {
      this.scopes.pop();
    }

    // Checks if a variable has already been declared in the current or outer scopes
    isDeclared(name) {
      for (let i = this.scopes.length - 1; i >= 0; i--) {
        if (this.scopes[i].has(name)) {
          return true;
        }
      }
      return false;
    }

    // Registers a variable name in the current active scope
    declare(name) {
      this.scopes[this.scopes.length - 1].add(name);
    }

    // Main recursive function to generate code for any AST Node
    generate(node) {
      if (!node) return '';
      if (node.disabled === true) return ''; // Bypass disabled AST nodes

      switch (node.type) {
        case 'Program':
          this.scopes = [new Set()];
          this.currentFunctionName = null;
          // A program is just a list of statements executed one after another.
          // Filter out empty strings (disabled statements) to keep compiled code clean.
          return node.statements
            .map(stmt => this.generate(stmt))
            .filter(line => line !== '')
            .join('\n');

        case 'VarDeclaration':
          // Explicit declaration: let x = 5 or set x to 5
          this.declare(node.name);
          return `let ${node.name} = ${this.generate(node.value)};`;

        case 'Assignment':
          // Implicit declaration or update: x = 5
          if (node.left) {
            // Complex assignment (e.g. user.score = 98 or list[0] = 5)
            return `${this.generate(node.left)} = ${this.generate(node.value)};`;
          }
          // If x is not declared yet, we declare it using 'let'. Otherwise, we just re-assign it.
          if (!this.isDeclared(node.name)) {
            this.declare(node.name);
            return `let ${node.name} = ${this.generate(node.value)};`;
          } else {
            return `${node.name} = ${this.generate(node.value)};`;
          }

        case 'SayOutStatement':
          // say.out("User", name, "is", age) -> console.log("User", name, "is", age);
          let exprs = node.expressions || [node.expression];
          let genExprs = exprs.map(e => this.generate(e)).join(', ');
          return `console.log(${genExprs});`;

        case 'SayInExpression':
          // say.in("Prompt") -> __say_in("Prompt")
          return `__say_in(${node.prompt ? this.generate(node.prompt) : '""'})`;

        case 'ExpressionStatement':
          // Standalone expression: x + y;
          return `${this.generate(node.expression)};`;

        case 'IfStatement':
          // Generate JS if/else structure
          let code = `if (${this.generate(node.condition)}) {\n`;
          
          this.pushScope(); // Enter consequence block scope
          code += this.generate(node.consequence);
          this.popScope();  // Exit consequence scope
          
          code += '\n}';

          if (node.alternative) {
            code += ' else ';
            // If the alternative is another 'if' statement (else if)
            if (node.alternative.type === 'IfStatement') {
              code += this.generate(node.alternative);
            } else {
              // Standard else block
              code += '{\n';
              this.pushScope(); // Enter alternative block scope
              code += this.generate(node.alternative);
              this.popScope();  // Exit alternative scope
              code += '\n}';
            }
          }
          return code;

        case 'LoopStatement':
          // loop i from start to end { body } -> JS for loop
          let startVal = this.generate(node.start);
          let endVal = this.generate(node.end);
          let iter = node.iterator;

          this.pushScope(); // Loop body creates its own scope
          this.declare(iter); // Declare the iterator variable inside loop scope
          let bodyCode = this.generate(node.body);
          this.popScope();

          // We wrap in a block {} in JS so __start and __end variables do not leak outside.
          // It automatically counts up (iter++) or down (iter--) depending on start <= end.
          return `{\n  let __start = ${startVal};\n  let __end = ${endVal};\n  for (let ${iter} = __start; __start <= __end ? ${iter} <= __end : ${iter} >= __end; __start <= __end ? ${iter}++ : ${iter}--) {\n${bodyCode}\n  }\n}`;

        case 'FunctionDeclaration':
          // fn myFunc(a, b) { body } -> function myFunc(a, b) { body }
          let oldFnName = this.currentFunctionName;
          this.currentFunctionName = node.name; // Remember name for recursion

          this.pushScope(); // Function body gets its own scope
          node.parameters.forEach(p => this.declare(p)); // Declare parameters in scope
          let fnBody = this.generate(node.body);
          this.popScope();

          this.currentFunctionName = oldFnName; // Restore outer function name context

          let paramList = node.parameters.join(', ');
          return `function ${node.name}(${paramList}) {\n${fnBody}\n}`;

        case 'ReturnStatement':
          // return value -> return value;
          return `return ${node.value ? this.generate(node.value) : ''};`;

        case 'CallExpression':
          // myFunc(a, b) -> myFunc(a, b)
          let callFn = node.function;
          if (callFn.type === 'MemberExpression') {
            let obj = this.generate(callFn.object);
            let prop = callFn.property.value;
            let argsList = node.arguments.map(arg => this.generate(arg)).join(', ');
            
            // Check if it's file namespace
            if (obj === 'file') {
              if (prop === 'read') {
                return `__file_read(${argsList})`;
              }
              if (prop === 'write') {
                return `__file_write(${argsList})`;
              }
            }
            
            if (obj !== 'math') {
              // Check if it's a member method call (List, String, or Dictionary)
              let memberMethods = {
                // Polymorphic length
                'len': () => `((o) => { if (typeof o === 'string' || Array.isArray(o)) return o.length; if (o && typeof o === 'object') return Object.keys(o).length; return 0; })(${obj})`,
                // Polymorphic check
                'has': () => `((o, v) => { if (typeof o === 'string' || Array.isArray(o)) return o.includes(v); if (o && typeof o === 'object') return v in o; return false; })(${obj}, ${argsList})`,
                // Polymorphic remove
                'remove': () => `((o, v) => { if (Array.isArray(o)) { let idx = o.indexOf(v); if (idx !== -1) { o.splice(idx, 1); return true; } return false; } else if (o && typeof o === 'object') { let exists = v in o; delete o[v]; return exists; } return false; })(${obj}, ${argsList})`,
                // Polymorphic clear
                'clear': () => `((o) => { if (Array.isArray(o)) o.length = 0; else if (o && typeof o === 'object') { for (let k in o) delete o[k]; } return o; })(${obj})`,
                // Polymorphic empty
                'empty': () => `((o) => { if (typeof o === 'string' || Array.isArray(o)) return o.length === 0; if (o && typeof o === 'object') return Object.keys(o).length === 0; return true; })(${obj})`,
                // Polymorphic replace
                'replace': () => {
                  let parts = node.arguments.map(arg => this.generate(arg));
                  return `((o, oldVal, newVal) => { if (typeof o === 'string') return o.split(oldVal).join(newVal); if (Array.isArray(o)) { let count = 0; for (let i = 0; i < o.length; i++) { if (o[i] === oldVal) { o[i] = newVal; count++; } } return count; } return 0; })(${obj}, ${parts[0]}, ${parts[1]})`;
                },
                // Polymorphic reverse
                'reverse': () => `((o) => { if (typeof o === 'string') return [...o].reverse().join(''); if (Array.isArray(o)) return o.slice().reverse(); return o; })(${obj})`,
                // Polymorphic count
                'count': () => `((o, v) => { if (typeof o === 'string') { if (!v) return 0; return o.split(v).length - 1; } if (Array.isArray(o)) { return o.filter(x => x === v).length; } return 0; })(${obj}, ${argsList})`,

                // List specific methods
                'add': () => `(${obj}.push(${argsList}), ${obj})`,
                'insert': () => {
                  let parts = node.arguments.map(arg => this.generate(arg));
                  return `(${obj}.splice(${parts[0]}, 0, ${parts[1]}), ${obj})`;
                },
                'removeAt': () => `${obj}.splice(${argsList}, 1)[0]`,
                'removeIf': () => `(function(arr, v) { let init = arr.length; for(let i = arr.length - 1; i >= 0; i--) { if(arr[i] === v) arr.splice(i, 1); } return arr.length !== init; })(${obj}, ${argsList})`,
                'pop': () => node.arguments.length > 0 ? `${obj}.splice(${argsList}, 1)[0]` : `${obj}.pop()`,
                'find': () => `((o, v) => { if (typeof o === 'string') return o.indexOf(v); if (Array.isArray(o)) return o.indexOf(v); return -1; })(${obj}, ${argsList})`,
                'first': () => `${obj}[0]`,
                'last': () => `${obj}[${obj}.length - 1]`,
                'get': () => `${obj}[${argsList}]`,
                'set': () => {
                  let parts = node.arguments.map(arg => this.generate(arg));
                  return `(${obj}[${parts[0]}] = ${parts[1]}, ${obj})`;
                },
                'copy': () => `[...${obj}]`,
                'slice': () => `((o, s, e) => { if (typeof o === 'string') { let end = e === undefined ? o.length : e; if (s < 0 || s > o.length || end < s || end > o.length) throw new Error("IndexError: Index out of bounds"); return o.slice(s, end); } if (Array.isArray(o)) return o.slice(s, e); throw new TypeError("Method .slice() requires List or String"); })(${obj}, ${argsList})`,
                'sort': () => `${obj}.slice().sort((a,b) => (a>b?1:a<b?-1:0))`,
                'shuffle': () => `${obj}.slice().sort(() => Math.random() - 0.5)`,
                'unique': () => `[...new Set(${obj})]`,
                'swap': () => {
                  let parts = node.arguments.map(arg => this.generate(arg));
                  return `(function(arr, a, b) { let tmp = arr[a]; arr[a] = arr[b]; arr[b] = tmp; return arr; })(${obj}, ${parts[0]}, ${parts[1]})`;
                },
                'join': () => `${obj}.join(${argsList})`,
                'random': () => `${obj}[Math.floor(Math.random() * ${obj}.length)]`,

                // String specific methods
                'upper': () => `((s) => { if (typeof s !== 'string') throw new TypeError("Method .upper() requires String"); return s.toUpperCase(); })(${obj})`,
                'lower': () => `((s) => { if (typeof s !== 'string') throw new TypeError("Method .lower() requires String"); return s.toLowerCase(); })(${obj})`,
                'trim': () => `((s) => { if (typeof s !== 'string') throw new TypeError("Method .trim() requires String"); return s.trim(); })(${obj})`,
                'split': () => `((s, sep) => { if (typeof s !== 'string') throw new TypeError("Method .split() requires String"); return s.split(sep); })(${obj}, ${argsList})`,
                'replaceFirst': () => `((s, oldVal, newVal) => { if (typeof s !== 'string') throw new TypeError("Method .replaceFirst() requires String"); return s.replace(oldVal, newVal); })(${obj}, ${argsList})`,
                'char': () => `((s, i) => { if (typeof s !== 'string') throw new TypeError("Method .char() requires String"); if (i < 0 || i >= s.length) throw new Error("IndexError: Index out of bounds"); return s.charAt(i); })(${obj}, ${argsList})`,
                'repeat': () => `((s, c) => { if (typeof s !== 'string') throw new TypeError("Method .repeat() requires String"); if (c < 0) throw new RangeError("RangeError: Repeat count must be non-negative"); return s.repeat(c); })(${obj}, ${argsList})`,
                'startsWith': () => `((s, t) => { if (typeof s !== 'string') throw new TypeError("Method .startsWith() requires String"); return s.startsWith(t); })(${obj}, ${argsList})`,
                'endsWith': () => `((s, t) => { if (typeof s !== 'string') throw new TypeError("Method .endsWith() requires String"); return s.endsWith(t); })(${obj}, ${argsList})`,

                // Dictionary specific methods
                'keys': () => `((o) => { if (!o || typeof o !== 'object' || Array.isArray(o)) throw new TypeError("Method .keys() requires Dictionary"); return Object.keys(o); })(${obj})`,
                'values': () => `((o) => { if (!o || typeof o !== 'object' || Array.isArray(o)) throw new TypeError("Method .values() requires Dictionary"); return Object.values(o); })(${obj})`,
              };

              if (memberMethods[prop]) {
                return memberMethods[prop]();
              }
            }
          }
          let callName = this.generate(node.function);
          if (callName === 'all') {
            return `(() => { let c = ${this.generate(node.arguments[0])}; if (!Array.isArray(c)) throw new TypeError("Built-in function all() requires a List"); return c.every(x => !!x); })()`;
          }
          if (callName === 'any') {
            return `(() => { let c = ${this.generate(node.arguments[0])}; if (!Array.isArray(c)) throw new TypeError("Built-in function any() requires a List"); return c.some(x => !!x); })()`;
          }
          let callArgs = node.arguments.map(arg => this.generate(arg)).join(', ');
          return `${callName}(${callArgs})`;

        case 'RecurseExpression':
          // recurse(size - 1) -> currentFunctionName(size - 1)
          if (!this.currentFunctionName) {
            throw new Error("Compilation Error: The 'recurse' keyword can only be used inside a function declaration.");
          }
          let recArgs = node.arguments.map(arg => this.generate(arg)).join(', ');
          return `${this.currentFunctionName}(${recArgs})`;

        case 'EachStatement':
          // each item in collection { body } -> JS for (let item of collection) { body }
          let collVal = this.generate(node.collection);
          let iterator = node.iterator;

          this.pushScope(); // Enter each loop block scope
          this.declare(iterator); // Declare iterator variable in this scope
          let eachBody = this.generate(node.body);
          this.popScope(); // Exit loop block scope

          return `for (let ${iterator} of ${collVal}) {\n${eachBody}\n}`;

        case 'BlockStatement':
          // Indent statements inside code blocks for readability.
          // Filter out empty lines (disabled statements).
          return node.statements
            .map(stmt => this.generate(stmt))
            .filter(line => line !== '')
            .map(line => '  ' + line)
            .join('\n');

        case 'Identifier':
          // Variable names print as-is
          return node.value;

        case 'NumberLiteral':
          // Numbers print as-is (e.g. 3.14)
          return String(node.value);

        case 'StringLiteral':
          // Wrap string literals in JSON double quotes for JS compatibility
          return JSON.stringify(node.value);

        case 'ArrayLiteral':
          // [1, 2, 3] -> [1, 2, 3]
          let elems = node.elements.map(el => this.generate(el)).join(', ');
          return `[${elems}]`;

        case 'BooleanLiteral':
          // true/false prints as-is
          return String(node.value);

        case 'NullLiteral':
          // null prints as-is
          return 'null';

        case 'MemberExpression':
          let objName = this.generate(node.object);
          let propName = node.property.value;
          if (objName === 'math') {
            switch (propName) {
              case 'pi': return 'Math.PI';
              case 'e': return 'Math.E';
              case 'abs': return 'Math.abs';
              case 'min': return 'Math.min';
              case 'max': return 'Math.max';
              case 'pow': return 'Math.pow';
              case 'sqrt': return 'Math.sqrt';
              case 'floor': return 'Math.floor';
              case 'ceil': return 'Math.ceil';
              case 'round': return 'Math.round';
              case 'sin': return 'Math.sin';
              case 'cos': return 'Math.cos';
              case 'tan': return 'Math.tan';
              case 'log': return 'Math.log';
              case 'log10': return 'Math.log10';
              case 'exp': return 'Math.exp';
              case 'clamp': return '((val, min, max) => Math.min(Math.max(val, min), max))';
              case 'random': return '((min, max) => { if (min === undefined) return Math.random(); if (Number.isInteger(min) && Number.isInteger(max)) return Math.floor(Math.random() * (max - min + 1)) + min; return Math.random() * (max - min) + min; })';
              default:
                throw new Error(`Unknown property or method '${propName}' in math namespace`);
            }
          }
          return `${objName}.${propName}`;

        case 'AndExpression':
          return `(() => { let l = ${this.generate(node.left)}; if (typeof l !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); if (!l) return false; let r = ${this.generate(node.right)}; if (typeof r !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return r; })()`;

        case 'OrExpression':
          return `(() => { let l = ${this.generate(node.left)}; if (typeof l !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); if (l) return true; let r = ${this.generate(node.right)}; if (typeof r !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return r; })()`;

        case 'NotExpression':
          return `(() => { let v = ${this.generate(node.right)}; if (typeof v !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return !v; })()`;

        case 'XorExpression':
          return `(() => { let l = ${this.generate(node.left)}; if (typeof l !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); let r = ${this.generate(node.right)}; if (typeof r !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return l !== r; })()`;

        case 'NandExpression':
          return `(() => { let l = ${this.generate(node.left)}; if (typeof l !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); if (!l) return true; let r = ${this.generate(node.right)}; if (typeof r !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return !r; })()`;

        case 'NorExpression':
          return `(() => { let l = ${this.generate(node.left)}; if (typeof l !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); if (l) return false; let r = ${this.generate(node.right)}; if (typeof r !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return !r; })()`;

        case 'XnorExpression':
          return `(() => { let l = ${this.generate(node.left)}; if (typeof l !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); let r = ${this.generate(node.right)}; if (typeof r !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return l === r; })()`;

        case 'ImpliesExpression':
          return `(() => { let l = ${this.generate(node.left)}; if (typeof l !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); if (!l) return true; let r = ${this.generate(node.right)}; if (typeof r !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return r; })()`;

        case 'IffExpression':
          return `(() => { let l = ${this.generate(node.left)}; if (typeof l !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); let r = ${this.generate(node.right)}; if (typeof r !== 'boolean') throw new TypeError("Logical operator requires Boolean operands"); return l === r; })()`;

        case 'DictionaryLiteral':
          let pairs = node.pairs.map(p => `${JSON.stringify(p.key)}: ${this.generate(p.value)}`).join(', ');
          return `{ ${pairs} }`;

        case 'TryStatement':
          let tryCode = `try {\n${this.generate(node.tryBlock)}\n}`;
          let catchCode = '';
          if (node.catchBlocks.length > 0) {
            catchCode += ` catch (__err) {\n`;
            catchCode += `  let __error = (__err instanceof Error) ? { message: __err.message, type: __err.name || 'RuntimeError', line: __err.line || 0 } : { message: String(__err), type: 'RuntimeError', line: 0 };\n`;
            
            let handled = false;
            node.catchBlocks.forEach((cb, idx) => {
              let errorVar = cb.errorVar;
              this.pushScope();
              this.declare(errorVar);
              let body = this.generate(cb.body);
              this.popScope();

              let cond = `__error.type === ${JSON.stringify(cb.errorType)}`;
              if (cb.errorType === 'Error') {
                if (idx === 0) {
                  catchCode += `  {\n  let ${errorVar} = __error;\n${body}\n  }\n`;
                  handled = true;
                } else {
                  catchCode += `  else {\n  let ${errorVar} = __error;\n${body}\n  }\n`;
                }
              } else {
                if (idx === 0) {
                  catchCode += `  if (${cond}) {\n  let ${errorVar} = __error;\n${body}\n  }\n`;
                } else {
                  catchCode += `  else if (${cond}) {\n  let ${errorVar} = __error;\n${body}\n  }\n`;
                }
              }
            });
            if (!handled) {
              catchCode += `  else { throw __err; }\n`;
            }
            catchCode += `}`;
          }
          let finallyCode = '';
          if (node.finallyBlock) {
            finallyCode += ` finally {\n${this.generate(node.finallyBlock)}\n}`;
          }
          return tryCode + catchCode + finallyCode;

        case 'ThrowStatement':
          return `throw ${this.generate(node.value)};`;

        case 'ErrorExpression':
          return `(function() { let e = new Error(${this.generate(node.message)}); e.name = "Error"; return e; })()`;

        case 'PrefixExpression':
          // Prefix operators: (-x)
          return `(${node.operator}${this.generate(node.right)})`;

        case 'InfixExpression':
          // Infix math/comparison operators: (left + right)
          return `(${this.generate(node.left)} ${node.operator} ${this.generate(node.right)})`;

        default:
          throw new Error(`CodeGen Error: Unknown AST node type: ${node.type}`);
      }
    }
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CodeGenerator
    };
  } else {
    window.CodeGenerator = CodeGenerator;
  }
})();
