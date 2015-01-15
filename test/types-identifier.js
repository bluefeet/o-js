var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var type = o.identifierType;

    var good = ['f','_','$','foo','_foo','$foo','f1','_1','$1'];

    for (var i = 0, l = good.length; i < l; i++) {
        t.is( type.check( good[i] ), true, good[i] + ' is an identifier' );
    }

    var bad = ['%','1','',null,undefined];

    for (var i = 0, l = bad.length; i < l; i++) {
        t.is( type.check( bad[i] ), false, bad[i] + ' is not an identifier' );
    }

    t.end();
});
