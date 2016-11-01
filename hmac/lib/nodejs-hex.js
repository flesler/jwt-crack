const crypto = require('crypto');

module.exports = function (secret, content) {
  return crypto.createHmac('sha256', secret)
    .update(content)
    .digest('hex')
    .replace('=', '');
};
