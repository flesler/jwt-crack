exports.limit = (chars, maxLen) => Math.pow(chars.length, maxLen);

exports.normalizeSignature = (sig) => {
  // Change to the characters that result from Node's crypto library
  const str = sig.replace(/_/g, '/').replace(/-/g, '+');
  // Let Node normalize the padding with ='s
  return new Buffer(str, 'base64').toString('base64');
};
