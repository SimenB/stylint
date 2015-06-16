## stylint - cli stylus linter.

## you're looking at the 1.0 branch, which still has a long ways to go before release

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rossPatton/stylint?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Code Climate](https://codeclimate.com/github/rossPatton/stylint/badges/gpa.svg)](https://codeclimate.com/github/rossPatton/stylint) [![Test Coverage](https://codeclimate.com/github/rossPatton/stylint/badges/coverage.svg)](https://codeclimate.com/github/rossPatton/stylint)

[![NPM](https://nodei.co/npm/stylint.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/stylint/)

[patch notes](https://github.com/rossPatton/stylint/blob/master/patch-notes.md)

[known issues](https://github.com/rossPatton/stylint/issues)

If you have any problems with the linter just create a ticket there and I will respond.

Same thing if you have any feature requests.

I will gladly accept pull requests if you want to do the work yourself.

you can also ping me [here](https://gitter.im/rossPatton/stylint)


## CLI
`-h` or `--help`    Display list of commands

`-w` or `--watch`   Watch file or directory and run lint on change

`-c` or `--config`  Pass in location of custom config file

`-s` or `--strict`  Run all tests, regardless of config

`-v` or `--version` Display current version


## Example CLI Usage:
`stylint` Run stylint on cwd

`stylint path/to/styl --strict` Run stylint in strict mode, for masochists

`stylint path/to/filename.styl` Run stylint on a file

`stylint path/to/dir --watch` Watch dir, run stylint on file change

`stylint --help` Get list of commands

`stylint --version` Get version number

`stylint --config path/to/config/.configrc` Run stylint with custom config settings

`stylint styl/ --watch -c path/to/config/.configrc` Watch dir, use custom config


## Using it as a module
Stylint uses stampit, and you can require it like follows:

```
const stylint = require('stylint');
```

Use is as follows:
```
stylint().create();
```

It can optionally take in 2 parameters.
1: Custom path
2: Configuration option (in place of using an .rc config file)
```
stylint('./path/to/stylus/', {
	brackets: 'never',
	mixed: true
}).create()
``


## Gulp
You can use the raw module with [gulp-shell](https://github.com/sun-zheng-an/gulp-shell) like below:

```
gulp.task('stylint', shell.task([
	'stylint path/to/styl/ -c .stylintrc'
]));
```

Or use [gulp-stylint](https://github.com/danielhusar/gulp-stylint)
```
var gulp = require('gulp');
var stylint = require('gulp-stylint');

gulp.task('default', function () {
	return gulp.src('src/*.styl')
		.pipe(stylint())
});
```


## Why Write This Tool?
Stylus is my CSS pre-processor of choice and the lack of a decent linter (or really, any linter) was an annoying pain point. So I thought I'd try my hand at writing what I thought my ideal linter would look like.


## Why Use This Tool?
To catch little mistakes (duplication of rules for instance) and to enforce a code style guide. This is particularly important with Stylus, which is unopinionated when it comes to syntax. Ideally by 1.0 or earlier this tool will eventually allow you to enforce as little, or as much, syntax as you like.


## Options
The following is a list of the options available to stylint. Use the `-c` or `--config` flag to pass in the location of your custom `.stylintrc` config file if you want to change the defaults. Alternatively, you could pass the `-s` or `--strict` flag to run stylint as though everything was set to true, config file or not.

The default settings are pretty weak and unopinionated (I think). If you want to enforce a particular styleguide, you'll have to set up your own config file. Below is the default config.

```
{
	blocks: false,
	brackets: 'never',
	colons: 'always',
	colors: false,
	commaSpace: 'always',
	commentSpace: false,
	cssLiteral: false,
	depthLimit: false,
	duplicates: true,
	efficient: true,
	extendPref: false,
	globalDupe: false,
	indentPref: false,
	leadingZero: false,
	maxErrors: false,
	maxWarnings: false,
	mixed: false,
	namingConvention: false,
	namingConventionStrict: false,
	none: 'never',
	parenSpace: false,
	placeholders: 'always',
	prefixVarsWithDollar: 'always',
	quotePref: 'single',
	reporter: '../core/reporter',
	semicolons: 'never',
	sortOrder: false,
	stackedProperties: 'never',
	trailingWhitespace: 'never',
	universal: false,
	valid: 'always',
	zeroUnits: 'never',
	zIndexNormalize: false
}
```


### warning toggle ( inline comment: @stylint off || @stylint on )
Disable linting for a particular block of code by placing `@stylint off` in a line comment. Re-enable by placing `@stylint on` in a line comment further down. Stylint will not test any lines until turned back on. Use this to suppress warnings on a case-by-case basis. By default the linter will check every line except for @css blocks or places where certain rules have exceptions.

For example, let's say you want to enforce `namingConvention: "lowercase_underscore"`, but you're also styling elements from the Bootstrap framework. You can use the `@stylint off` toggle to prevent warnings in places where you're referencing Bootstrap classes.

Example:
```stylus
.button_block {
	background: silver;
	padding: 4px;
}
// @stylint off
.button_block .btn-default {
	background-color: green;
	color: white;
}
// @stylint on
```


### ignore toggle ( inline comment: @stylint ignore )
A toggle that works like the block comment, but just for one line. Useful for cases where you want to include fallback css for browser support.

Example:
```stylus
.button-zoom
	cursor pointer // @stylint ignore
	cursor zoom-in
// @stylint on
```


### handling severity
Stylint allows you to specify 2 levels of severity, Warning or Error, if a problem is found with your Stylus. By default, everything is a Warning.

This works together with the maxWarnings and maxErrors config options, so you could error out if you get a single Error, but allow say, up to 5 Warnings.

In your config file, you can pass in a string (usually always or never), false (usually you should leave this rule out of the config), or an object. The object lets you set the rule, as well as the severity

Examples:
```stylus
// below sets brackets to throw an Error instead of a Warning if a bracket is found
brackets: {
	expect: 'never',
	error: true
}

// below sets brackets to throw an Warning if a bracket is found
brackets: {
	expect: 'never'
}

// which is equivalent to:
brackets: 'never'
```


### blocks ( default: false, 'always' || 'never' || false )
When 'always' expect the `@block` keyword when defining block variables.
When 'never', expect no `@block` keyword when defining block variables.
When false, do not check either way.

Example if 'always': prefer `my-block = @block ` over `my-block = `
Example if 'never': prefer `my-block = ` over `my-block = @block `
If falsy does not check this rule.


### brackets ( default: 'never', 'always' || 'never' || false )
When 'always', expect {} when declaring a selector.
When 'never', expect no brackets when declaring a selector.

Example if 'always': prefer `.some-class-name {` over `.some-class-name`
Example if 'never': prefer `.some-class-name ` over `.some-class-name {`


### colons ( default: 'always', 'always' || 'never' || false )
When 'always', expect : when declaring a property.
When 'never', expect no : when declaring a property.

Example if 'always': prefer `margin: 0` over `margin 0`
Example if 'never: prefer `margin 0` over `margin: 0`


### colors ( default: false, 'always' || false )
When 'always', force variables when defining hex values

Example if true: prefer `color $red` over `color #f00`


### commaSpace ( default: false, 'always' || 'never' || false )
Enforce spaces after commas.

Example if true: prefer `rgba(0, 0, 0, .18)` over `rgba(0,0,0,.18)`


### commentSpace (default: false, boolean)
Enforce spaces after line comments.

Example if true: prefer `// comment` over `//comment`


### cssLiteral (default: false, boolean)
By default Stylint ignores `@css` blocks. If set to true however, it will throw a warning if `@css` is used.

Example if true: `@css` will throw a warning


### depthLimit (default: false, number or false)
Set the max selector depth. If set to 4, max selector depth will be 4 indents. Pseudo selectors like `&:first-child` or `&:hover` won't count towards the limit.

Set to false if you don't want to check for this.


### duplicates (default: true, boolean)
Checks if selector or property duplicated unnecessarily. By default, only checks on a file-by-file basis, but if `globalDupes: true` is set, then it will also check for duplicates globally (for root values only).

Example if true: the following will throw a warning:
```
.test
	margin 0
	margin 5px
```


### efficient (default: true, boolean)
Check for places where properties can be written more efficiently.

Example if true: prefer `margin 0` over `margin 0 0`


### emoji (default: false, boolean)
Do you want a happy face with your sucess/warning messages? of course you do


### enforceBlockStyle (default: false, boolean)
Enforce use of `@block` when defining a block variable.

Example: prefer `myBlock = @block` over `myBlock =`


### enforceVarStyle (default: false, boolean)
Enforce use of `$` when defining a variable. In Stylus using a `$` when defining a variable is optional, but is a good idea if you want to prevent ambiguity. Not including the `$` sets up situations where you wonder: "Is this a variable or a value?" For instance: `padding $default` is easier to understand than `padding default`.

Yes, `default` isn't an acceptable value for `padding`, but at first glance you might not catch that. And now if you try to set `cursor default`, it's not going to behave the way you expect. All this pain and heartache could've been avoided if you just used a `$`.

Example: prefer `$my-var = 0` over `my-var = 0`


### extendPref (default: false, string or false)
Pass in either `@extend` or `@extends` and then enforce that. Both are valid in Stylus. It doesn't really matter which one you use. I prefer `@extends` myself.

Example if set to `@extends`: prefer `@extends $some-var` over `@extend $some-var`

Example if set to `@extend`: prefer `@extend $some-var` over `@extend $some-var`


### globalDupe (default: false, boolean)
Works in conjunction with duplicates. Does nothing on its own. If false, duplicates will check for dupes within individual files only. If true, duplicates will check for dupes across all files.

Example if true: the following will throw a warning
```
>>> file1.styl
.test
	margin 0

>>> file2.styl
.test
	margin 5px
```


### indentSpaces (default: 4, number or false)
This works in conjunction with depthLimit. If you indent with spaces this is the number of spaces you indent with. If you use hard tabs, set this value to false.

By default this value is 4, so if you indent with hard tabs or 2 spaces you'll need to manually set this value in a custom `.stylintrc` file. With default settings, this means the depth limit is 4 indents of 4 spaces each.


### leadingZero (default: true, boolean)
Checking for unnecessary leading zeroes on decimal points. You don't need them.

Example: prefer `rgba( 0, 0, 0, .5 )` over `rgba( 0, 0, 0, 0.5 )`


### maxWarnings (default: 10, number)
Set 'max' number of warnings. Currently this just displays a slightly sterner message. Womp womp.


### maxWarningsKill (default: false, boolean)
If set to true, then Stylint will throw an error if total # of warnings goes over the limit set in maxWarnings.


### mixed (default: false, boolean, relies on indentPref)
Returns true if mixed spaces and tabs are found. If a number is passed to indentPref (4 is the default), it assumes soft tabs (ie, spaces), and if false is passed to indentPref it assumes hard tabs.

If soft tabs, throws warning if hard tabs used. If hard tabs, throws warning if unnecessary extra spaces found.

Example if indentPref: 4 and mixed: true: prefer `\s\s\s\smargin\s0` over `\tmargin\s0`

Example if indentPref: 2 and mixed: true: prefer `\s\smargin\s0` over `\tmargin\s0`

Example if indentPref: false and mixed: true: prefer `\tmargin\s0` over `\s\s\s\smargin\s0`


### namingConvention (default: false, false | 'lowercase-dash' | 'lowercase_underscore' | 'camelCase' | 'BEM')
Enforce a particular naming convention when declaring classes, ids, and variables. Throws a warning if you don't follow the convention. If set to false, allow any convention.

Example if set to `'lowercase-dash'`: prefer `$var-name` over `$var_name` or `$varName`

Example if set to `'lowercase_underscore'`: prefer `$var_name` over `$var-name` or `$varName`

Example if set to `'camelCase'`: prefer `$varName` over `$var_name` or `$var-name`

Example if set to `'BEM'`: prefer `$var__like--this` over `$var_name` or `$varName`


### namingConventionStrict (default: false, boolean)
By default, namingConvention only looks at variable names. If namingConventionStrict is set to true, namingConvention will also look at class and id names.

This is useful if you have little or no 3rd party css in your codebase.


### none ( default: 'never'. options: 'always' || never' || false  )
If 'always' check for places where `border none` could be used instead of `border 0`.
If 'never' check for places where `border 0` could be used instead of `border none`.
If false, ignore this rule.

Example if 'always': prefer `border none` over `border 0`
Example if 'never': prefer `border 0` over `border none`


### parenSpace (default: false, boolean)
Enforce use of extra spaces inside parens.

This option used to be called mixinSpace, and you can still call it that if you want, but I will remove the old option by 1.0 probably.

Example: prefer `my-mixin( $myParam )` over `my-mixin($myParam)`


### placeholder (default: false, boolean)
Enforce extending placeholder vars when using `@extend(s)`

Example: prefer `@extends $placeholder` over `$extends .some-class`


### quotePref (default: false, false | 'single' | 'double')
Enforce consistent quotation style.

Example if `'single'`: prefer `$var = 'some string'` over `$var = "some string"`
Example if `'double'`: prefer `$var = "some string"` over `$var = 'some string'`


### stackedProperties (default: true, boolean)
No one-liners. Enforce putting properties on new lines.

Example if `true`: prefer

```
.className
	padding 0
```

over

`.className { padding 0 }`


### semicolons (default: false, boolean)
Look for unecessary semicolons.

Example: prefer `margin 0` over `margin 0;`


### sortOrder (default: false, false | 'alphabetical' | 'grouped' | {Array})
Enforce a particular sort order when declaring properties. Throws a warning if you don't follow the order. If set to false, allow any order.

Example if `'alphabetical'`:

prefer this:
```
.some-class
	display block
	float left
	position absolute
	right 10px
	top 0
```

over this:
```
.some-class
	position absolute
	top 0
	right 10px
	display block
	float left
```

Example if `'grouped'` ([based on predefined grouped ordering](src/data/ordering.json#L2)):

prefer this:
```
.some-class
	position absolute
	top 0
	right 10px
	display block
	float left
```

over this:
```
.some-class
	display block
	float left
	position absolute
	right 10px
	top 0
```

Example if `[ 'margin', 'padding', 'float', 'position' ]`:

prefer this:
```
.some-class
	margin 0
	padding 0
	float left
	position absolute
	right 10px
	top 0
	display block
```

over this:
```
.some-class
	display block
	float left
	position absolute
	right 10px
	top 0
	margin 0
	padding 0
```

When set to `'grouped'` or `{Array}` throws a warning if properties that are not defined in the ordering array are not after those that should be ordered.


### universal (default: true, boolean)
Looks for instances of the inefficient * selector. Lots of resets use this, for good reason (resetting box model), but past that you really don't need this selector, and you should avoid it if possible.


### valid (default: false, boolean)
Check that a property is a valid CSS or HTML property. Currently just checks properties, value checks will come soon.

Example if true: `marg 0` will throw a warning, prefer `margin 0`


### whitespace (default: true, boolean)
Looks for trailing whitespace. Throws a warning if any found.


### zeroUnits (default: true, boolean)
Looks for instances of `0px`. You don't need the px. Checks all units, not just px.

Example: prefer `margin-right 0` over `margin-right 0em`


### zIndexDuplicates (default: false, boolean)
If a z-index value has been used before, throw a warning. Is this useful? WHO KNOWS.

Example if true: the follow throws a warning
```
.test
	z-index 5

.test
	z-index 5
```

Doesn't take into considering stacking contexts yet so, and i'm not sure it ever will, so good luck if you try to use this. Small projects might get some use out of this.


### zIndexNormalize (default: false, number or false)
Enforce some (very) basic z-index sanity. Any number passed in will be used as the base for your z-index values. Throws an error if your value is not normalized.

Example if set to 5: prefer `z-index 10` over `z-index 9`
Example if set to 10: prefer `z-index 20` over `z-index 15`
Example if set to 50: prefer `z-index 100` over `z-index 75`

Doesn't take into considering stacking contexts yet so, and i'm not sure it ever will, so good luck if you try to use this. Small projects might get some use out of this.
