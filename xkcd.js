var im = require('./libs/imagemagick')
    , request = require('./libs/request')
    , feed_root = 'http://xkcd.com/info.0.json'
    , cache_hash = new Array();

exports.get_random = function(callback) {
  request({uri: feed_root}, function(err, response, body){
    var max_num = response.body.match(/\"num\": (\d+?),/)[1];
    var num=Math.floor(Math.random()*max_num);
    var feed_link = feed_root.replace(/com\/info/,'com/'+num+'/info');
    request({uri: feed_link}, function(error, res, bd){
      var identifyCallback = function (url,alt,num) {
        return function(err,features) {
          callback({
            'url': url,
            'width': features.width,
            'height': features.height,
            'alt': alt,
            'comic_num': num
          });
        }
      };
      try {
        var img = res.body.match(/\"img\": \"(.+?)\",/)[1];
        var alt = res.body.match(/\"alt\": \"(.+?)\",/)[1];
        var comic_num = res.body.match(/\"num\": (.+?),/)[1];
        im.identify(img,identifyCallback(img,alt,comic_num));
      } catch(err) {
      }
    });
  });  
};

exports.get_random_width_height = function(width,height,callback) {
  request({uri: feed_root}, function(err, response, body){
    var max_num = response.body.match(/\"num\": (\d+?),/)[1];
    for(var iteration=0; iteration<max_num; iteration++) {
      var num=Math.floor(Math.random()*max_num);
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
          try {
            var img = res.body.match(/\"img\": \"(.+?)\",/)[1];
            var alt = res.body.match(/\"alt\": \"(.+?)\",/)[1];
            var comic_num = res.body.match(/\"num\": (.+?),/)[1];
            im.identify(img,identifyCallback(img,alt,comic_num));
          } catch(err) {
          }
        });
        cache_hash[num] = 0;
      }
    }
  });
};
