var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var trait = new o.Trait({});

    t.is( o.traitType.check(trait), true, 'trait is a trait' );
    t.is( o.traitType.check({}), false, 'simple object is not a trait' );

    trait = o.traitType.coerce({ attributes:{foo:{}} });
    t.ok( trait instanceof o.Trait, 'coercion worked' );
    var obj = trait.install({}, { foo: 'hi!' });
    t.is( obj.foo, 'hi!', 'coerced trait works' );

    t.end();
});
