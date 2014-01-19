var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_objectType = require('./o-objectType.js');
var o_arrayType = require('./o-arrayType.js');
var o_simpleObjectType = require('./o-simpleObjectType.js');

module.exports = o_augment(
    o_Type,
    function (parent, properties, args) {
        args = args || {};
        args.validate = function (val) {
            if (!o_objectType.check(val)) return false;
            if (o_arrayType.check(properties)) {
                for (var i = 0, l = properties.length; i < l; i++) {
                    if (val[properties[i]] === undefined) return false;
                }
                return true;
            }
            else if (o_simpleObjectType.check(properties)) {
                for (var key in properties) {
                    if (val[key] === undefined) return false;
                    if (!properties[key].check(val[key])) return false;
                }
                return true;
            }
            return false;
        };
        parent( args );
    }
);
