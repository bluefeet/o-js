# Overview

## Resources

- [The o-js.com Site](https://o-js.com)
- [o.Class Documentation](Classes.md)
- [o.Trait Documentation](Traits.md)
- [o.Attribute Documentation](Attributes.md)
- [Types Documentation](Types.md)
- [Plumbing Documentation](Plumbing.md)

## Support

The best way to get support is to hop on over to the
[o.js Gitter Channel](https://gitter.im/bluefeet/o-js) and ask there.  Alternatively
you can open a [GitHub Issue](https://github.com/bluefeet/o-js/issues), or
better yet fork the repo and make a pull request.

See [Contributing](#contributing), below, for more information.

## Custom Builds

Custom builds of o.js, containing only the features you need, can be created easily by cloning the o-js repo, getting your environment setup (see Developer Setup below), and using the `bin/combine` tool like this:

    bin/combine --require=Type,augment 

The above would include the `Type` and `augment` modules, and their dependencies.  You could then run `grunt minify` to produce a `o.min.js` ready for your use.

Make sure that you know which version of o.js you are creating a build of.  If you've just cloned the o-js repo then you are on the master branch with all the latest development work, which could very well be broken.  To get yourself pointed at the latest released code checkout the `current` branch:

    git fetch
    git checkout current
    git pull --ff-only

Then when you run `bin/combine` you'll be using the code from the latest stable release.

## The current Branch

This branch contains the latest released version, making it easier to create links to the latest official documentation.

## Contributing

Changes to o.js must be minimal and deliberate.  Currently the focus is contradictory - add helpful features, increase browser/platform support, and reduce the minified size.

If you've found a bug and have the tuits to fix it, then please do.  If you've got an idea for something new and shiny then a good way to start is to first [open a ticket](https://github.com/bluefeet/o-js/issues) and start a discussion.

The typical way to contribute changes to o.js is by forking the GitHub repository and sending me (Aran Deltac) a pull request in GitHub.  I'll review the pull request and ask for any changes that I think are necessary and then accept it if all is well.  Please follow these guidelines when making changes:

- Always account for your changes in the tests, by adjusting existing tests and/or adding new tests.
- Update CHANGES.txt to account for what you changed.
- Use the same coding style as the rest of the code base.
- Run `grunt` which will lint your changes, run all tests, and integrate your changes with the combined o.js and uglified o.min.js.

## Developer Setup

In order to run the tests, minify the javascript, and/or create a custom build you'll want to install some development tools.

- node.js - If you are on a Mac you can use [Homebrew](http://brew.sh/) to install this.
- Perl - The build tools require Perl to create the combined `o.js` file.
- Install the devDepencies:
 - Open up a shell and get into the directory where you have the o-js repo cloned.
 - `npm install`
 - `npm install -g grunt-cli tap`
- Make sure everything works by running `grunt`.

## Releasing and Publishing

To make a new release:

    grunt release-patch
    # Or: release-minor, release-major

The above will run the `default` task (`lint`, `test`, `combine`, `minify`),
runs the `tag` task which updates various files to contain the new version
number, commits the changes, creates a git tag, pushes the tag up to
origin (GitHub), and updates the `current` branch.

Once a new release has been made the release needs to be deployed to NPM:

    grunt publish-npm

## Media

Currently the only branding that o.js has is the icon which is used for the site's `favicon.png` and, slightly modified, for the `apple-touch-icon.png`.

You can download a [full size PNG](https://o-js.com/icon.png) (593x593) or the [original Pixelmator image](https://o-js.com/icon.pxm).  If you're loading the Pixelmator image make sure you grab the Lato Normal 400 font over at [Google Fonts](http://www.google.com/fonts/specimen/Lato).  You can use [SkyFonts](https://skyfonts.com/) to easly install the font (its free for Google fonts).

<img src="https://o-js.com/icon-180x180.png" width="90" height="90">

The <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/StillImage" property="dct:title" rel="dct:type">o.js Icon</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">Aran Deltac</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>.

