# Plumbing

## Utilities

### construct

    <constructor> = o.construct( <constructor>, <prototype> );

```javascript
var Person = o.construct(
    function (args) { this.age = args.age },
    {
        hoursOld: function () {
            return this.age * 365 * 24;
        }
    }
);
var bilbo = new Person({ age: 111 });
console.log( bilbo.hoursOld() ); // 972,360
```

Provides shorthand for creating a new constructor with a prototype.  The `prototype` will be merged in to the `constructor`'s prototype.

### augment

    <newConstructor> = o.augment( <parentConstructor>, <constructor>, [<prototype>] )

```javascript
var Point2D = function(x, y){ this.x=x; this.y=y };
var Point3D = o.augment(
    Point2D,
    function (orig, x, y, z) {
        orig( x, y );
        this.z = z;
    }
);
```

Uses `o.around` where `parentConstructor` is the `origFunction` and `constructor` is the `aroundFunction`.  The `newConstructor`'s prototype will be set to inherit from the `parentConstructor`'s prototype, and if `prototype` is specified then it will be merged into `newConstructor`'s prototype.

Typically, in JavaScript inheritance, all that is setup is prototype inheritance.  This function takes this a step further by also inheriting the constructor function so that construction logic is maintained in the inheriting constructor.

### merge

    <object1> = o.merge( <object1>, <object2> [...] );

```javascript
var merged = o.merge({a:1,b:1}, {b:2,c:2}, {c:3,d:3});
// {a:1, b:2, c:3, d:3}
```

Takes the first object and merges all subsequent objects in to it.  The farther right in the list the object is, the higher its precedence is.  Returns the first object.

### clone

    <newObject> = o.clone( <object> );

```javascript
var obj1 = {foo:'bar'};
var obj2 = o.clone( obj1 );
console.log( obj2.foo ); // 'bar'
```

Clones the object by returning a new one with the same keys and values, constructor, and prototype.

### has

    <boolean> = o.has( <object>, <key> );

```javascript
var obj = {foo:'bar'};
if (o.has(obj, 'foo')) { /* do something */ }
```

This is just shorthand for calling `hasOwnProperty`.

### local

    o.local( <object>, <property>, <function> );

```javascript
var obj = { foo: 32 };
o.local( obj, 'foo', function(){
    console.log( obj.foo ); // 32
    obj.foo = 501;
    console.log( obj.foo ); // 501
});
console.log( obj.foo ); // 32
```

Within the scope of the function this will localize the specified `property` on the
`object`.  This way the property can be changed and any called code will then see the
new property value.  When scope leaves the function the property will be restored to
its original value.  This is useful for modifying global variables without making a
permanent global impact.

If an exception is thrown during the function's execution the exception will be caught,
the property will still be restored to its original value, and the exception will be
rethrown.

### ucFirst

## Function Modifiers

### before

    <newFunction> = o.before( <origFunction>, <beforeFunction> );

```javascript
var main = function () { console.log('main') };
var before = function () { console.log('before') };
var combined = o.before( main, before );
combined(); // Logs "before", then "main".
```

Creates a new function where the `beforeFunction` will be called before the `origFunction`.

### after

    <newFunction> = o.after( <origFunction>, <afterFunction> );

```javascript
var main = function () { console.log('main') };
var after = function () { console.log('after') };
var combined = o.after( main, after );
combined(); // Logs "main", then "after".
```

Creates a new function where the `afterFunction` will be called after the `origFunction`.

### around

    <newFunction> = o.around( <origFunction>, <aroundFunction> );

```javascript
var main = function (number) { console.log(number) };
var around = function (orig, number) { return orig(number + 1) };
var combined = o.around( main, around );
combined(2); // Logs 3.
```

Creates a new function where the `aroundFunction` will be called with an extra first argument, a function that will call the origFunction.

## Properties

### reader

### writer

### accessor

### predicate

### clearer

### proxy

