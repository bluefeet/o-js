var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var Person = new o.Class({
        attributes: {
            foo: {
                is: 'lite'
            }
        }
    });

    var p = new Person({ foo:'abc' });

    t.is( p.foo, 'abc', 'attribute was installed correctly' );

    t.end();
});
