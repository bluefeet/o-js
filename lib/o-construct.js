var o_merge = require('./o-merge.js');

module.exports = function (constructor, proto) {
    o_merge( constructor.prototype, proto );
    return constructor;
};
