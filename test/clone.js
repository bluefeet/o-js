
var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var A = function (foo) { this.foo = foo };
    A.prototype = { bar: 'BAR' };

    var a = new A( 'FOO' );
    var b = o.clone( a );

    t.isDeeply( a.foo, b.foo, 'objects match' );
    t.isDeeply( a.bar, b.bar, 'objects match' );
    t.equal( a.__proto__, b.__proto__, 'prototype matches' );
    t.equal( a.constructor, b.constructor, 'constructor matches' );

    t.end();
});
