const hash = require('hash.js');

module.exports = function (secret, content) {
  const hmac = hash.hmac(hash.sha256, secret);
  // base64 not supported
  let res = hmac.update(content).digest('hex');
  res = (new Buffer(res, 'hex')).toString('base64');
  return res;
};
