var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var obj = { x: o.accessor('_x') };
    t.equal( obj.x(), undefined, 'property is undefined' );
    t.equal( obj.x(5), undefined, 'setting the property return original valie' );
    t.equal( obj.x(), 5, 'property was written and read' );
    t.end();
});

test('writer (pass-through)', function (t) {
    // TODO
    t.end();
});

test('writer (custom)', function (t) {
    // TODO
    t.end();
});

test('reader (pass-through)', function (t) {
    // TODO
    t.end();
});

test('reader (custom)', function (t) {
    // TODO
    t.end();
});
