var o = require('./o-bootstrap.js');

var o_Trait = require('./o-Trait.js');
var o_liteAttributeTrait = require('./o-liteAttributeTrait.js');
var o_traitType = require('./o-traitType.js');

module.exports = o.liteClassTrait = (function(){
    "use strict";

    return new o_Trait({
        attributes: {
            attributesAre: {
                type: o_traitType,
                devoid: 'lite',
                filter: function (val) {
                    if (o_traitType.check(val)) return val;
                    return o[val + 'AttributeTrait'];
                }
            }
        }
    });
})();
