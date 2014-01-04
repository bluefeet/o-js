var o = require('../o');
var test = require('tap').test;

test('type', function (t) {
    var parentTrait = new o.Trait({
        attributes: { parentAttribute:{ type:o.integerType } },
        methods: { parentMethod:function(){} }
    });

    var trait = new o.Trait({
        traits: [ parentTrait ],
        attributes: {
            type: { type:o.integerType },
            augments: { augments:Number },
            both: { type:o.integerType, augments:Number },
            none: { }
        },
        methods: { method:function(){} },
        after: { after:function(){} },
        before: { before:function(){} },
        around: { around:function(){} },
    });

    var type = trait.type();
    var parentType = parentTrait.type();

    t.is( parentType.check({}), false, 'parent type failed on empty object' );
    t.is( parentType.check({ _parentAttribute:32, parentMethod:function(){} }), true, 'parent type passed object');

    var good = {
        _parentAttribute: 32,
        parentMethod: function(){},

        _type: 103,
        _augments: new Number( 32.45 ),
        _both: new Number( 103 ),
        _none: null,

        method: function(){},
        after: function(){},
        before: function(){},
        around: function(){}
    };
    t.is( type.check(good), true, 'type passed' );

    var bad1 = o.merge({}, good, {_type:null});
    t.is( type.check(bad1), false, 'type failed' );

    var bad2 = o.merge({}, good, {method:'foo'});
    t.is( type.check(bad2), false, 'type failed' );

    var bad3 = o.merge({}, good, {_augments:32.45});
    t.is( type.check(bad3), false, 'type failed' );

    var bad4 = o.merge({}, good, {_both:new Number(103.1)});
    t.is( type.check(bad4), false, 'type failed' );

    var bad5 = o.merge({}, good, {_parentAttribute:'foo'});
    t.is( type.check(bad5), false, 'type failed' );

    t.end();
});

// This test is a bit brittle as it depends on JavaScript returning a
// filtered attribute our before a non-filtered attribute when using for.
// See o.Trait's setFromArgs function.
test('set-from-args-race-condition', function (t) {
    var filter = function (val) {
        return( val + this.a() + this.c() + this.e() );
    };

    var trait = new o.Trait({
        attributes: {
            a: {},
            b: { filter: filter },
            c: {},
            d: { filter: filter },
            e: {},
            f: { filter: filter },
        }
    });

    var obj = {};
    trait.install( obj, { a:'a', b:'b', c:'c', d:'d', e:'e', f:'f' } );

    t.is( obj.a(), 'a' );
    t.is( obj.b(), 'bace' );
    t.is( obj.c(), 'c' );
    t.is( obj.d(), 'dace' );
    t.is( obj.e(), 'e' );
    t.is( obj.f(), 'face' );

    t.end();
});

test('existing-attributes', function (t) {
    var attr = new o.Attribute({
        key: 'hair',
        filter: function (val) { return val + 'FOO' },
        writer: true
    });

    var trait = new o.Trait({
        attributes: {
            hair: attr,
            fur: attr
        }
    });

    var obj = {};
    trait.install( obj );

    obj.hair('green');
    obj.fur('pink');

    t.is( obj._hair, 'greenFOO' );
    t.is( obj._fur, 'pinkFOO' );

    t.end();
});

test('basic', function (t) {
    var log = [];

    var person = new o.Trait({
        attributes: {
            firstName: { type:o.nonEmptyStringType, writer:true },
            lastName: { type:o.nonEmptyStringType, writer:true },
            gender: { type:new o.EnumType(['m', 'f']), writer:true },
            married: { type:o.booleanType, writer:true }
        },
        methods: {
            fullName: function () {
                return this.firstName() + ' ' + this.lastName();
            }
        },
        around: {
            fullName: function (original) {
                log.push('around-FullName');
                var name = original();
                if (this.gender() === 'm') {
                    name = 'Mr. ' + name;
                }
                else {
                    name = (this.married() ? 'Mrs. ' : 'Ms. ') + name;
                }
                return name;
            }
        },
        before: {
            gender: function () { log.push('before-gender') },
            fullName: function () { log.push('before-fullName') }
        },
        after: {
            gender: function () { log.push('after-gender') },
            fullName: function () { log.push('after-fullName') }
        }
    });

    var obj = {};
    person.install( obj );

    obj.firstName('Jill');
    obj.lastName('Smith');
    obj.married(true);
    t.isDeeply( log, [], 'log is empty' );

    obj.gender('f');
    t.isDeeply( log, ['before-gender', 'after-gender'], 'logged before and after' );
    log = [];

    t.is( obj.fullName(), 'Mrs. Jill Smith', 'all the pieces fit together' );
    t.isDeeply( log, ['before-fullName', 'around-FullName', 'before-gender', 'after-gender', 'after-fullName'], 'logged before, after, and arounds in the right order' );

    t.end();
});
