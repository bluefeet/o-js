var o = require('./o-bootstrap.js');

var o_Type = require('./o-Type.js');
var o_local = require('./o-local.js');

module.exports = o.disableTypeValidation = function (func) {
    "use strict";

    if (!func) {
        o_Type.validationDisabled = true;
        return;
    }

    return o_local(
        o_Type,
        'validationDisabled',
        function(){
            o_Type.validationDisabled = true;
            return func();
        }
    );
};
