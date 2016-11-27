var o = require('./o-bootstrap.js');

var o_InstanceOfType = require('./o-InstanceOfType.js');
var o_Attribute = require('./o-Attribute.js');

module.exports = o.attributeType = new o_InstanceOfType( o_Attribute );
