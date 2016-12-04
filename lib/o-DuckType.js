var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_objectType = require('./o-objectType.js');
var o_arrayType = require('./o-arrayType.js');
var o_simpleObjectType = require('./o-simpleObjectType.js');

module.exports = o.DuckType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, properties, args) {
            args = args || {};

            if (!args.parent) args.parent = o_objectType;

            if (!args.validate) args.validate = function (val) {
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

            if (!args.name) args.name = 'o.DuckType';

            if (!args.message) args.message = function (val) {
                var msg = [];
                msg.push(val + ' failed ' + this.name + ' validation due to ');
                if (o_arrayType.check(properties)) {
                    msg.push('not having the [' + properties.join(',') + '] properties set');
                }
                else if (o_simpleObjectType.check(properties)) {
                    msg.push('not having the {');
                    var msg_props = [];
                    for (var key in properties) {
                        msg_props.push(key + ':' + properties[key].name);
                    }
                    msg.push( msg_props.join(',') );
                    msg.push('} properties set');
                }
                return msg.join('') + '.';
            };

            parent( args );
        }
    );
})();
