var o = require('./o-bootstrap.js');

var o_AnyType = require('./o-AnyType.js');
var o_booleanType = require('./o-booleanType.js');
var o_identifierType = require('./o-identifierType.js');
var o_nullType = require('./o-nullType.js');
var o_definedType = require('./o-definedType.js');
var o_simpleObjectType = require('./o-simpleObjectType.js');
var o_prependIdentifier = require('./o-prependIdentifier.js');
var o_EnumType = require('./o-EnumType.js');
var o_typeType = require('./o-typeType.js');
var o_functionType = require('./o-functionType.js');
var o_ObjectOfType = require('./o-ObjectOfType.js');
var o_ArrayOfType = require('./o-ArrayOfType.js');
var o_arrayType = require('./o-arrayType.js');
var o_InstanceOfType = require('./o-InstanceOfType.js');
var o_LazyType = require('./o-LazyType.js');
var o_writer = require('./o-writer.js');
var o_reader = require('./o-reader.js');
var o_merge = require('./o-merge.js');
var o_construct = require('./o-construct.js');
var o_clone = require('./o-clone.js');
var o_predicate = require('./o-predicate.js');
var o_clearer = require('./o-clearer.js');

module.exports = o.Attribute = (function(){
    "use strict";

    var key; // Used by several for loops.

    var booleanOrIdentifierType = new o_AnyType([
        o_booleanType,
        o_identifierType
    ]);

    var attrTraitType = new o_LazyType(function(){
        return new o_InstanceOfType( o.Trait );
    });
    var attrTraitsType = new o_LazyType(function(){
        return new o_ArrayOfType( attrTraitType );
    });

    var attrArgs = {
        key: {
            type: o_identifierType,
            required: true
        },
        argKey: {
            type: new o_AnyType([ o_identifierType, o_nullType ]),
            devoid: function () { return this.key; }
        },
        valueKey: {
            type: o_identifierType,
            devoid: function () { return '__' + this.key; }
        },

        is: {
            type: attrTraitType,
            filter: function (val) {
                if (attrTraitType.check(val)) return val;
                return o[val + 'AttributeTrait'];
            }
        },
        traits: {
            type: attrTraitsType,
            devoid: function () { return []; }
        },

        devoid: {
            type: o_definedType
        },
        builder: {
            type: booleanOrIdentifierType,
            filter: function (val) { if (val === true) val = o_prependIdentifier('_build',this.key); return val; }
        },
        required: {
            type: o_booleanType
        },
        type: {
            type: new o_AnyType([
                new o_EnumType(['undefined', 'object', 'boolean', 'number', 'string', 'function']),
                o_typeType,
                o_functionType
            ])
        },
        coerce: {
            type: o_booleanType
        },
        filter: {
            type: o_functionType
        },
        augments: {
            type: o_functionType
        },
        chain: {
            type: o_booleanType
        },

        reader: {
            type: booleanOrIdentifierType,
            devoid: true,
            filter: function (val) { if (val === true) val = this.key; return val; }
        },
        writer: {
            type: booleanOrIdentifierType,
            filter: function (val) { if (val === true) val = this.key; return val; }
        },
        predicate: {
            type: booleanOrIdentifierType,
            filter: function (val) { if (val === true) val = o_prependIdentifier('has',this.key); return val; }
        },
        clearer: {
            type: booleanOrIdentifierType,
            filter: function (val) { if (val === true) val = o_prependIdentifier('clear',this.key); return val; }
        },
        proxies: {
            type: new o_ObjectOfType( o_identifierType ),
            devoid: function () { return {}; }
        },

        getMethodName: {
            type: o_identifierType,
            devoid: function () { return o_prependIdentifier('_get',this.key); }
        },
        setMethodName: {
            type: o_identifierType,
            devoid: function () { return o_prependIdentifier('_set',this.key); }
        },
        predicateGetMethodName: {
            type: o_identifierType,
            devoid: function () { return o_prependIdentifier('_predicateGet',this.key); }
        }
    };

    var attrAttrs = {
        getMethod: {
            type: o_functionType,
            devoid: function () {
                return o_reader(
                    this.valueKey,
                    {
                        devoid:    this.devoid,
                        builder:   this.builder,
                        required:  this.required,
                        writer:    this.setMethod,
                        predicate: this.predicateMethod
                    }
                );
            }
        },
        propGetMethod: {
            type: o_functionType,
            devoid: function () {
                var method = this.getMethodName;
                return function () {
                    return this[method]();
                };
            }
        },
        setMethod: {
            type: o_functionType,
            devoid: function () {
                return o_writer(
                    this.valueKey,
                    {
                        type: this.type,
                        coerce: this.coerce,
                        filter: this.filter,
                        augments: this.augments,
                        chain: this.chain
                    }
                );
            }
        },
        propSetMethod: {
            type: o_functionType,
            devoid: function () {
                var method = this.setMethodName;
                return function (val) {
                    this[method](val);
                };
            }
        },
        predicateGetMethod: {
            type: o_functionType,
            devoid: function () {
                return o_predicate( this.valueKey );
            }
        },
        propPredicateGetMethod: {
            type: o_functionType,
            devoid: function () {
                var method = this.predicateGetMethodName;
                return function () {
                    return this[method]();
                };
            }
        },
        clearerMethod: {
            type: o_functionType,
            devoid: function () {
                return o_clearer( this.valueKey );
            }
        },
        proxyProperties: {
            type: o.simpleObjectType,
            devoid: function () {
                var props = {};
                var proxies = this.proxies;
                if (proxies === undefined) return props;

                var attr = this;
                for (var key in proxies) {
                    props[key] = ( function(key){ return {
                        get: function () {
                            var obj = attr.getValue( this );
                            var val = obj[key];
                            if (typeof val !== 'function') return val;
                            return val.bind( obj );
                        },
                        set: function (val) {
                            var obj = attr.getValue( this );
                            obj[ key ] = val;
                        }
                    }; })( proxies[key] );
                }
                return props;
            }
        }
    };

    var attrWriters = {};
    var attrReaders = {};
    for (key in attrArgs) {
        attrWriters[key] = o_writer( '_' + key, attrArgs[key] );
        attrReaders[key] = o_reader( '_' + key, o_merge( { writer: attrWriters[key] }, attrArgs[key] ) );
    }
    for (key in attrAttrs) {
        attrReaders[key] = o_reader( '_' + key, o_merge( { writer: attrWriters[key] }, attrAttrs[key] ) );
    }

    var o_Attribute = o_construct(
        function (args) {
            args = args || {};
            this._originalArgs = o_clone( args );

            var ignores = {};

            // Write the "key" attribute first as some filters depend on it.
            attrWriters.key.call( this, args.key );
            ignores.key = true;

            for (var name in args) {
                if (!attrWriters[name]) continue;
                attrWriters[name].call( this, args[name] );
                ignores[name] = true;
            }

            var is = this.is;
            if (is) is.install( this, args, ignores );

            var traits = this.traits;
            for (var i = 0, l = traits.length; i < l; i++) {
                traits[i].install( this, args, ignores );
            }
        },
        {
            getValue: function (obj) {
                return this.getMethod.call( obj );
            },
            setValue: function (obj, value) {
                return this.setMethod.call( obj, value );
            },
            hasValue: function (obj) {
                return this.predicateMethod.call( obj );
            },
            clearValue: function (obj) {
                return this.clearerMethod.call( obj );
            },

            setValueFromArgs: function (obj, args, ignores) {
                var argKey = this.argKey;
                if (!argKey) return;
                if (args[argKey] === undefined) return;
                if (ignores) ignores[argKey] = true;
                return this.setValue( obj, args[argKey] );
            },

            install: function (obj, value) {
                var props = {};

                if (this.valueKey !== this.key) {
                    if (this.reader) obj[this.getMethodName] = this.getMethod;
                    if (this.writer) obj[this.setMethodName] = this.setMethod;

                    if (this.writer && this.writer === this.reader) {
                        props[this.writer] = {
                            get: this.propGetMethod,
                            set: this.propSetMethod
                        };
                    }
                    else {
                        if (this.reader) props[this.reader] = { get:this.propGetMethod };
                        if (this.writer) props[this.writer] = { set:this.propSetMethod };
                    }
                }

                if (this.predicate) {
                    obj[this.predicateGetMethodName] = this.predicateGetMethod;
                    props[this.predicate] = { get:this.propPredicateGetMethod };
                }

                if (this.clearer) obj[this.clearer] = this.clearerMethod;

                Object.defineProperties( obj, props );
                Object.defineProperties( obj, this.proxyProperties );

                if (value) this.setValue( obj, value );

                return obj;
            },

            rebuild: function (args) {
                var Constructor = this.constructor;
                return new Constructor( o_merge(
                    {},
                    this._originalArgs,
                    args
                ));
            }
        }
    );

    var attrProps = {};
    for (key in attrReaders) {
        attrProps[key] = { get:attrReaders[key] };
    }
    Object.defineProperties( o_Attribute.prototype, attrProps );

    return o_Attribute;
})();
