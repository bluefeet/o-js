var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.booleanType.check(2), false, 'number is not a boolean' );
    t.is( o.booleanType.check(false), true, 'false is a boolean' );
    t.is( o.booleanType.check(new Boolean()), true, 'Boolean is a boolean' );

    t.end();
});
