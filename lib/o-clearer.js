var o = require('./o-bootstrap.js');

module.exports = o.clearer = function (key) {
    "use strict";

    return function () {
        delete this[key];
    };
};
