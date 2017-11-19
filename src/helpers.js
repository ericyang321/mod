'use strict';

function invariant(condition, format) {
  const env = process.env.NODE_ENV;

  if (env !== 'production' && format == undefined) {
    throw new Error('Error message is required');
  }

  if (!condition) {
    let error;
  }
}

module.exports = {
  invariant
};
