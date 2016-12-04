var o = require('./o-bootstrap.js');

var o_numberType = require('./o-numberType.js');

module.exports = o.negativeType = (function(){
    "use strict";

    return o_numberType.subtype({
        name: 'o.negativeType',
        validate: function (val) {
            return (val < 0) ? true : false;
        }
    });
})();
