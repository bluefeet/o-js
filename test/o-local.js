var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {

    var obj = {};
    t.is( obj.one, undefined, 'non-defined property is undefined' );
    o.local( obj, 'one', function(){
        obj.one = 'a';
        t.is( obj.one, 'a', 'modified localized value' );
    });
    t.is( obj.one, undefined, 'non-defined property was restored to original state' );

    obj.two = 'a';
    t.is( obj.two, 'a', 'defined property is set' );
    o.local( obj, 'two', function(){
        obj.two = 'b';
        t.is( obj.two, 'b', 'modified localized value' );
    });
    t.is( obj.two, 'a', 'defined property was restored to original state' );

    obj.__proto__ = { three: 'a' };
    t.is( obj.three, 'a', 'defined prototype property is set' );
    o.local( obj, 'three', function(){
        obj.three = 'b';
        t.is( o.has(obj,'three'), true, 'property value is not coming from prototype still' );
        t.is( obj.three, 'b', 'modified localized value' );
    });
    t.is( obj.three, 'a', 'defined prototype property was restored to original state' );
    t.is( o.has(obj,'three'), false, 'property value is coming from prototype still' );

    t.end();
});
