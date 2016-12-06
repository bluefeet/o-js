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
    "use strict";

    return function () {
        delete this[key];
    };
};

// o.getPrototypeOf
var o_getPrototypeOf = o.getPrototypeOf = function (obj) {
    "use strict";

    if (Object.getPrototypeOf) return Object.getPrototypeOf(obj);
    return Object.__proto__; // jshint ignore:line
};

// o.has
var o_has = o.has = function (obj, key) {
    "use strict";

    return Object.prototype.hasOwnProperty.call( obj, key );
};

// o.local
var o_local = o.local = function (obj, prop, func) {
    "use strict";

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
    "use strict";

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
    "use strict";

    return function () {
        return( o_has( this, key ) && this[key] !== undefined );
    };
};

// o.ucFirst
var o_ucFirst = o.ucFirst = function (str) {
    "use strict";

    return str.charAt(0).toUpperCase() + str.slice(1);
};

// o.writer
var o_writer = o.writer = function (key, def) {
    "use strict";

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
            else {
                if (def.coerce && def.type.coerce instanceof Function) val = def.type.coerce( val );
                if (def.type.validate instanceof Function) def.type.validate( val );
            }
        }

        if (def.augments) {
            if (!(val instanceof def.augments)) throw new Error( val + ' failed validation.' );
        }

        this[key] = val;
    };
};

// o.after
var o_after = o.after = function (original, func) {
    "use strict";

    return function () {
        var ret = original.apply( this, arguments );
        func.call( this );
        return ret;
    };
};

// o.around
var o_around = o.around = function (original, func) {
    "use strict";

    return function () {
        var args = Array.prototype.slice.call(arguments);
        var wrapper = original.bind( this );
        args.unshift( wrapper );
        return func.apply( this, args );
    };
};

// o.before
var o_before = o.before = function (original, func) {
    "use strict";

    return function () {
        func.call( this );
        return original.apply( this, arguments );
    };
};

// o.clone
var o_clone = o.clone = function (obj) {
    "use strict";

    var newObj = Object.create( o_getPrototypeOf(obj) );
    newObj.constructor = obj.constructor;
    o_merge( newObj, obj );
    return newObj;
};

// o.construct
var o_construct = o.construct = function (constructor, proto) {
    "use strict";

    o_merge( constructor.prototype, proto );
    return constructor;
};

// o.prependIdentifier
var o_prependIdentifier = o.prependIdentifier = (function(){
    "use strict";

    var privateMatch = /^_/;

    return function (str, ident) {
        var isPrivate = privateMatch.test(ident);
        if (!isPrivate) isPrivate = privateMatch.test(str);

        ident = ident.replace(privateMatch,'');
        str = str.replace(privateMatch,'');

        if (str) ident = o_ucFirst( ident );
        ident = str + ident;

        if (isPrivate) ident = '_' + ident;

        return ident;
    };
})();

