var o = require('./o-bootstrap.js');

var o_PatternType = require('./o-PatternType.js');

module.exports = o.identifierType = (function(){
    "use strict";

    return new o_PatternType(
        /^[A-Za-z_$][A-Za-z_$0-9]*$/,
        { name: 'o.identifierType' }
    );
})();
