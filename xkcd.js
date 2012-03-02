var im = require('./libs/imagemagick')
    , request = require('request')
    , feed_root = 'http://xkcd.com/info.0.json'
    , cache_hash = new Array();

exports.get_random = function(width,height,callback) {
  request({uri: feed_root}, function(err, response, body){
    for(var iteration=0; iteration<response.body.num; iteration++) {
      var num=Math.floor(Math.random()*response.body.num);
      if(!cache_hash[num]) {
        var feed_link = feed_root.replace(/com\/info/,'com/'+num+'/info');
        request({uri: feed_link}, function(error, res, bd){
          var identifyCallback = function (url,alt,num) {
            return function(err,features) {
              if(features.width <= width && features.height <= height) {
                callback({
                  'url': url,
                  'width': features.width,
                  'height': features.height,
                  'alt': alt,
                  'comic_num': num
                });
              }
            }
          };
          im.identify(res.body.img,identifyCallback(res.body.img,res.body.alt,res.body.num));
        });
      }
    }
  });
};
