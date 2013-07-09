var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var numPrefixType = new o.PatternType(/\d+$/);

    t.is( numPrefixType.check('abc'), false, 'fails on "abc"' );
    t.is( numPrefixType.check('123abc'), false, 'fails on "123abc"' );
    t.is( numPrefixType.check(''), false, 'fails on ""' );
    t.is( numPrefixType.check('abc123'), true, 'passes on "abc123"' );
    t.is( numPrefixType.check('123'), true, 'passes on "123"' );

    t.end();
});
