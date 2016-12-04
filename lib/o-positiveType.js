var o = require('./o-bootstrap.js');

var o_numberType = require('./o-numberType.js');

module.exports = o.positiveType = (function(){
    "use strict";

    return o_numberType.subtype({
        name: 'o.positiveType',
        validate: function (val) {
            return (val > 0) ? true : false;
        }
    });
})();