// o.reader
var o_reader = o.reader = function (key, def) {
    "use strict";

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

// o.augment
var o_augment = o.augment = function (parent, constructor, proto) {
    "use strict";

    var child = o_around(
        parent,
        constructor
    );

    var childProto = Object.create( parent.prototype );
    if (proto) o_merge( childProto, proto );

    child.prototype = childProto;
    child.prototype.constructor = parent;

    return child;
};

// o.TypeValidationError
var o_TypeValidationError = o.TypeValidationError = (function(){
    "use strict";

    return o_augment(
        Error,
        function (parent, type, value) {
            this.name = 'o.TypeValidationError';
            this.message = type.message( value );
            this.stack = (new Error(this.message)).stack;
            this.type = type;
            this.value = value;
        }
    );
})();

// o.Type
var o_Type = o.Type = (function(){
    "use strict";

    var O_Type = o_construct(
        function (args) {
            args = args || {};
            if (typeof args === 'function') args = { validate: args };
            if (args.validate) this._validateMethod = args.validate;
            if (args.coerce) this._coerceMethod = args.coerce;
            if (args.parent) this._parent = args.parent;
            this._name = args.name || 'unnamedType';
            if (args.message) this._message = args.message;
        },
        {
            check: function (val) {
                if (O_Type.validationDisabled) return true;
                if (this._parent) { if (!this._parent.check(val)) return false; }
                if (!this._validateMethod) return true;
                if (!this._validateMethod( val )) return false;
                return true;
            },
            validate: function (val) {
                if (O_Type.validationDisabled) return;
                if (this._parent) { this._parent.validate(val); }
                if (!this._validateMethod) return true;
                if (!this._validateMethod( val )) throw new o_TypeValidationError( this, val );
            },
            coerce: function (val) {
                if (this._parent) val = this._parent.coerce( val );
                if (this._coerceMethod) val = this._coerceMethod( val );
                return val;
            },
            subtype: function (args) {
                if (typeof args === 'function') { args = { validate: args }; }
                return new O_Type(
                    o_merge( {parent:this}, args )
                );
            },
            message: function (val) {
                if (!this._message) return val + ' failed ' + this.name + ' validation.';
                return this._message( val );
            }
        }
    );

    Object.defineProperties( O_Type.prototype, {
        name: { get:function(){ return this._name; } }
    });

    O_Type.validationDisabled = false;

    return O_Type;
})();

// o.TypeOfType
var o_TypeOfType = o.TypeOfType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, result, args) {
            args = args || {};

            if (!args.validate) args.validate = function (val) {
                return (typeof val === result) ? true : false;
            };

            if (!args.name) args.name = 'o.TypeOfType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to not being a typeof' +
                    result + '.';
            };

            parent( args );
        }
    );
})();

// o.disableTypeValidation
var o_disableTypeValidation = o.disableTypeValidation = function (func) {
    "use strict";

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
var o_AllType = o.AllType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, types, args) {
            args = args || {};

            if (!args.validate) args.validate = function (val) {
                for (var i = 0, l = types.length; i < l; i++) {
                    if (!types[i].check(val)) return false;
                }
                return true;
            };

            if (!args.name) args.name = 'o.AllType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to not passing all of the ' +
                    '[' + types.map(function(type){ return type.name; }).join(',') + '] type checks.';
            };

            parent( args );
        }
    );
})();

// o.AnyType
var o_AnyType = o.AnyType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, types, args) {
            args = args || {};

            if (!args.validate) args.validate = function (val) {
                for (var i = 0, l = types.length; i < l; i++) {
                    if (types[i].check(val)) return true;
                }
                return false;
            };

            if (!args.name) args.name = 'o.AnyType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to not passing any of the ' +
                    '[' + types.map(function(type){ return type.name; }).join(',') + '] type checks.';
            };

            parent( args );
        }
    );
})();

// o.EnumType
var o_EnumType = o.EnumType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, values, args) {
            args = args || {};

            if (!args.validate) args.validate = function (val) {
                for (var i = 0, l = values.length; i < l; i++) {
                    if (val === values[i]) return true;
                }
                return false;
            };

            if (!args.name) args.name = 'o.EnumType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to not being one of ' +
                    '[' + values.join(',') + '].';
            };

            parent( args );
        }
    );
})();

// o.EqualType
var o_EqualType = o.EqualType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, expected, args) {
            args = args || {};

            if (!args.validate) args.validate = function (val) {
                return (val === expected) ? true : false;
            };

            if (!args.name) args.name = 'o.EqualType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to not equalling ' +
                    expected + '.';
            };

            parent( args );
        }
    );
})();

// o.InstanceOfType
var o_InstanceOfType = o.InstanceOfType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, Constructor, args) {
            args = args || {};

            if (!args.validate) args.validate = function (obj) {
                return (obj instanceof Constructor) ? true : false;
            };

            if (!args.coerce) args.coerce = function (args) {
                return this.check( args ) ? args : new Constructor( args );
            };

            if (!args.name) args.name = 'o.InstanceOfType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to not being an instanceof ' +
                    (Constructor.name || Constructor) + '.';
            };

            parent( args );
        }
    );
})();

// o.LazyType
var o_LazyType = o.LazyType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, typeBuilder, args) {
            args = args || {};
            var type;

            if (!args.validate) args.validate = function (val) {
                type = type || typeBuilder();
                return type.check( val );
            };

            if (!args.coerce) args.coerce = function (val) {
                type = type || typeBuilder();
                return type.coerce( val );
            };

            if (!args.name) args.name = 'o.LazyType';

            if (!args.message) args.message = function (val) {
                type = type || typeBuilder();
                return type.message( val );
            };

            parent( args );
        }
    );
})();

