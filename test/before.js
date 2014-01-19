var o = require('../lib/o.js');
var test = require('tap').test;

test('basic', function (t) {
    var values = [];
    var x = function (arg) { values.push(arg) };
    x = o.before( x, function () { values.push('before') } );
    x('during');
    t.isDeeply( values, ['before', 'during'], 'worked' );
    t.end();
});
