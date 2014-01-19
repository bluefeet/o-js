module.exports = function (original, func) {
    return function () {
        var ret = original.apply( this, arguments );
        func.call( this );
        return ret;
    };
};
