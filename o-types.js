(function() {
    var o = oJS;
    if (!o) throw new Error('...');

    function simpleType (func) {
        return function () { return func }
    }

    function complexType (func) {
        return function (def) {
            return function (value) {
                return func.call( o, value, def );
            }
        }
    }

    o.isUndefined = function (value) {
        return (value === undefined) ? true : false;
    };
    o.undefinedType = simpleType( o.isUndefined );

    o.isDefined = function (value) {
        return (value === undefined) ? false : true;
    };
    o.definedType = simpleType( o.isDefined );

    o.isNull = function (value) {
        return (value === null) ? true : false;
    };
    o.nullType = simpleType( o.isNull );

    o.isBooleanPrimitive = function (value) {
        return (typeof value === 'boolean') ? true : false;
    };
    o.booleanPrimitiveType = simpleType( o.isBooleanPrimitive );

    o.isBooleanObject = function (value) {
        return (value instanceof Boolean) ? true : false;
    };
    o.booleanObjectType = simpleType( o.isBooleanObject );

    o.isBoolean = function (value) {
        return (o.isBooleanPrimitive(value) || o.isBooleanObject(value)) ? true : false;
    };
    o.booleanType = simpleType( o.isBoolean );

    o.isStringPrimitive = function (value) {
        return (typeof value === 'string') ? true : false;
    };
    o.stringPrimitiveType = simpleType( o.isStringPrimitive );

    o.isStringObject = function (value) {
        return (value instanceof String) ? true : false;
    };
    o.stringObjectType = simpleType( o.isStringObject );

    o.isString = function (value) {
        return (o.isStringPrimitive(value) || o.isStringObject(value)) ? true : false;
    };
    o.stringType = simpleType( o.isString );

    o.isNonEmptyString = function (value) {
        if (!o.isString(value)) return false;
        return (value.length > 0) ? true : false;
    };
    o.nonEmptyStringType = simpleType( o.isNonEmptyString );

    o.isNumberPrimitive = function (value) {
        return (typeof value === 'number') ? true : false;
    };
    o.numberPrimitiveType = simpleType( o.isNumberPrimitive );

    o.isNumberObject = function (value) {
        return (value instanceof Number) ? true : false;
    };
    o.numberObjectType = simpleType( o.isNumberObject );

    o.isNumber = function (value) {
        return (o.isNumberPrimitive(value) || o.isNumberObject(value)) ? true : false;
    };
    o.numberType = simpleType( o.isNumber );

    o.isInteger = function (value) {
        if (!o.isNumber(value)) return false;
        return (Math.floor(value) === value + 0) ? true : false;
    };
    o.integerType = simpleType( o.isInteger );

    o.isPositive = function (value) {
        if (!o.isNumber(value)) return false;
        return (value > 0) ? true : false;
    }
    o.positiveType = simpleType( o.isPositive );

    o.isNegative = function (value) {
        if (!o.isNumber(value)) return false;
        return (value < 0) ? true : false;
    };
    o.negativeType = simpleType( o.isNegative );

    o.isNonZero = function (value) {
        if (!o.isNumber(value)) return false;
        return (value !== 0) ? true : false;
    };
    o.nonZeroType = simpleType( o.isNonZero );

    o.isObject = function (value) {
        return (value instanceof Object) ? true : false;
    };
    o.objectType = simpleType( o.isObject );

    o.isFunction = function (value) {
        return (value instanceof Function) ? true : false;
    };
    o.functionType = simpleType( o.isFunction );

    o.isArray = function (value) {
        return (value instanceof Array) ? true : false;
    };
    o.arrayType = simpleType( o.isArray );

    o.isRegExp = function (value) {
        return (value instanceof RegExp) ? true : false;
    };
    o.regExpType = simpleType( o.isRegExp );

    o.isDate = function (value) {
        return (value instanceof Date) ? true : false;
    };
    o.dateType = simpleType( o.isDate );

    o.isEnum = function (value, values) {
        for (var i = 0, l = values.length; i < l; i++) {
            if (value === values[i]) return true;
        }
        return false;
    };
    o.enumType = complexType( o.isEnum );

    o.isTypeOf = function (value, result) {
        return (typeof value === result) ? true : false;
    };
    o.typeOfType = complexType( o.isTypeOf );

    o.isInstanceOf = function (value, constructor) {
        return (value instanceof constructor) ? true : false;
    };
    o.instanceOfType = complexType( o.isInstanceOf );

    o.isArrayOf = function (value, type) {
        if (!o.isArray(value)) return false;
        for (var i = 0, l = value.length; i < l; i++) {
            if (!type(value[i])) return false;
        }
        return true;
    };
    o.arrayOfType = complexType( o.isArrayOf );

    o.isObjectOf = function (value, type) {
        if (!o.isObject(value)) return false;
        for (var key in value) {
            if (!type(value[key])) return false;
        }
        return true;
    };
    o.objectOfType = complexType( o.isObjectOf );

    o.isDuck = function (value, methods) {
        if (!o.isObject(value)) return false;
        for (var i = 0, l = methods.length; i < l; i++) {
            if (value[methods[i]] === undefined) return false;
        }
        return true;
    };
    o.duckType = complexType( o.isDuck );

    o.isAny = function (value, types) {
        for (var i = 0, l = types.length; i < l; i++) {
            if (types[i](value)) return true;
        }
        return false;
    };
    o.anyType = complexType( o.isAny );

    o.isAll = function (value, types) {
        for (var i = 0, l = types.length; i < l; i++) {
            if (!types[i](value)) return false;
        }
        return true;
    };
    o.allType = complexType( o.isAll );

    o.isNone = function (value, types) {
        return o.isAny(value,types) ? false : true;
    };
    o.noneType = complexType( o.isNone );

    o.isNot = function (value, type) {
        return type(value) ? false : true;
    };
    o.notType = complexType( o.isNot );
}).call(this);
