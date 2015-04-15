var assert = require('assert')
var describe = require('mocha').describe
var it = require('mocha').it

describe('plugin', function () {
  it('it should interpolate the route provided and render with the renderer', function (done) {
    var mocked = mock({})

    var render = mocked.plugin('./test/target/:slug/index.html', function (page) {
      return new Promise(function (resolve, reject) {
        resolve('<h1>' + page.title + '</h1>')
      })
    })

    render([{slug: 'test-1-2-3', title: 'Test One Two Three'}])
      .then(function (pages) {
        assert.deepEqual(mocked.output, {
          mkdirp: [
            './test/target/test-1-2-3'
          ],
          fs: {
            './test/target/test-1-2-3/index.html': '<h1>Test One Two Three</h1>'
          }
        })

        done()
      })
      .catch(done)
  })
})

function mock (files) {
  var rewire = require('rewire')
  var plugin = rewire('./index.js')
  var output = {
    fs: {},
    mkdirp: []
  }

  plugin.__set__('fs', {
    writeFile: function (filename, data, callback) {
      output['fs'][filename] = data

      callback()
    }
  })

  plugin.__set__('mkdirp', function (directory, callback) {
    output['mkdirp'].push(directory)

    callback()
  })

  return { plugin: plugin, output: output }
}
