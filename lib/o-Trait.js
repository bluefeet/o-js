var o = require('./o-bootstrap.js');

var o_construct = require('./o-construct.js');
var o_around = require('./o-around.js');
var o_before = require('./o-before.js');
var o_after = require('./o-after.js');
var o_functionType = require('./o-functionType.js');
var o_DuckType = require('./o-DuckType.js');
var o_AllType = require('./o-AllType.js');
var o_ArrayOfType = require('./o-ArrayOfType.js');
var o_definedType = require('./o-definedType.js');
var o_ObjectOfType = require('./o-ObjectOfType.js');
var o_attributeType = require('./o-attributeType.js');
var o_Attribute = require('./o-Attribute.js');
var o_merge = require('./o-merge.js');
var o_typeType = require('./o-typeType.js');
var o_InstanceOfType = require('./o-InstanceOfType.js');

var traitAttrs;

o.Trait = o_construct(
    function (args) {
        if (typeof args === 'function') args = this.functionToArgs( args );

        args = args || {};
        var ignores = {};
        for (var i = 0, l = traitAttrs.length; i < l; i++) {
            traitAttrs[i].setValueFromArgs( this, args, ignores );
            if (traitAttrs[i].key == 'is') {
                var is = this.is;
                if (is) is.install( this, args, ignores );
            }
        }
    },
    {
        functionToArgs: function (func) {
            var args = {
                requires: [],
                traits: [],
                attributeTraits: [],
                attributes: {},
                methods: {},
                around: {},
                before: {},
                after: {}
            };

            var scope = {
                require: function (name) { args.requires.push(name); },
                is: function (name) { args.is = name; },
                trait: function (name) { args.traits.push(name); },
                attributesAre: function (name) { args.attributesAre = name; },
                attributeTrait: function (name) { args.attributeTraits.push(name); },
                attribute: function (name,props) { args.attributes[name] = props; },
                method: function (name,func) { args.methods[name] = func; },
                around: function (name,func) { args.around[name] = func; },
                before: function (name,func) { args.before[name] = func; },
                after: function (name,func) { args.after[name] = func; }
            };

            func.apply( scope );

            return args;
        },
        install: function (obj, args, ignores) {
            var i, l, name;

            var requires = this.requires;
            if (requires) requires.validate( obj );

            var methods = this.methods;
            for (name in methods) {
                obj[name] = methods[name];
            }

            var traits = this.traits;
            for (i = 0, l = traits.length; i < l; i++) {
                traits[i].install( obj );
            }

            var attributes = this.attributes;
            for (name in attributes) {
                attributes[name].install( obj );
            }

            var around = this.around;
            for (name in around) {
                obj[name] = o_around( obj[name], around[name] );
            }

            var before = this.before;
            for (name in before) {
                obj[name] = o_before( obj[name], before[name] );
            }

            var after = this.after;
            for (name in after) {
                obj[name] = o_after( obj[name], after[name] );
            }

            if (args) this.setFromArgs( obj, args, ignores );

            return obj;
        },

        setFromArgs: function (obj, args, ignores) {
            // Set the attributes that do not have filters first so
            // that any filters that depend on other attributes are set
            // last.  Avoids a common race conditions when using filters.
            var attributes = this.attributes;
            if (!ignores) ignores = {};
            var i, l, name;

            for (name in attributes) {
                if (attributes[name].filter) continue;
                attributes[name].setValueFromArgs( obj, args, ignores );
            }

            for (name in attributes) {
                if (!attributes[name].filter) continue;
                attributes[name].setValueFromArgs( obj, args, ignores );
            }

            var traits = this.traits;
            for (i = 0, l = traits.length; i < l; i++) {
                traits[i].setFromArgs( obj, args, ignores );
            }
        },

        _buildType: function () {
            var duck = {};
            var name;

            var attributes = this.attributes;
            for (name in attributes) {
                var attribute = attributes[name];
                if (attribute.reader) duck[attribute.reader] = o_functionType;
                if (attribute.writer) duck[attribute.writer] = o_functionType;
                if (attribute.predicate) duck[attribute.predicate] = o_functionType;
                if (attribute.clearer) duck[attribute.clearer] = o_functionType;
            }

            for (name in this.methods) {
                duck[name] = o_functionType;
            }

            var isPrivate = /^_/m;
            for (name in duck) {
                if (name.match(isPrivate)) delete duck[name];
            }

            duck = new o_DuckType( duck );
            var traits = this.traits;
            if (!traits.length) return duck;

            var ducks = [ duck ];
            for (var i = 0, l = traits.length; i < l; i++) {
                ducks.push( traits[i].type );
            }

            return( new o_AllType(ducks) );
        }
    }
);

var traitType = new o_InstanceOfType( o.Trait );
var traitsType = new o_ArrayOfType( traitType );

traitAttrs = [
    {
        key: 'requires',
        type: new o_InstanceOfType( o_DuckType ),
        coerce: true
    },

    {
        key: 'is',
        type: traitType,
        filter: function (val) {
            if (traitType.check(val)) return val;
            return o[val + 'ClassTrait'];
        }
    },
    {
        key: 'traits',
        type: traitsType,
        devoid: function () { return []; }
    },

    {
        key: 'attributesAre',
        type: traitType,
        filter: function (val) {
            if (traitType.check(val)) return val;
            return o[val + 'AttributeTrait'];
        }
    },
    {
        key: 'attributeTraits',
        type: traitsType,
        devoid: function () { return []; }
    },

    {
        key: 'attributes',
        type: new o_ObjectOfType( o_attributeType ),
        devoid: function () { return {}; },
        filter: function (val) {
            var attributes = {};
            for (var key in val) {
                var attribute = val[key];
                if (o_attributeType.check(attribute)) {
                    if (attribute.key !== key) attribute = attribute.rebuild({ key: key });
                }
                else {
                    var config = {
                        key: key,
                        traits: this.attributeTraits
                    };
                    if (this.attributesAre) config.is = this.attributesAre;

                    attribute = new o_Attribute(
                        o_merge(
                            {},
                            attribute,
                            config
                        )
                    );
                }
                attributes[key] = attribute;
            }
            return attributes;
        }
    },

    {
        key: 'methods',
        type: new o_ObjectOfType( o_functionType ),
        devoid: function () { return {}; }
    },

    {
        key: 'around',
        type: new o_ObjectOfType( o_functionType ),
        devoid: function () { return {}; }
    },

    {
        key: 'before',
        type: new o_ObjectOfType( o_functionType ),
        devoid: function () { return {}; }
    },

    {
        key: 'after',
        type: new o_ObjectOfType( o_functionType ),
        devoid: function () { return {}; }
    },

    {
        key: 'type',
        type: o_typeType,
        builder: true,
        argKey: null
    }
];

var traitProto = o.Trait.prototype;
for (var i = 0, l = traitAttrs.length; i < l; i++) {
    traitAttrs[i] = new o_Attribute( traitAttrs[i] );
    traitAttrs[i].install( traitProto );
}

module.exports = o.Trait;
