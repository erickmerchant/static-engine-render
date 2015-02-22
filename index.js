var path = require('path');
var fs = require('fs');
var interpolate = require('./interpolate.js');
var mkdirp = require('mkdirp');
var async_done = require('async-done');

module.exports = function(route, renderer) {

    return function (pages) {

        var promises = pages.map(function (page) {

            return new Promise(function(resolve, reject){

                var file = interpolate(route, page || {});

                var directory = path.dirname(file);

                async_done(function(done){

                    return renderer(page, done);

                }, function(err, html){

                    if(err) {
                        reject(err);
                    }
                    else {

                        mkdirp(directory, function (err) {

                            if (err) { reject(err); }
                            else
                            {
                                fs.writeFile(file, html, function (err, html) {

                                    if (err) { reject(err); }
                                    else
                                    {
                                        resolve(page);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });

        return Promise.all(promises);
    };
};
