var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    t.is( o.typeType.check(o.numberType), true, 'numbertype is a type' );
    t.is( o.typeType.check({}), false, 'simple object is not a type' );

    var type1 = o.typeType.coerce( function(){ return true } );
    t.ok( type1 instanceof o.Type, 'type coerced from function' );

    var type2 = o.typeType.coerce({
        validate: function(){ return true },
        coerce: function (val) { return val + 100 }
    });
    t.ok( type2 instanceof o.Type, 'type coerced from object' );
    t.is( type2.coerce(3), 103, 'coerced type works' );

    t.end();
});
