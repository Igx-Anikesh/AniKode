/**
 * AniKode In-Browser TypeScript Code Generator
 */

export class CodeGenerator {
  scopes: Set<string>[] = [new Set()];
  currentFunctionName: string | null = null;

  pushScope() {
    this.scopes.push(new Set());
  }

  popScope() {
    this.scopes.pop();
  }

  isDeclared(name: string): boolean {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name)) {
        return true;
      }
    }
    return false;
  }

  declare(name: string) {
    this.scopes[this.scopes.length - 1].add(name);
  }

  generate(node: any): string {
    if (!node) return '';
    if (node.disabled === true) return '';

    switch (node.type) {
      case 'Program':
        this.scopes = [new Set()];
        this.currentFunctionName = null;
        return node.statements
          .map((stmt: any) => this.generate(stmt))
          .filter((line: string) => line !== '')
          .join('\n');

      case 'VarDeclaration':
        if (!this.isDeclared(node.name)) {
          this.declare(node.name);
          return `let ${node.name} = ${this.generate(node.value)};`;
        } else {
          return `${node.name} = ${this.generate(node.value)};`;
        }

      case 'Assignment':
        if (node.left && node.left.type === 'MemberExpression') {
          return `${this.generate(node.left)} = ${this.generate(node.value)};`;
        }
        if (!this.isDeclared(node.name)) {
          this.declare(node.name);
          return `let ${node.name} = ${this.generate(node.value)};`;
        } else {
          return `${node.name} = ${this.generate(node.value)};`;
        }

      case 'SayOutStatement':
        const exprs = node.expressions || [node.expression];
        return `console.log(${exprs.map((e: any) => this.generate(e)).join(', ')});`;

      case 'SayInExpression':
        return `__say_in(${node.prompt ? this.generate(node.prompt) : '""'})`;

      case 'ExpressionStatement':
        return `${this.generate(node.expression)};`;

      case 'IfStatement':
        let ifCode = `if (${this.generate(node.condition)}) {\n`;
        this.pushScope();
        ifCode += this.generate(node.consequence);
        this.popScope();
        ifCode += '\n}';

        if (node.alternative) {
          ifCode += ' else ';
          if (node.alternative.type === 'IfStatement') {
            ifCode += this.generate(node.alternative);
          } else {
            ifCode += '{\n';
            this.pushScope();
            ifCode += this.generate(node.alternative);
            this.popScope();
            ifCode += '\n}';
          }
        }
        return ifCode;

      case 'LoopStatement':
        const startVal = this.generate(node.start);
        const endVal = this.generate(node.end);
        const iter = node.iterator;

        this.pushScope();
        this.declare(iter);
        const bodyCode = this.generate(node.body);
        this.popScope();

        return `for (let ${iter} = ${startVal}; (${startVal} <= ${endVal}) ? ${iter} <= ${endVal} : ${iter} >= ${endVal}; (${startVal} <= ${endVal}) ? ${iter}++ : ${iter}--) {\n${bodyCode}\n}`;

      case 'EachStatement':
        const collVal = this.generate(node.collection);
        const iterator = node.iterator;

        this.pushScope();
        this.declare(iterator);
        const eachBody = this.generate(node.body);
        this.popScope();

        return `for (const ${iterator} of (${collVal})) {\n${eachBody}\n}`;

      case 'FunctionDeclaration':
        const oldFnName = this.currentFunctionName;
        this.currentFunctionName = node.name;

        this.pushScope();
        node.parameters.forEach((p: string) => this.declare(p));
        const fnBody = this.generate(node.body);
        this.popScope();

        this.currentFunctionName = oldFnName;
        return `function ${node.name}(${node.parameters.join(', ')}) {\n${fnBody}\n}`;

      case 'ReturnStatement':
        return `return ${node.value ? this.generate(node.value) : 'null'};`;

      case 'CallExpression':
        const callFn = node.function;
        if (callFn.type === 'MemberExpression') {
          const obj = this.generate(callFn.object);
          const prop = callFn.property.value;
          const argsList = node.arguments.map((arg: any) => this.generate(arg)).join(', ');

          if (obj === 'file') {
            if (prop === 'read') return `__file_read(${argsList})`;
            if (prop === 'write') return `__file_write(${argsList})`;
          }

          if (obj !== 'math') {
            const memberMethods: Record<string, () => string> = {
              'len': () => `((o) => { if (typeof o === 'string' || Array.isArray(o)) return o.length; if (o && typeof o === 'object') return Object.keys(o).length; return 0; })(${obj})`,
              'has': () => `((o, v) => { if (typeof o === 'string' || Array.isArray(o)) return o.includes(v); if (o && typeof o === 'object') return v in o; return false; })(${obj}, ${argsList})`,
              'remove': () => `((o, v) => { if (Array.isArray(o)) { let idx = o.indexOf(v); if (idx !== -1) { o.splice(idx, 1); return true; } return false; } else if (o && typeof o === 'object') { let exists = v in o; delete o[v]; return exists; } return false; })(${obj}, ${argsList})`,
              'clear': () => `((o) => { if (Array.isArray(o)) o.length = 0; else if (o && typeof o === 'object') { for (let k in o) delete o[k]; } return o; })(${obj})`,
              'empty': () => `((o) => { if (typeof o === 'string' || Array.isArray(o)) return o.length === 0; if (o && typeof o === 'object') return Object.keys(o).length === 0; return true; })(${obj})`,
              'add': () => `(${obj}.push(${argsList}), ${obj})`,
              'pop': () => node.arguments.length > 0 ? `${obj}.splice(${argsList}, 1)[0]` : `${obj}.pop()`,
              'upper': () => `(${obj}).toUpperCase()`,
              'lower': () => `(${obj}).toLowerCase()`,
              'trim': () => `(${obj}).trim()`,
              'split': () => `(${obj}).split(${argsList})`,
              'join': () => `(${obj}).join(${argsList})`,
              'keys': () => `Object.keys(${obj})`,
              'values': () => `Object.values(${obj})`
            };

            if (memberMethods[prop]) {
              return memberMethods[prop]();
            }
          }
        }

        const callName = this.generate(node.function);
        if (callName === 'all') {
          return `(() => { let c = ${this.generate(node.arguments[0])}; if (!Array.isArray(c)) throw new TypeError("Built-in all() requires a List"); return c.every(x => !!x); })()`;
        }
        if (callName === 'any') {
          return `(() => { let c = ${this.generate(node.arguments[0])}; if (!Array.isArray(c)) throw new TypeError("Built-in any() requires a List"); return c.some(x => !!x); })()`;
        }

        const callArgs = node.arguments.map((arg: any) => this.generate(arg)).join(', ');
        return `${callName}(${callArgs})`;

      case 'RecurseExpression':
        if (!this.currentFunctionName) {
          throw new Error("Syntax Error: 'recurse' keyword can only be used inside a function body.");
        }
        const recurseArgs = node.arguments.map((arg: any) => this.generate(arg)).join(', ');
        return `${this.currentFunctionName}(${recurseArgs})`;

      case 'BlockStatement':
        return node.statements
          .map((stmt: any) => '  ' + this.generate(stmt))
          .filter((line: string) => line.trim() !== '')
          .join('\n');

      case 'InfixExpression':
        const left = this.generate(node.left);
        const right = this.generate(node.right);
        const op = node.operator;

        if (op === 'and') return `(Boolean(${left}) && Boolean(${right}))`;
        if (op === 'or') return `(Boolean(${left}) || Boolean(${right}))`;
        if (op === 'xor') return `((!${left} && Boolean(${right})) || (Boolean(${left}) && !${right}))`;
        if (op === 'nand') return `(!(Boolean(${left}) && Boolean(${right})))`;
        if (op === 'nor') return `(!(Boolean(${left}) || Boolean(${right})))`;
        if (op === 'xnor') return `(!((!${left} && Boolean(${right})) || (Boolean(${left}) && !${right})))`;
        if (op === 'implies') return `(!${left} || Boolean(${right}))`;
        if (op === 'iff') return `(Boolean(${left}) === Boolean(${right}))`;
        if (op === '%') return `(${left} % ${right})`;
        return `(${left} ${op} ${right})`;

      case 'PrefixExpression':
        if (node.operator === 'not') {
          return `!Boolean(${this.generate(node.right)})`;
        }
        return `(${node.operator}${this.generate(node.right)})`;

      case 'IndexExpression':
        return `${this.generate(node.left)}[${this.generate(node.index)}]`;

      case 'Identifier':
        return node.value;

      case 'NumberLiteral':
        return String(node.value);

      case 'StringLiteral':
        return JSON.stringify(node.value);

      case 'BooleanLiteral':
        return node.value ? 'true' : 'false';

      case 'NullLiteral':
        return 'null';

      case 'ArrayLiteral':
      case 'ListLiteral':
        return `[${node.elements.map((el: any) => this.generate(el)).join(', ')}]`;

      case 'DictionaryLiteral':
        const pairs = node.pairs.map((p: any) => `${JSON.stringify(p.key)}: ${this.generate(p.value)}`).join(', ');
        return `{ ${pairs} }`;

      case 'TryStatement':
        let jsTry = `try {\n${this.generate(node.tryBlock)}\n}`;
        if (node.catchBlocks && node.catchBlocks.length > 0) {
          const cb = node.catchBlocks[0];
          jsTry += ` catch (${cb.errorVariable}) {\n${this.generate(cb.body)}\n}`;
        } else {
          jsTry += ` catch (error) {}`;
        }
        if (node.finallyBlock) {
          jsTry += ` finally {\n${this.generate(node.finallyBlock)}\n}`;
        }
        return jsTry;

      case 'ThrowStatement':
        return `throw new Error(${this.generate(node.value)});`;

      case 'MemberExpression':
        const objName = this.generate(node.object);
        const propName = node.property.value;
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
              return `Math.${propName}`;
          }
        }
        return `${objName}.${propName}`;

      default:
        return '';
    }
  }
}
