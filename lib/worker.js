const crypto = require('crypto');
const utils = require('./utils');

// const worker = require('cluster').worker;

const opts = JSON.parse(process.env.OPTS);

const NOTIFY_INTERVAL = 10e3;
const CHARS_LEN = opts.chars.length;
const LIMIT = utils.limit(opts.chars, opts.maxlen);

const p = opts.token.split('.');
const signature = utils.normalizeSignature(p.pop());
// Slightly faster if already a Buffer
const content = new Buffer(p.join('.'));

let nextNotify = Date.now() + NOTIFY_INTERVAL;

for (let i = opts.progress + opts.offset; i < LIMIT; i += opts.workers) {
  // Calculate the secret for this iteration
  let secret = '';
  let seed = i + 1;
  do {
    // Small change so it goes 9->00 rather than 9->10
    seed -= 1;
    const mod = seed % CHARS_LEN;
    secret = opts.chars[mod] + secret;
    seed = (seed - mod) / CHARS_LEN;
  } while (seed > 0);

  // Calculate signature for this secret
  const sig = crypto.createHmac('sha256', secret).update(content).digest('base64');
  if (signature === sig) {
    process.send({ progress: i, secret });
    process.exit();
  }

  const now = Date.now();
  if (now >= nextNotify) {
    nextNotify = now + NOTIFY_INTERVAL;
    process.send({ progress: i });
  }
}

process.send({ progress: LIMIT });
process.exit(1);
