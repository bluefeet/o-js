var o = require('./o-bootstrap.js');

var o_construct = require('./o-construct.js');
var o_merge = require('./o-merge.js');
var o_TypeValidationError = require('./o-TypeValidationError.js');

module.exports = o.Type = (function(){
    "use strict";

    var o_Type = o_construct(
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
                if (o_Type.validationDisabled) return true;
                if (this._parent) { if (!this._parent.check(val)) return false; }
                if (!this._validateMethod) return true;
                if (!this._validateMethod( val )) return false;
                return true;
            },
            validate: function (val) {
                if (o_Type.validationDisabled) return;
                if (this._parent) { this._parent.validate(val) }
                if (!this._validateMethod) return true;
                if (!this._validateMethod( val )) throw new o_TypeValidationError( this, val );
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
                return new o_Type(
                    o_merge( {parent:this}, args )
                );
            },
            message: function (val) {
                if (!this._message) return val + ' failed ' + this.name + ' validation.';
                return this._message( val );
            }
        }
    );

    Object.defineProperties( o_Type.prototype, {
        name: { get:function(){ return this._name; } }
    });

    o_Type.validationDisabled = false;

    return o_Type;
})();
