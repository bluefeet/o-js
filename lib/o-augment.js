var o = require('./o-bootstrap.js');

var o_around = require('./o-around.js');
var o_merge = require('./o-merge.js');
var o_clone = require('./o-clone.js');

module.exports = o.augment = function (parent, constructor, proto) {
    var child = o_around(
        parent,
        constructor
    );

    childProto = Object.create( parent.prototype );
    if (proto) o_merge( childProto, proto );

    child.prototype = childProto;

    return child;
};
