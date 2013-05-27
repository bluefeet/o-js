var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.definedType.check(1), true, 'number is defined' );
    t.is( o.definedType.check(null), true, 'null is defined' );
    t.is( o.definedType.check(undefined), false, 'undefined is not defined' );
    t.end();
});
