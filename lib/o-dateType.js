var o = require('./o-bootstrap.js');

var o_InstanceOfType = require('./o-InstanceOfType.js');

module.exports = o.dateType = (function(){
    "use strict";

    return new o_InstanceOfType(
        Date,
        { name: 'o.dateType' }
    );
})();
