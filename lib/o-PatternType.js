var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_stringType = require('./o-stringType.js');

module.exports = o.PatternType = o_augment(
    o_Type,
    function (parent, regExp, args) {
        args = args || {};
        args.validate = function (val) {
            if (!o_stringType.check(val)) return false;
            return regExp.test(val);
        };
        parent( args );
    }
);
