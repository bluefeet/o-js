var o = require('./o-bootstrap.js');

var o_InstanceOfType = require('./o-InstanceOfType.js');

module.exports = o.arrayType = (function(){
    "use strict";

    return new o_InstanceOfType(
        Array,
        { name: 'o.arrayType' }
    );
})();
