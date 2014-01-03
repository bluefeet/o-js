var o = require('../o');
var test = require('tap').test;

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
