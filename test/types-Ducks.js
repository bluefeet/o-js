var o = require('o-core');
require('../o-types');
var test = require('tap').test;

test('basic', function (t) {
    var duckType = new o.DuckType(['a', 'b']);

    t.is( duckType.check('a'), false, 'string is not an object' );
    t.is( duckType.check({}), false, 'empty object fails' );
    t.is( duckType.check({a:32}), false, 'partial object fails' );
    t.is( duckType.check({a:4,b:0}), true, 'complete object passes' );

    t.end();
});
