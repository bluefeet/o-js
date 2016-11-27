var o = require('./o-bootstrap.js');

module.exports = o.clearer = function (key) {
    return function () {
        delete this[key];
    };
};
