var o = require('./o-bootstrap.js');

var o_numberType = require('./o-numberType.js');

module.exports = o.nonZeroType = o_numberType.subtype({
    name: 'o.nonZeroType',
    validate: function (val) {
        return (val !== 0) ? true : false;
    }
});
