var o_construct = require('./o-construct.js');
var o_Trait = require('./o-Trait.js');
var o_classTrait = require('./o-classTrait.js');

module.exports = o_construct(
    function (args) {
        var trait = new o_Trait( args );
        var constructor = function (args) {
            trait.setFromArgs( this, args );
        };
        trait.install( constructor.prototype );
        o_classTrait.install( constructor, {trait:trait} );
        return constructor;
    }
);
