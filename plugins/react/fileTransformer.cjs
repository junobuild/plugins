const babel = require('@babel/core');
const  babelOptions  = require('./babel-config.ts');

module.exports = {
  process(src, filename, options) {
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
      return babel.transformAsync(src, babelOptions)
      .then((result) => result.code);
    }
    return {
      code: `module.exports = ${JSON.stringify(filename.basename(src))};`,
    };
  }
};