var assert = require('assert')
var describe = require('mocha').describe
var it = require('mocha').it

describe('plugin', function () {
  it('it should interpolate the route provided and render with the renderer', function (done) {
    var rewired = mocks({'./test/target/': {}})

    var render = rewired.render('./test/target/:slug/index.html', function (page) {
      return new Promise(function (resolve, reject) {
        resolve('<h1>' + page.title + '</h1>')
      })
    })

    render([{slug: 'test-1-2-3', title: 'Test One Two Three'}])
      .then(function (pages) {
        var globbed = {}

        rewired.glob('./test/target/**/*.html', { encoding: 'utf-8' }, function (err, files) {
          if (err) {
            throw err
          }

          files.forEach(function (file) {
            globbed[file] = rewired.fs.readFileSync(file, { encoding: 'utf-8' })
          })

          assert.deepEqual(globbed, {
            './test/target/test-1-2-3/index.html': '<h1>Test One Two Three</h1>'
          })

          done()
        })
      })
      .catch(done)
  })
})

function mocks (fsConfig) {
  var rewire = require('rewire')
  var mockFS = require('mock-fs')
  var render = rewire('./index.js')
  var glob = rewire('glob')
  var mkdirp = rewire('mkdirp')
  var fs = mockFS.fs(fsConfig)

  mkdirp.__set__('fs', fs)

  glob.__set__('fs', fs)

  render.__set__('fs', fs)

  render.__set__('mkdirp', mkdirp)

  return { fs: fs, glob: glob, render: render }
}
