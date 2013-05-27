(function() {
    var o = this.oJS;
    if (typeof exports !== 'undefined') {
        o = require('o-core');
        require('o-types');
        require('o-attributes');
        require('o-traits');
    }
    if (!o) throw new Error('...');

    o.Constructor = o.construct(
        function (args) {
            var trait = new o.Trait( args );
            var Constructor = function (args) {
                trait.setFromArgs( this, args );
            };
            trait.install( Constructor.prototype );
            return Constructor;
        }
    );
}).call(this);
