var o = require('./o-bootstrap.js');

module.exports = o.getPrototypeOf = function (obj) {
    "use strict";

    if (Object.getPrototypeOf) return Object.getPrototypeOf(obj);
    return Object.__proto__; // jshint ignore:line
};
