var o = require('../o');
var test = require('tap').test;

test('basic', function (t) {
    var obj = {};

    obj.queue = [];
    obj.enqueue = o.proxy('queue', 'unshift');
    obj.dequeue = o.proxy('queue', 'pop');
    t.deepEqual( obj.queue, [], 'queue is empty' );

    obj.enqueue( 'job1' );
    obj.enqueue( 'job2' );
    obj.enqueue( 'job3' );
    t.deepEqual( obj.queue, ['job3', 'job2', 'job1'], 'queue is full' );

    t.equal( obj.dequeue(), 'job1', 'dequeued first job' );

    t.deepEqual( obj.queue, ['job3', 'job2'], 'remaining jobs are correct' );

    t.end();
});
