var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var log = [];

    var person = new o.Trait({
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
