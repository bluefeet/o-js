var o_stringType = require('./o-stringType.js');

module.exports = o_stringType.subtype( function (val) {
    return (val.length > 0) ? true : false;
});
