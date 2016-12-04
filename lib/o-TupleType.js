var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');
var o_arrayType = require('./o-arrayType.js');

module.exports = o.TupleType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, types, args) {
            args = args || {};

            if (!args.validate) args.validate = function (ary) {
                if (!o_arrayType.check(ary)) return false;
                if (ary.length != types.length) return false;
                for (var i in ary) {
                    if (!types[i]) return false;
                    if (!types[i].check(ary[i])) return false;
                }
                return true;
            };

            if (!args.coerce) args.coerce = function (ary) {
                if (!this.check(ary)) return ary;
                for (var i in ary) {
                    if (!types[i]) continue;
                    ary[i] = types[i].coerce( ary[i] );
                }
                return ary;
            };

            if (!args.name) args.name = 'o.TupleType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to one of the array values ' +
                'not passing the [' + types.map(function(type){ return type.name; }).join(',') + '] ' +
                'tuple of type checks.';
            };

            parent( args );
        }
    );
})();
