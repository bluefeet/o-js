var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var Person = new o.Class({
        attributes: {
            foo: {
                is: 'rwp'
            }
        }
    });

    var p = new Person({ foo:'abc' });
    p._foo = 'def';
    p.foo = 'ghi';

    t.is( p.foo, 'def', 'writing to rwp attribute did happen' );

    t.end();
});
