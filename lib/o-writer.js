var o = require('./o-bootstrap.js');

module.exports = o.writer = function (key, def) {
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
