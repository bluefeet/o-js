var o = require('o-core');
require('../o-types');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.arrayType.check(1), false, 'number is not an array' );
    t.is( o.arrayType.check([]), true, 'primitive array is an array' );
    t.is( o.arrayType.check(new Array()), true, 'object array is an array' );
    t.end();
});
