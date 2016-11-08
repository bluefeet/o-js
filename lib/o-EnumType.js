var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o_augment(
    o_Type,
    function (parent, values, args) {
        args = args || {};
        args.validate = function (val) {
            for (var i in values) {
                if (val === values[i]) return true;
            }
            return false;
        };
        parent( args );
    }
);
