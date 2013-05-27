var o = require('o-core');
require('o-types');
require('../o-attributes');
var test = require('tap').test;

test('key', function (t) {
    var attr = new o.Attribute({
        key: 'foo'
    });
    t.is( attr.key(), 'foo', 'key was stored' );
    t.end();
});

test('argKey', function (t) {
    var attr1 = new o.Attribute({ key:'foo' });
    t.is( attr1.argKey(), 'foo', 'argKey defaults to key' );

    var attr2 = new o.Attribute({ key:'foo', argKey:'bar' });
    t.is( attr2.argKey(), 'bar', 'argKey is settable' );

    var attr3 = new o.Attribute({ key:'foo', argKey:null });
    t.is( attr3.argKey(), null, 'argKey is nullable' );

    t.end();
});

test('valueKey', function (t) {
    var attr1 = new o.Attribute({ key:'foo' });
    t.is( attr1.valueKey(), '_foo', 'valueKey defaults to _key' );

    var attr2 = new o.Attribute({ key:'foo', valueKey:'bar' });
    t.is( attr2.valueKey(), 'bar', 'valueKey is settable' );

    t.end();
});
