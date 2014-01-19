var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var obj1 = { a:'A', b:'B' };
    var obj2 = { b:'BB', c:'CC', d:'DD' };
    var obj3 = { d:'DDD', e:'EEE' };

    var obj4 = o.merge( obj1, obj2, obj3 );
    t.equal( obj4, obj1, 'first argument was modified in place' );
    t.isDeeply( obj1, {a:'A', b:'BB', c:'CC', d:'DDD', e:'EEE' }, 'merged in right order' );

    t.end();
});
