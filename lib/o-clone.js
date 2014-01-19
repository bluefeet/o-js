var o_merge = require('./o-merge.js');

module.exports = function (obj) {
    var newObj = o_merge( {}, obj );
    newObj.__proto__ = obj.__proto__;
    newObj.constructor = obj.constructor;
    return newObj;
};
