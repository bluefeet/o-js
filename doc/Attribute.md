Attributes provide the majority of the features provided by o.js.  Attributes manage
a single value of an object by providing validation, filtering, access restriction,
argument handling, and a host of other features.

```javascript
var date = new o.Attribute({
    type: o.dateType,
    required: true
});

var Contract = new o.Class({
    attributes: {
       dateCreated: date,
       dateApproved: date.rebuild({ required: false }),
       dateCompleted: date.rebuild({ required: false })
    }
});
```

# Arguments

## key

    key: <string>

This is the only required argument when creating an attribute and it is used as the
basis of the defaults of many of the other arguments.

## argKey

    [argKey: <string>]

The key in the arguments that this attribute should pull its value from.  Defaults
to the `key` argument.  If you set this to `null` then the attribute will not get a
value from the arguments.

## valueKey

    [valueKey: <string>]

The key name that will be used to store the value in the object.  By default this
will be the `key` with an underscore prepended.  So, if the key was `color` then the
valueKey would default to `_color`.

## devoid

    [devoid: <value|function>]

Use this to set the default value for the attribute if none is provided by the
arguments.  If this is set to a function then the function will be executed and
expected to return a value which will be used to populate the attribute value.

Note that this default is not evaluated/assigned until the attribute value is
read (it is lazy).

If you'd like the default itself to be a function then your devoid should be a
function that returns a function.

## builder

    [builder: <methodName>]

Declare a method name to be called to assign the default value for the attribute if
none is provided by the arguments.  This is an alternative to `devoid` and typically
is cleaner to use.

## required

    [required: <true|false>]

Whether or not this attribute is required to have a defined value (remember that
JavaScript's null **is** considered a defined value).

Note that the required check is only evaluated when the attribute value is read (it
is lazy).

## type

    [type: <typeOfString|function|TypeObject>

Declares the validation that the value being written (whether via arguments, calling
the writer, or via devoid) must pass.

Validation can be specified in three forms, 1) by passing a string which will pass if
calling `typeof` on the value returns the same string, 2) by passing a function which
will be called with the value as its only argument and is expected to return true or
false, or 3) an [o.Type](Type.md) object.

## coerce

    [coerce: <true|false>]

Whether or not to utilize the type's coercion (if it is an o.Type object, and the type
supports coercion).

Defaults to false.

## filter

    [filter: <function>]

The filter function, if present, will be called when a value is being written and is
expected to return a replacement, filtered, value.  The filter is called before any
validation has been attempted.

This argument is provided for the sake of simple one-off filtering.  If you want to
reuse the filtering you should probably just make a type and use coercions for your
filtering.

## augments

    [augments: <constructor>]

Given a constructor function this will validate that the value being written is an
`instanceof` the constructor.

The same functionality can be had be creating a new `o.InstanceOfType` and assigning
the type argument to it.

## chain

    [chain: <true|false>]

Be default, when writing a value, the old value is returned by the writer.  But, if
chain is true the object will be returned instead, allowing you to chain together writes.

## reader

    [reader: <string>]

The name of the reader method for reading the value of the attribute.
Defaults to the value of `key`.

Set to `false` to disable the creation of the reader method.

## writer

    [writer: <string>]

The name of the writer method for writing the value of the attribute.  Defaults to the
value of `false`, meaning there will be no writer created.

Setting to `true` will cause the writer to be the same as `key`.

`reader` and `writer` may be the same value (and is the default).  If they are then
the method acts like a typical accessor where it acts as a reader if an argument is not
passed, and acts as a writer if an argument is passed.

## predicate

    [predicate: <string>]

The name of the predicate method.  Defaults to `false`, which means no predicate method
will be created.  When the predicate method is called it returns `false` if the attribute
value is `undefined`, and `true` otherwise.

If you set the predicate to `true` then the predicate method will default to the `key`
with `has` prefixed to it, so if the key was `age` then the predicate, when set to
`true`, would default to `hasAge`.

## clearer

    [clearer: <string>]

The name of the clearer method.  Defaults to `false`, which means no clearer method will
be created.  This method, when called, will clear the attribute value leaving it in an
`undefined` state.

If you set the clearer to `true` then the clearer method will default to the `key` with
`clear` prefixed to it, so if the key was `age` then the clearer, when set to `true`,
would default to `clearAge`.

## proxies

    [proxies: <mappingObject>]

```javascript
var Queue = new o.Class({
    attributes: {
        items: {
            argKey: null,
            type: o.ArrayType,
            devoid: function () { return [] },
            proxies: { enqueue: 'unshift', dequeue: 'pop' } // FIFO
        }
    }
});

var $q = new Queue();

$q->enqueue( 'foo' );
$q->enqueue( 'bar' );

$q->dequeue(); // foo
```

Given an object this will proxy specified method calls on the object to calls on the attribute's value (which should be an object that supports the proxied methods).

Proxying methods can be a much cleaner and more flexible way of extending another object's functionality without having to inherit from it.

# Methods

## getValue

    <attribute>.getValue( <object> );

Given an object, this returns the value of the attribute on that object.

## setValue

    <attribute>.setValue( <object>, <value> );

Given an object, this sets the value of the attribute on the object.

## hasValue

    <attribute>.hasValue( <object> );

Returns `true` if the object has the attribute value set (not `undefined`), false otherwise.

## clearValue

    <attribute>.clearValue( <object> );

Clears the attribute value on the object, leaving it in an `undefined` state.

## setValueFromArgs

    <attribute>.setValueFromArgs( <object>, <arguments> );

Given an object and arguments this will find the appropriate arguments for this attribute and set it on the object.

## install

    <attribute>.install( <object>, [<arguments>] );

Installs the attribute's methods (reader, writer, predicate, clearer, proxies) on to
the object.

If `<arguments>` are passed then `setValueFromArgs` will be called after the attribute
is installed.

## rebuild

    <newAttribute> = <attribute>.rebuild( <args> );

Rebuilds the attribute by combining the attribute's original arguments with the passed in arguments and returning a new attribute object.  This is used internally to change the `key` of an attribute when an existing attribute object is used when creating traits and classes.

