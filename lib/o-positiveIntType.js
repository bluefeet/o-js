var o = require('./o-bootstrap.js');

var o_AllType = require('./o-AllType.js');
var o_integerType = require('./o-integerType.js');
var o_positiveType = require('./o-positiveType.js');

module.exports = o.positiveIntType = (function(){
    "use strict";

    return new o_AllType(
        [ o_integerType, o_positiveType ],
        { name: 'o.positiveIntType' }
    );
})();
