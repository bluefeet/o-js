// o.js : DEVELOPMENT VERSION : https://o-js.com : MIT License

(function() {
'use strict';

var root = this;
var previousO = root.o;


// o.bootstrap
var o = {};
var o_bootstrap = o;

// o.clearer
var o_clearer = o.clearer = function (key) {
    return function () {
        delete this[key];
    };
};

// o.getPrototypeOf
var o_getPrototypeOf = o.getPrototypeOf = function (obj) {
    if (Object.getPrototypeOf) return Object.getPrototypeOf(obj);
    return Object.__proto__; // jshint ignore:line
};

// o.has
var o_has = o.has = function (obj, key) {
    return Object.prototype.hasOwnProperty.call( obj, key );
};

// o.local
var o_local = o.local = function (obj, prop, func) {
    var hasProp = o_has( obj, prop );
    var origVal = obj[prop];

    var ret;
    try {
        ret = func();
    }
    finally {
        if (hasProp) { obj[prop] = origVal; }
        else { delete obj[prop]; }
    }

    return ret;
};

// o.merge
var o_merge = o.merge = function () {
    var fromObjs = Array.prototype.slice.call(arguments);
    var toObj = fromObjs.shift();

    while (fromObjs.length) {
        var obj = fromObjs.shift();
        for (var key in obj) {
            if (o_has(obj, key)) toObj[key] = obj[key];
        }
    }

    return toObj;
};

// o.predicate
var o_predicate = o.predicate = function (key) {
    return function () {
        return( o_has( this, key ) && this[key] !== undefined );
    };
};

// o.proxy
var o_proxy = o.proxy = function (key, method) {
    return function () {
        return this[key][method].apply( this[key], arguments );
    };
};

// o.ucFirst
var o_ucFirst = o.ucFirst = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// o.writer
var o_writer = o.writer = function (key, def) {
    def = def || {};
    if (def.augments) def.type = def.type || 'object';

    return function (val) {
        if (def.filter) val = def.filter.call( this, val );

        if (def.type) {
            if (typeof def.type === 'string' || def.type instanceof String) {
                if (typeof val !== def.type) throw new Error( val + ' failed validation.' );
            }
            else if (def.type instanceof Function) {
                if (!def.type( val )) throw new Error( val + ' failed validation.' );
            }
            else if (def.type.coerce instanceof Function && def.type.validate instanceof Function) {
                if (def.coerce) {
                    val = def.type.coerce( val );
                }
                else {
                    def.type.validate( val );
                }
            }
        }

        if (def.augments) {
            if (!(val instanceof def.augments)) throw new Error( val + ' failed validation.' );
        }

        var original = this[key];
        this[key] = val;
        if (def.chain) return this;
        return original;
    };
};

// o.after
var o_after = o.after = function (original, func) {
    return function () {
        var ret = original.apply( this, arguments );
        func.call( this );
        return ret;
    };
};

// o.around
var o_around = o.around = function (original, func) {
    return function () {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var wrapper = function () {
            return original.apply( self, arguments );
        };
        args.unshift( wrapper );
        return func.apply( self, args );
    };
};

// o.before
var o_before = o.before = function (original, func) {
    return function () {
        func.call( this );
        return original.apply( this, arguments );
    };
};

// o.clone
var o_clone = o.clone = function (obj) {
    var newObj = Object.create( o_getPrototypeOf(obj) );
    newObj.constructor = obj.constructor;
    o_merge( newObj, obj );
    return newObj;
};

// o.construct
var o_construct = o.construct = function (constructor, proto) {
    o_merge( constructor.prototype, proto );
    return constructor;
};

// o.reader
var o_reader = o.reader = function (key, def) {
    def = def || {};
    def.writer = def.writer || o_writer( key, def );
    def.predicate = def.predicate || o_predicate( key );

    return function () {
        if (!def.predicate.call( this )) {
            if (def.required) throw new Error( key + ' is required.' );
            else if (def.devoid) {
                var val = def.devoid;
                if (val instanceof Function) val = val.call( this );
                def.writer.call( this, val );
            }
            else if (def.builder) {
                def.writer.call( this, this[def.builder].call(this) );
            }
        }

        return this[key];
    };
};

// o.Type
o.Type = o_construct(
    function (args) {
        args = args || {};
        if (typeof args === 'function') args = { validate: args };
        if (args.validate) this._validateMethod = args.validate;
        if (args.coerce) this._coerceMethod = args.coerce;
        if (args.parent) this._parent = args.parent;
    },
    {
        check: function (val) {
            if (o.Type.validationDisabled) return true;
            if (this._parent) { if (!this._parent.check(val)) return false; }
            if (!this._validateMethod) return true;
            if (!this._validateMethod( val )) return false;
            return true;
        },
        validate: function (val) {
            if (!this.check( val )) throw new Error( val + ' failed validation.' );
        },
        coerce: function (val) {
            val = this.coerceOnly( val );
            this.validate( val );
            return val;
        },
        coerceOnly: function (val) {
            if (this._parent) val = this._parent.coerceOnly( val );
            if (this._coerceMethod) val = this._coerceMethod( val );
            return val;
        },
        subtype: function (args) {
            if (typeof args === 'function') { args = { validate: args }; }
            return new o.Type(
                o_merge( {parent:this}, args )
            );
        }
    }
);

o.Type.validationDisabled = false;

var o_Type = o.Type;

// o.accessor
var o_accessor = o.accessor = function (key, def) {
    def = def || {};
    def.writer = def.writer || o_writer( key, def );
    def.reader = def.reader || o_reader( key, def );

    return function (val) {
        if (val !== undefined) return def.writer.call( this, val );
        return def.reader.call( this );
    };
};

// o.augment
var o_augment = o.augment = function (parent, constructor, proto) {
    var child = o_around(
        parent,
        constructor
    );

    childProto = Object.create( parent.prototype );
    if (proto) o_merge( childProto, proto );

    child.prototype = childProto;

    return child;
};

// o.disableTypeValidation
var o_disableTypeValidation = o.disableTypeValidation = function (func) {
    if (!func) {
        o_Type.validationDisabled = true;
        return;
    }

    return o_local(
        o_Type,
        'validationDisabled',
        function(){
            o_Type.validationDisabled = true;
            return func();
        }
    );
};

// o.AllType
var o_AllType = o.AllType = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};
        args.validate = function (val) {
            for (var i = 0, l = types.length; i < l; i++) {
                if (!types[i].check(val)) return false;
            }
            return true;
        };
        parent( args );
    }
);

