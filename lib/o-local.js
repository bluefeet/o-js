var o = require('./o-bootstrap.js');

var o_has = require('./o-has.js');

module.exports = o.local = function (obj, prop, func) {
    var hasProp = o_has( obj, prop );
    var origVal = obj[prop];

    var ret;
    try {
        ret = func();
    }
    finally {
        if (hasProp) { obj[prop] = origVal; }
        else { delete obj[prop]; }
    }

    return ret;
};
