var o = require('./o-bootstrap.js');

var o_construct = require('./o-construct.js');
var o_merge = require('./o-merge.js');

o.Type = o_construct(
    function (args) {
        args = args || {};
        if (typeof args === 'function') args = { validate: args };
        if (args.validate) this._validateMethod = args.validate;
        if (args.coerce) this._coerceMethod = args.coerce;
        if (args.parent) this._parent = args.parent;
    },
    {
        check: function (val) {
            if (o.Type.validationDisabled) return true;
            if (this._parent) { if (!this._parent.check(val)) return false; }
            if (!this._validateMethod) return true;
            if (!this._validateMethod( val )) return false;
            return true;
        },
        validate: function (val) {
            if (!this.check( val )) throw new Error( val + ' failed validation.' );
        },
        coerce: function (val) {
            val = this.coerceOnly( val );
            this.validate( val );
            return val;
        },
        coerceOnly: function (val) {
            if (this._parent) val = this._parent.coerceOnly( val );
            if (this._coerceMethod) val = this._coerceMethod( val );
            return val;
        },
        subtype: function (args) {
            if (typeof args === 'function') { args = { validate: args }; }
            return new o.Type(
                o_merge( {parent:this}, args )
            );
        }
    }
);

o.Type.validationDisabled = false;

module.exports = o.Type;
