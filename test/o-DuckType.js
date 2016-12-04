var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var duckType = new o.DuckType(['a', 'b']);

    t.is( duckType.check('a'), false, 'string is not an object' );
    t.is( duckType.check({}), false, 'empty object fails' );
    t.is( duckType.check({a:32}), false, 'partial object fails' );
    t.is( duckType.check({a:4,b:0}), true, 'complete object passes' );

    t.end();
});

test('with types', function (t) {
    var duckType = new o.DuckType({name:o.stringType, age:o.integerType});

    t.is( duckType.check('a'), false, 'string is not an object' );
    t.is( duckType.check({}), false, 'empty object fails' );
    t.is( duckType.check({name:'joe'}), false, 'partial object fails' );
    t.is( duckType.check({name:'joe', age:29}), true, 'complete object passes' );
    t.is( duckType.check({name:29, age:'joe'}), false, 'complete object with bad values fails' );

    t.end();
});
