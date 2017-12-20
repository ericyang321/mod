const fs = require('fs');
const yargs = require('yargs');
const path = require('path');

const transformPropTypes = require('./src/transformPropTypes');
const prettierFormat = require('./src/prettierFormat');
const decaffinator = require('./src/decaffinator');

function convertToDestPath(sourcePath, destPath) {
  const pathObj = path.parse(sourcePath);
  return pathObj.dir + '/' + pathObj.name + '.jsx';
}

function convertSourceFile(sourcePath) {}

function executeConversion(sourcePath) {
  const destPath = convertToDestPath(sourcePath);
  const formattedJs = convertSourceFile(sourcePath, destPath);

  fs.writeFileSync(destPath, formattedJs);
}

const cliArgs = yargs
  .usage('Usage: $0 <src>')
  .required(1, 'file source path is required')
  .argv;

const srcPath = cliArgs._[0];

if (srcPath) {
  executeConversion(srcPath);
}
