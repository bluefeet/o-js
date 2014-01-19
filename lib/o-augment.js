var o_around = require('./o-around.js');
var o_merge = require('./o-merge.js');
var o_clone = require('./o-clone.js');

module.exports = function (parent, constructor, proto) {
    var child = o_around(
        parent,
        constructor
    );

    proto = proto
            ? o_merge( {}, constructor.prototype, proto )
            : o_clone( constructor.prototype );

    proto.__proto__ = parent.prototype;
    child.prototype = proto;

    return child;
};
