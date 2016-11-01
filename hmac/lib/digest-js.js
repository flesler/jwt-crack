const HMAC_SHA1 = require('digest-js').HMAC_SHA1;

module.exports = function (secret, content) {
  const hmac = new HMAC_SHA1();
  hmac.setKey(secret);
  return hmac.mac(content);// .toString('base64');
};
