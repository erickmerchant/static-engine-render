var path = require('path')
var fs = require('fs')
var path2regexp = require('path-to-regexp')
var mkdirp = require('mkdirp')
var once = require('once')

module.exports = function (route, renderer) {
  return function (pages) {
    var promises = pages.map(function (page) {
      return new Promise(function (resolve, reject) {
        var file = path2regexp.compile(route)(page)
        var directory = path.dirname(file)
        var mkdirPromise, done, result

        mkdirPromise = new Promise(function (resolve, reject) {
          mkdirp(directory, function (err) {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        })
        .catch(reject)

        done = once(function (err, html) {
          if (err) {
            reject(err)
          } else {
            mkdirPromise.then(function () {
              fs.writeFile(file, html, function (err) {
                if (err) {
                  reject(err)
                } else {
                  resolve(page)
                }
              })
            })
          }
        })

        result = renderer(page, done)

        if (result && typeof result.then === 'function') {
          result.then(function (html) {
            done(null, html)
          }, done)
        }
      })
    })

    return Promise.all(promises)
  }
}
