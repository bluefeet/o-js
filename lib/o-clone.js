var o = require('./o-bootstrap.js');

var o_merge = require('./o-merge.js');
var o_getPrototypeOf = require('./o-getPrototypeOf.js');

module.exports = o.clone = function (obj) {
    "use strict";

    var newObj = Object.create( o_getPrototypeOf(obj) );
    newObj.constructor = obj.constructor;
    o_merge( newObj, obj );
    return newObj;
};
