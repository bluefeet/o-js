var o = require('o-core');
require('../o-types');
var test = require('tap').test;

test('basic', function (t) {
    var oneType = new o.Type(function (val) { return (val===1) ? true : false });
    var twoType = new o.Type(function (val) { return (val===2) ? true : false });
    var notOneTwoType = new o.NoneType([
        oneType,
        twoType
    ]);

    t.is( notOneTwoType.check(0), true, 'passes on 0' );
    t.is( notOneTwoType.check(1), false, 'fails on 1' );
    t.is( notOneTwoType.check(2), false, 'fails on 2' );
    t.is( notOneTwoType.check(3), true, 'passes on 3' );

    t.end();
});
