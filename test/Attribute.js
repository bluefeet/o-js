var o = require('../o');
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

test('rebuild', function(t) {
    var attr1 = new o.Attribute({ key:'fooKey', writer:'setFOO', predicate:true });
    t.is( attr1.key(), 'fooKey', 'key on original is correct' );
    t.is( attr1.writer(), 'setFOO', 'writer on original is correct' );
    t.is( attr1.predicate(), 'hasFooKey', 'predicate on original is correct' );

    var attr2 = attr1.rebuild({ key:'barKey' });
    t.is( attr2.key(), 'barKey', 'key on rebuilt is correct' );
    t.is( attr2.writer(), 'setFOO', 'writer on rebuilt is correct' );
    t.is( attr2.predicate(), 'hasBarKey', 'predicate on rebuilt is correct' );

    t.end();
});

test('builder', function (t) {
    var attr1 = new o.Attribute({
        key: 'fooKey',
        builder: true,
    });

    var attr2 = new o.Attribute({
        key: 'barKey',
        builder: 'buildBAR',
    });

    var obj = {
        buildFooKey: function () { return 'fooTest' },
        buildBAR: function () { return 'barTest' }
    };

    attr1.install( obj );
    attr2.install( obj );

    t.is( obj.fooKey(), 'fooTest', 'true builder worked' );
    t.is( obj.barKey(), 'barTest', 'named builder worked' );

    t.end();
});

test('basic', function (t) {
    var ageAttr = new o.Attribute({
        key: 'age',
        type: o.positiveType,
        devoid: function () { return 18 },
        clearer: true,
        writer: true
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
