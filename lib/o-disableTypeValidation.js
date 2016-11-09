var o_Type = require('./o-Type.js');
var o_local = require('./o-local.js');

module.exports = function (func) {
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
