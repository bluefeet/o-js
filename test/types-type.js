var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.typeType.check(o.numberType), true, 'numbertype is a type' );
    t.is( o.typeType.check({}), false, 'simple object is not a type' );

    t.end();
});
