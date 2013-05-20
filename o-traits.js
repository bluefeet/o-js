(function() {
    var o = this.oJS;
    if (typeof exports !== 'undefined') {
        o = require('o-core');
        require('o-types');
        require('o-attributes');
    }
    if (!o) throw new Error('...');

    var traitAttrs = [];

    o.Trait = o.construct(
        function (args) {
            for (var i = 0, l = traitAttrs.length; i < l; i++) {
                traitAttrs[i].setValueFromArgs( this, args );
            }
        },
        {
            install: function (obj) {
                var traits = this.traits();
                for (var i = 0, l = traits.length; i < l; i++) {
                    traits[i].install( obj );
                }

                var attributes = this.attributes();
                for (var i = 0, l = attributes.length; i < l; i++) {
                    attributes[i].install( obj );
                }

                var methods = this.methods();
                for (var name in methods) {
                    obj[name] = methods[name];
                }

                var around = this.around();
                for (var name in around) {
                    obj[name] = o.around( obj[name], around[name] );
                }

                var before = this.before();
                for (var name in before) {
                    obj[name] = o.before( obj[name], before[name] );
                }

                var after = this.after();
                for (var name in after) {
                    obj[name] = o.after( obj[name], after[name] );
                }
            }
        }
    );

    traitAttrs.push( new o.Attribute({
        key: 'traits',
        argKey: 'with',
        type: new o.ArrayOfType( new o.InstanceOfType( o.Trait ) ),
        devoid: function () { return [] },
        writer: null
    }) );

    traitAttrs.push( new o.Attribute({
        key: 'attributes',
        argKey: 'has',
        type: new o.ArrayOfType( new o.InstanceOfType( o.Attribute ) ),
        devoid: function () { return {} },
        filter: function (val) {
            var attributes = [];
            for (var key in val) {
                attributes.push( new o.Attribute( o.merge({ key:key }, val[key]) ) );
            }
            return attributes;
        },
        writer: null,
    }) );

    traitAttrs.push( new o.Attribute({
        key: 'methods',
        type: new o.ObjectOfType( o.functionType ),
        devoid: function () { return {} },
        writer: null
    }) );

    traitAttrs.push( new o.Attribute({
        key: 'around',
        type: new o.ObjectOfType( o.functionType ),
        devoid: function () { return {} },
        writer: null
    }) );

    traitAttrs.push( new o.Attribute({
        key: 'before',
        type: new o.ObjectOfType( o.functionType ),
        devoid: function () { return {} },
        writer: null
    }) );

    traitAttrs.push( new o.Attribute({
        key: 'after',
        type: new o.ObjectOfType( o.functionType ),
        devoid: function () { return {} },
        writer: null
    }) );

    var proto = o.Trait.prototype;
    for (var i = 0, l = traitAttrs.length; i < l; i++) {
        traitAttrs[i].install( proto );
    }
}).call(this);
