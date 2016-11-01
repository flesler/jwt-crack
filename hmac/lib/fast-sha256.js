const hmac = require('fast-sha256').hmac;

// TODO: Try the OO way to see if it avoids reinstantiation
module.exports = function (secret, content) {
  return hmac(secret, content).buffer; // .toString('base64');
};
