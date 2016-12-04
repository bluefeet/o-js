var o = require('./o-bootstrap.js');

module.exports = o.around = function (original, func) {
    "use strict";

    return function () {
        var args = Array.prototype.slice.call(arguments);
        var wrapper = original.bind( this );
        args.unshift( wrapper );
        return func.apply( this, args );
    };
};
