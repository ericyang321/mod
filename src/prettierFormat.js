const prettier = require('prettier');

function prettierFormat(sourceFile) {
  const sourceJs = sourceFile.toString();
  const opts = {
    semi: false,
    trailingComma: 'es5',
    jsxBracketSameLine: true,
    singleQuote: true,
  };

  return prettier.format(sourceJs, opts);
}

module.exports = prettierFormat;
