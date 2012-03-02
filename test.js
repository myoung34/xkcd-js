var xkcd = require('./xkcd')
  , util = require('util');

xkcd.get_random(800,800,function(res) {
  util.puts(res.url);
  process.exit(1);
});
