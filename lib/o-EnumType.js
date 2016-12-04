var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o.EnumType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, values, args) {
            args = args || {};

            if (!args.validate) args.validate = function (val) {
                for (var i = 0, l = values.length; i < l; i++) {
                    if (val === values[i]) return true;
                }
                return false;
            };

            if (!args.name) args.name = 'o.EnumType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to not being one of ' +
                    '[' + values.join(',') + '].';
            };

            parent( args );
        }
    );
})();
