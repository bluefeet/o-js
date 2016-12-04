var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var values = [];
    var x = function (arg) { values.push(arg) };
    x = o.after( x, function () { values.push('after') } );
    x('during');
    t.isDeeply( values, ['during', 'after'], 'worked' );
    t.end();
});
