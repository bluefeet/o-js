var o_AnyType = require('./o-AnyType.js');
var o_TypeOfType = require('./o-TypeOfType.js');
var o_InstanceOfType = require('./o-InstanceOfType.js');

module.exports = new o_AnyType([
    new o_TypeOfType( 'boolean' ),
    new o_InstanceOfType( Boolean )
]);
