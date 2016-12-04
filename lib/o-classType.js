var o = require('./o-bootstrap.js');

var o_classTrait = require('./o-classTrait.js');
var o_Class = require('./o-Class.js');

module.exports = o.classType = (function(){
    "use strict";

    return o_classTrait.type.subtype({
        name: 'o.classType',
        coerce: function (args) {
            return this.check(args) ? args : new o_Class(args);
        }
    });
})();
