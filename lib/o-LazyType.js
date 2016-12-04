var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type    = require('./o-Type.js');

module.exports = o.LazyType = o_augment(
    o_Type,
    function (parent, typeBuilder, args) {
        args = args || {};
        var type;

        if (!args.validate) args.validate = function (val) {
            type = type || typeBuilder();
            return type.check( val );
        };

        if (!args.coerce) args.coerce = function (val) {
            type = type || typeBuilder();
            return type.coerce( val );
        };

        if (!args.name) args.name = 'o.LazyType';

        if (!args.message) args.message = function (val) {
            type = type || typeBuilder();
            return type.message( val );
        };

        parent( args );
    }
);