// o.NoneType
var o_NoneType = o.NoneType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, types, args) {
            args = args || {};
            var type = new o_AnyType(types);

            if (!args.validate) args.validate = function (val) {
                return type.check(val) ? false : true;
            };

            if (!args.name) args.name = 'o.NoneType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to passing one of the ' +
                    '[' + types.map(function(type){ return type.name; }).join(',') + '] type checks.';
            };

            parent( args );
        }
    );
})();

// o.NotType
var o_NotType = o.NotType = (function(){
    "use strict";

    return o_augment(
        o_NoneType,
        function (parent, type, args) {
            args = args || {};

            if (!args.name) args.name = 'o.NotType';

            parent( [type], args );
        }
    );
})();

// o.arrayType
var o_arrayType = o.arrayType = (function(){
    "use strict";

    return new o_InstanceOfType(
        Array,
        { name: 'o.arrayType' }
    );
})();

// o.booleanType
var o_booleanType = o.booleanType = (function(){
    "use strict";

    return new o_AnyType(
        [
            new o_TypeOfType( 'boolean' ),
            new o_InstanceOfType( Boolean )
        ],
        { name:'o.booleanType' }
    );
})();

// o.dateType
var o_dateType = o.dateType = (function(){
    "use strict";

    return new o_InstanceOfType(
        Date,
        { name: 'o.dateType' }
    );
})();

// o.functionType
var o_functionType = o.functionType = (function(){
    "use strict";

    return new o_InstanceOfType(
        Function,
        { name: 'o.functionType' }
    );
})();

// o.nullType
var o_nullType = o.nullType = (function(){
    "use strict";

    return new o_EqualType(
        null,
        { name: 'o.nullType' }
    );
})();

// o.numberType
var o_numberType = o.numberType = (function(){
    "use strict";

    return new o_AnyType(
        [
            new o_TypeOfType( 'number' ),
            new o_InstanceOfType( Number )
        ],
        { name: 'o.numberType' }
    );
})();

// o.objectType
var o_objectType = o.objectType = (function(){
    "use strict";

    return new o_InstanceOfType(
        Object,
        { name: 'o.objectType' }
    );
})();

// o.positiveType
var o_positiveType = o.positiveType = (function(){
    "use strict";

    return o_numberType.subtype({
        name: 'o.positiveType',
        validate: function (val) {
            return (val > 0) ? true : false;
        }
    });
})();

// o.regExpType
var o_regExpType = o.regExpType = (function(){
    "use strict";

    return new o_InstanceOfType(
        RegExp,
        { name: 'o.regExpType' }
    );
})();

// o.simpleObjectType
var o_simpleObjectType = o.simpleObjectType = (function(){
    "use strict";

    return o_objectType.subtype({
        name: 'o.simpleObjectType',
        validate: function (val) {
            return (val.constructor === Object) ? true : false;
        }
    });
})();

// o.stringType
var o_stringType = o.stringType = (function(){
    "use strict";

    return new o_AnyType(
        [
            new o_TypeOfType( 'string' ),
            new o_InstanceOfType( String )
        ],
        { name: 'o.stringType' }
    );
})();

// o.typeType
var o_typeType = o.typeType = (function(){
    "use strict";

    return new o_InstanceOfType(
        o_Type,
        { name: 'o.typeType' }
    );
})();

// o.undefinedType
var o_undefinedType = o.undefinedType = (function(){
    "use strict";

    return new o_EqualType(
        undefined,
        { name: 'o.undefinedType' }
    );
})();

// o.ArrayOfType
var o_ArrayOfType = o.ArrayOfType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, type, args) {
            args = args || {};

            if (!args.parent) args.parent = o_arrayType;

            if (!args.validate) args.validate = function (ary) {
                for (var i = 0, l = ary.length; i < l; i++) {
                    if (!type.check(ary[i])) return false;
                }
                return true;
            };

            if (!args.coerce) args.coerce = function (ary) {
                if (!this.check(ary)) return ary;
                for (var i = 0, l = ary.length; i < l; i++) {
                    ary[i] = type.coerce( ary[i] );
                }
                return ary;
            };

            if (!args.name) args.name = 'o.ArrayOfType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to one of the array ' +
                    'values not passing the ' + type.name + ' type check.';
            };

            parent( args );
        }
    );
})();

