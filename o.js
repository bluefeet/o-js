(function() {
    var root = this;
    var previousO = root.o;
    var o = {};

    // The method in which we export o (and oJS), that works whether in the browseri
    // or Node.js, including noConflict, was graciously copied from underscore.js.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = o;
        }
        exports.o = o;
        exports.oJS = o;
    } else {
        root.o = o;
        root.oJS = o;
    }

    o.noConflict = function () {
        root.o = previousO;
        return o;
    };

    // Basic printf support for errors.  Only supports %s for now.
    var error = function (msg) {
        var args = arguments;
        var index = 0;
        msg = msg.replace(
            /%s/g,
            function () {
                index++;
                if (!(index in args)) return '';
                var value = args[index];
                if (value === undefined || value === null) return value;
                return '"' + value + '"';
            }
        );
        return new Error( msg );
    };

    o.local = function (obj, prop, func) {
        var hasProp = o_has( obj, prop );
        var origVal = obj[prop];

        var ret;
        try {
            ret = func();
        }
        finally {
            if (hasProp) { obj[prop] = origVal }
            else { delete obj[prop] }
        }

        return ret;
    };

    var o_writer = o.writer = function (key, def) {
        def = def || {};
        if (def.augments) def.type = def.type || 'object';

        return function (val) {
            if (def.filter) val = def.filter.call( this, val );

            if (def.type) {
                if (typeof def.type === 'string' || def.type instanceof String) {
                    if (typeof val !== def.type) throw error('%s failed validation.', val);
                }
                else if (def.type instanceof Function) {
                    if (!def.type( val )) throw error('%s failed validation.', val);
                }
                else if (def.type instanceof o.Type) {
                    if (def.coerce) {
                        val = def.type.coerce( val );
                    }
                    else {
                        def.type.validate( val );
                    }
                }
            }

            if (def.augments) {
                if (!(val instanceof def.augments)) throw error('%s failed validation.', val);
            }

            var original = this[key];
            this[key] = val;
            if (def.chain) return this;
            return original;
        };
    };

    var o_predicate = o.predicate = function (key) {
        return function () {
            return( o_has( this, key ) && this[key] !== undefined );
        };
    };

    var o_reader = o.reader = function (key, def) {
        def = def || {};
        def.writer = def.writer || o_writer( key, def );
        def.predicate = def.predicate || o_predicate( key );

        return function () {
            if (!def.predicate.call( this )) {
                if (def.required) throw error('%s is required.', key);
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

    var o_accessor = o.accessor = function (key, def) {
        def = def || {};
        def.writer = def.writer || o_writer( key, def );
        def.reader = def.reader || o_reader( key, def );

        return function (val) {
            if (val !== undefined) return def.writer.call( this, val );
            return def.reader.call( this );
        };
    };

    var o_clearer = o.clearer = function (key) {
        return function () {
            delete this[key];
        };
    };

    o.proxy = function (key, method) {
        return function () {
            return this[key][method].apply( this[key], arguments );
        };
    };

    var o_before = o.before = function (original, func) {
        return function () {
            func.call( this );
            return original.apply( this, arguments );
        };
    };

    var o_after = o.after = function (original, func) {
        return function () {
            var ret = original.apply( this, arguments );
            func.call( this );
            return ret;
        };
    };

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

    var o_has = o.has = function (obj, key) {
        return Object.prototype.hasOwnProperty.call( obj, key );
    };

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

    var o_clone = o.clone = function (obj) {
        var newObj = o_merge( {}, obj );
        newObj.__proto__ = obj.__proto__;
        newObj.constructor = obj.constructor;
        return newObj;
    };

    var o_construct = o.construct = function (constructor, proto) {
        o_merge( constructor.prototype, proto );
        return constructor;
    };

    var o_augment = o.augment = function (parent, constructor, proto) {
        var child = o_around(
            parent,
            constructor
        );

        proto = proto
              ? o_merge( {}, constructor.prototype, proto )
              : o_clone( constructor.prototype );

        proto.__proto__ = parent.prototype;
        child.prototype = proto;

        return child;
    };

    var o_Type = o.Type = o_construct(
        function (args) {
            args = args || {};
            if (typeof args === 'function') args = { validate: args };
            this._validateMethod = args.validate || function(){ return true };
            if (args.coerce) this._coerceMethod = args.coerce;
            if (args.parent) this._parent = args.parent;
        },
        {
            check: function (val) {
                if (this._parent) { if (!this._parent.check(val)) return false }
                if (!this._validateMethod( val )) return false;
                return true;
            },
            validate: function (val) {
                if (!this.check( val )) throw error('%s failed validation.', val);
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
                if (typeof args === 'function') { args = { validate: args } }
                if (args.validate === undefined) { args.validate=function(){ return true } }
                return new o.Type(
                    o_merge( {parent:this}, args )
                );
            }
        }
    );

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

    var o_NotType = o.NotType = o_augment(
        o_NoneType,
        function (parent, type, args) {
            parent( [type], args );
        }
    );

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

    var o_InstanceOfType = o.InstanceOfType = o_augment(
        o_Type,
        function (parent, constructor, args) {
            args = args || {};
            args.validate = function (obj) {
                return (obj instanceof constructor) ? true : false;
            };
            if (o.classType && o.classType.check(constructor)) {
                args.coerce = function (args) {
                    return o.simpleObjectType.check(args) ? new constructor(args) : args;
                };
            }
            parent( args );
        }
    );

    var o_undefinedType = o.undefinedType = new o_EqualType( undefined );
    var o_definedType = o.definedType = new o_NotType( o_undefinedType );
    var o_nullType = o.nullType = new o_EqualType( null );

    o.booleanPrimitiveType = new o_TypeOfType( 'boolean' );
    o.booleanObjectType = new o_InstanceOfType( Boolean );
    var o_booleanType = o.booleanType = new o_AnyType([ o.booleanPrimitiveType, o.booleanObjectType ]);

    o.stringPrimitiveType = new o_TypeOfType( 'string' );
    o.stringObjectType = new o_InstanceOfType( String );
    var o_stringType = o.stringType = new o_AnyType([ o.stringPrimitiveType, o.stringObjectType ]);

    var o_nonEmptyStringType = o.nonEmptyStringType = o_stringType.subtype( function (val) {
        return (val.length > 0) ? true : false;
    });

    o.numberPrimitiveType = new o_TypeOfType( 'number' );
    o.numberObjectType = new o_InstanceOfType( Number );
    var o_numberType = o.numberType = new o_AnyType([ o.numberPrimitiveType, o.numberObjectType ]);

    var o_integerType = o.integerType = o_numberType.subtype( function (val) {
        return (Math.floor(val) === val + 0) ? true : false;
    });

    var o_positiveType = o.positiveType = o_numberType.subtype( function (val) {
        return (val > 0) ? true : false;
    });

    o.positiveIntType = new o_AllType([ o_integerType, o_positiveType ]);

    o.negativeType = o_numberType.subtype( function (val) {
        return (val < 0) ? true : false;
    });

    o.nonZeroType = o_numberType.subtype( function (val) {
        return (val !== 0) ? true : false;
    });

    var o_objectType = o.objectType = new o_InstanceOfType( Object );
    var o_functionType = o.functionType = new o_InstanceOfType( Function );
    var o_arrayType = o.arrayType = new o_InstanceOfType( Array );
    o.regExpType = new o_InstanceOfType( RegExp );
    o.dateType = new o_InstanceOfType( Date );

    var o_simpleObjectType = o.simpleObjectType = o_objectType.subtype( function (val) {
        return (val.constructor === Object) ? true : false;
    });

    var o_typeType = o.typeType = new o_InstanceOfType(
        o_Type,
        { coerce: function (args) {
            if (o.classType && o.classType.check(args)) return args;
            return (
                o_simpleObjectType.check(args) ||
                o_functionType.check(args)
            ) ? new o_Type(args) : args;
        }}
    );

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
                else if (o_objectType.check(properties)) {
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

    o.PatternType = o_augment(
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

    var o_ucFirst = o.ucFirst = function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    var booleanOrNonEmptyStringType = new o_AnyType([
        o_booleanType,
        o_nonEmptyStringType
    ]);

    var definitions = {
        key: {
            type: o_nonEmptyStringType,
            required: true
        },
        argKey: {
            type: new o_AnyType([ o_nonEmptyStringType, o_nullType ]),
            devoid: function () { return this.key() }
        },
        valueKey: {
            type: o_nonEmptyStringType,
            devoid: function () { return '_' + this.key() }
        },

        devoid: { type: o_definedType },
        builder: {
            type: booleanOrNonEmptyStringType,
            devoid: false,
            filter: function (val) { if (val === true) val = 'build' + o_ucFirst( this.key() ); return val }
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
            type: booleanOrNonEmptyStringType,
            devoid: true,
            filter: function (val) { if (val === true) val = this.key(); return val }
        },
        writer: {
            type: booleanOrNonEmptyStringType,
            devoid: false,
            filter: function (val) { if (val === true) val = this.key(); return val }
        },
        predicate: {
            type: booleanOrNonEmptyStringType,
            devoid: false,
            filter: function (val) { if (val === true) val = 'has' + o_ucFirst( this.key() ); return val }
        },
        clearer: {
            type: booleanOrNonEmptyStringType,
            devoid: false,
            filter: function (val) { if (val === true) val = 'clear' + o_ucFirst( this.key() ); return val }
        },
        proxies: { type: new o_ObjectOfType( o_nonEmptyStringType ) }
    };

    var writers = {};
    var readers = {};
    for (var key in definitions) {
        writers[key] = o_writer( '_' + key, definitions[key] );
        readers[key] = o_reader( '_' + key, o_merge( { writer: writers[key] }, definitions[key] ) );
    }

    var o_Attribute = o.Attribute = o_construct(
        function (args) {
            this._originalArgs = o_clone( args );
            // Write the "key" attribute first as some filters depend on it.
            writers['key'].call( this, args['key'] );
            for (var key in args) {
                writers[key].call( this, args[key] );
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
            readers
        )
    );

    var o_attributeType = o.attributeType = new o_InstanceOfType(
        o_Attribute,
        { coerce: function (args) {
            return o_simpleObjectType.check(args) ? new o_Attribute(args) : args;
        }}
    );

    var traitAttrs = [];

    var o_Trait = o.Trait = o_construct(
        function (args) {
            for (var i = 0, l = traitAttrs.length; i < l; i++) {
                traitAttrs[i].setValueFromArgs( this, args );
            }
        },
        {
            install: function (obj, args) {
                var requires = this.requires();
                for (var i = 0, l = requires.length; i < l; i++) {
                    if (obj[requires[i]] !== undefined) continue;
                    throw error('%s is required.', requires[i]);
                }

                var traits = this.traits();
                for (var i = 0, l = traits.length; i < l; i++) {
                    traits[i].install( obj );
                }

                var attributes = this.attributes();
                for (var name in attributes) {
                    attributes[name].install( obj );
                }

                var methods = this.methods();
                for (var name in methods) {
                    obj[name] = methods[name];
                }

                var around = this.around();
                for (var name in around) {
                    obj[name] = o_around( obj[name], around[name] );
                }

                var before = this.before();
                for (var name in before) {
                    obj[name] = o_before( obj[name], before[name] );
                }

                var after = this.after();
                for (var name in after) {
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

                for (var name in attributes) {
                    if (attributes[name].filter()) continue;
                    attributes[name].setValueFromArgs( obj, args );
                }

                for (var name in attributes) {
                    if (!attributes[name].filter()) continue;
                    attributes[name].setValueFromArgs( obj, args );
                }
            },

            buildType: function () {
                var duck = {};

                var attributes = this.attributes();
                for (var name in attributes) {
                    var attribute = attributes[name];
                    if (attribute.reader()) duck[attribute.reader()] = o_functionType;
                    if (attribute.writer()) duck[attribute.writer()] = o_functionType;
                    if (attribute.predicate()) duck[attribute.predicate()] = o_functionType;
                    if (attribute.clearer()) duck[attribute.clearer()] = o_functionType;
                }

                for (var name in this.methods()) {
                    duck[name] = o_functionType;
                }

                var isPrivate = /^_/m;
                for (var name in duck) {
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

    var o_traitType = o.traitType = new o_InstanceOfType(
        o_Trait,
        { coerce: function (args) {
            return o_simpleObjectType.check(args) ? new o_Trait(args) : args;
        }}
    );

    traitAttrs = [
        {
            key: 'requires',
            type: new o_ArrayOfType( o_definedType ),
            devoid: function () { return [] }
        },

        {
            key: 'traits',
            type: new o_ArrayOfType( o_traitType ),
            devoid: function () { return [] }
        },

        {
            key: 'attributes',
            type: new o_ObjectOfType( o_attributeType ),
            devoid: function () { return {} },
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
            devoid: function () { return {} }
        },

        {
            key: 'around',
            type: new o_ObjectOfType( o_functionType ),
            devoid: function () { return {} }
        },

        {
            key: 'before',
            type: new o_ObjectOfType( o_functionType ),
            devoid: function () { return {} }
        },

        {
            key: 'after',
            type: new o_ObjectOfType( o_functionType ),
            devoid: function () { return {} }
        },

        {
            key: 'type',
            type: o_typeType,
            builder: true,
            argKey: null
        }
    ];

    var proto = o_Trait.prototype;
    for (var i = 0, l = traitAttrs.length; i < l; i++) {
        traitAttrs[i] = new o_Attribute( traitAttrs[i] );
        traitAttrs[i].install( proto );
    }

    var ClassTrait = new o_Trait({
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
                var self = this;
                return new o_InstanceOfType(
                    self,
                    { coerce: function (val) {
                        if (o_simpleObjectType.check(val)) return new self( val );
                        return val;
                    } }
                );
            }
        }
    });

    var o_Class = o.Class = o_construct(
        function (args) {
            var trait = new o_Trait( args );
            var constructor = function (args) {
                trait.setFromArgs( this, args );
            };
            trait.install( constructor.prototype );
            ClassTrait.install( constructor, {trait:trait} );
            return constructor;
        }
    );

    o.classType = ClassTrait.type().subtype({
        coerce: function (args) {
            return o_simpleObjectType.check(args) ? new o_Class(args) : args
        }
    });
}).call(this);
