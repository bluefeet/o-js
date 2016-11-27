var o = require('./o-bootstrap.js');

var o_classTrait = require('./o-classTrait.js');
var o_Class = require('./o-Class.js');

module.exports = o.classType = o_classTrait.type().subtype({
    coerce: function (args) {
        return this.check(args) ? args : new o_Class(args);
    }
});
