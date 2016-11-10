# Types

## Objects

Many type objects are already defined for all of the built-in JavaScript types.  Below is
the list of the types that are currently available.  These type objects are all instances
of the [o.Type](o-Type.md) class.

```text
undefined
defined
    null
    boolean
        booleanPrimitive
        booleanObject
    string
        stringPrimitive
        stringObject
        nonEmptyString
        identifier
    number
        numberPrimitive
        numberObject
        integer
        positive
        posotiveInt
        negative
        nonZero
    object
        function
        array
        regExp
        date
        simpleObject
        class
        trait
        attribute
        type
```

To use these type objects just prefix them with `o.` and suffix them with `Type`, so
`integer` becomes `o.integerType`.  For example:

```js
var Person = new o.Class({
    attributes: {
        age: { type: o.integerType }
    }
});
```

The `simpleObject` type subtypes the `object` type and additionally checks that the
value's constructor is `Object`.

The `class`, `trait`, `attribute`, and `type` types are used to validate that a
given object is an instance of the `o.Class`, `o.Trait`, `o.Attribute`, and `o.Type`
constuctors.  Each of these types has a coercion defined which checks if the value
is a `simpleObject`, and if it is it uses the value as arguments for creating
an appropriate object.  So, for example these two lines do the same thing:

```js
obj = new o.Trait({});
obj = o.traitType.coerce({});
```

## Classes

Type classes are used to construct complex types that solve common problems.  These
classes all inherit from the [o.Type](o-Type.md) class and support all its arguments
and methods.

These classes all accept two arguments.  The first argument is defined by the
individual class and is required.  The second argument is optional and, if present,
must be an object containing arguments as accepted by [o.Type](o.Type).

### EqualType

    <type> = new o.EqualType( <value>, [<arguments>] )

```js
var greenType = new o.EqualType('green');
if (greenType.check('green')) console.log('green is green');
if (!greenType.check('blue')) console.log('blue is not green');
```

Creates a type that validates that the passed in value passes a strict comparison
against the `<value>` argument.

### AnyType

    <type> = new o.AnyType( <typesArray>, [<arguments>] )

```js
var numOrStrType = new o.AnyType([ o.integerType, o.stringType ]);
if (numOrStrType.check(1)) console.log('1 is a num or str');
if (numOrStrType.check('a')) console.log('"a" is a num or str');
if (!numOrStrType.check(null)) console.log('null is not a num or str');
```

This type class creates a type that verifies that the passed in value passes at least
one of the types in `<typesArray>`.

### AllType

    <type> = new o.AllType( <typesArray>, [<arguments>] )

Similar to `o.AnyType`, this type class verifies that the passed in value passes every
single one of the types in `<typesArray>`.

### NoneType

    <type> = new o.NoneType( <typesArray>, [<arguments>] )

This is the opposite of `o.AllType` in that value must not pass any of the types in
`<typesArray>`.

### NotType

    <type> = new o.NotType( <type>, [<arguments>] );

```js
var notNullType = new o.NotType( o.nullType );
var foo = null;
if (!notNullType.check(null)) console.log('null is not not null');
if (notNullType.check(1)) console.log('1 is not null');
```

This inverts the given `<type>`'s validation, causing it to return `true` if it would
have returned `false`, and `false` if it would have returned `true`.

### EnumType

    <type> = new o.EnumType( <valuesArray>, [<arguments>] )

```js
var rgbType = new o.EnumType( ['red', 'green', 'blue'] );
if (rgbType.check('red')) console.log('red is in rgb');
if (!rgbType.check('purple')) console.log('purple is not rgb');
```

Creates an enum type where the value must strictly match one of the
values in `<valuesArray>`.

### TypeOfType

    <type> = new o.TypeOfType( <typeofString>, [<arguments>] )

```js
var stringType = new o.TypeOfType( 'string' );
if (stringType.check('foo')) console.log('string primitive is typeof string');
if (!stringType.check(new String('foo'))) console.log('string object is not typeof string')
```

Creates a type that validates that the value is `typeof` `<typeofString>`.  This is
actually how all the pre-defined primitive types are created, such as
`o.booleanPrimitiveType` and `o.numberPrimitiveType`.

Considering that all the types that `typeof` checks already have a corresponding
pre-defined type, there should be no need to use this type.

### InstanceOfType

    <type> = new o.InstanceOfType( <constructor>, [<arguments>] )

