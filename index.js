const spawn = require('child_process').spawn;
const argv = process.argv.slice(2);

const match = argv.join(' ').match(/--cpus[= ](\d+)/);
const cpus = match ? parseInt(match[1], 10) : require('os').cpus().length;

// Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJpYXQiOm51bGwsImV4cCI6bnVsbCwiYXVkIjoiIiwic3ViIjoiYXJpZWwifQ.gACDeFDqSARF2XOgvB4YNxOEDy5SJ9pjXFoF6bMxal0
// Secret: abcdef

if (cpus === 1) {
  return require('./worker');
}

const args = ['worker']
  .concat(argv)
  .concat('--step=' + cpus);

for (let i = 0; i < cpus; i++) {
  const child = spawn('node', args.concat('--offset=' + i), { stdio: 'inherit' });
  child.on('exit', function(code) {
    if (code === 0) {
      process.exit();
    }
  });
}
