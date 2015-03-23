var path = require('path');
var fs = require('fs');
var reverend = require('reverend');
var mkdirp = require('mkdirp');
var once = require('once');

module.exports = function(route, renderer) {

    return function (pages) {

        var promises = pages.map(function (page) {

            return new Promise(function(resolve, reject){

                var file = reverend(route, page || {});

                var directory = path.dirname(file);

                var done = once(function(err, html){

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

                var result = renderer(page, done);

                if(result && typeof result.then == 'function') {

                    result.then(function(html){

                        done(null, html);

                    }, done)
                }
            });
        });

        return Promise.all(promises);
    };
};
