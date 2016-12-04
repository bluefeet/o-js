var o = require('./o-bootstrap.js');

var o_objectType = require('./o-objectType.js');

module.exports = o.simpleObjectType = (function(){
    "use strict";

    return o_objectType.subtype({
        name: 'o.simpleObjectType',
        validate: function (val) {
            return (val.constructor === Object) ? true : false;
        }
    });
})();