// o.AnyType
var o_AnyType = o.AnyType = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};
        args.validate = function (val) {
            for (var i = 0, l = types.length; i < l; i++) {
                if (types[i].check(val)) return true;
            }
            return false;
        };
        parent( args );
    }
);

// o.EnumType
var o_EnumType = o.EnumType = o_augment(
    o_Type,
    function (parent, values, args) {
        args = args || {};
        args.validate = function (val) {
            for (var i = 0, l = values.length; i < l; i++) {
                if (val === values[i]) return true;
            }
            return false;
        };
        parent( args );
    }
);

// o.EqualType
var o_EqualType = o.EqualType = o_augment(
    o_Type,
    function (parent, expected, args) {
        args = args || {};
        args.validate = function (val) {
            return (val === expected) ? true : false;
        };
        parent( args );
    }
);

// o.InstanceOfType
var o_InstanceOfType = o.InstanceOfType = o_augment(
    o_Type,
    function (parent, Constructor, args) {
        args = args || {};
        args.validate = function (obj) {
            return (obj instanceof Constructor) ? true : false;
        };
        args.coerce = function (args) {
            return this.check( args ) ? args : new Constructor( args );
        };
        parent( args );
    }
);

// o.NoneType
var o_NoneType = o.NoneType = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};
        var type = new o_AnyType(types);
        args.validate = function (val) {
            return type.check(val) ? false : true;
        };
        parent( args );
    }
);

