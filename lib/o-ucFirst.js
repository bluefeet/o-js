var o = require('./o-bootstrap.js');

module.exports = o.ucFirst = function (str) {
    "use strict";

    return str.charAt(0).toUpperCase() + str.slice(1);
};
