var o = require('o-core');
require('../o-types');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.stringPrimitiveType.check(2), false, 'number is not a primitive' );
    t.is( o.stringPrimitiveType.check(new String()), false, 'String is not a primitive' );
    t.is( o.stringPrimitiveType.check('abc'), true, 'string is a primitive' );

    t.is( o.stringObjectType.check(2), false, 'number is not an object' );
    t.is( o.stringObjectType.check('abc'), false, 'string is not an object' );
    t.is( o.stringObjectType.check(new String()), true, 'String is an object' );

    t.is( o.stringType.check(2), false, 'number is not a string' );
    t.is( o.stringType.check('abc'), true, 'string is a string' );
    t.is( o.stringType.check(new String()), true, 'String is a string' );

    t.is( o.nonEmptyStringType.check(''), false, 'empty string is not non-empty' );
    t.is( o.nonEmptyStringType.check('abc'), true, 'non-empty string is non-empty' );

    t.end();
});
