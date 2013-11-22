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

    o.reader = function (key, def) {
        def = def || {};
        def.writer = def.writer || o.writer( key, def );
        def.predicate = def.predicate || o.predicate( key );

        return function () {
            if (!def.predicate.call( this )) {
                if (def.required) throw new Error('...');
                else if (def.devoid !== undefined) {
                    var val = def.devoid;
                    if (val instanceof Function) val = val.call( this );

                    def.writer.call( this, val );
                }
            }

            return this[key];
        };
    };

    o.writer = function (key, def) {
        def = def || {};
        if (def.augments) def.type = def.type || 'object';

        return function (val) {
            if (def.filter) val = def.filter.call( this, val );

            if (def.type) {
                if (typeof def.type === 'string' || def.type instanceof String) {
                    if (typeof val !== def.type) throw new Error('...');
                }
                else if (def.type instanceof Function) {
                    if (!def.type( val )) {
                        throw new Error('...');
                    }
                }
                else if (def.type instanceof o.Type) {
                    if (def.coerce) {
                        val = def.type.coerce( val );
                    }
                    else {
                        def.type.validate( val );
                    }
                }
                else {
                    throw new Error('...');
                }
            }

            if (def.augments) {
                if (!(val instanceof def.augments)) {
                    throw new Error('...');
                }
            }

            var original = this[key];
            this[key] = val;
            if (def.chain) return this;
            return original;
        };
    };

    o.accessor = function (key, def) {
        def = def || {};
        def.writer = def.writer || o.writer( key, def );
        def.reader = def.reader || o.reader( key, def );

        return function (val) {
            if (val !== undefined) return def.writer.call( this, val );
            return def.reader.call( this );
        };
    };

    o.predicate = function (key) {
        return function () {
            return( o.has( this, key ) && this[key] !== undefined );
        };
    };

    o.clearer = function (key) {
        return function () {
            delete this[key];
        };
    };

    o.proxy = function (key, method) {
        return function () {
            return this[key][method].apply( this[key], arguments );
        };
    };

    o.before = function (original, func) {
        return function () {
            func.call( this );
            return original.apply( this, arguments );
        };
    };

    o.after = function (original, func) {
        return function () {
            var ret = original.apply( this, arguments );
            func.call( this );
            return ret;
        };
    };

    o.around = function (original, func) {
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

    o.construct = function (constructor, proto) {
        o.merge( constructor.prototype, proto );
        return constructor;
    };

    o.augment = function (parent, constructor, proto) {
        var child = o.around(
            parent,
            constructor
        );

        proto = proto
              ? o.merge( {}, constructor.prototype, proto )
              : o.clone( constructor.prototype );

        proto.__proto__ = parent.prototype;
        child.prototype = proto;

        return child;
    };

    o.merge = function () {
        var fromObjs = Array.prototype.slice.call(arguments);
        var toObj = fromObjs.shift();

        while (fromObjs.length) {
            var obj = fromObjs.shift();
            for (var key in obj) {
                if (o.has(obj, key)) toObj[key] = obj[key];
            }
        }

        return toObj;
    };

    o.clone = function (obj) {
        var newObj = o.merge( {}, obj );
        newObj.__proto__ = obj.__proto__;
        newObj.constructor = obj.constructor;
        return newObj;
    };

    o.has = function (obj, key) {
        return Object.prototype.hasOwnProperty.call( obj, key );
    };

    o.Type = o.construct(
        function (args) {
            if (typeof args === 'function') { args = { validate: args } }

            if (args.validate) { this._validateMethod = args.validate }
            else { throw new Error('...') }

            if (args.message) this._messageMethod = args.message;
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
                if (this._parent) this._parent.validate( val );
                if (!this._validateMethod( val )) throw new Error('...');
                return true;
            },
            coerce: function (val) {
                val = this.coerceOnly( val );
                if (!this._validateMethod( val )) throw new Error('...');
                return val;
            },
            coerceOnly: function (val) {
                if (this._parent) val = this._parent.coerceOnly( val );
                if (this._coerceMethod) val = this._coerceMethod( val );
                return val;
            },
            error: function (val) {
                if (this._messageMethod) { throw new Error( this._messageMethod(val) ) }
                throw new Error( 'Validation failed for value "' + val + '"' );
            },
            subtype: function (args) {
                if (typeof args === 'function') { args = { validate: args } }
                if (args.validate === undefined) { args.validate=function(){ return true } }
                return new o.Type(
                    o.merge( {parent:this}, args )
                );
            }
        }
    );

    o.EqualType = o.augment(
        o.Type,
        function (parent, expected, args) {
            args = args || {};
            args.validate = function (val) {
                return (val === expected) ? true : false;
            };
            parent( args );
        }
    );

    o.AnyType = o.augment(
        o.Type,
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

    o.AllType = o.augment(
        o.Type,
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

    o.NoneType = o.augment(
        o.Type,
        function (parent, types, args) {
            args = args || {};
            var type = new o.AnyType(types);
            args.validate = function (val) {
                return type.check(val) ? false : true;
            };
            parent( args );
        }
    );

    o.NotType = o.augment(
        o.NoneType,
        function (parent, type, args) {
            parent( [type], args );
        }
    );

    o.EnumType = o.augment(
        o.Type,
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

    o.TypeOfType = o.augment(
        o.Type,
        function (parent, result, args) {
            args = args || {};
            args.validate = function (val) {
                return (typeof val === result) ? true : false;
            };
            parent( args );
        }
    );

    o.InstanceOfType = o.augment(
        o.Type,
        function (parent, constructor, args) {
            args = args || {};
            args.validate = function (val) {
                return (val instanceof constructor) ? true : false;
            };
            parent( args );
        }
    );

    o.undefinedType = new o.EqualType( undefined );
    o.definedType = new o.NotType( o.undefinedType );
    o.nullType = new o.EqualType( null );

    o.booleanPrimitiveType = new o.TypeOfType( 'boolean' );
    o.booleanObjectType = new o.InstanceOfType( Boolean );
    o.booleanType = new o.AnyType([ o.booleanPrimitiveType, o.booleanObjectType ]);

    o.stringPrimitiveType = new o.TypeOfType( 'string' );
    o.stringObjectType = new o.InstanceOfType( String );
    o.stringType = new o.AnyType([ o.stringPrimitiveType, o.stringObjectType ]);

    o.nonEmptyStringType = o.stringType.subtype( function (val) {
        return (val.length > 0) ? true : false;
    });

    o.numberPrimitiveType = new o.TypeOfType( 'number' );
    o.numberObjectType = new o.InstanceOfType( Number );
    o.numberType = new o.AnyType([ o.numberPrimitiveType, o.numberObjectType ]);

    o.integerType = o.numberType.subtype( function (val) {
        return (Math.floor(val) === val + 0) ? true : false;
    });

    o.positiveType = o.numberType.subtype( function (val) {
        return (val > 0) ? true : false;
    });

    o.negativeType = o.numberType.subtype( function (val) {
        return (val < 0) ? true : false;
    });

    o.nonZeroType = o.numberType.subtype( function (val) {
        return (val !== 0) ? true : false;
    });

    o.objectType = new o.InstanceOfType( Object );
    o.functionType = new o.InstanceOfType( Function );
    o.arrayType = new o.InstanceOfType( Array );
    o.regExpType = new o.InstanceOfType( RegExp );
    o.dateType = new o.InstanceOfType( Date );

    o.DuckType = o.augment(
        o.Type,
        function (parent, properties, args) {
            args = args || {};
            args.validate = function (val) {
                if (!o.objectType.check(val)) return false;
                if (o.arrayType.check(properties)) {
                    for (var i = 0, l = properties.length; i < l; i++) {
                        if (val[properties[i]] === undefined) return false;
                    }
                    return true;
                }
                else if (o.objectType.check(properties)) {
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

    o.ArrayOfType = o.augment(
        o.Type,
        function (parent, type, args) {
            args = args || {};
            args.validate = function (ary) {
                if (!o.arrayType.check(ary)) return false;
                for (var i = 0, l = ary.length; i < l; i++) {
                    if (!type.check(ary[i])) return false;
                }
                return true;
            };
            parent( args );
        }
    );

    o.ObjectOfType = o.augment(
        o.Type,
        function (parent, type, args) {
            args = args || {};
            args.validate = function (obj) {
                if (!o.objectType.check(obj)) return false;
                for (var key in obj) {
                    if (!type.check(obj[key])) return false;
                }
                return true;
            };
            parent( args );
        }
    );

    o.PatternType = o.augment(
        o.Type,
        function (parent, regExp, args) {
            args = args || {};
            args.validate = function (val) {
                if (!o.stringType.check(val)) return false;
                return regExp.test(val);
            };
            parent( args );
        }
    );

    function ucFirst (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    var nullOrNonEmptyStringType = new o.AnyType([
        o.nullType,
        o.nonEmptyStringType
    ]);

    var definitions = {
        key: {
            type: o.nonEmptyStringType,
            required: true
        },
        argKey: {
            type: new o.AnyType([ o.nonEmptyStringType, o.nullType ]),
            devoid: function () { return this.key() }
        },
        valueKey: {
            type: o.nonEmptyStringType,
            devoid: function () { return '_' + this.key() }
        },

        devoid: { type: o.definedType },
        required: { type: o.booleanType, devoid: false },
        type: {
            type: new o.AnyType([
                new o.EnumType(['undefined', 'object', 'boolean', 'number', 'string', 'function']),
                new o.InstanceOfType( o.Type ),
                o.functionType
            ])
        },
        coerce: { type: o.booleanType, devoid: false },
        filter: { type: o.functionType },
        augments: { type: o.functionType },
        chain: { type: o.booleanType, devoid: false },

        reader: {
            type: nullOrNonEmptyStringType,
            devoid: function () { return this.key() }
        },
        writer: {
            type: nullOrNonEmptyStringType,
            devoid: function () { return this.key() }
        },
        predicate: {
            type: nullOrNonEmptyStringType,
            filter: function (val) { if (val === true) val = 'has' + ucFirst( this.key() ); return val },
            devoid: function () { return null }
        },
        clearer: {
            type: nullOrNonEmptyStringType,
            filter: function (val) { if (val === true) val = 'clear' + ucFirst( this.key() ); return val },
            devoid: function () { return null }
        },
        proxies: { type: new o.ObjectOfType( o.nonEmptyStringType ) }
    };

    var writers = {};
    var readers = {};
    for (var key in definitions) {
        writers[key] = o.writer( '_' + key, definitions[key] );
        readers[key] = o.reader( '_' + key, o.merge( { writer: writers[key] }, definitions[key] ) );
    }

    o.Attribute = o.construct(
        function (args) {
            this._originalArgs = o.clone( args );
            for (var key in args) {
                writers[key].call( this, args[key] );
            }
        },
        o.merge(
            {
                readerMethod: o.reader('_readerMethod', {
                    type: o.functionType,
                    devoid: function () {
                        return o.reader(
                            this.valueKey(),
                            {
                                devoid:    this.devoid(),
                                required:  this.required(),
                                writer:    this.writerMethod(),
                                predicate: this.predicateMethod()
                            }
                        );
                    }
                }),
                writerMethod: o.reader('_writerMethod', {
                    type: o.functionType,
                    devoid: function () {
                        return o.writer(
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
                accessorMethod: o.reader('_accessorMethod', {
                    type: o.functionType,
                    devoid: function () {
                        return o.accessor(
                            this.valueKey(),
                            {
                                writer: this.writerMethod(),
                                reader: this.readerMethod()
                            }
                        );
                    }
                }),
                predicateMethod: o.reader('_predicateMethod', {
                    type: o.functionType,
                    devoid: function () {
                        return o.predicate( this.valueKey() );
                    }
                }),
                clearerMethod: o.reader('_clearerMethod', {
                    type: o.functionType,
                    devoid: function () {
                        return o.clearer( this.valueKey() );
                    }
                }),
                proxyMethods: o.reader('_proxyMethods', {
                    type: new o.ObjectOfType( o.functionType ),
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
                },

                rebuild: function (args) {
                    var Constructor = this.constructor;
                    return new Constructor( o.merge(
                        {},
                        this._originalArgs,
                        args
                    ));
                }
            },
            readers
        )
    );

    var traitAttrs = [];

    o.Trait = o.construct(
        function (args) {
            for (var i = 0, l = traitAttrs.length; i < l; i++) {
                traitAttrs[i].setValueFromArgs( this, args );
            }
        },
        {
            install: function (obj, args) {
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

                if (args) this.setFromArgs( obj, args );
            },

            setFromArgs: function (obj, args) {
                var attributes = this.attributes();
                for (var name in attributes) {
                    attributes[name].setValueFromArgs( obj, args );
                }
            }
        }
    );

    traitAttrs = [
        {
            key: 'traits',
            type: new o.ArrayOfType( new o.InstanceOfType( o.Trait ) ),
            devoid: function () { return [] },
            writer: null
        },

        {
            key: 'attributes',
            type: new o.ObjectOfType( new o.InstanceOfType( o.Attribute ) ),
            devoid: function () { return {} },
            filter: function (val) {
                var attributes = {};
                for (var key in val) {
                    var attribute = val[key];
                    if (attribute instanceof o.Attribute) {
                        if (attribute.key() !== key) attribute = attribute.rebuild({ key: key });
                    }
                    else {
                        attribute = new o.Attribute( o.merge({}, attribute, { key:key }) );
                    }
                    attributes[key] = attribute;
                }
                return attributes;
            },
            writer: null
        },

        {
            key: 'methods',
            type: new o.ObjectOfType( o.functionType ),
            devoid: function () { return {} },
            writer: null
        },

        {
            key: 'around',
            type: new o.ObjectOfType( o.functionType ),
            devoid: function () { return {} },
            writer: null
        },

        {
            key: 'before',
            type: new o.ObjectOfType( o.functionType ),
            devoid: function () { return {} },
            writer: null
        },

        {
            key: 'after',
            type: new o.ObjectOfType( o.functionType ),
            devoid: function () { return {} },
            writer: null
        }
    ];

    var proto = o.Trait.prototype;
    for (var i = 0, l = traitAttrs.length; i < l; i++) {
        traitAttrs[i] = new o.Attribute( traitAttrs[i] );
        traitAttrs[i].install( proto );
    }

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
