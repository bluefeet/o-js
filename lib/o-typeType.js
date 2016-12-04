var o = require('./o-bootstrap.js');

var o_InstanceOfType = require('./o-InstanceOfType.js');
var o_Type = require('./o-Type.js');

module.exports = o.typeType = (function(){
    "use strict";

    return new o_InstanceOfType(
        o_Type,
        { name: 'o.typeType' }
    );
})();
