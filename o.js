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
        var writer = def.writer || o.writer( key, def );
        var predicate = def.predicate || o.predicate( key );

        return function () {
            if (!predicate.call( this )) {
                if (def.required) {
                    throw new Error('...');
                }
                else if (def.default !== undefined) {
                    var value = def.default;
                    if (typeof value === 'function') { 
                        value = value.call( this );
                    }

                    writer.call( this, value );
                }
            }

            return this[key];
        };
    };

    o.writer = function (key, def) {
        def = def || {};
        var isa = def.isa
        if (def.option) isa = isa || 'boolean';

        return function (value) {
            if (def.option && value === undefined) { value = true }
            if (def.filter) { value = def.filter.call( this, value ) }

            if (isa) {
                if (typeof isa === 'string') {
                    if (typeof value !== isa) throw new Error('...');
                }
                else if (!isa.call(this, value)) {
                    throw new Error('...');
                }
            }

            if (def.extends) {
                if (!(value instanceof def.extends)) {
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
        var writer = def.writer || o.writer( key, def );
        var reader = def.reader || o.reader( key, def );

        return function (value) {
            if (value !== undefined) {
                writer.call( this, value );
            }
            return reader.call( this );
        };
    };

    o.predicate = function (key) {
        return function () {
            return Object.prototype.hasOwnProperty.call(this, key);
        };
    };

    o.clearer = function (key) {
        return function () {
            delete this[key];
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
                original.apply( self, arguments );
            };
            args.unshift( wrapper );
            func.apply( self, args );
        };
    };

    o.proxy = function (key, method) {
        return function () {
            return this[key][method].apply( this[key], arguments );
        };
    };

    o.extend = function (parent, constructor) {
        var child = o.around(
            parent,
            constructor
        );

        var proto = {};
        for (var key in parent.prototype) {
            proto[key] = parent.prototype[key];
        }
        for (var key in constructor.prototype) {
            proto[key] = constructor.prototype[key];
        }

        child.prototype = proto;

        return child;
    };
}).call(this);
