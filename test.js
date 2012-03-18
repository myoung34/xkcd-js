var xkcd = require('./xkcd')
  , util = require('util');

xkcd.get_random(function(res) {
  util.puts(res.url + ' ' +res.width+'x'+res.height);
});

xkcd.get_random_width_height(800,800,function(res) {
  util.puts(res.url + ' ' +res.width+'x'+res.height);
  process.exit(1);
});
