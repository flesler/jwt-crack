const cluster = require('cluster');
const os = require('os');
const opts = require('commander');
const util = require('./util');
const pkg = require('./package.json');

// Ordered by frequency http://letterfrequency.org/
const DEFAULT_CHARS = 'etaoinsrhldcumfpgwybv0123456789kxjqzETAOINSRHLDCUMFPGWYBVKXJQZ';

opts
  .version(pkg.version)
  .usage('<jwt> [options]')
  .option('--chars <v>', 'The alphabet to use to brute-force secrets', String, DEFAULT_CHARS)
  .option('--maxlen <n>', 'The maximum length of secrets to try', Number, 12)
  .option('--start <n>', 'Iteration start, can be used to resume a previous session', Number, 0)
  .option('--cpus <n>', 'The amount of processes to spawn [default cpus]', Number, 0)
  .parse(process.argv);

const token = opts.args[0];
// Very basic validation, can be improved
if (!token || token.split('.').length !== 3) {
  opts.help();
}

const limit = util.limit(opts.chars, opts.maxlen);
const cpus = opts.cpus || os.cpus().length;
// The last reported seed of each worker
const progress = [];
let found = false;
let lastProgress = 0;

cluster.setupMaster({
  exec: 'worker.js',
});

cluster.on('message', (worker, msg) => {
  if (msg.secret) {
    found = true;
    log('Cracked secret in', msg.index, 'attempts, took', getElapsed() + ', secret is', msg.secret);
    process.exit();
  } else {
    progress[worker.env.INDEX] = msg.index;
    updateProgress();
  }
});

function outputProcess() {
  if (!found) {
    found = true;
    log('Failed to crack secret in', getProgress(), 'attempts, took', getElapsed());
    process.exit(1);
  }
}

process.on('beforeExit', outputProcess);
process.on('exit', outputProcess);
process.on('SIGHUP', outputProcess);
process.on('SIGTERM', outputProcess);
process.on('SIGINT', outputProcess);

const startTime = Date.now();
for (let i = 0; i < cpus; i++) {
  progress[i] = opts.start;
  spawn(getEnv(i));
}

function getEnv(i) {
  return {
    TOKEN: token,
    CHARS: opts.chars,
    MAX_LEN: opts.maxlen,
    START: progress[i],
    INDEX: i,
    STEP: cpus,
  };
}

function spawn(env) {
  const worker = cluster.fork(env);
  worker.env = env;
}

function getElapsed() {
  return ((Date.now() - startTime) / 1000 / 60).toFixed(1) + ' minutes';
}

function getProgress() {
  return progress.reduce((a, b) => Math.min(a, b));
}

function updateProgress() {
  const prog = getProgress();
  const perc = Math.floor((prog * 100) / limit);
  if (perc > lastProgress) {
    lastProgress = perc;
    log(prog, '->', perc + '%');
  }
}

function log(...args) {
  const ts = (new Date()).toISOString().split(/[T.]/);
  console.log(ts[0], ts[1] + '>', ...args);
}
