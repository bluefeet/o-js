var o = require('./o-bootstrap.js');

var o_merge = require('./o-merge.js');

module.exports = o.construct = function (constructor, proto) {
    "use strict";

    o_merge( constructor.prototype, proto );
    return constructor;
};
