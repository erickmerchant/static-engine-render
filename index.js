var path = require('path');
var fs = require('fs');
var Promise = require('es6-promise').Promise;
var interpolate = require('./interpolate.js');
var mkdirp = require('mkdirp');

function plugin(route, renderer) {

    return function (pages) {

        var promises = pages.map(function (page) {

            return new Promise(function(resolve, reject){

                renderer(page).then(function (html) {

                    var url = interpolate(route, page || {});

                    var file = plugin.directory + url;

                    var directory;

                    directory = path.dirname(file);

                    mkdirp(directory, function (err) {

                        if (err) reject(err);

                        fs.writeFile(file, html, function (err, data) {

                            if (err) reject(err);

                            resolve(page);
                        });
                    });
                });
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
