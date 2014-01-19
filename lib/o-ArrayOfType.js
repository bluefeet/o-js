var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_arrayType = require('./o-arrayType.js');

module.exports = o_augment(
    o_Type,
    function (parent, type, args) {
        args = args || {};
        args.validate = function (ary) {
            if (!o_arrayType.check(ary)) return false;
            for (var i = 0, l = ary.length; i < l; i++) {
                if (!type.check(ary[i])) return false;
            }
            return true;
        };
        args.coerce = function (ary) {
            if (!this.check(ary)) return ary;
            for (var i = 0, l = ary.length; i < l; i++) {
                ary[i] = type.coerce( ary[i] );
            }
            return ary;
        };
        parent( args );
    }
);
