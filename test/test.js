var assert = require('assert');

describe('plugin', function(){

    it('it should interpolate the route provided and render with the renderer', function(done){

        var rewired = require('./rewired.js')({'./test/target/': {}});

        var plugin = rewired.render('./test/target/:slug/index.html', function(page) {

            return new Promise(function(resolve, reject) {

                resolve('<h1>' + page.title + '</h1>');
            });
        });

        plugin([{slug: 'test-1-2-3', title: 'Test One Two Three'}])
        .then(function(pages){

            var globbed = {};

            rewired.glob('./test/target/**/*.html', { encoding: 'utf-8' }, function (err, files) {

                files.forEach(function(file) {

                    globbed[file] = rewired.fs.readFileSync(file, { encoding: 'utf-8' });
                });

                assert.deepEqual(globbed, {
                    './test/target/test-1-2-3/index.html': '<h1>Test One Two Three</h1>'
                });

                done();
            });
        })
        .catch(done);
    });
});
