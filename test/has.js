var o = require('../o');
var test = require('tap').test;

test( 'basic', function (t) {
    var obj = { name: 'Foo' };
    t.ok( o.has(obj, 'name'), 'has found a property' );
    t.ok( !o.has(obj, 'bah'), 'has did not find a property' );
    obj.__proto__ = { age: 65 };
    t.equal( obj.age, 65, 'value propogates from prototype' );
    t.ok( !o.has(obj, 'age'), 'prototype property does not affect has' );
    t.end();
});
