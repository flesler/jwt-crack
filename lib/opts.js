const opts = require('commander');
const os = require('os');
const pkg = require('../package.json');

// Ordered by frequency http://letterfrequency.org/ and discarded some very unusual
const DEFAULT_CHARS = 'etaoinsrhldcumfpgwybv0123456789kxjqz _-.ETAOINSRHLDCUMFPGWYBVKXJQZ';

opts
  .version(pkg.version)
  .usage('<jwt> [options]')
  .option('-c, --chars <v>', 'The alphabet to use to brute-force secrets', String, DEFAULT_CHARS)
  .option('-m, --maxlen <n>', 'The maximum length of secrets to try', Number, 12)
  .option('-p, --progress <n>', 'At what iteration to start, can be used to resume a previous session', Number, 0)
  .option('-w, --workers <n>', 'The amount of workers to spawn [default cpus]', Number, os.cpus().length)
  .option('-S, --session [file]', 'Where to persist the session, token used as filename by default')
  .option('-P, --progressbar', 'Show a progress bar')
  .parse(process.argv);

opts.token = opts.args[0];
if (opts.session === true) {
  opts.session = opts.token + '.json';
}

module.exports = opts;
