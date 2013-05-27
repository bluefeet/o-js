var o = require('o-core');
require('../o-types');
var test = require('tap').test;

test('basic', function (t) {
    var oneTwoType = new o.EnumType([1,2]);

    t.is( oneTwoType.check(0), false, 'fails on 0' );
    t.is( oneTwoType.check(1), true, 'passes on 1' );
    t.is( oneTwoType.check(2), true, 'passes on 2' );
    t.is( oneTwoType.check(3), false, 'fails on 3' );

    t.end();
});
