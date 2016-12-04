var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.undefinedType.check(1), false, 'number is not undefined' );
    t.is( o.undefinedType.check(null), false, 'null is not undefined' );
    t.is( o.undefinedType.check(undefined), true, 'undefined is undefined' );
    t.end();
});
