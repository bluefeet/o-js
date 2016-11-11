# o.Class

`o.Class` is a thin wrapper around a `o.Trait` and accepts all the same arguments.  The
underlying trait of the class is installed on the class's prototype so that any objects
created by the class have the trait automatically applied.

```js
var Person = new o.Class({
    attributes: {
        firstName: { type:o.nonEmptyStringType, required:true },
        lastName: { type:o.nonEmptyStringType, required:true },
        age: { type:new o.AllType([ o.positiveType, o.integerType ]), required:true }
    },
    methods: {
        fullName: function () { return this.firstName() + ' ' + this.lastName() }
    }
});

var bilbo = new Person({
    firstName: 'Bilbo',
    lastName: 'Baggins',
    age: 111
});

console.log( bilbo.fullName() ); // Bilbo Baggins
```

See the [Traits Documentation](Traits.md) for what arguments this accepts.

Constructors created by `o.Class` have an internal-only trait assigned to them called
`ClassTrait` which exposes a `type` and a `trait` attribute.

```js
    Person.type.check( bilbo ); // true
    var frodo = Person.type.coerce({ firstName:'Frodo', lastName:'Baggins', age:33 });
    Person.trait.type.check( frodo ); // true
```

