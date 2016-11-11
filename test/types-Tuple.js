var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var type = new o.TupleType([ o.stringType, o.numberType ]);

    t.is( type.check(1), false, 'fails on non-array' );
    t.is( type.check([]), false, 'fails on empty array' );
    t.is( type.check(['a',1]), true, 'passes with correct values' );
    t.is( type.check([1,'a']), false, 'fails with incorrect values' );
    t.is( type.check(['a']), false, 'fails with too few values' );
    t.is( type.check(['a',1,2]), false, 'fails with too many values' );

    t.end();
});
