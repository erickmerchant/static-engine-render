var rewire = require('rewire')
var mock = require('mock-fs')

module.exports = function (fs) {
  var render = rewire('../index.js')
  var glob = rewire('glob')
  var mkdirp = rewire('mkdirp')

  fs = mock.fs(fs)

  mkdirp.__set__('fs', fs)

  glob.__set__('fs', fs)

  render.__set__('fs', fs)

  render.__set__('mkdirp', mkdirp)

  return { fs: fs, glob: glob, render: render }
}
