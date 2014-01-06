var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var Class = new o.Class({});

    t.is( o.classType.check(Class), true, 'Class is a Class' );
    t.is( o.classType.check({}), false, 'simple object is not a Class' );

    t.end();
});
