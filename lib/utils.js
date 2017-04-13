exports.limit = (chars, maxLen) => (
  Math.pow(chars.length, maxLen)
);

exports.normalizeSignature = (sig) => {
  // Change to the characters that result from Node's crypto library
  const str = sig.replace(/_/g, '/').replace(/-/g, '+');
  // Let Node normalize the padding with ='s
  return new Buffer(str, 'base64').toString('base64');
};

exports.copy = (dest, ...args) => {
  args.forEach((src) => {
    for (const key in src) {
      dest[key] = src[key];
    }
  });
  return dest;
};

exports.now = () => (
  (new Date()).toISOString().split(/[T.]/, 2).join(' ')
);

exports.log = (...args) => {
  console.log(exports.now(), '>', ...args);
};

exports.elapsedMinutes = () => (
  (process.uptime() / 60).toFixed(1)
);

// Very basic validation, can be improved
exports.isValidJWT = token => (
  token && token.split('.').length === 3
);

exports.values = obj => (
  Object.keys(obj).map(key => obj[key])
);

exports.pluck = (src, keys) => {
  const data = {};
  keys.forEach((key) => { data[key] = src[key]; });
  return data;
};
