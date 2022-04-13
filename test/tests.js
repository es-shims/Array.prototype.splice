'use strict';

var canDistinguishSparseFromUndefined = 0 in [undefined]; // IE 6 - 8 have a bug where this returns false.

module.exports = function (splice, t) {
	var b = ['b'];
	var a = [1, 'a', b];

	var makeArray = function (l, givenPrefix) {
		var prefix = givenPrefix || '';
		var length = l;
		var arr = [];
		while (length--) { // eslint-disable-line no-plusplus
			arr.unshift(prefix + Array(length + 1).join(' ') + length);
		}
		return arr;
	};

	// ES6 introduced a proper default value
	t.test('defaults deleteCount to length - start if there is only 1 argument', function (st) {
		st.equal(splice([0, 1, 2], 0).length, 3);
		st.equal(splice([0, 1, 2], 1).length, 2);

		st.end();
	});

	t.deepEqual(
		splice(a.slice(0), 0, 0),
		[],
		'basic implementation test 1'
	);

	var test2 = a.slice(0);
	splice(test2, 0, 2);
	t.deepEqual(
		test2,
		[b],
		'basic implementation test 2'
	);

	t.test('should return right result 1', function (st) {
		var array = [];

		splice(array, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
		splice(array, 1, 0, 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26');
		splice(array, 5, 0, 'XXX');

		st.deepEqual(
			array,
			[1, 'F1', 'F2', 'F3', 'F4', 'XXX', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
		);

		st.end();
	});

	t.test('should return right result 2', function (st) {
		var array = makeArray(6);

		splice(array, array.length - 1, 1, '');
		splice(array, 0, 1, 1, 2, 3, 4);
		splice(array, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45);

		splice(array, 4, 0, '99999999999999');

		st.deepEqual(
			array,
			[1, 2, 3, 4, '99999999999999', 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 1, 2, 3, 4, ' 1', '  2', '   3', '    4', '']
		);

		st.end();
	});

	t.test('should return right result 3', function (st) {
		var array = [1, 2, 3];

		splice(array, 0, array.length);
		splice(array, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
		splice(array, 1, 1, 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26');
		splice(array, 5, 1, 'YYY', 'XXX');
		splice(array, 0, 1);
		splice(array, 0, 2);
		array.pop();
		array.push.apply(array, makeArray(10, '-'));
		splice(array, array.length - 2, 10);
		splice(array);
		splice(array, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9);
		splice(array, 1, 1, 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 1, 23, 4, 5, 6, 7, 8);
		splice(array, 30, 10);
		splice(array, 30, 1);
		splice(array, 30, 0);
		splice(array, 2, 5, 1, 2, 3, 'P', 'LLL', 'CCC', 'YYY', 'XXX');
		array.push(1, 2, 3, 4, 5, 6);
		splice(array, 1, 6, 1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9);
		splice(array, 3, 7);
		array.unshift(7, 8, 9, 10, 11);
		array.pop();
		splice(array, 5, 2);
		array.pop();
		array.unshift.apply(array, makeArray(8, '~'));
		array.pop();
		splice(array, 3, 1, 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 1, 23, 4, 5, 6, 7, 8);
		splice(array, 4, 5, 'P', 'LLL', 'CCC', 'YYY', 'XXX');

		st.deepEqual(
			array,
			['~0', '~ 1', '~  2', 'F1', 'P', 'LLL', 'CCC', 'YYY', 'XXX', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 1, 23, 4, 5, 6, 7, 8, '~    4', '~     5', '~      6', '~       7', 7, 8, 9, 10, 11, 2, 4, 5, 6, 7, 8, 9, 'CCC', 'YYY', 'XXX', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 1, 23, 4, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'YYY', 'XXX', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F26', 3, 4, 5, 6, 7, 8, 9, '-0', '- 1', '-  2', '-   3', '-    4', '-     5', '-      6', '-       7', 1, 2, 3]
		);

		st.end();
	});

	t.test('should do nothing if method called with no arguments', function (st) {
		var test = a.slice(0);
		st.deepEqual(splice(test), []);
		st.deepEqual(test, a);

		st.end();
	});

	t.test('should set first argument to 0 if first argument is set but undefined', function (st) {
		var testA = a.slice(0);
		var testB = testA.slice(0);
		st.deepEqual(
			splice(testA, void 0, 2),
			splice(testB, 0, 2)
		);
		st.deepEqual(testA, testB);

		st.end();
	});

	t.test('should work with objects - adding 1', function (st) {
		var obj = {};
		splice(obj, 0, 0, 1, 2, 3);
		st.equal(obj.length, 3);

		st.end();
	});

	t.test('should work with objects - adding 2', function (st) {
		var obj = { 0: 1, length: 1 };
		splice(obj, 1, 0, 2, 3);
		st.equal(obj.length, 3);

		st.end();
	});

	t.test('should work with objects - removing', function (st) {
		var obj = { 0: 1, 1: 2, 2: 3, length: 3 };
		splice(obj, 0, 3);
		st.equal(obj.length, 0);

		st.end();
	});

	t.test('should work with objects - replacing', function (st) {
		var obj = { 0: 99, length: 1 };
		splice(obj, 0, 1, 1, 2, 3);

		st.equal(obj.length, 3);
		st.equal(obj[0], 1);

		st.end();
	});

	t.test('should not break on sparse arrays in Opera', { skip: !canDistinguishSparseFromUndefined }, function (st) {
		// test from https://github.com/wikimedia/VisualEditor/blob/d468b00311e69c2095b9da360c5745153342a5c3/src/ve.utils.js#L182-L196
		var n = 256;
		var arr = [];
		arr[n] = 'a';
		splice(arr, n + 1, 0, 'b');
		st.equal(arr[n], 'a');

		st.end();
	});

	t.test('should not break on sparse arrays in Safari 7/8', { skip: !canDistinguishSparseFromUndefined }, function (st) {
		// test from https://github.com/wikimedia/VisualEditor/blob/d468b00311e69c2095b9da360c5745153342a5c3/src/ve.utils.js#L182-L196
		var justFine = new Array(1e5 - 1);
		justFine[10] = 'x';
		var tooBig = new Array(1e5);
		tooBig[8] = 'x';

		splice(justFine, 1, 1);
		st.notOk(8 in justFine);
		st.equal(justFine.indexOf('x'), 9);
		splice(tooBig, 1, 1);
		st.notOk(6 in tooBig);
		st.equal(tooBig.indexOf('x'), 7);

		st.end();
	});
};
