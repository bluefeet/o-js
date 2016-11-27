var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var Person = new o.Class({
        attributes: {
            foo: {
                is: 'rw'
            },
            bar: {}
        }
    });

    var p = new Person({ foo:'abc', bar:123 });
    p.foo('def');
    p.bar(456);

    t.is( p.foo(), 'def', 'writing to rw attribute did happen' );
    t.is( p.bar(), 123, 'writing to default attribute did not happen' );

    t.end();
});
