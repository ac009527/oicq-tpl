const Limiter = require('async-limiter');
const task = new Limiter({ concurrency: 1 });

exports.task = task