var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var number = new o.Type({
        validate: function (val) {
            return (typeof val === 'number') ? true : false;
        }
    });
    t.is( number.check(123), true, 'number passes validation' );
    t.is( number.check('abc'), false, 'string fails validation' );

    o.disableTypeValidation(function(){
        t.is( number.check('abc'), true, 'validation disabled inside of scope' );
    });
    t.is( number.check('abc'), false, 'validation re-enabled outside of scope' );

    o.disableTypeValidation();
    t.is( number.check('abc'), true, 'validation disabled globally' );

    o.Type.validationDisabled = false;
    t.is( number.check('abc'), false, 'validation enabled globally' );

    t.end();
});
