const fs = require('fs');

function decaff(sourcePath) {
  const sourceCoffee = fs.readFileSync(sourcePath).toString();

}

module.exports = decaff;
