var o_writer = require('./o-writer.js');
var o_predicate = require('./o-predicate.js');

module.exports = function (key, def) {
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
