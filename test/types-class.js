var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var Class = new o.Class({});

o.classType.validate( Class );
    t.is( o.classType.check(Class), true, 'Class is a Class' );
    t.is( o.classType.check({}), false, 'simple object is not a Class' );

    Class = o.classType.coerce({ attributes:{foo:{}} });
    t.ok( o.classType.check(Class), 'coercion worked' );
    var obj = new Class({ foo:'hi!' });
    t.is( obj.foo(), 'hi!', 'coerced class works' );

    t.end();
});
