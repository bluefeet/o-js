var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var A = function () {};
    var B = function () {};

    var bType = new o.InstanceOfType( B );

    t.is( bType.check(1), false, 'number is not an instance of B' );
    t.is( bType.check(new A()), false, 'a is not an instance of B' );
    t.is( bType.check(new B()), true, 'b is an instance of B' );

    var Thing = new o.Class({ attributes: { foo:{} } });
    var thingType = new o.InstanceOfType( Thing );
    var thing = thingType.coerce({ foo:32 });
    t.is( thing.foo(), 32, 'Class coercion worked' );

    t.end();
});
