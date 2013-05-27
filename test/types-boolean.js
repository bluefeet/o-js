var o = require('o-core');
require('../o-types');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.booleanPrimitiveType.check(2), false, 'number is not a primitive' );
    t.is( o.booleanPrimitiveType.check(new Boolean()), false, 'Boolean is not a primitive' );
    t.is( o.booleanPrimitiveType.check(false), true, 'false is a primitive' );

    t.is( o.booleanObjectType.check(2), false, 'number is not an object' );
    t.is( o.booleanObjectType.check(false), false, 'false is not an object' );
    t.is( o.booleanObjectType.check(new Boolean()), true, 'Boolean is an object' );

    t.is( o.booleanType.check(2), false, 'number is not a boolean' );
    t.is( o.booleanType.check(false), true, 'false is a boolean' );
    t.is( o.booleanType.check(new Boolean()), true, 'Boolean is a boolean' );

    t.end();
});