// o.NotType
var o_NotType = o.NotType = o_augment(
    o_NoneType,
    function (parent, type, args) {
        parent( [type], args );
    }
);

// o.TypeOfType
var o_TypeOfType = o.TypeOfType = o_augment(
    o_Type,
    function (parent, result, args) {
        args = args || {};
        args.validate = function (val) {
            return (typeof val === result) ? true : false;
        };
        parent( args );
    }
);

// o.arrayType
var o_arrayType = o.arrayType = new o_InstanceOfType( Array );

// o.booleanType
var o_booleanType = o.booleanType = new o_AnyType([
    new o_TypeOfType( 'boolean' ),
    new o_InstanceOfType( Boolean )
]);

// o.dateType
var o_dateType = o.dateType = new o_InstanceOfType( Date );

// o.functionType
var o_functionType = o.functionType = new o_InstanceOfType( Function );

// o.nullType
var o_nullType = o.nullType = new o_EqualType( null );

// o.numberType
var o_numberType = o.numberType = new o_AnyType([
    new o_TypeOfType( 'number' ),
    new o_InstanceOfType( Number )
]);

// o.objectType
var o_objectType = o.objectType = new o_InstanceOfType( Object );

// o.positiveType
var o_positiveType = o.positiveType = o_numberType.subtype( function (val) {
    return (val > 0) ? true : false;
});

// o.regExpType
var o_regExpType = o.regExpType = new o_InstanceOfType( RegExp );

// o.simpleObjectType
var o_simpleObjectType = o.simpleObjectType = o_objectType.subtype( function (val) {
    return (val.constructor === Object) ? true : false;
});

// o.stringType
var o_stringType = o.stringType = new o_AnyType([
    new o_TypeOfType( 'string' ),
    new o_InstanceOfType( String )
]);

// o.typeType
var o_typeType = o.typeType = new o_InstanceOfType( o_Type );

// o.undefinedType
var o_undefinedType = o.undefinedType = new o_EqualType( undefined );

// o.ArrayOfType
var o_ArrayOfType = o.ArrayOfType = o_augment(
    o_Type,
    function (parent, type, args) {
        args = args || {};
        args.validate = function (ary) {
            if (!o_arrayType.check(ary)) return false;
            for (var i = 0, l = ary.length; i < l; i++) {
                if (!type.check(ary[i])) return false;
            }
            return true;
        };
        args.coerce = function (ary) {
            if (!this.check(ary)) return ary;
            for (var i = 0, l = ary.length; i < l; i++) {
                ary[i] = type.coerce( ary[i] );
            }
            return ary;
        };
        parent( args );
    }
);

// o.DuckType
var o_DuckType = o.DuckType = o_augment(
    o_Type,
    function (parent, properties, args) {
        args = args || {};
        args.validate = function (val) {
            if (!o_objectType.check(val)) return false;
            if (o_arrayType.check(properties)) {
                for (var i = 0, l = properties.length; i < l; i++) {
                    if (val[properties[i]] === undefined) return false;
                }
                return true;
            }
            else if (o_simpleObjectType.check(properties)) {
                for (var key in properties) {
                    if (val[key] === undefined) return false;
                    if (!properties[key].check(val[key])) return false;
                }
                return true;
            }
            return false;
        };
        parent( args );
    }
);

// o.ObjectOfType
var o_ObjectOfType = o.ObjectOfType = o_augment(
    o_Type,
    function (parent, type, args) {
        args = args || {};
        args.validate = function (obj) {
            if (!o_objectType.check(obj)) return false;
            for (var key in obj) {
                if (!type.check(obj[key])) return false;
            }
            return true;
        };
        args.coerce = function (obj) {
            if (!this.check(obj)) return obj;
            for (var key in obj) {
                obj[key] = type.coerce( obj[key] );
            }
            return obj;
        };
        parent( args );
    }
);

