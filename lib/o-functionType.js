var o = require('./o-bootstrap.js');

var o_InstanceOfType = require('./o-InstanceOfType.js');

module.exports = o.functionType = (function(){
    "use strict";

    return new o_InstanceOfType(
        Function,
        { name: 'o.functionType' }
    );
})();
