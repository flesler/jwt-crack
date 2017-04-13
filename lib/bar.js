const ProgressBar = require('progress');

let bar;

exports.setup = (total) => {
  bar = new ProgressBar('[:bar] :percent | :etas left', { total, width: 20, renderThrottle: 1e3 });
};

exports.update = (progress) => {
  if (bar) bar.tick(progress - bar.curr);
};

exports.stop = () => {
  if (bar) bar.terminate();
};
