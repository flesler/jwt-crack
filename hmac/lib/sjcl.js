const sjcl = require('sjcl');

const HMAC = sjcl.misc.hmac;
const SHA256 = sjcl.hash.sha256;
const base64 = sjcl.codec.base64.fromBits;

module.exports = function (secret, content) {
  const hmac = new HMAC(secret, SHA256);
  return base64(hmac.mac(content), true);
};
