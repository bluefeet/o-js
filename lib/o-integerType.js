var o_numberType = require('./o-numberType.js');

module.exports = o_numberType.subtype( function (val) {
    return (Math.floor(val) === val + 0) ? true : false;
});
