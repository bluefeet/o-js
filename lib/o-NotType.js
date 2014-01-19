var o_augment = require('./o-augment.js');
var o_NoneType = require('./o-NoneType.js');

module.exports = o_augment(
    o_NoneType,
    function (parent, type, args) {
        parent( [type], args );
    }
);
