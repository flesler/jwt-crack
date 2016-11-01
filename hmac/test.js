// Some don't match, but they already take longer so there's no point
const libs = require('./lib');
const data = require('./data');

Object.keys(libs).forEach(test);

function test(lib) {
  console.log(lib + '>');
  if (check(lib, 1)) {
    check(lib, 2);
  }
}

function check(lib, num) {
  const hmac = libs[lib];
  const res = hmac(data.secret, data.payload);
  const ok = res === data.hmac;
  console.log(' ', '#' + num, ok ? 'OK' : 'BAD', res);
  return ok;
}
