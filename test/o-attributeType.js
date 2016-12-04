var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var attr = new o.Attribute({
        key: 'foo'
    });

    t.is( o.attributeType.check(attr), true, 'attribute is an attribute' );
    t.is( o.attributeType.check({}), false, 'simple object is not an attribute' );

    attr = o.attributeType.coerce({ key:'bar' });
    t.ok( attr instanceof o.Attribute, 'coercion worked' );
    t.is( attr.key, 'bar', 'coerced attribute looks right' );

    t.end();
});
