var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o_augment(
    o_Type,
    function (parent, expected, args) {
        args = args || {};
        args.validate = function (val) {
            return (val === expected) ? true : false;
        };
        parent( args );
    }
);
