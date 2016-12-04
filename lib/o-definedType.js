var o = require('./o-bootstrap.js');

var o_NotType = require('./o-NotType.js');
var o_undefinedType = require('./o-undefinedType.js');

module.exports = o.definedType = new o_NotType(
    o_undefinedType,
    { name: 'o.NotType' }
);
