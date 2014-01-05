var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var trait = new o.Trait({});

    t.is( o.traitType.check(trait), true, 'trait is a trait' );
    t.is( o.traitType.check({}), false, 'simple object is not a trait' );

    t.end();
});
