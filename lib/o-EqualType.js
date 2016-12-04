var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o.EqualType = o_augment(
    o_Type,
    function (parent, expected, args) {
        args = args || {};

        if (!args.validate) args.validate = function (val) {
            return (val === expected) ? true : false;
        };

        if (!args.name) args.name = 'o.EqualType';

        if (!args.message) args.message = function (val) {
            return val + ' failed ' + this.name + ' validation due to not equalling ' +
                expected + '.';
        };

        parent( args );
    }
);
