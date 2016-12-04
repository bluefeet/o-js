var o = require('./o-bootstrap.js');

var o_InstanceOfType = require('./o-InstanceOfType.js');

module.exports = o.objectType = (function(){
    "use strict";

    return new o_InstanceOfType(
        Object,
        { name: 'o.objectType' }
    );
})();
