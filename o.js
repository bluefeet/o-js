(function() {
    var o = this.oJS;
    if (typeof exports !== 'undefined') {
        o = require('o-core');
    }
    if (!o) throw new Error('...');

    o.Type = o.construct(
        function (args) {
            if (typeof args === 'function') { args = { validate: args } }

            if (args.validate) { this.validateMethod = args.validate }
            else { throw new Error('...') }

            if (args.message) this.messageMethod = args.message;
            if (args.coerce) this.coerceMethod = args.coerce;
            if (args.parent) this.parent = args.parent;
        },
        {
            check: function (val) {
                if (this.parent) { if (!this.parent.check(val)) return false }
                if (!this.validateMethod( val )) return false;
                return true;
            },
            validate: function (val) {
                if (this.parent) this.parent.validate( val );
                if (!this.validateMethod( val )) throw new Error('...');
                return true;
            },
            coerce: function (val) {
                if (this.parent) val = this.parent.coerce( val );
                if (this.coerceMethod) val = this.coerceMethod( val );
                if (!this.validateMethod( val )) throw new Error('...');
                return val;
            },
            error: function (val) {
                if (this.messageMethod) { throw new Error( this.messageMethod(val) ) }
                throw new Error( 'Validation failed for value "' + val + '"' );
            },
            subtype: function (args) {
                if (typeof args === 'function') { args = { validate: args } }
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

    o.isUndefined = function (val) { return o.undefinedType.check(val) };
    o.isDefined = function (val) { return o.definedType.check(val) };
    o.isNull = function (val) { return o.nullType.check(val) };

    o.booleanPrimitiveType = new o.TypeOfType( 'boolean' );
    o.booleanObjectType = new o.InstanceOfType( Boolean );
    o.booleanType = new o.AnyType([ o.booleanPrimitiveType, o.booleanObjectType ]);

    o.isBooleanPrimitive = function (val) { return o.booleanPrimitiveType.check(val) };
    o.isBooleanObject = function (val) { return o.booleanObjectType.check(val) };
    o.isBoolean = function (val) { return o.booleanType.check(val) };

    o.stringPrimitiveType = new o.TypeOfType( 'string' );
    o.stringObjectType = new o.InstanceOfType( String );
    o.stringType = new o.AnyType([ o.stringPrimitiveType, o.stringObjectType ]);

    o.isStringPrimitive = function (val) { return o.stringPrimitiveType.check(val) };
    o.isStringObject = function (val) { return o.stringObjectType.check(val) };
    o.isString = function (val) { return o.stringType.check(val) };

    o.nonEmptyStringType = o.stringType.subtype( function (val) {
        return (val.length > 0) ? true : false;
    });
    o.isNonEmptyString = function (val) { return o.nonEmptyStringType.check(val) };

    o.numberPrimitiveType = new o.TypeOfType( 'number' );
    o.numberObjectType = new o.InstanceOfType( Number );
    o.numberType = new o.AnyType([ o.numberPrimitiveType, o.numberObjectType ]);

    o.isNumberPrimitive = function (val) { return o.numberPrimitiveType.check(val) };
    o.isNumberObject = function (val) { return o.numberObjectType.check(val) };
    o.isNumber = function (val) { return o.numberType.check(val) };

    o.integerType = o.numberType.subtype( function (val) {
        return (Math.floor(val) === val + 0) ? true : false;
    });
    o.isInteger = function (val) { return o.integerType.check(val) };

    o.positiveType = o.numberType.subtype( function (val) {
        return (val > 0) ? true : false;
    });
    o.isPositive = function (val) { return o.positiveType.check(val) };

    o.negativeType = o.numberType.subtype( function (val) {
        return (val < 0) ? true : false;
    });
    o.isNegative = function (val) { return o.negativeType.check(val) };

    o.nonZeroType = o.numberType.subtype( function (val) {
        return (val !== 0) ? true : false;
    });
    o.isNonZero = function (val) { return o.nonZeroType.check(val) };

    o.objectType = new o.InstanceOfType( Object );
    o.functionType = new o.InstanceOfType( Function );
    o.arrayType = new o.InstanceOfType( Array );
    o.regExpType = new o.InstanceOfType( RegExp );
    o.dateType = new o.InstanceOfType( Date );

    o.isObject = function (val) { return o.objectType.check(val) };
    o.isFunction = function (val) { return o.functionType.check(val) };
    o.isArray = function (val) { return o.arrayType.check(val) };
    o.isRegExp = function (val) { return o.regExpType.check(val) };
    o.isDate = function (val) { return o.dateType.check(val) };

    o.DuckType = o.augment(
        o.Type,
        function (parent, methods, args) {
            args = args || {};
            args.validate = function (val) {
                if (!o.objectType.check(val)) return false;
                for (var i = 0, l = methods.length; i < l; i++) {
                    if (val[methods[i]] === undefined) return false;
                }
                return true;
            };
            parent( args );
        }
    );

    o.ArrayOfType = o.augment(
        o.Type,
        function (parent, type, args) {
            args = args || {};
            args.validate = function (val) {
                if (!o.arrayType.check(val)) return false;
                for (var i = 0, l = val.length; i < l; i++) {
                    if (!type.check(val[i])) return false;
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
            args.validate = function (val) {
                if (!o.objectType.check(val)) return false;
                for (var key in val) {
                    if (!type.check(val[key])) return false;
                }
                return true;
            };
            parent( args );
        }
    );

}).call(this);