// o.PatternType
var o_PatternType = o.PatternType = o_augment(
    o_Type,
    function (parent, regExp, args) {
        args = args || {};
        args.validate = function (val) {
            if (!o_stringType.check(val)) return false;
            return regExp.test(val);
        };
        parent( args );
    }
);

// o.TupleType
var o_TupleType = o.TupleType = o_augment(
    o_Type,
    function (parent, types, args) {
        args = args || {};
        args.validate = function (ary) {
            if (!o_arrayType.check(ary)) return false;
            if (ary.length != types.length) return false;
            for (var i in ary) {
                if (!types[i]) return false;
                if (!types[i].check(ary[i])) return false;
            }
            return true;
        };
        args.coerce = function (ary) {
            if (!this.check(ary)) return ary;
            for (var i in ary) {
                if (!types[i]) continue;
                ary[i] = types[i].coerce( ary[i] );
            }
            return ary;
        };
        parent( args );
    }
);

// o.definedType
var o_definedType = o.definedType = new o_NotType( o_undefinedType );

// o.identifierType
var o_identifierType = o.identifierType = new o_PatternType(/^[A-Za-z_$][A-Za-z_$0-9]*$/);

// o.integerType
var o_integerType = o.integerType = o_numberType.subtype( function (val) {
    return (Math.floor(val) === val + 0) ? true : false;
});

// o.negativeType
var o_negativeType = o.negativeType = o_numberType.subtype( function (val) {
    return (val < 0) ? true : false;
});

// o.nonEmptyStringType
var o_nonEmptyStringType = o.nonEmptyStringType = o_stringType.subtype( function (val) {
    return (val.length > 0) ? true : false;
});

// o.nonZeroType
var o_nonZeroType = o.nonZeroType = o_numberType.subtype( function (val) {
    return (val !== 0) ? true : false;
});

// o.positiveIntType
var o_positiveIntType = o.positiveIntType = new o_AllType([ o_integerType, o_positiveType ]);

