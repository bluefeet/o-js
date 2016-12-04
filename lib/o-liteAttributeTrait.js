var o = require('./o-bootstrap.js');

var o_Trait = require('./o-Trait.js');
var o_identifierType = require('./o-identifierType.js');

module.exports = o.liteAttributeTrait = (function(){
    "use strict";

    return new o_Trait({
        attributes: {
            valueKey: {
                type: o_identifierType,
                devoid: function () { return this.key; }
            }
        }
    });
})();
