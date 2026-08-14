/**
 * AniKode Compiler Bridge for Web
 */

import { Lexer } from './lexer';
import { Parser } from './parser';
import { CodeGenerator } from './codegen';

export interface ExecutionResult {
  success: boolean;
  output: string[];
  errors: string[];
  executionTimeMs: number;
}

export function compileAndExecute(
  sourceCode: string,
  onSayIn?: (promptText: string) => Promise<string> | string
): ExecutionResult {
  const output: string[] = [];
  const errors: string[] = [];
  const startTime = performance.now();

  try {
    const lexer = new Lexer(sourceCode);
    const parser = new Parser(lexer);
    const ast = parser.parseProgram();

    if (parser.errors.length > 0) {
      return {
        success: false,
        output: [],
        errors: parser.errors,
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100
      };
    }

    const codegen = new CodeGenerator();
    const compiledJs = codegen.generate(ast);

    const customConsole = {
      log: (...args: any[]) => {
        const text = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
        output.push(text);
      }
    };

    const customSayIn = (promptText: string) => {
      if (typeof window !== 'undefined') {
        const res = window.prompt(promptText);
        return res !== null ? res : '';
      }
      return '';
    };

    const customFileRead = (filePath: string) => {
      throw new Error(`FileError: file.read("${filePath}") is not available in the web sandbox. Use desktop CLI ('anikode run') for file operations.`);
    };

    const customFileWrite = (filePath: string) => {
      throw new Error(`FileError: file.write("${filePath}") is not available in the web sandbox. Use desktop CLI ('anikode run') for file operations.`);
    };

    const runner = new Function(
      'console', '__say_in', '__file_read', '__file_write', 'Math', 'int', 'float', 'str', 'window', 'document',
      compiledJs
    );

    runner(
      customConsole,
      customSayIn,
      customFileRead,
      customFileWrite,
      Math,
      (x: any) => parseInt(x, 10),
      (x: any) => parseFloat(x),
      (x: any) => String(x),
      undefined,
      undefined
    );

    return {
      success: true,
      output,
      errors: [],
      executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100
    };
  } catch (err: any) {
    return {
      success: false,
      output,
      errors: [err.message || 'Execution failed'],
      executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100
    };
  }
}
