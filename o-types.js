(function() {
    var o = oJS;
    if (!o) throw new Error('...');

    o.isUndefined = function (value) {
        return (value === undefined) ? true : false;
    };
    o.undefinedType = function () { return o.isUndefined };

    o.isDefined = function (value) {
        return (value === undefined) ? false : true;
    };
    o.definedType = function () { return o.isDefined };

    o.isNull = function (value) {
        return (value === null) ? true : false;
    };
    o.nullType = function () { return o.isNull };

    o.isBoolean = function (value) {
        if (value instanceof Boolean) return true;
        return (typeof value === 'boolean') ? true : false;
    };
    o.booleanType = function () { return o.isBoolean };

    o.isString = function (value) {
        if (value instanceof String) return true;
        return (typeof value === 'string') ? true : false;
    };
    o.stringType = function () { return o.isString };

    o.isEmptyString = function (value) {
        if (!o.isString(value)) return false;
        return value ? false : true;
    };
    o.emptyStringType = function () { return o.isEmptyString };

    o.isNumber = function (value) {
        if (value instanceof Number) return true;
        return (typeof value === 'number') ? true : false;
    };
    o.numberType = function () { return o.isNumber };

    o.isInteger = function (value) {
        if (!o.isNumber(value)) return false;
        return (Math.floor(value) === value + 0) ? true : false;
    };
    o.integerType = function () { return o.isInteger };

    o.isPositive = function (value) {
        if (!o.isNumber(value)) return false;
        return (value > 0) ? true : false;
    }
    o.positiveType = function () { return o.isPositive };

    o.isNegative = function (value) {
        if (!o.isNumber(value)) return false;
        return (value < 0) ? true : false;
    };
    o.negativeType = function () { return o.isNegative };

    o.isNonZero = function (value) {
        if (!o.isNumber(value)) return false;
        return (value !== 0) ? true : false;
    };
    o.nonZeroType = function () { return o.isNonZero };

    o.isFunction = function (value) {
        if (value instanceof Function) return true;
        return (typeof value === 'function') ? true : false;
    };
    o.functionType = function () { return o.isFunction };

    o.isObject = function (value) {
        if (value instanceof Object) return true;
        return (typeof value === 'object') ? true : false;
    };
    o.objectType = function () { return o.isObject };

    o.isArray = function (value) {
        return (value instanceof Array) ? true : false;
    };
    o.arrayType = function () { return o.isArray };

    o.isRegExp = function (value) {
        return (value instanceof RegExp) ? true : false;
    };
    o.regExpType = function () { return o.isRegExp };

    o.isDate = function (value) {
        return (value instanceof Date) ? true : false;
    };
    o.dateType = function () { return o.isDate };

    o.isInEnum = function (value, values) {
        for (var i = 0, l = values.length; i < l; i++) {
            if (value === values[i]) return true;
        }
        return false;
    };
    o.enumType = function () {
        var values = arguments;
        return function (value) {
            return o.isInEnum( value, values );
        };
    };

    o.isExtending = function (value, constructor) {
        return (value instanceof constructor) ? true : false;
    };
    o.extendsType = function (constructor) {
        return function (value) {
            return o.isExtending( value, constructor );
        };
    };

    o.isDuck = function (value, methods) {
        if (!o.isObject(value)) return false;
        for (var i = 0, l = methods.length; i < l; i++) {
            if (value[methods[i]] === undefined) return false;
        }
        return true;
    };
    o.duckType = function () {
        var methods = arguments;
        return function (value) {
            return o.isDuck( value, methods );
        };
    };

    o.isAny = function (value, types) {
        for (var i = 0, l = types.length; i < l; i++) {
            if (types[i](value)) return true;
        }
        return false;
    };
    o.anyType = function () {
        var types = arguments;
        return function (value) {
            return o.isAny.apply( o, value, types );
        };
    };

    o.isAll = function (value, types) {
        for (var i = 0, l = types.length; i < l; i++) {
            if (!types[i](value)) return false;
        }
        return true;
    };
    o.allType = function () {
        var types = arguments;
        return function (value) {
            return o.isAll( value, types );
        };
    };

    o.isNone = function (value, types) {
        return o.isAny(value,types) ? false : true;
    };
    o.noneType = function () {
        var types = arguments;
        return function (value) {
            return o.isNone( value, types );
        };
    };

    o.isNot = function (value, type) {
        return type(value) ? false : true;
    };
    o.notType = function (type) {
        return function (value) {
            return o.isNot( value, type );
        };
    };
}).call(this);
