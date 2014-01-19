var o_Trait = require('./o-Trait.js');
var o_typeType = require('./o-typeType.js');
var o_traitType = require('./o-traitType.js');
var o_InstanceOfType = require('./o-InstanceOfType.js');

module.exports = new o_Trait({
    attributes: {
        type: {
            type: o_typeType,
            builder: true,
            argKey: null
        },
        trait: {
            type: o_traitType,
            required: true
        }
    },
    methods: {
        buildType: function () {
            return new o_InstanceOfType( this );
        }
    }
});
