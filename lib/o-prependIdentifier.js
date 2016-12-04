var o = require('./o-bootstrap.js');

var o_ucFirst = require('./o-ucFirst.js');

var privateMatch = /^_/;

module.exports = o.prependIdentifier = function (str, ident) {
    "use strict";

    var isPrivate = privateMatch.test(ident);
    if (!isPrivate) isPrivate = privateMatch.test(str);

    ident = ident.replace(privateMatch,'');
    str = str.replace(privateMatch,'');

    if (str) ident = o_ucFirst( ident );
    ident = str + ident;

    if (isPrivate) ident = '_' + ident;

    return ident;
};
