var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_objectType = require('./o-objectType.js');

module.exports = o.ObjectOfType = o_augment(
    o_Type,
    function (parent, type, args) {
        args = args || {};
        args.validate = function (obj) {
            if (!o_objectType.check(obj)) return false;
            for (var key in obj) {
                if (!type.check(obj[key])) return false;
            }
            return true;
        };
        args.coerce = function (obj) {
            if (!this.check(obj)) return obj;
            for (var key in obj) {
                obj[key] = type.coerce( obj[key] );
            }
            return obj;
        };
        parent( args );
    }
);
