'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimArrayPrototypeSplice() {
	var polyfill = getPolyfill();

	define(
		Array.prototype,
		{ splice: polyfill },
		{ splice: function () { return Array.prototype.splice !== polyfill; } }
	);

	return polyfill;
};
