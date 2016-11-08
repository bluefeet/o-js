var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};
        args.validate = function (val) {
            for (var i in types) {
                if (!types[i].check(val)) return false;
            }
            return true;
        };
        parent( args );
    }
);
