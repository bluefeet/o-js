var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var attr = new o.Attribute({
        key: 'foo'
    });

    t.is( o.attributeType.check(attr), true, 'attribute is an attribute' );
    t.is( o.attributeType.check({}), false, 'simple object is not an attribute' );

    t.end();
});
