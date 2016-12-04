var o = require('./o-bootstrap.js');

var o_InstanceOfType = require('./o-InstanceOfType.js');
var o_Trait = require('./o-Trait.js');

module.exports = o.traitType = (function(){
    "use strict";

    return new o_InstanceOfType(
        o_Trait,
        { name: 'o.traitType' }
    );
})();
