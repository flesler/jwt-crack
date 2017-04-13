const utils = require('../lib/utils');
const cluster = require('../lib/cluster');
const session = require('../lib/session');
const opts = require('../lib/opts');
const bar = require('../lib/bar');

/* Session & State */

const state = utils.pluck(opts, ['chars', 'maxlen', 'progress', 'workers', 'token', 'progressbar']);
const stored = session.read(opts.session) || {};

if (!utils.isValidJWT(stored.token || state.token)) {
  opts.help();
}

function updateState(changes) {
  utils.copy(state, changes);
  if (opts.session) {
    session.write(opts.session, state);
  }
}

// Make sure (if requested) that a session is stored so options can be omitted
updateState(stored);

/* Cluster & Progress */

const total = utils.limit(state.chars, state.maxlen);

utils.log(`Started cracking the secret at ${state.progress} attempts`);

if (state.progressbar) {
  bar.setup(total);
  bar.update(state.progress);
}

cluster.on('progress', (progress) => {
  updateState({ progress });
  bar.update(progress);
  if (progress === total) {
    failed();
  }
});

cluster.on('success', (secret) => {
  updateState({ secret });
  bar.stop();
  utils.log(`Cracked secret in ${state.progress} attempts`);
  utils.log(`Took ${utils.elapsedMinutes()} minutes`);
  utils.log(`Secret is ${secret}`);
  process.exit();
});

cluster.spawn(state);

/* Termination */

function failed() {
  if (!state.secret) {
    state.secret = true;
    bar.stop();
    utils.log(`Failed to crack secret in ${state.progress} attempts`);
    utils.log(`Took ${utils.elapsedMinutes()} minutes`);
    cluster.stop();
    process.exit(1);
  }
}

['beforeExit', 'exit', 'SIGHUP', 'SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((event) => {
  process.on(event, failed);
});
