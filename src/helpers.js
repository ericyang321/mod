const fs = require('fs');

function output(dstPath, formattedJs) {
  fs.writeFileSync(dstPath, formattedJs);
}

module.exports = {
  output
}
