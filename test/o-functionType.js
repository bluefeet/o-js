var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.functionType.check(1), false, 'number is not a function' );
    t.is( o.functionType.check(function () {}), true, 'function is a function' );
    t.is( o.functionType.check(new Function ()), true, 'Function is a function' );
    t.end();
});
