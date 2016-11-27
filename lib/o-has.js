var o = require('./o-bootstrap.js');

module.exports = o.has = function (obj, key) {
    return Object.prototype.hasOwnProperty.call( obj, key );
};
