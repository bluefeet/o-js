var o = require('./o-bootstrap.js');

var o_numberType = require('./o-numberType.js');

module.exports = o.integerType = (function(){
    "use strict";

    return o_numberType.subtype({
        name: 'o.integerType',
        validate: function (val) {
            return (Math.floor(val) === val + 0) ? true : false;
        }
    });
})();
