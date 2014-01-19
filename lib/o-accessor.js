var o_writer = require('./o-writer.js');
var o_reader = require('./o-reader.js');

module.exports = function (key, def) {
    def = def || {};
    def.writer = def.writer || o_writer( key, def );
    def.reader = def.reader || o_reader( key, def );

    return function (val) {
        if (val !== undefined) return def.writer.call( this, val );
        return def.reader.call( this );
    };
};
