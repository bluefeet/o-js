var o_AnyType = require('./o-AnyType.js');
var o_booleanType = require('./o-booleanType.js');
var o_identifierType = require('./o-identifierType.js');
var o_nullType = require('./o-nullType.js');
var o_definedType = require('./o-definedType.js');
var o_ucFirst = require('./o-ucFirst.js');
var o_EnumType = require('./o-EnumType.js');
var o_typeType = require('./o-typeType.js');
var o_functionType = require('./o-functionType.js');
var o_ObjectOfType = require('./o-ObjectOfType.js');
var o_writer = require('./o-writer.js');
var o_reader = require('./o-reader.js');
var o_merge = require('./o-merge.js');
var o_construct = require('./o-construct.js');
var o_clone = require('./o-clone.js');
var o_accessor = require('./o-accessor.js');
var o_predicate = require('./o-predicate.js');
var o_clearer = require('./o-clearer.js');

var booleanOrIdentifierType = new o_AnyType([
    o_booleanType,
    o_identifierType
]);

var attrAttrs = {
    key: {
        type: o_identifierType,
        required: true
    },
    argKey: {
        type: new o_AnyType([ o_identifierType, o_nullType ]),
        devoid: function () { return this.key(); }
    },
    valueKey: {
        type: o_identifierType,
        devoid: function () { return '_' + this.key(); }
    },

    devoid: { type: o_definedType },
    builder: {
        type: booleanOrIdentifierType,
        devoid: false,
        filter: function (val) { if (val === true) val = 'build' + o_ucFirst( this.key() ); return val; }
    },
    required: { type: o_booleanType, devoid: false },
    type: {
        type: new o_AnyType([
            new o_EnumType(['undefined', 'object', 'boolean', 'number', 'string', 'function']),
            o_typeType,
            o_functionType
        ])
    },
    coerce: { type: o_booleanType, devoid: false },
    filter: { type: o_functionType },
    augments: { type: o_functionType },
    chain: { type: o_booleanType, devoid: false },

    reader: {
        type: booleanOrIdentifierType,
        devoid: true,
        filter: function (val) { if (val === true) val = this.key(); return val; }
    },
    writer: {
        type: booleanOrIdentifierType,
        devoid: false,
        filter: function (val) { if (val === true) val = this.key(); return val; }
    },
    predicate: {
        type: booleanOrIdentifierType,
        devoid: false,
        filter: function (val) { if (val === true) val = 'has' + o_ucFirst( this.key() ); return val; }
    },
    clearer: {
        type: booleanOrIdentifierType,
        devoid: false,
        filter: function (val) { if (val === true) val = 'clear' + o_ucFirst( this.key() ); return val; }
    },
    proxies: { type: new o_ObjectOfType( o_identifierType ) }
};

var attrWriters = {};
var attrReaders = {};
for (var key in attrAttrs) {
    attrWriters[key] = o_writer( '_' + key, attrAttrs[key] );
    attrReaders[key] = o_reader( '_' + key, o_merge( { writer: attrWriters[key] }, attrAttrs[key] ) );
}

module.exports = o_construct(
    function (args) {
        args = args || {};
        this._originalArgs = o_clone( args );
        // Write the "key" attribute first as some filters depend on it.
        attrWriters.key.call( this, args.key );
        for (var key in args) {
            attrWriters[key].call( this, args[key] );
        }
    },
    o_merge(
        {
            readerMethod: o_reader('_readerMethod', {
                type: o_functionType,
                devoid: function () {
                    return o_reader(
                        this.valueKey(),
                        {
                            devoid:    this.devoid(),
                            builder:   this.builder(),
                            required:  this.required(),
                            writer:    this.writerMethod(),
                            predicate: this.predicateMethod()
                        }
                    );
                }
            }),
            writerMethod: o_reader('_writerMethod', {
                type: o_functionType,
                devoid: function () {
                    return o_writer(
                        this.valueKey(),
                        {
                            type: this.type(),
                            coerce: this.coerce(),
                            filter: this.filter(),
                            augments: this.augments(),
                            chain: this.chain()
                        }
                    );
                }
            }),
            accessorMethod: o_reader('_accessorMethod', {
                type: o_functionType,
                devoid: function () {
                    return o_accessor(
                        this.valueKey(),
                        {
                            writer: this.writerMethod(),
                            reader: this.readerMethod()
                        }
                    );
                }
            }),
            predicateMethod: o_reader('_predicateMethod', {
                type: o_functionType,
                devoid: function () {
                    return o_predicate( this.valueKey() );
                }
            }),
            clearerMethod: o_reader('_clearerMethod', {
                type: o_functionType,
                devoid: function () {
                    return o_clearer( this.valueKey() );
                }
            }),
            proxyMethods: o_reader('_proxyMethods', {
                type: new o_ObjectOfType( o_functionType ),
                devoid: function () {
                    var methods = {};
                    var proxies = this.proxies();
                    if (proxies === undefined) return methods;

                    var attr = this;
                    for (var key in proxies) {
                        // The way JS closures work requires us to copy the key variable via
                        // a function call so that it does not get changed by the for loop.
                        methods[key] = (function (toMethod) {
                            return function () {
                                var val = attr.getValue( this );
                                return val[ toMethod ].apply( val, arguments );
                            };
                        })( proxies[key] );
                    }
                    return methods;
                }
            }),

            getValue: function (obj) {
                return this.readerMethod().call( obj );
            },
            setValue: function (obj, value) {
                return this.writerMethod().call( obj, value );
            },
            hasValue: function (obj) {
                return this.predicateMethod().call( obj );
            },
            clearValue: function (obj) {
                return this.clearerMethod().call( obj );
            },

            setValueFromArgs: function (obj, args) {
                if (this.argKey() === null) return;
                if (args[this.argKey()] === undefined) return;
                return this.setValue( obj, args[this.argKey()] );
            },

            install: function (obj, value) {
                if (this.writer() !== null && this.writer() === this.reader()) {
                    obj[this.writer()] = this.accessorMethod();
                }
                else {
                    if (this.writer() !== null) obj[this.writer()] = this.writerMethod();
                    if (this.reader() !== null) obj[this.reader()] = this.readerMethod();
                }

                if (this.predicate() !== null) obj[this.predicate()] = this.predicateMethod();
                if (this.clearer() !== null) obj[this.clearer()] = this.clearerMethod();

                var proxyMethods = this.proxyMethods();
                for (var key in proxyMethods) {
                    obj[key] = proxyMethods[key];
                }

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
        },
        attrReaders
    )
);
