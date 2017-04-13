const fs = require('fs');

exports.read = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return null;
  }
};

exports.write = (file, state) => {
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
};
