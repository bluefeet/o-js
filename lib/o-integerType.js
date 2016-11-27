var o = require('./o-bootstrap.js');

var o_numberType = require('./o-numberType.js');

module.exports = o.integerType = o_numberType.subtype( function (val) {
    return (Math.floor(val) === val + 0) ? true : false;
});
