var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var Parent = function (foo) { this.foo = foo };
    Parent.prototype = { getFoo: function () { return this.foo } };

    var Child = o.augment(
        Parent,
        function (parent, foo, bar) { parent(foo); this.bar = bar }
    );
    Child.prototype.getBar = function () { return this.bar };

    var obj = new Child( 'FOO', 'BAR' );
    t.equal( obj.foo, 'FOO', 'constructor arguments for parent made it through' );
    t.equal( obj.bar, 'BAR', 'constructor arguments for child made it through' );

    t.ok( obj instanceof Child, 'object is an instance of the child constructor' );
    t.ok( obj instanceof Parent, 'object is an instance of the parent constructor' );

    t.equal( obj.getFoo(), 'FOO', 'called function from the parent' );
    t.equal( obj.getBar(), 'BAR', 'called function from the child' );

    var Child2 = o.augment(
        Parent,
        function (parent, foo, baz) { parent(foo); this.baz = baz },
        { getBaz: function () { return this.baz } }
    );
    var obj2 = new Child2( 'FOO', 'BAZ' );
    t.equal( obj2.getBaz(), 'BAZ', 'prototype argument was copied' );

    t.end();
});
