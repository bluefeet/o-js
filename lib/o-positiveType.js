var o_numberType = require('./o-numberType.js');

module.exports = o_numberType.subtype( function (val) {
    return (val > 0) ? true : false;
});
