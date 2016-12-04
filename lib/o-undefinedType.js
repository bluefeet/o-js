var o = require('./o-bootstrap.js');

var o_EqualType = require('./o-EqualType.js');

module.exports = o.undefinedType = (function(){
    "use strict";

    return new o_EqualType(
        undefined,
        { name: 'o.undefinedType' }
    );
})();
