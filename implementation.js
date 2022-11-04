'use strict';

var GetIntrinsic = require('get-intrinsic');

var ArraySpeciesCreate = require('es-abstract/2022/ArraySpeciesCreate');
var clamp = require('es-abstract/2022/clamp');
var CreateDataPropertyOrThrow = require('es-abstract/2022/CreateDataPropertyOrThrow');
var DeletePropertyOrThrow = require('es-abstract/2022/DeletePropertyOrThrow');
var Get = require('es-abstract/2022/Get');
var HasProperty = require('es-abstract/2022/HasProperty');
var LengthOfArrayLike = require('es-abstract/2022/LengthOfArrayLike');
var Set = require('es-abstract/2022/Set');
var ToIntegerOrInfinity = require('es-abstract/2022/ToIntegerOrInfinity');
var ToObject = require('es-abstract/2022/ToObject');
var ToString = require('es-abstract/2022/ToString');

var forEach = require('es-abstract/helpers/forEach');

var callBound = require('call-bind/callBound');

var isString = require('is-string');

// Check failure of by-index access of string characters (IE < 9) and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var strSplit = callBound('String.prototype.split');
var $slice = callBound('Array.prototype.slice');
var $TypeError = GetIntrinsic('%TypeError%');
var max = GetIntrinsic('%Math.max%');
var min = GetIntrinsic('%Math.min%');

module.exports = function splice(start, deleteCount) {
	var O = ToObject(this); // step 1
	var self = splitString && isString(O) ? strSplit(O, '') : O;
	var len = LengthOfArrayLike(self); // step 2

	var relativeStart = ToIntegerOrInfinity(start); // step 3
	var actualStart;
	if (relativeStart === -Infinity) {
		actualStart = 0; // step 4
	} else if (relativeStart < 0) {
		actualStart = max(len + relativeStart, 0); // step 5
	} else {
		actualStart = min(relativeStart, len); // step 6
	}

	var items = arguments.length > 2 ? $slice(arguments, 2) : [];
	var insertCount = items.length; // step 7
	var actualDeleteCount;
	if (arguments.length === 0) { // step 8
		actualDeleteCount = 0;
	} else if (arguments.length < 2) { // step 9
		actualDeleteCount = len - actualStart;
	} else {
		var dc = ToIntegerOrInfinity(deleteCount);
		actualDeleteCount = clamp(dc, 0, len - actualStart);
	}
	if (len + insertCount - actualDeleteCount > (Math.pow(2, 53) - 1)) {
		throw new $TypeError('TODO'); // step 11
	}

	var A = ArraySpeciesCreate(0, actualDeleteCount); // step 12
	var k = 0; // step 13

	var from;
	var fromValue;

	while (k < actualDeleteCount) { // step 14
		from = ToString(actualStart + k); // step 14.a
		if (HasProperty(O, from)) { // step 14.b
			fromValue = Get(O, from); // step 14.b.i
			CreateDataPropertyOrThrow(A, ToString(k), fromValue); // step 14.b.ii
		}
		k += 1; // step 14.c
	}

	Set(A, 'length', actualDeleteCount, true); // step 15
	var itemCount = items.length; // step 16
	var to;
	if (itemCount < actualDeleteCount) { // step 17
		k = actualStart; // step 17.a
		while (k < (len - actualDeleteCount)) { // step 17.b
			from = ToString(k + actualDeleteCount); // step 17.b.i
			to = ToString(k + itemCount); // step 17.b.ii
			if (HasProperty(O, from)) { // step 17.b.iii
				fromValue = Get(O, from);
				Set(O, to, fromValue, true);
			} else {
				DeletePropertyOrThrow(O, to);
			}
			k += 1; // step 17.b.v
		}
		k = len; // step 17.c
		while (k < (len - actualDeleteCount)) { // step 17.d
			DeletePropertyOrThrow(O, !ToString(k - 1));
			k -= 1; // step 17.d.ii
		}
	} else if (itemCount > actualDeleteCount) { // step 18
		k = len - actualDeleteCount; // step 18.a
		while (k > actualStart) { // step 18.b
			from = ToString(k + actualDeleteCount - 1); // step 18.b.i
			to = ToString(k + itemCount - 1); // step 18.b.ii
			if (HasProperty(O, from)) { // step 18.b.iii
				fromValue = Get(O, from);
				Set(O, to, fromValue, true);
			} else { // step 18.b.iv
				DeletePropertyOrThrow(O, to); // step 18.b.iv.1
			}
			k -= 1; // step 18.b.v
		}
	}

	k = actualStart; // step 19

	forEach(items, function (E) { // step 20
		Set(O, ToString(k), E, true); // step 20.a
		k += 1; // step 20.b
	});

	Set(O, 'length', len - actualDeleteCount + itemCount, true); // step 21

	return A; // step 22
};
