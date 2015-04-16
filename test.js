var assert = require('assert')
var describe = require('mocha').describe
var it = require('mocha').it
var renderer = function (page) {
  return new Promise(function (resolve, reject) {
    resolve('<h1>' + page.title + '</h1>')
  })
}

describe('plugin', function () {
  it('it should work with a promise', function (done) {
    var mocked = mock({})

    var render = mocked.plugin('./test/target/:slug/index.html', renderer)

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
  })

  it('it should work with the callback', function (done) {
    var mocked = mock({})

    var render = mocked.plugin('./test/target/:slug/index.html', function (page, done) {
      done(null, '<h1>' + page.title + '</h1>')
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
  })

  it('it should handle errors from the renderer', function (done) {
    var mocked = mock({})
    var promises = []
    var render

    promises.push(new Promise(function (resolve, reject) {
      render = mocked.plugin('./test/target/:slug/index.html', function (page) {
        return new Promise(function (resolve, reject) {
          reject(new Error('renderer error!'))
        })
      })

      render([{slug: 'test-1-2-3', title: 'Test One Two Three'}])
        .catch(function (err) {
          assert.equal('renderer error!', err.message)

          resolve()
        })
    }))

    promises.push(new Promise(function (resolve, reject) {
      render = mocked.plugin('./test/target/:slug/index.html', function (page, done) {
        done(new Error('renderer error!'))
      })

      render([{slug: 'test-1-2-3', title: 'Test One Two Three'}])
        .catch(function (err) {
          assert.equal('renderer error!', err.message)

          resolve()
        })
    }))

    Promise.all(promises).then(function () { done() })
  })

  it('it should handle errors from mkdirp', function (done) {
    var mocked = mock({}, {
      mkdirp: new Error('mkdirp error!')
    })

    var render = mocked.plugin('./test/target/:slug/index.html', renderer)

    render([{slug: 'test-1-2-3', title: 'Test One Two Three'}])
      .catch(function (err) {
        assert.equal('mkdirp error!', err.message)

        done()
      })
  })

  it('it should handle errors from fs.writeFile', function (done) {
    var mocked = mock({}, {
      fs: new Error('fs.writeFile error!')
    })

    var render = mocked.plugin('./test/target/:slug/index.html', renderer)

    render([{slug: 'test-1-2-3', title: 'Test One Two Three'}])
      .catch(function (err) {
        assert.equal('fs.writeFile error!', err.message)

        done()
      })
  })
})

function mock (files, errors) {
  var rewire = require('rewire')
  var plugin = rewire('./index.js')
  var output = {
    fs: {},
    mkdirp: []
  }

  errors = errors || {}

  plugin.__set__('fs', {
    writeFile: function (filename, data, callback) {
      output.fs[filename] = data

      callback(errors.fs)
    }
  })

  plugin.__set__('mkdirp', function (directory, callback) {
    output.mkdirp.push(directory)

    callback(errors.mkdirp)
  })

  return { plugin: plugin, output: output }
}
