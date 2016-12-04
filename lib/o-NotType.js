var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_NoneType = require('./o-NoneType.js');

module.exports = o.NotType = (function(){
    "use strict";

    return o_augment(
        o_NoneType,
        function (parent, type, args) {
            args = args || {};

            if (!args.name) args.name = 'o.NotType';

            parent( [type], args );
        }
    );
})();
