'use strict';

var HasProperty = require('es-abstract/2021/HasProperty');
var LengthOfArrayLike = require('es-abstract/2021/LengthOfArrayLike');
var Set = require('es-abstract/2021/Set');
var ToIntegerOrInfinity = require('es-abstract/2021/ToIntegerOrInfinity');
var ToObject = require('es-abstract/2021/ToObject');

var callBound = require('call-bind/callBound');

var max = Math.max;
var min = Math.min;
var $String = String;

var $slice = callBound('Array.prototype.slice');

module.exports = function splice(start, deleteCount) {
	var O = ToObject(this);
	var A = [];
	var len = LengthOfArrayLike(O);
	var relativeStart = ToIntegerOrInfinity(start);
	var actualStart = relativeStart < 0 ? max(len + relativeStart, 0) : min(relativeStart, len);
	var actualDeleteCount = arguments.length === 0
		? 0
		: arguments.length === 1
			? len - actualStart
			: min(max(ToIntegerOrInfinity(deleteCount), 0), len - actualStart);

	var k = 0;
	var from;
	while (k < actualDeleteCount) {
		from = $String(actualStart + k);
		if (HasProperty(O, from)) {
			A[k] = O[from];
		}
		k += 1;
	}

	var items = $slice(arguments, 2);
	var itemCount = items.length;
	var to;
	if (itemCount < actualDeleteCount) {
		k = actualStart;
		var maxK = len - actualDeleteCount;
		while (k < maxK) {
			from = $String(k + actualDeleteCount);
			to = $String(k + itemCount);
			if (HasProperty(O, from)) {
				O[to] = O[from];
			} else {
				delete O[to];
			}
			k += 1;
		}
		k = len;
		var minK = len - actualDeleteCount + itemCount;
		while (k > minK) {
			delete O[k - 1];
			k -= 1;
		}
	} else if (itemCount > actualDeleteCount) {
		k = len - actualDeleteCount;
		while (k > actualStart) {
			from = $String(k + actualDeleteCount - 1);
			to = $String(k + itemCount - 1);
			if (HasProperty(O, from)) {
				O[to] = O[from];
			} else {
				delete O[to];
			}
			k -= 1;
		}
		k = actualStart;
		for (var i = 0; i < items.length; ++i) {
			O[k] = items[i];
			k += 1;
		}
		Set(O, 'length', len - actualDeleteCount + itemCount, true);
	}
	return A;
};
