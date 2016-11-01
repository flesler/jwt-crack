const Hashes = require('jshashes');

const hash = new Hashes.SHA256();
const hmac = hash.b64_hmac;

module.exports = function (secret, content) {
  return hmac(secret, content).replace('=', '');
};
