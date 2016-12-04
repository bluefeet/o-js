var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o.InstanceOfType = o_augment(
    o_Type,
    function (parent, Constructor, args) {
        args = args || {};

        if (!args.validate) args.validate = function (obj) {
            return (obj instanceof Constructor) ? true : false;
        };

        if (!args.coerce) args.coerce = function (args) {
            return this.check( args ) ? args : new Constructor( args );
        };

        if (!args.name) args.name = 'o.InstanceOfType';

        if (!args.message) args.message = function (val) {
            return val + ' failed ' + this.name + ' validation due to not being an instanceof ' +
                (Constructor.name || Constructor) + '.';
        };

        parent( args );
    }
);
