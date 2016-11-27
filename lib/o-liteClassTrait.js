var o = require('./o-bootstrap.js');

var o_Trait = require('./o-Trait.js');
var o_liteAttributeTrait = require('./o-liteAttributeTrait.js');

module.exports = o.liteClassTrait = new o_Trait({
    methods: {
        attributesAre: function () { return o_liteAttributeTrait; }
    }
});