// o.DuckType
var o_DuckType = o.DuckType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, properties, args) {
            args = args || {};

            if (!args.parent) args.parent = o_objectType;

            if (!args.validate) args.validate = function (val) {
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

            if (!args.name) args.name = 'o.DuckType';

            if (!args.message) args.message = function (val) {
                var msg = [];
                msg.push(val + ' failed ' + this.name + ' validation due to ');
                if (o_arrayType.check(properties)) {
                    msg.push('not having the [' + properties.join(',') + '] properties set');
                }
                else if (o_simpleObjectType.check(properties)) {
                    msg.push('not having the {');
                    var msg_props = [];
                    for (var key in properties) {
                        msg_props.push(key + ':' + properties[key].name);
                    }
                    msg.push( msg_props.join(',') );
                    msg.push('} properties set');
                }
                return msg.join('') + '.';
            };

            parent( args );
        }
    );
})();

// o.ObjectOfType
var o_ObjectOfType = o.ObjectOfType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, type, args) {
            args = args || {};

            if (!args.parent) args.parent = o_objectType;

            if (!args.validate) args.validate = function (obj) {
                for (var key in obj) {
                    if (!type.check(obj[key])) return false;
                }
                return true;
            };

            if (!args.coerce) args.coerce = function (obj) {
                if (!this.check(obj)) return obj;
                for (var key in obj) {
                    obj[key] = type.coerce( obj[key] );
                }
                return obj;
            };

            if (!args.name) args.name = 'o.ObjectOfType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to one of the object values ' +
                    'not passing the ' + type.name + ' type check.';
            };

            parent( args );
        }
    );
})();

// o.PatternType
var o_PatternType = o.PatternType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, regExp, args) {
            args = args || {};

            if (!args.validate) args.validate = function (val) {
                if (!o_stringType.check(val)) return false;
                return regExp.test(val);
            };

            if (!args.name) args.name = 'o.PatternType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to not matching ' + regExp;
            };

            parent( args );
        }
    );
})();

// o.TupleType
var o_TupleType = o.TupleType = (function(){
    "use strict";

    return o_augment(
        o_Type,
        function (parent, types, args) {
            args = args || {};

            if (!args.validate) args.validate = function (ary) {
                if (!o_arrayType.check(ary)) return false;
                if (ary.length != types.length) return false;
                for (var i in ary) {
                    if (!types[i]) return false;
                    if (!types[i].check(ary[i])) return false;
                }
                return true;
            };

            if (!args.coerce) args.coerce = function (ary) {
                if (!this.check(ary)) return ary;
                for (var i in ary) {
                    if (!types[i]) continue;
                    ary[i] = types[i].coerce( ary[i] );
                }
                return ary;
            };

            if (!args.name) args.name = 'o.TupleType';

            if (!args.message) args.message = function (val) {
                return val + ' failed ' + this.name + ' validation due to one of the array values ' +
                'not passing the [' + types.map(function(type){ return type.name; }).join(',') + '] ' +
                'tuple of type checks.';
            };

            parent( args );
        }
    );
})();

// o.definedType
var o_definedType = o.definedType = (function(){
    "use strict";

    return new o_NotType(
        o_undefinedType,
        { name: 'o.NotType' }
    );
})();

// o.identifierType
var o_identifierType = o.identifierType = (function(){
    "use strict";

    return new o_PatternType(
        /^[A-Za-z_$][A-Za-z_$0-9]*$/,
        { name: 'o.identifierType' }
    );
})();

// o.integerType
var o_integerType = o.integerType = (function(){
    "use strict";

    return o_numberType.subtype({
        name: 'o.integerType',
        validate: function (val) {
            return (Math.floor(val) === val + 0) ? true : false;
        }
    });
})();

// o.negativeType
var o_negativeType = o.negativeType = (function(){
    "use strict";

    return o_numberType.subtype({
        name: 'o.negativeType',
        validate: function (val) {
            return (val < 0) ? true : false;
        }
    });
})();

