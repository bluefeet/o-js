var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_arrayType = require('./o-arrayType.js');

module.exports = o.ArrayOfType = o_augment(
    o_Type,
    function (parent, type, args) {
        args = args || {};

        if (!args.parent) args.parent = o_arrayType;

        if (!args.validate) args.validate = function (ary) {
            for (var i = 0, l = ary.length; i < l; i++) {
                if (!type.check(ary[i])) return false;
            }
            return true;
        };

        if (!args.coerce) args.coerce = function (ary) {
            if (!this.check(ary)) return ary;
            for (var i = 0, l = ary.length; i < l; i++) {
                ary[i] = type.coerce( ary[i] );
            }
            return ary;
        };

        if (!args.name) args.name = 'o.ArrayOfType';

        if (!args.message) args.message = function (val) {
            return val + ' failed ' + this.name + ' validation due to one of the array ' +
                'values not passing the ' + type.name + ' type check.';
        };

        parent( args );
    }
);
