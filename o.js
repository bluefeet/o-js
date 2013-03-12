(function() {
    var root = this;
    var previousO = root.o;
    var o = {};

    // The method in which we export o, that works whether in the browser or
    // Node.js, including noConflict, was graciously copied from underscore.js.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = o;
        }
        exports.o = o;
    } else {
        root.o = o;
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
                if (def.required) {
                    throw new Error('...');
                }
                else if (def['default'] !== undefined) {
                    var value = def['default'];
                    if (typeof value === 'function') { 
                        value = value.call( this );
                    }

                    def.writer.call( this, value );
                }
            }

            return this[key];
        };
    };

    o.writer = function (key, def) {
        def = def || {};
        if (def.option) def.isa = def.isa || 'boolean';
        if (def.extends) def.isa = def.isa || 'object';

        return function (value) {
            if (def.option && value === undefined) { value = true }
            if (def.filter) { value = def.filter.call( this, value ) }

            if (def.isa) {
                if (typeof def.isa === 'string') {
                    if (typeof value !== def.isa) throw new Error('...');
                }
                else if (!def.isa.call(this, value)) {
                    throw new Error('...');
                }
            }

            if (def['extends']) {
                if (!(value instanceof def['extends'])) {
                    throw new Error('...');
                }
            }

            this[key] = value;
            if (def.chain || def.option) { return this }
            return value;
        };
    };

    o.accessor = function (key, def) {
        def = def || {};
        def.writer = def.writer || o.writer( key, def );
        def.reader = def.reader || o.reader( key, def );

        return function (value) {
            if (value !== undefined) {
                def.writer.call( this, value );
            }
            return def.reader.call( this );
        };
    };

    o.predicate = function (key) {
        return function () {
            return o.has( this, key );
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

    o.extend = function (parent, constructor, proto) {
        var child = o.around(
            parent,
            constructor
        );

        child.prototype = proto
                        ? o.merge( {}, constructor.prototype, proto )
                        : o.clone( constructor.prototype );

        child.prototype.__proto__ = parent.prototype;

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
}).call(this);
