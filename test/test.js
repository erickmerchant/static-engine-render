var mock = require('mock-fs');
var assert = require('chai').assert;
var rewire = require('rewire');

describe('plugin', function(){

    it('it should interpolate the route provided', function(done){

        var render = rewire('../index.js');
        var mkdirp = rewire('mkdirp');
        var glob = rewire('glob');

        var mocked_fs = mock.fs({'./test/target/': {}});

        var plugin = render('./test/target/:slug/index.html', function(page) {

            return new Promise(function(resolve, reject) {

                resolve('<h1>' + page.title + '</h1>');
            });
        });

        mkdirp.__set__('fs', mocked_fs);

        glob.__set__('fs', mocked_fs);

        render.__set__('fs', mocked_fs);

        render.__set__('mkdirp', mkdirp);

        plugin([{slug: 'test-1-2-3', title: 'Test One Two Three'}])
        .then(function(pages){

            var globbed = {};

            glob('./test/target/**/*.html', { encoding: 'utf-8' }, function (err, files) {

                files.forEach(function(file) {

                    globbed[file] = mocked_fs.readFileSync(file, { encoding: 'utf-8' });
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
