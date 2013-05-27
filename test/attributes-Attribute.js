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
var o = require('o-core');
require('o-types');
require('../o-attributes');
var test = require('tap').test;

test('basic', function (t) {
    var ageAttr = new o.Attribute({
        key: 'age',
        type: o.positiveType,
        devoid: function () { return 18 },
        clearer: true
    });

    var nameAttr = new o.Attribute({
        key: 'name',
        type: o.nonEmptyStringType,
        required: true,
        writer: '_setName',
        predicate: true
    });

    var queueAttr = new o.Attribute({
        key: 'queue',
        type: o.arrayType,
        devoid: function(){ return [] },
        proxies: {
            enqueue: 'unshift',
            dequeue: 'pop'
        }
    });

    var obj = {};
    ageAttr.install( obj );
    nameAttr.install( obj );
    queueAttr.install( obj );

    t.equal( obj.age(), 18, 'devoid was applied' );
    obj.age( 32 );
    t.equal( obj.age(), 32, 'age was set' );

    obj.clearAge();
    t.equal( obj.age(), 18, 'devoid was re-applied after clear' );

    t.equal( obj.hasAge, undefined, 'no predicate was created' );

    t.equal( obj.hasName(), false, 'predicate was created' );
    t.throws( function(){ obj.name() }, 'throws when required' );
    obj._setName('Foo');
    t.equal( obj.name(), 'Foo', 'name was set' );
    obj.name('Bar');
    t.equal( obj.name(), 'Foo', 'name was set by reader' );
    t.equal( obj.clearName, undefined, 'no clearer was created' );

    obj.enqueue('a');
    obj.enqueue('b');
    t.equal( obj.dequeue(), 'a', 'first queued proxy value dequeued' );
    obj.enqueue('c');
    t.equal( obj.dequeue(), 'b', 'second queued proxy value dequeued' );
    t.equal( obj.dequeue(), 'c', 'third queued proxy value dequeued' );
    t.equal( obj.dequeue(), undefined, 'queue proxy is empty' );

    t.end();
});
