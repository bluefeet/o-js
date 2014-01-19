var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.objectType.check(1), false, 'number is not an object' );
    t.is( o.objectType.check({}), true, 'object is an object' );
    t.end();
});
