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
var o_Trait;

o_Trait = o_construct(
    function (args) {
        for (var i = 0, l = traitAttrs.length; i < l; i++) {
            traitAttrs[i].setValueFromArgs( this, args );
        }
    },
    {
        install: function (obj, args) {
            var i, l, name;

            var requires = this.requires();
            for (i = 0, l = requires.length; i < l; i++) {
                if (obj[requires[i]] !== undefined) continue;
                throw new Error( required[i] + ' is required.' );
            }

            var traits = this.traits();
            for (i = 0, l = traits.length; i < l; i++) {
                traits[i].install( obj );
            }

            var attributes = this.attributes();
            for (name in attributes) {
                attributes[name].install( obj );
            }

            var methods = this.methods();
            for (name in methods) {
                obj[name] = methods[name];
            }

            var around = this.around();
            for (name in around) {
                obj[name] = o_around( obj[name], around[name] );
            }

            var before = this.before();
            for (name in before) {
                obj[name] = o_before( obj[name], before[name] );
            }

            var after = this.after();
            for (name in after) {
                obj[name] = o_after( obj[name], after[name] );
            }

            if (args) this.setFromArgs( obj, args );

            return obj;
        },

        setFromArgs: function (obj, args) {
            // Set the attributes that do not have filters first so
            // that any filters that depend on other attributes are set
            // last.  Avoids a common race conditions when using filters.
            var attributes = this.attributes();
            var name;

            for (name in attributes) {
                if (attributes[name].filter()) continue;
                attributes[name].setValueFromArgs( obj, args );
            }

            for (name in attributes) {
                if (!attributes[name].filter()) continue;
                attributes[name].setValueFromArgs( obj, args );
            }
        },

        buildType: function () {
            var duck = {};
            var name;

            var attributes = this.attributes();
            for (name in attributes) {
                var attribute = attributes[name];
                if (attribute.reader()) duck[attribute.reader()] = o_functionType;
                if (attribute.writer()) duck[attribute.writer()] = o_functionType;
                if (attribute.predicate()) duck[attribute.predicate()] = o_functionType;
                if (attribute.clearer()) duck[attribute.clearer()] = o_functionType;
            }

            for (name in this.methods()) {
                duck[name] = o_functionType;
            }

            var isPrivate = /^_/m;
            for (name in duck) {
                if (name.match(isPrivate)) delete duck[name];
            }

            duck = new o_DuckType( duck );
            var traits = this.traits();
            if (!traits.length) return duck;

            var ducks = [ duck ];
            for (var i = 0, l = traits.length; i < l; i++) {
                ducks.push( traits[i].type() );
            }

            return( new o_AllType(ducks) );
        }
    }
);

traitAttrs = [
    {
        key: 'requires',
        type: new o_ArrayOfType( o_definedType ),
        devoid: function () { return []; }
    },

    {
        key: 'traits',
        type: new o_ArrayOfType( new o_InstanceOfType( o_Trait ) ),
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
                    if (attribute.key() !== key) attribute = attribute.rebuild({ key: key });
                }
                else {
                    attribute = new o_Attribute( o_merge({}, attribute, { key:key }) );
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

var traitProto = o_Trait.prototype;
for (var i = 0, l = traitAttrs.length; i < l; i++) {
    traitAttrs[i] = new o_Attribute( traitAttrs[i] );
    traitAttrs[i].install( traitProto );
}

module.exports = o_Trait;
