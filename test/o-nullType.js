var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.nullType.check(1), false, 'number is not null' );
    t.is( o.nullType.check(undefined), false, 'undefined is not null' );
    t.is( o.nullType.check(null), true, 'null is null' );
    t.end();
});
