var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type    = require('./o-Type.js');

module.exports = o.LazyType = o_augment(
    o_Type,
    function (parent, typeBuilder, args) {
        args = args || {};
        var type;
        args.validate = function (val) {
            type = type || typeBuilder();
            return type.check(val);
        };
        args.coerce = function (val) {
            type = type || typeBuilder();
            return type.coerce(val);
        };
        parent( args );
    }
);
