var o = require('./o-bootstrap.js');

var o_EqualType = require('./o-EqualType.js');

module.exports = o.nullType = (function(){
    "use strict";

    return new o_EqualType(
        null,
        { name: 'o.nullType' }
    );
})();
