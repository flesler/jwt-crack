const crypto = require('crypto');
const util = require('./util');

const env = process.env;
const CHARS = env.CHARS;
const MAX_LEN = +env.MAX;
const START = +env.START;
const INDEX = +env.INDEX;
const STEP = +env.STEP;
const NOTIFY_INTERVAL = 60e3;

const CHARS_LEN = CHARS.length;
const LIMIT = util.limit(CHARS, MAX_LEN);

const p = env.TOKEN.split('.');
const signature = p.pop();
const content = p.join('.');

let nextNotify = Date.now() + NOTIFY_INTERVAL;

for (let i = START + INDEX; i < LIMIT; i += STEP) {
  // Calculate the secret for this iteration
  let secret = '';
  let seed = i + 1;
  do {
    // Small change so it goes 9->00 rather than 9->10
    seed -= 1;
    const mod = seed % CHARS_LEN;
    secret = CHARS[mod] + secret;
    seed = (seed - mod) / CHARS_LEN;
  } while (seed > 0);
  // Calculate signature for this secret
  const sig = crypto.createHmac('sha256', secret).update(content).digest('base64').replace('=', '');
  if (signature === sig) {
    process.send({ secret, index: i });
    process.exit();
  }

  const now = Date.now();
  if (now >= nextNotify) {
    nextNotify = now + NOTIFY_INTERVAL;
    // Notify progress
    process.send({ index: i });
  }
}

process.send({ index: LIMIT });
process.exit(1);
