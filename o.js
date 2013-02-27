var _ = require('./underscore.js');

(function() {
    var root = this;
    var previous = root.o;

    var o = {};

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = o;
        }
        exports.o = o;
    } else {
        root.o = o;
    }

    o.noConflict = function () {
        root.o = previous;
        return o;
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

    o.extend = function (parent, constructor) {
        var child = o.around(
            parent,
            constructor
        );

        var proto = _.clone( parent.prototype || {} );
        _.extend(
            proto,
            (constructor.prototype || {})
        );

        child.prototype = proto;

        return child;
    };

    o.predicate = function (key) {
        return function () {
            return _.has( this, key );
        };
    };

    o.clearer = function (key) {
        return function () {
            delete this[key];
        };
    };

    o.reader = function (key, def) {
        def = def || {};
        var writer = def.writer || o.writer( key, def );
        var predicate = def.predicate || o.predicate( key );

        return function () {
            if (!predicate.call( this )) {
                if (def.default !== undefined) {
                    var value = def.default;
                    if (typeof value === 'function') { 
                        value = value.call( this );
                    }

                    writer.call( this, value );
                }
                else if (def.required) {
                    throw new Error('...');
                }
            }

            return this[key];
        };
    };

    o.writer = function (key, def) {
        def = def || {};

        return function (value) {
            if (def.option && value === undefined) { value = true }
            if (def.coerce) { value = def.coerce.call( this, value ) }
            if (def.isa && !def.isa.call( this, value )) { throw new Error('...') }

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
}).call(this);
