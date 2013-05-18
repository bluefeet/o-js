
test( 'attribute', function () {
    var ageAttr = new o.Attribute({
        key: 'age',
        type: o.positiveType(),
        devoid: function () { return 18 },
        clearer: true
    });

    var nameAttr = new o.Attribute({
        key: 'name',
        type: o.nonEmptyStringType(),
        required: true,
        writer: '_setName',
        predicate: true
    });

    var queueAttr = new o.Attribute({
        key: 'queue',
        type: o.arrayType(),
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

    equal( obj.age(), 18, 'devoid was applied' );
    obj.age( 32 );
    equal( obj.age(), 32, 'age was set' );

    obj.clearAge();
    equal( obj.age(), 18, 'devoid was re-applied after clear' );

    equal( obj.hasAge, undefined, 'no predicate was created' );

    equal( obj.hasName(), false, 'predicate was created' );
    throws( function(){ obj.name() }, 'throws when required' );
    obj._setName('Foo');
    equal( obj.name(), 'Foo', 'name was set' );
    obj.name('Bar');
    equal( obj.name(), 'Foo', 'name was set by reader' );
    equal( obj.clearName, undefined, 'no clearer was created' );

    obj.enqueue('a');
    obj.enqueue('b');
    equal( obj.dequeue(), 'a', 'first queued proxy value dequeued' );
    obj.enqueue('c');
    equal( obj.dequeue(), 'b', 'second queued proxy value dequeued' );
    equal( obj.dequeue(), 'c', 'third queued proxy value dequeued' );
    equal( obj.dequeue(), undefined, 'queue proxy is empty' );
});
