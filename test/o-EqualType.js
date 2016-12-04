var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var twoType = new o.EqualType(2);

    t.is( twoType.check(0), false, 'fails on 0' );
    t.is( twoType.check(1), false, 'fails on 1' );
    t.is( twoType.check(2), true, 'passes on 2' );
    t.is( twoType.check(3), false, 'fails on 3' );

    t.end();
});
