var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o.InstanceOfType = o_augment(
    o_Type,
    function (parent, Constructor, args) {
        args = args || {};
        args.validate = function (obj) {
            return (obj instanceof Constructor) ? true : false;
        };
        args.coerce = function (args) {
            return this.check( args ) ? args : new Constructor( args );
        };
        parent( args );
    }
);
