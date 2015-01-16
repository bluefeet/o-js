`o.Trait` creates a trait object which can be applied to other objects,
extending their functionality with the trait's interface.  Trait objects
can also be used with the `traits:[]` arguments to `o.Class` and `o.Trait`.
Multiple traits can be applied to a single object, bypassing JavaScript's
single-inheritance model, supporting the
[Composition over Inheritance](http://en.wikipedia.org/wiki/Composition_over_inheritance)
technique.

A typical use case would be to define a shared interface between a set of classes.

```javascript
var PlayerTrait = new o.Trait({
    attributes: {
        id: { type:o.integerType, required:true }
    }
});

var Computer = new o.Class({
    traits: [ PlayerTrait ],
    attributes: {
        difficulty: { type:o.enumType(['easy', 'hard']), devoid:'easy' }
    }
});

var Human = new o.Class({
    traits: [ PlayerTrait ],
    attributes: {
        name: { type:o.nonEmptyStringType, required:true }
    }
});

var human = new Human({ id:1, name:'Fischer' });
var computer = new Computer({ id:2, name:'Blue' });
```

Or, a trait can be applied to an existing object if that is what you want.

```javascript
var customPlayer = { id:3 };
PlayerTrait.install( customPlayer );
```

# Arguments

## attributes

    [attributes: <objectOfAttributes>]

```javascript
attributes: {
   attrOne: attrObject, // An o.Attribute object.
   attrTwo: { /* o.Attribute arguments */ }
}
```

An object containing [o.Attribute](Attribute.md) objects, or arguments to create them,
where the key will be used as the attribute's `key` argument.  If an attribute object
is passed, rather than arguments for one, and the attribute's key does not match then
the attribute's `rebuild()` method will be called to create a new attribute object with
the specified key.

## traits

    [traits: <arrayOfTraits>]

```javascript
traits: [ TraitOne, TraitTwo ]
```

An array of traits which will be installed to the target object before this trait is installed.

## requires

    [requires: <arrayOfPropertyNames>]

```javscript
requires: ['propOne', 'propTwo']
```

When the trait is being installed onto an object the specified properties must be defined or
an error will be thrown.

## methods

    [methods: <objectOfMethods>]

```javascript
methods: {
    increase: function (amount) {
        this.value( this.value() + amount );
    }
}
```

An object containing functions where the key will be the name of the function.

## around

    [around: <objectOfAroundModifiers>]

```javascript
around: {
    save: function (orig, data) {
        console.log('Saving ' + data + '...');
        orig( data );
        console.log('Saved!');
    }
}
```

Wraps the the specified method in a function, allowing you to do things before and
after the method call, change the argument, or even decide not to call the original method.

## before

    [before: <objectOfBeforeModifiers>]

```javascript
before: {
   save: function () { console.log('Saving...') }
}
```

Calls the specified function before calling the underlying method.

## after

    [after: <objectOfAfterModifiers>]

```javascript
after: {
   save: function () { console.log('Saved!') }
}
```

Calls the specified function after calling the underlying method.

# Attributes

## type

# Methods

## install

    <trait>.install( <object>, [<arguments>] )

```javascript
MyTrait.install( myObject );
// Now myObject has all the attributes, methods, etc, provided by MyTrait.
```

Installs the trait's interface onto an object.  If an arguments object is passed then
then `setFromArgs` will be called for you after the install is done.

## setFromArgs

    <trait>.setFromArgs( <object>, <arguments> )

```javascript
MyTrait.setFromArgs( myObject, { /* arguments */ } );
```

Applies the arguments to the object via the trait's (and any traits in the
`traits:[]` argument) attributes.

