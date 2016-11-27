var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type    = require('./o-Type.js');
var o_AnyType = require('./o-AnyType.js');

module.exports = o.NoneType = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};
        var type = new o_AnyType(types);
        args.validate = function (val) {
            return type.check(val) ? false : true;
        };
        parent( args );
    }
);
