var o = require('./o-bootstrap.js');

var o_EqualType = require('./o-EqualType.js');

module.exports = o.undefinedType = new o_EqualType(
    undefined,
    { name: 'o.undefinedType' }
);
