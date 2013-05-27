var o = require('o-core');
require('o-types');
require('o-attributes');
require('o-traits');
require('../o-constructors');
var test = require('tap').test;

test('basic', function (t) {
    var Person = new o.Constructor({
        has: {
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
