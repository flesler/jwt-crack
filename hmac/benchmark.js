const libs = require('./lib');
const data = require('./data');

const TIMES = 500;

Object.keys(libs).forEach(benchmark);

function benchmark(lib) {
  const hmac = libs[lib];
  const start = process.hrtime();
  for (let i = 0; i < TIMES; i++) {
    hmac(data.secret, data.payload);
  }
  const arr = process.hrtime(start);
  const elapsed = Math.round((arr[0] * 1e3) + (arr[1] / 1e6));
  console.log(lib, '>', elapsed + 'ms');
}
