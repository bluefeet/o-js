var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o.AllType = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};

        if (!args.validate) args.validate = function (val) {
            for (var i = 0, l = types.length; i < l; i++) {
                if (!types[i].check(val)) return false;
            }
            return true;
        };

        if (!args.name) args.name = 'o.AllType';

        if (!args.message) args.message = function (val) {
            return val + ' failed ' + this.name + ' validation due to not passing all of the ' +
                '[' + types.map(function(type){ return type.name; }).join(',') + '] type checks.';
        };

        parent( args );
    }
);
