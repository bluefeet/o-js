var o = require('./o-bootstrap.js');

var o_AnyType = require('./o-AnyType.js');
var o_TypeOfType = require('./o-TypeOfType.js');
var o_InstanceOfType = require('./o-InstanceOfType.js');

module.exports = o.stringType = new o_AnyType(
    [
        new o_TypeOfType( 'string' ),
        new o_InstanceOfType( String )
    ],
    { name: 'o.stringType' }
);
