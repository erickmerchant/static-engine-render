# static-engine-render

[![Dependency Status](https://david-dm.org/erickmerchant/static-engine-render.svg?style=flat-square)](https://david-dm.org/erickmerchant/static-engine-render) [![devDependency Status](https://david-dm.org/erickmerchant/static-engine-render/dev-status.svg?style=flat-square)](https://david-dm.org/erickmerchant/static-engine-render#info=devDependencies) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

This is a plugin for [static-engine](https://github.com/erickmerchant/static-engine). It renders and saves a file using a provided render function for each object in the collection. Pass it first a route, the file to save. It will interpolate properties from each object into the string provided. Second pass it a function to use for rendering. For each object in the collection it is passed first the object and then a callback function. The renderer may use the callback or optionally return a promise.

```javascript

var engine = require('static-engine');
var render = require('static-engine-render');
var pluginA = require('plugin-a');
var renderer = function(page, done) {

    // some templating

    done(err, result);
}

engine([
    pluginA,
    render('./your-route/:var/index.html', renderer)
]);

```
