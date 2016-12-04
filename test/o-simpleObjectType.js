var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.simpleObjectType.check(1), false, 'number is not a simple object' );
    t.is( o.simpleObjectType.check({}), true, 'object is a simple object' );
    t.is( o.simpleObjectType.check(new Object()), true, 'Object is a simple object' );
    t.is( o.simpleObjectType.check(new Number(32)), false, 'Number object is not a simple Object' );
    t.end();
});
