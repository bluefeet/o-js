var o = require('./o-bootstrap.js');

var o_augment = require('./o-augment.js');
var o_Type = require('./o-Type.js');

module.exports = o.TypeOfType = o_augment(
    o_Type,
    function (parent, result, args) {
        args = args || {};

        if (!args.validate) args.validate = function (val) {
            return (typeof val === result) ? true : false;
        };

        if (!args.name) args.name = 'o.TypeOfType';

        if (!args.message) args.message = function (val) {
            return val + ' failed ' + this.name + ' validation due to not being a typeof' +
                result + '.';
        };

        parent( args );
    }
);
