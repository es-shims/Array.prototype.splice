'use strict';

var GetIntrinsic = require('get-intrinsic');

var ToIntegerOrInfinity = require('es-abstract/2024/ToIntegerOrInfinity');
var IsArray = require('es-abstract/2024/IsArray');

var callBind = require('call-bind');
var callBound = require('call-bound');

var $Array = GetIntrinsic('%Array%');
var max = GetIntrinsic('%Math.max%');

var implementation = require('./implementation');

var $slice = callBound('Array.prototype.slice');
var $push = callBound('Array.prototype.push');
var $spliceApply = callBind.apply(Array.prototype.splice);

module.exports = function getPolyfill() {
	if (!Array.prototype.splice) {
		return implementation;
	}

	if ([0, 1, 2].splice(0).length !== 3) {
		// IE 8 and pre-ES6 engines need this
		return implementation;
		// TODO: see if there's a way to write this as a wrapper around the native impl
	}

	// Safari 5.0 bug where .splice() returns undefined
	var spliceNoopReturnsEmptyArray = (function () {
		var a = [1, 2];
		var result = a.splice();
		return a.length === 2 && IsArray(result) && result.length === 0;
	}());
	if (!spliceNoopReturnsEmptyArray) {
		// eslint-disable-next-line no-unused-vars
		return function splice(start, deleteCount) {
			if (arguments.length === 0) {
				return [];
			}
			return $spliceApply(this, arguments);
		};
	}

	var spliceWorksWithEmptyObject = (function () {
		var obj = {};
		Array.prototype.splice.call(obj, 0, 0, 1);
		return obj.length === 1;
	}());
	if (!spliceWorksWithEmptyObject) {
		/* eslint no-invalid-this: 0 */
		return function splice(start, deleteCount) {
			if (arguments.length === 0) {
				return [];
			}
			var args = arguments;
			this.length = max(ToIntegerOrInfinity(this.length), 0);
			if (arguments.length > 0 && typeof deleteCount !== 'number') {
				args = $slice(arguments);
				if (args.length < 2) {
					$push(args, this.length - start);
				} else {
					args[1] = ToIntegerOrInfinity(deleteCount);
				}
			}
			return $spliceApply(this, args);
		};
	}

	var spliceWorksWithLargeSparseArrays = (function () {
		/*
		 * Per https://github.com/es-shims/es5-shim/issues/295
		 * Safari 7/8 breaks with sparse arrays of size 1e5 or greater
		 */
		var arr = new $Array(1e5);
		// note: the index MUST be 8 or larger or the test will false pass
		arr[8] = 'x';
		arr.splice(1, 1);
		for (var i = 0; i < arr.length; i += 1) {
			if (arr[i] === 'x') {
				return i === 7;
			}
		}
		return false;
	}());
	var spliceWorksWithSmallSparseArrays = (function () {
		/*
		 * Per https://github.com/es-shims/es5-shim/issues/295
		 * Opera 12.15 breaks on this, no idea why.
		 */
		var n = 256;
		var arr = [];
		arr[n] = 'a';
		arr.splice(n + 1, 0, 'b');
		return arr[n] === 'a';
	}());

	if (!spliceWorksWithLargeSparseArrays || !spliceWorksWithSmallSparseArrays) {
		return implementation;
	}

	return Array.prototype.splice;
};
