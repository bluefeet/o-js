module.exports = function (original, func) {
    return function () {
        func.call( this );
        return original.apply( this, arguments );
    };
};