```js
var Dog = function (name) { this.name=name };
var Cat = function (name) { this.name=name };
var fido = new Dog('Fido');
var whiskers = new Cat('Whiskers');
var isDogType = new o.instanceOfType( Dog );
if (isDogType.check(fido)) console.log('fido is a dog');
if (!isDogType.checl(whiskers)) console.log('whiskers is not a dog');
```

Creates a type that validates that the value is an `instanceof` the `<constructor>`
function.  Many of the pre-defined types are created using this, such as
`o.stringObjectType` and `o.arrayType`.

Typically a `DuckType` is a much better choice for validating objects than this type.

If the `constructor` was created by `o.Class` then a coercion will be declared on the
created type which will check if the value is a `simpleObject`, and if it is, it will
use the value as arguments to the constructor to create an instance.

### DuckType

    <type> = new o.DuckType( <propertiesArray>, [<arguments>] )
    <type> = new o.DuckType( <propertiesObject>, [<arguments>] )

```js
var personType = new o.DuckType( ['name', 'age'] );
if (personType.check({name:'Bob', age:67})) console.log('bob is a person');
if (!personType.check({name:'Fido'})) console.log('fido is not a person');
```

If `<propertiesArray>` is passed then a type will be returned that validates that
the value is an object and that the object has the specified properties defined.

```js
var personType = new o.DuckType( {name:o.stringType, age:o.integerType} );
if (personType.check({name:'Fred', age:34})) console.log('fred looks like a person');
if (personType.check({name:'Ted', age:'98'})) console.log('ted does not look like a person.);
```

Instead of `<propertiesArray>` you can specify `<propertiesObject>` where the object
keys are the property names that must be defined on the value object, and the object
values are types that the value object's property values must pass.

Duck types are a great way to validate objects as they check that the object supports
an interface that you depend on, abstracting away what the object is, and focusing
on what the object does.

### ArrayOfType

    <type> = new o.ArrayOfType( <type>, [<arguments>] )

```js
var arrayOfIntsType = new o.ArrayOfType( o.integerType );
if (arrayOfIntsType.check([1, 2, 3])) console.log('1,2,3 is an array of integers');
if (!arrayOfIntsType.check(['a', 'b', 'c'])) console.log('a,b,c is not an array of integers');
```

Creates a type that validates that the value is an array containing values that
match the `<type>`.

A coercion is declared on this type wich will coerce any values within the array using
the inner type's coercion logic (if any).

### ObjectOfType

    <type> = new o.ObjectOfType( <type>, [<arguments>] )

Like `o.ArrayOfType`, but checks that the value is an object and that the key values
within the object match the `<type>`.

A coercion is declared on this type which will coerce any values within the object using
the inner type's coercion logic (if any).

### PatternType

    <type> = new o.PatternType( <RegExp>, [<arguments>] )

```js
var nameType = new o.PatternType(/^[A-Z][a-z]+$/);
if (nameType.check('George')) console.log('George looks like a name');
if (!nameType.check('george')) console.log('george does not look like a name');
```

Creates a type that checks that the values passes the `<RegExp>` pattern.

## Using Types Standalone

Types can be used independently of the rest of o.js, such as in conjunction with
form validation libraries.  If you'd like to check if a value is valid, or not,
use the `check()` function:

```js
if (o.integerType.check( value )) {
    // Do something with the valid value.
}
```

If you'd like an exception to be thrown you can use the `validate()` function.

```js
o.nonEmptyStringType.validate( value );
// Do something with the valid value.
```

And if you'd like to apply coercion you can do that too with `coerce()`.  Note
that this will throw an exception if the coerced value does not pass the type's
validation.  While not recommended, if you'd just like to coerce and bypass
validation you can use the `coerceOnly()` function.

```js
var roundNum = o.numberType.subtype({
    coerce: function (val) { return Math.round(val) }
});
var value = 2.5;
value = roundNum.coerce( value ); // 3
```

## Disabling Validation

Validation may be disabled by calling:

```js
o.disableTypeValidation();
```

Doing this depends heavily on what validation means to you.  If validation is a tool
for which you depend on during development and testing to find bugs before deployment
then you may find that the performance gain of disabling validation in production may
be worth the loss of early error detection you get by enabling validation.

Another workflow is to disable validation for specific blocks of code:

```js
// Validation is enabled here.
o.disableTypeValidation(function(){
    // Validation is disabled here.
});
// Validation is enabled here.
```

Doing the above may be useful if you have certain pieces of code which spawn many
objects and the performance gain of disabling validation within a scope is worth it.

