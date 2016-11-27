var o = require('./o-bootstrap.js');

var o_objectType = require('./o-objectType.js');

module.exports = o.simpleObjectType = o_objectType.subtype( function (val) {
    return (val.constructor === Object) ? true : false;
});
