const { convert } = require('decaffeinate');

function decaffinate(sourceFile) {
  return convert(sourceFile, {
    preferLet: false,
    useJSModules: true,
    looseJSModules: true,
  }).code;
}

module.exports = decaffinate;
