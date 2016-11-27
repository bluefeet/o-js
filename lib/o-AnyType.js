var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o.AnyType = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};
        args.validate = function (val) {
            for (var i = 0, l = types.length; i < l; i++) {
                if (types[i].check(val)) return true;
            }
            return false;
        };
        parent( args );
    }
);
