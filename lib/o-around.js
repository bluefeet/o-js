module.exports = function (original, func) {
    return function () {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        var wrapper = function () {
            return original.apply( self, arguments );
        };
        args.unshift( wrapper );
        return func.apply( self, args );
    };
};
