var path = require('path');
var fs = require('fs');
var interpolate = require('./interpolate.js');
var mkdirp = require('mkdirp');

function plugin(route, renderer) {

    return function (pages) {

        var promises = pages.map(function (page) {

            return new Promise(function(resolve, reject){

                var url = interpolate(route, page || {});

                var file = plugin.directory + url;

                var directory = path.dirname(file);

                var write = function(html) {

                    mkdirp(directory, function (err) {

                        if (err) { reject(err); }
                        else
                        {
                            fs.writeFile(file, html, function (err, html) {

                                if (err) reject(err);
                                else
                                    resolve(page);
                            });
                        }
                    });
                }

                var result = renderer(page, function(err, html){

                    if(err) {
                        reject(err);
                    }
                    else {
                        write(html);
                    }
                });

                if(typeof result !== 'undefined' && result.then) {

                    result.then(write, reject);
                }
            });
        });

        return Promise.all(promises);
    };
}

plugin.directory = './';

plugin.configure = function(directory) {

    plugin.directory = directory;
};

module.exports = plugin;
