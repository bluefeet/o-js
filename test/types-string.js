var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.stringType.check(2), false, 'number is not a string' );
    t.is( o.stringType.check('abc'), true, 'string is a string' );
    t.is( o.stringType.check(new String()), true, 'String is a string' );

    t.is( o.nonEmptyStringType.check(''), false, 'empty string is not non-empty' );
    t.is( o.nonEmptyStringType.check('abc'), true, 'non-empty string is non-empty' );

    t.end();
});
