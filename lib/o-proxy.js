var o = require('./o-bootstrap.js');

module.exports = o.proxy = function (key, method) {
    return function () {
        return this[key][method].apply( this[key], arguments );
    };
};
