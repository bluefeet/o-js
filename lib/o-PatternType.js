var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_stringType = require('./o-stringType.js');

module.exports = o.PatternType = o_augment(
    o_Type,
    function (parent, regExp, args) {
        args = args || {};

        if (!args.validate) args.validate = function (val) {
            if (!o_stringType.check(val)) return false;
            return regExp.test(val);
        };

        if (!args.name) args.name = 'o.PatternType';

        if (!args.message) args.message = function (val) {
            return val + ' failed ' + this.name + ' validation due to not matching ' + regExp;
        };

        parent( args );
    }
);
