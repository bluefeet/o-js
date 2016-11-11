# Custom Types

The base class for all type classes and objects is the `o.Type` class.  Under normal
circumstances you should be able to construct custom types using the existing
pre-defined type classes and object documented in the [Types doc](types.md).

For example, you could create a type which validates that a number is an integer,
and is zero or positive with:

```js
var type = new o.AllType([
    o.integerType,
    new o.AnyType([
        new o.EqualType( 0 ),
        o.positiveType
    ])
]);
```

But, sometimes you need to construct a type yourself using custom rules.  To do that,
create an instance of `o.Type`:

```js
var type = new o.Type({
    validate: function (val) {
        if (Math.floor(val) !== val + 0) return false;
        if (val < 0) return false;
        return true;
    }
});
```

Another alternative to this is creating you own type class by augmenting the `o.Type`
class:

```js
var MyType = o.augment(
    o.Type,
    function (parent, min, args) {
        args = args || {};
        args.validate = function (val) {
            if (Math.floor(val) !== val + 0) return false;
            if (val < min) return false;
            return true;
        };
        parent( args );
    }
);
var type = new MyType( 0 );
```

All three of the above examples produce a type which validates using the same
rules.  Each example is more complex than the previous, but is also more powerful.

## Arguments

### validate

    validate: <function>

```js
validate: function (val) {
    if (valPassesSomeCondition) return true;
    return false;
}
```

The validate function is the heart of types.  It is what confirms whether or not a
value satisfies a constraint.  The validate function will be passed the value
to be checked and is expected to return `true` if it passes and `false` if not.

### coerce

    [coerce: <function>]

```js
coerce: function (val) {
    if (valPassesSomeCondition) return val;
    return changeValToMatchCondition( val );
}
```

The coerce function is used to coerce a value which would not normally pass the
validation constraint.  This function should return the original, invalid, value
if it cannot be coerced.

### parent

    [parent: <parentTypeObject>]

The parent type.  The parent type is used in validation and coercion.

## Methods

### check

    <type>.check( <value> )

```js
if (type.check(val)) doSomething();
```

Returns `true` if the passed value passes validation.  If the `parent` argument
has been set then the parent's validation will also be checked.

### validate

    <type>.validate( <value> )

```js
type.validate( val );
```

This works just like the `check` method except it will throw an exception if the
value fails validation.

### coerce

    <newValue> = <type>.coerce( <value> )

Given a value this will call the coerce method on it and then validate the result.
If the type does not support coercion then the value will be returned as-is.  If
the type has a `parent` then the parent`s coercion will be applied first.

### coerceOnly

    <newValue> = <type>.coerceOnly( value )

This works just like `coerce` but the coerced value is not validated.

### subtype

    <newType> = <type>.subtype( <validateFunction> )
    <newType> = <type>.subtype( <typeArgs> )

```js
var intType = new o.Type({
    validate: function (val) { 
        return (Math.floor(val) === val + 0) ? true : false;
    }
});
var posIntType = intType.subtype(
    function (val) {
        return (val > 0) ? true : false;
    }
);
```

This creates a new type who's `parent` is set to the type.
