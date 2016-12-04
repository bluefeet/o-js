var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type    = require('./o-Type.js');
var o_AnyType = require('./o-AnyType.js');

module.exports = o.NoneType = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};
        var type = new o_AnyType(types);

        if (!args.validate) args.validate = function (val) {
            return type.check(val) ? false : true;
        };

        if (!args.name) args.name = 'o.NoneType';

        if (!args.message) args.message = function (val) {
            return val + ' failed ' + this.name + ' validation due to passing one of the ' +
                '[' + types.map(function(type){ return type.name; }).join(',') + '] type checks.';
        };

        parent( args );
    }
);