// o.Attribute
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
        filter: function (val) { if (val === true) val = 'build' + o_ucFirst( this.key() ); return val; }
    },
    required: { type: o_booleanType },
    type: {
        type: new o_AnyType([
            new o_EnumType(['undefined', 'object', 'boolean', 'number', 'string', 'function']),
            o_typeType,
            o_functionType
        ])
    },
    coerce: { type: o_booleanType },
    filter: { type: o_functionType },
    augments: { type: o_functionType },
    chain: { type: o_booleanType },

    reader: {
        type: booleanOrIdentifierType,
        devoid: true,
        filter: function (val) { if (val === true) val = this.key(); return val; }
    },
    writer: {
        type: booleanOrIdentifierType,
        filter: function (val) { if (val === true) val = this.key(); return val; }
    },
    predicate: {
        type: booleanOrIdentifierType,
        filter: function (val) { if (val === true) val = 'has' + o_ucFirst( this.key() ); return val; }
    },
    clearer: {
        type: booleanOrIdentifierType,
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

var o_Attribute = o.Attribute = o_construct(
    function (args) {
        args = args || {};
        this._originalArgs = o_clone( args );

        if (args.traits) {
            var trait = new o.Trait({ traits:args.traits });
            trait.install( this, args );
        }

        // Write the "key" attribute first as some filters depend on it.
        attrWriters.key.call( this, args.key );
        for (var key in args) {
            if (!attrWriters[key]) continue;
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
                if (!this.argKey()) return;
                if (args[this.argKey()] === undefined) return;
                return this.setValue( obj, args[this.argKey()] );
            },

            install: function (obj, value) {
                if (this.writer() && this.writer() === this.reader()) {
                    obj[this.writer()] = this.accessorMethod();
                }
                else {
                    if (this.writer()) obj[this.writer()] = this.writerMethod();
                    if (this.reader()) obj[this.reader()] = this.readerMethod();
                }

                if (this.predicate()) obj[this.predicate()] = this.predicateMethod();
                if (this.clearer()) obj[this.clearer()] = this.clearerMethod();

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

// o.attributeType
var o_attributeType = o.attributeType = new o_InstanceOfType( o_Attribute );

// o.Trait
var traitAttrs;

o.Trait = o_construct(
    function (args) {
        if (typeof args === 'function') args = this.functionToArgs( args );

        args = args || {};
        for (var i = 0, l = traitAttrs.length; i < l; i++) {
            traitAttrs[i].setValueFromArgs( this, args );
        }
    },
    {
        functionToArgs: function (func) {
            var args = {
                requires: [],
                traits: [],
                attributes: {},
                methods: {},
                around: {},
                before: {},
                after: {}
            };

            var scope = {
                require: function (name) { args.requires.push(name); },
                trait: function (name) { args.traits.push(name); },
                attribute: function (name,props) { args.attributes[name] = props; },
                method: function (name,func) { args.methods[name] = func; },
                around: function (name,func) { args.around[name] = func; },
                before: function (name,func) { args.before[name] = func; },
                after: function (name,func) { args.after[name] = func; }
            };

            func.apply( scope );

            return args;
        },
        install: function (obj, args) {
            var i, l, name;

            var requires = this.requires();
            if (requires) requires.validate( obj );

            var methods = this.methods();
            for (name in methods) {
                obj[name] = methods[name];
            }

            var traits = this.traits();
            for (i = 0, l = traits.length; i < l; i++) {
                traits[i].install( obj );
            }

            var attributes = this.attributes();
            for (name in attributes) {
                attributes[name].install( obj );
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

        setFromArgs: function (obj, args, ignores) {
            // Set the attributes that do not have filters first so
            // that any filters that depend on other attributes are set
            // last.  Avoids a common race conditions when using filters.
            var attributes = this.attributes();
            if (!ignores) ignores = {};
            var i, l, name;

            for (name in attributes) {
                if (ignores[name]) continue;
                if (attributes[name].filter()) continue;
                attributes[name].setValueFromArgs( obj, args );
                ignores[name] = true;
            }

            for (name in attributes) {
                if (ignores[name]) continue;
                if (!attributes[name].filter()) continue;
                attributes[name].setValueFromArgs( obj, args );
                ignores[name] = true;
            }

            var traits = this.traits();
            for (i = 0, l = traits.length; i < l; i++) {
                traits[i].setFromArgs( obj, args, ignores );
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
        type: new o_InstanceOfType( o_DuckType ),
        coerce: true
    },

    {
        key: 'traits',
        type: new o_ArrayOfType( new o_InstanceOfType( o.Trait ) ),
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

var traitProto = o.Trait.prototype;
for (var i = 0, l = traitAttrs.length; i < l; i++) {
    traitAttrs[i] = new o_Attribute( traitAttrs[i] );
    traitAttrs[i].install( traitProto );
}

var o_Trait = o.Trait;

// o.traitType
var o_traitType = o.traitType = new o_InstanceOfType( o_Trait );

// o.classTrait
var o_classTrait = o.classTrait = new o_Trait({
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

// o.Class
var o_Class = o.Class = o_construct(
    function (args) {
        var trait = new o_Trait( args );
        var constructor = function (args) {
            args = args || {};
            trait.setFromArgs( this, args );
        };
        trait.install( constructor.prototype );
        o_classTrait.install( constructor, {trait:trait} );
        return constructor;
    }
);

// o.classType
var o_classType = o.classType = o_classTrait.type().subtype({
    coerce: function (args) {
        return this.check(args) ? args : new o_Class(args);
    }
});

root.o = o;
root.oJS = o;

o.noConflict = function () {
    root.o = previousO;
    return o;
};

}).call(this);