// o.nonEmptyStringType
var o_nonEmptyStringType = o.nonEmptyStringType = (function(){
    "use strict";

    return o_stringType.subtype({
        name: 'o.nonEmptyStringType',
        validate: function (val) {
            return (val.length > 0) ? true : false;
        }
    });
})();

// o.nonZeroType
var o_nonZeroType = o.nonZeroType = (function(){
    "use strict";

    return o_numberType.subtype({
        name: 'o.nonZeroType',
        validate: function (val) {
            return (val !== 0) ? true : false;
        }
    });
})();

// o.positiveIntType
var o_positiveIntType = o.positiveIntType = (function(){
    "use strict";

    return new o_AllType(
        [ o_integerType, o_positiveType ],
        { name: 'o.positiveIntType' }
    );
})();

// o.Attribute
var o_Attribute = o.Attribute = (function(){
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
                        augments: this.augments
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

// o.attributeType
var o_attributeType = o.attributeType = (function(){
    "use strict";

    return new o_InstanceOfType(
        o_Attribute,
        { name: 'o.attributeType' }
    );
})();

// o.Trait
var o_Trait = o.Trait = (function(){
    "use strict";

    var traitAttrs;

    var o_Trait = o_construct(
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
                    var type = attribute.type || (attribute.required ? o_definedType : undefined);

                    if (type && attribute.reader) duck[attribute.reader] = type;
                    if (type && attribute.writer) duck[attribute.writer] = type;

                    if (attribute.predicate) duck[attribute.predicate] = o_booleanType;
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

    var traitType = new o_InstanceOfType( o_Trait );
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

    var traitProto = o_Trait.prototype;
    for (var i = 0, l = traitAttrs.length; i < l; i++) {
        traitAttrs[i] = new o_Attribute( traitAttrs[i] );
        traitAttrs[i].install( traitProto );
    }

    return o_Trait;
})();

// o.liteAttributeTrait
var o_liteAttributeTrait = o.liteAttributeTrait = (function(){
    "use strict";

    return new o_Trait({
        attributes: {
            valueKey: {
                type: o_identifierType,
                devoid: function () { return this.key; }
            }
        }
    });
})();

// o.rwAttributeTrait
var o_rwAttributeTrait = o.rwAttributeTrait = (function(){
    "use strict";

    var booleanOrIdentifierType = new o_AnyType([
        o_booleanType,
        o_identifierType
    ]);

    return new o_Trait({
        attributes: {
            writer: {
                type: booleanOrIdentifierType,
                devoid: function () { return this.reader; }
            }
        }
    });
})();

// o.rwpAttributeTrait
var o_rwpAttributeTrait = o.rwpAttributeTrait = (function(){
    "use strict";

    var booleanOrIdentifierType = new o_AnyType([
        o_booleanType,
        o_identifierType
    ]);

    return new o_Trait({
        attributes: {
            writer: {
                type: booleanOrIdentifierType,
                devoid: function () { return o_prependIdentifier('_',this.reader); }
            }
        }
    });
})();

// o.traitType
var o_traitType = o.traitType = (function(){
    "use strict";

    return new o_InstanceOfType(
        o_Trait,
        { name: 'o.traitType' }
    );
})();

// o.classTrait
var o_classTrait = o.classTrait = (function(){
    "use strict";

    return new o_Trait({
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
            _buildType: function () {
                return new o_InstanceOfType( this );
            }
        }
    });
})();

// o.liteClassTrait
var o_liteClassTrait = o.liteClassTrait = (function(){
    "use strict";

    return new o_Trait({
        attributes: {
            attributesAre: {
                type: o_traitType,
                devoid: 'lite',
                filter: function (val) {
                    if (o_traitType.check(val)) return val;
                    return o[val + 'AttributeTrait'];
                }
            }
        }
    });
})();

// o.Class
var o_Class = o.Class = (function(){
    "use strict";

    return o_construct(
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
})();

// o.classType
var o_classType = o.classType = (function(){
    "use strict";

    return o_classTrait.type.subtype({
        name: 'o.classType',
        coerce: function (args) {
            return this.check(args) ? args : new o_Class(args);
        }
    });
})();

root.o = o;
root.oJS = o;

o.noConflict = function () {
    root.o = previousO;
    return o;
};

}).call(this);
