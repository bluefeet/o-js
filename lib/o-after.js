var o = require('./o-bootstrap.js');

module.exports = o.after = function (original, func) {
    return function () {
        var ret = original.apply( this, arguments );
        func.call( this );
        return ret;
    };
};
