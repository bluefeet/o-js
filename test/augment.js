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

    t.equal( obj.__proto__, Child.prototype, 'objects prototype came from the child constructor' );
    t.equal( Child.prototype.__proto__, Parent.prototype, 'childs prototype came from the parent constructor' );

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

    var Child3 = function (parent, foo, zap, mez) { parent(foo); this.zap = zap; this.mez = mez };
    Child3.prototype.getZap = function () { return this.zap };
    Child3 = o.augment(
        Parent,
        Child3,
        { getMez: function () { return this.mez } }
    );
    var obj3 = new Child3( 'FOO', 'ZAP', 'MEZ' );
    t.equal( obj3.getZap(), 'ZAP', 'prototype property was copied' );
    t.equal( obj3.getMez(), 'MEZ', 'constructor prototype was copied' );

    t.end();
});
