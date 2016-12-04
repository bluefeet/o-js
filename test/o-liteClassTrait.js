var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var Person = new o.Class({
        is: 'lite',
        attributes: {
            foo: {}
        }
    });

    var p = new Person({ foo:'abc' });

    t.is( p.foo, 'abc', 'attribute was installed correctly' );

    t.end();
});
