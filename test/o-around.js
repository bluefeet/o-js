var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var values = [];
    var x = function (arg) { values.push(arg) };
    x = o.around( x, function (original, arg) { values.push('before'); original(arg); values.push('after') } );
    x('during');
    t.isDeeply( values, ['before', 'during', 'after'], 'worked' );
    t.end();
});
