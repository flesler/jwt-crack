const crypto = require('crypto');
const opts = require('commander');
const pkg = require('./package.json');

opts
	.version(pkg.version)
	.usage('<token> [options]')
	.option('--alpha <v>', 'The alphabet', String, 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789')
	.option('--max <n>', 'The maximum number of chars allowed on the secret', Number, 12)
	.option('--offset <n>', 'Iteration start, used for multi-threading', Number, 0)
	.option('--step <n>', 'Iteration step, used for multi-threading', Number, 1)
	.option('--cpus <n>', 'The amount of process to spawn [default cpus]', Number)
	.parse(process.argv);

const ALPHABET = opts.alpha;
const MAX_LEN = opts.max;
const OFFSET = opts.offset;
const STEP = opts.step;

const ALPHA_LEN = ALPHABET.length;
const LIMIT = Math.pow(ALPHA_LEN, MAX_LEN);
const PREFFIX = STEP === 1 ? '' : '#' + OFFSET + '> ';

const p = opts.args[0].split('.');
const signature = p.pop();
const content = p.join('.');

console.log(PREFFIX + 'Processing...');

const start = Date.now();

function getElapsed() {
  return ((Date.now() - start) / 1000 / 60 ).toFixed(1) + ' minutes';
}

for (let i = OFFSET; i < LIMIT; i += STEP) {
  // Calculate the secret for this iteration
  let secret = '';
  let seed = i + 1;
  do {
    // Small change so it goes 9->00 rather than 9->10
    seed--;
    const mod = seed % ALPHA_LEN;
    secret = ALPHABET[mod] + secret;
    seed = (seed - mod) / ALPHA_LEN;
  } while (seed > 0);

  // Calculate signature for this secret
  const sig = crypto.createHmac('sha256', secret).update(content).digest('base64').replace('=', '');
  if (signature === sig) {
    console.log(PREFFIX + 'Cracked secret in', i, 'attempts, took', getElapsed() + ', secret is', secret);
    process.exit();
  }
}

console.error(PREFFIX + 'Failed to crack secret in', LIMIT, 'attempts, took', getElapsed());
process.exit(1);
