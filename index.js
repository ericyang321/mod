const fs = require('fs');
const yargs = require('yargs');
const path = require('path');

const transformPropTypes = require('./src/transformPropTypes');
const prettierFormat = require('./src/prettierFormat');
const decaffinate = require('./src/decaffinator');
const { output } = require('./src/helpers');

function convertToDestPath(sourcePath) {
  const pathObj = path.parse(sourcePath);
  return pathObj.dir + '/' + pathObj.name + '.jsx';
}

function convertSourceFile(sourceFile) {
  const decaffinatedJs = decaffinate(sourceFile);
  const prettyJs = prettierFormat(decaffinatedJs);

  return prettyJs;
}

function executeConversion(sourcePath) {
  if (!sourcePath) return;
  const sourceFile = fs.readFileSync(sourcePath).toString();

  const destPath = convertToDestPath(sourcePath);
  const formattedJs = convertSourceFile(sourceFile);

  output(destPath, formattedJs);
}

const cliArgs = yargs
  .usage('Usage: $0 <src>')
  .required(1, 'file source path is required').argv;

const srcPath = cliArgs._[0];

executeConversion(srcPath);
