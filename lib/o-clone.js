var o_merge = require('./o-merge.js');
var o_getPrototypeOf = require('./o-getPrototypeOf.js');

module.exports = function (obj) {
    var newObj = Object.create( o_getPrototypeOf(obj) );
    newObj.constructor = obj.constructor;
    o_merge( newObj, obj );
    return newObj;
};
