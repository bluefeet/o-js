var o = require('./o-bootstrap.js');

module.exports = o.before = function (original, func) {
    return function () {
        func.call( this );
        return original.apply( this, arguments );
    };
};
