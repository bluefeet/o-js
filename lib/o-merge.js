var o = require('./o-bootstrap.js');

var o_has = require('./o-has.js');

module.exports = o.merge = function () {
    "use strict";

    var fromObjs = Array.prototype.slice.call(arguments);
    var toObj = fromObjs.shift();

    while (fromObjs.length) {
        var obj = fromObjs.shift();
        for (var key in obj) {
            if (o_has(obj, key)) toObj[key] = obj[key];
        }
    }

    return toObj;
};
