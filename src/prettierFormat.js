const prettier = require('prettier');

function formatPrettier(sourcePath) {
  const sourceJs = fs.readFileSync(sourcePath).toString();
  const opts = {
    semi: false,
    trailingComma: 'es5',
    jsxBracketSameLine: true,
    singleQuote: true,
  };

  prettier.format(sourceJs, opts);
}

module.exports = formatPrettier;
