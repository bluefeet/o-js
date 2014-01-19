var o_has = require('./o-has.js');

module.exports = function (key) {
    return function () {
        return( o_has( this, key ) && this[key] !== undefined );
    };
};
