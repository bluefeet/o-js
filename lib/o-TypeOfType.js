var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o.TypeOfType = o_augment(
    o_Type,
    function (parent, result, args) {
        args = args || {};
        args.validate = function (val) {
            return (typeof val === result) ? true : false;
        };
        parent( args );
    }
);
