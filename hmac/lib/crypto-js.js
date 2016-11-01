const hmac = require('crypto-js/hmac-sha256');
const base64 = require('crypto-js/enc-base64');

module.exports = function (secret, content) {
  return base64.stringify(hmac(content, secret)).replace('=', '');
};
