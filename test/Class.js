var o = require('../lib/o.js');
var test = require('tap').test;

test('type', function (t) {
    var Thing1 = new o.Class({});
    var Thing2 = new o.Class({});

    var thing1 = new Thing1({});
    var thing2 = new Thing2({});

    t.is( Thing1.type().check(thing1), true, 'type passed' );
    t.is( Thing1.type().check(thing2), false, 'type failed' );

    var Obj = new o.Class({
        attributes: { one: {type:Thing1.type(), coerce:true} }
    });
    var obj = new Obj({ one:{} });

    t.is( obj.one().constructor, Thing1, 'coerce worked' );

    t.end();
});

test('basic', function (t) {
    var Person = new o.Class({
        attributes: {
            firstName: { type:o.nonEmptyStringType },
            lastName: { type:o.nonEmptyStringType },
            gender: { type:new o.EnumType(['m', 'f']) },
            married: { type:o.booleanType }
        },
        methods: {
            fullName: function () {
                return this.firstName() + ' ' + this.lastName();
            }
        },
        around: {
            fullName: function (original) {
                var name = original();
                if (this.gender() === 'm') {
                    name = 'Mr. ' + name;
                }
                else {
                    name = (this.married() ? 'Mrs. ' : 'Ms. ') + name;
                }
                return name;
            }
        }
    });

    var obj = new Person({
        firstName: 'Jill',
        lastName: 'Smith',
        married: true,
        gender: 'f'
    });

    t.is( obj.fullName(), 'Mrs. Jill Smith', 'all the pieces fit together' );

    t.end();
});

test('traits', function (t) {
    var trait = new o.Trait({
        attributes: {
            traitAttr: {}
        }
    });

    var Class = new o.Class({
        traits: [ trait ],
        attributes: {
            classAttr: {}
        }
    });

    var obj = new Class({
        traitAttr: 'foo',
        classAttr: 'bar'
    });

    t.is( obj.traitAttr(), 'foo', 'ok' );
    t.is( obj.classAttr(), 'bar', 'ok' );

    t.end();
});
