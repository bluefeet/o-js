var o = require('./o-bootstrap.js');

var o_has = require('./o-has.js');

module.exports = o.predicate = function (key) {
    "use strict";

    return function () {
        return( o_has( this, key ) && this[key] !== undefined );
    };
};
