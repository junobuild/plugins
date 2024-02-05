const path = require('path');
const ts = require('typescript');
const babel = require('@babel/core');

module.exports = {
  process(sourceText, sourcePath, options) {
    if (sourcePath.endsWith('.ts') || sourcePath.endsWith('.tsx')) {
      // Define babelOptions with the necessary Babel configuration
      
      const babelOptions = {
        compilerOptions: {
          jsx: ts.JsxEmit.React,
          esModuleInterop: true,
          module: ts.ModuleKind.CommonJS,
        },
       "presets": ["ts-jest"], // ... your babel options here
      };
      return babel.transformAsync(sourceText, babelOptions).then((result) => ({
        code: result.code // Return the transformed code as a string
      }));
    }
    return {
      code: sourceText // Return the original source text for non-TypeScript files
    };
  },
};