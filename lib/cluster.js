const EventEmitter = require('events').EventEmitter;
const cluster = require('cluster');
const path = require('path');
const utils = require('./utils');

exports = new EventEmitter();
module.exports = exports;

exports.spawn = (state) => {
  for (let i = 0; i < state.workers; i++) {
    const opts = utils.copy({ offset: i }, state);
    spawn(opts);
  }
};

cluster.setupMaster({
  exec: path.join(__dirname, 'worker.js'),
});

function spawn(opts) {
  const worker = cluster.fork({ OPTS: JSON.stringify(opts) });
  worker.opts = opts;
}

cluster.on('exit', (worker, code, signal) => {
  // Keep reviving them
  console.log('EXITED', worker.env.offset, code, signal, worker.exitedAfterDisconnect);
  if (!worker.exitedAfterDisconnect) {
    // spawn(worker.opts);
  }
});

cluster.on('message', (worker, msg) => {
  if (msg.progress) {
    worker.opts.progress = msg.progress;
    exports.emit('progress', getMinProgress());
  }
  if (msg.secret) {
    exports.emit('success', msg.secret);
  }
});

function getMinProgress() {
  // The cluster progresses as much as its slowest worker
  const vals = workers().map(worker => worker.opts.progress);
  return Math.min(...vals);
}

exports.stop = () => {
  workers().forEach((worker) => {
    try {
      worker.kill();
    } catch (err) {
      // Silence EPIPE errors
    }
  });
};

function workers() {
  return utils.values(cluster.workers);
}

