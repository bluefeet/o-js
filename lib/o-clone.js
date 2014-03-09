var o_merge = require('./o-merge.js');

module.exports = function (obj) {
    var newObj = Object.create( Object.getPrototypeOf(obj) );
    newObj.constructor = obj.constructor;
    o_merge( newObj, obj );
    return newObj;
};
