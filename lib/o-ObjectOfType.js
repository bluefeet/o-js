var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_objectType = require('./o-objectType.js');

module.exports = o.ObjectOfType = o_augment(
    o_Type,
    function (parent, type, args) {
        args = args || {};

        if (!args.parent) args.parent = o_objectType;

        if (!args.validate) args.validate = function (obj) {
            for (var key in obj) {
                if (!type.check(obj[key])) return false;
            }
            return true;
        };

        if (!args.coerce) args.coerce = function (obj) {
            if (!this.check(obj)) return obj;
            for (var key in obj) {
                obj[key] = type.coerce( obj[key] );
            }
            return obj;
        };

        if (!args.name) args.name = 'o.ObjectOfType';

        if (!args.message) args.message = function (val) {
            return val + ' failed ' + this.name + ' validation due to one of the object values ' +
                'not passing the ' + type.name + ' type check.';
        };

        parent( args );
    }
);
