var o = require('./o-bootstrap.js');

var o_ucFirst = require('./o-ucFirst.js');

module.exports = o.prependIdentifier = (function(){
    "use strict";

    var privateMatch = /^_/;

    return function (str, ident) {
        var isPrivate = privateMatch.test(ident);
        if (!isPrivate) isPrivate = privateMatch.test(str);

        ident = ident.replace(privateMatch,'');
        str = str.replace(privateMatch,'');

        if (str) ident = o_ucFirst( ident );
        ident = str + ident;

        if (isPrivate) ident = '_' + ident;

        return ident;
    };
})();
