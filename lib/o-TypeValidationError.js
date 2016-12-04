var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');

module.exports = o.TypeValidationError = (function(){
    "use strict";

    return o_augment(
        Error,
        function (parent, type, value) {
            this.name = 'o.TypeValidationError';
            this.message = type.message( value );
            this.stack = (new Error(this.message)).stack;
            this.type = type;
            this.value = value;
        }
    );
})();
