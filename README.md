# array.prototype.splice <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

An ES spec-compliant `Array.prototype.splice` shim/polyfill/replacement that works as far down as ES3.

This package implements the [es-shim API](https://github.com/es-shims/api) interface. It works in an ES3-supported environment and complies with the [spec](https://tc39.es/ecma262/#sec-array.prototype.splice).

Because `Array.prototype.splice` depends on a receiver (the “this” value), the main export takes the array to operate on as the first argument.

## Example

```js
var splice = require('array.prototype.splice');
var assert = require('assert');

var a = [1, 1, 1];
assert.deepEqual(splice(a, 1, 2), [1, 1]);
assert.deepEqual(a, [1]);
```

```js
var splice = require('array.prototype.splice');
var assert = require('assert');
/* when Array#splice is not present */
delete Array.prototype.splice;
var shimmed = splice.shim();
assert.equal(shimmed, splice.getPolyfill());
assert.equal(shimmed, Array.prototype.splice);
assert.deepEqual([1, 2, 3].splice(1, 2, 3), splice([1, 2, 3], 1, 2, 3));
```

```js
var splice = require('array.prototype.splice');
var assert = require('assert');
/* when Array#splice is present */
var shimmed = splice.shim();
assert.equal(shimmed, Array.prototype.splice);
assert.deepEqual([1, 2, 3].splice(1, 2, 3), splice([1, 2, 3], 1, 2, 3));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[package-url]: https://npmjs.org/package/array.prototype.splice
[npm-version-svg]: https://versionbadg.es/es-shims/Array.prototype.splice.svg
[deps-svg]: https://david-dm.org/es-shims/Array.prototype.splice.svg
[deps-url]: https://david-dm.org/es-shims/Array.prototype.splice
[dev-deps-svg]: https://david-dm.org/es-shims/Array.prototype.splice/dev-status.svg
[dev-deps-url]: https://david-dm.org/es-shims/Array.prototype.splice#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/array.prototype.splice.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/array.prototype.splice.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/array.prototype.splice.svg
[downloads-url]: https://npm-stat.com/charts.html?package=array.prototype.splice
[codecov-image]: https://codecov.io/gh/es-shims/Array.prototype.splice/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/es-shims/Array.prototype.splice/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/es-shims/Array.prototype.splice
[actions-url]: https://github.com/es-shims/Array.prototype.splice/actions
