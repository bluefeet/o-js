var o_has = require('./o-has.js');

module.exports = function () {
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
