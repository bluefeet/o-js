# Introduction

When o.js was originally created back in 2013 things such as the native JavaScript
(ECMAScript) class declaration and super keyword did not exist, or at least were not
widely available.  o.js was created to fill this gap, to make it possible to simply
create classes, offer property validation, and code re-use via traits.  To this day
ECMAScript is still very low-level in these regards while o.js continues to be
refined, optimized, and enhanced into a highly flexible tool enabling developers
to write more organized, concise, and maintanable software.

o.js lets you treat ECMAScript in a more traditional OO mindset, but with modern
best-practices that you might expect from languages like Ruby and Perl, to name
two well-known languages.

One of the larger benefits, as you'll find, with o.js is that the amount of code
you write will tend to be reduced while the flexibility of it will increase.  This
is especially beneficial to large projects where encapsulation and abstraction
reduces maintenance, and web sites where less code means less for the browser to
download.

# Creating a Class

In o.js a class is a constructor function which creates a function for each property.
Properties under o.js are called attributes.  Where you might normally create a new class
like this:

    var Person = function (args) {
        this.name = args.name;
        this.age = args.age;
    };

In o.js you'd create it like this:

    var Person = new o.Class({
        attributes: {
            name: {},
            age: {}
        }
    });

Then to create an instance of the class:

    var bob = new Person({ name:'Bob', age:63 });

One thing to note, is that classes in o.js are simply a trait which is applied to a new
object when the constructor is called.

# Defining Attributes

Attributes are the worker bees in o.js and provide a lot of functionality.
