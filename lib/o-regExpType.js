var o = require('./o-bootstrap.js');

var o_InstanceOfType = require('./o-InstanceOfType.js');

module.exports = o.regExpType = (function(){
    "use strict";

    return new o_InstanceOfType(
        RegExp,
        { name: 'o.regExpType' }
    );
})();
