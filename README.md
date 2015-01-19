## stylint - cli stylus linter.

not stable yet. please report any issues you see and update often. i'm adding new features and fixing bugs all the time. don't be surprised if most things change by 1.0. it is however perfectly good to use now if you don't mind the terminal and hitting the occasional bug.


## CLI
-h or --help    Display list of commands

-w or --watch   Watch file or directory and run lint on change

-c or --config  Pass in location of custom config file

-s or --strict  Run all tests, regardless of config

-v or --version Display current version


##### Example CLI Usage:
`stylint` Run stylint on cwd

`stylint path/to/styl -s` Run stylint in strict mode, for masochists

`stylint path/to/filename.styl` Run stylint on a file

`stylint path/to/dir -w` Watch dir, run stylint on file change

`stylint -h` Get list of commands

`stylint -v` Get version number

`stylint -c path/to/config/.configrc` Run stylint with custom config settings

`stylint styl/ -w -c path/to/config/.configrc` Watch dir, use custom config


#### Example Gulp Usage
So there's no gulp/grunt plugin for this yet, but no worries, just use a shell plugin like so:

```
gulp.task('stylint', shell.task([
    'stylint path/to/styl/ -c .stylintrc'
]));
```

##### Known Issues:
The depthLimit / valid options are throwing occasional false positives. They are not enabled by default (depthLimit used to be but it's been turned off for now). You can enable them if you want.

This will be fixed by 1.0, use those options at your own risk. If they give you problems use a `@stylint off` comment.


## Options
The following is a list of the options available to stylinter. Use the -c or --config flag to pass in the location of your custom .stylintrc config file if you want to change the defaults. Alternatively, you could pass the -s or --strict flag to run stylint as though everything was set to true, config file or not.

The default settings are pretty weak and unopinionated (i think). If you want to enforce a particular styleguide, you'll have to set up your own config file. Below is the default config.

```
{
    'borderNone': true,
    'brackets': false,
    'colons': false,
    'commaSpace': true,
    'commentSpace': false,
    'cssLiteral': false,
    'depthLimit': false,
    'efficient': true,
    'enforceVarStyle': false,
    'enforceBlockStyle': false,
    'extendPref': false,
    'indentSpaces': 4,
    'leadingZero': true,
    'maxWarnings': 10,
    'mixed': false,
    'namingConvention': false,
    'parenSpace': false,
    'placeholders': true,
    'semicolons': false,
    'trailingWhitespace': true,
    'universal': true,
    'valid': false,
    'zeroUnits': true,
    'zIndexDuplicates': false,
    'zIndexNormalize': false
}
```


### warning toggle (inline comment: @stylint off || @stylint on)
Disable linting for a particular block of code by placing `@stylint off` in a line comment. Re-enable by placing `@stylint on` in a line comment farther down. Linter will not test any lines until turned back on. Use this to suppress warnings on a case by case basis. By default the linter will check every line except for @css blocks or places where certain rules have exceptions.


### borderNone (default: true, boolean)
Check for places where `border 0` could be used instead of border none

Example if true: prefer `border 0` over `border none`


### brackets (default: false, boolean)
Brackets are optional in stylus (except in hashes). If set to true, throws a warning if a bracket is used outside of a hash.

Example if true: prefer `.some-class-name ` over `.some-class-name {`


### colons (default: false, boolean)
Checks for existence of unecessary colons. Does not throw a warning if colon is used inside a hash.

Example if true: prefer `margin 0` over `margin: 0`


### commaSpace (default: true, boolean)
Enforce spaces after commas.

Example if true: prefer `rgba(0, 0, 0, .18)` over `rgba(0,0,0,.18)`


### commentSpace (default: false, boolean)
Enforce spaces after line comments.

Example if true: prefer `// comment` over `//comment`


### cssLiteral (default: false, boolean)
By default stylint ignores `@css` blocks. If set to true however, it will throw a warning if `@css` is used.

Example if true: `@css` will throw a warning


### depthLimit (default: false, number or false)
Set the max selector depth. Pseudo selectors like `&:first-child` or `&:hover` won't count towards the limit.

Set to false if you don't want to check for this.


### efficient (default: true, boolean)
Check for places where properties can be written more efficiently.

Example if true: prefer `margin 0` over `margin 0 0`


### enforceBlockStyle (default: false, boolean)
Enforce use of `@block` when defining a block variable.

Example: prefer `myBlock = @block` over `myBlock =`


### enforceVarStyle (default: false, boolean)
Enforce use of `$` when defining a variable. In Stylus using a `$` when defining a variable is optional, but a good idea if you want to prevent ambiguity. Not including the `$` sets up situations where you wonder, is this a variable or a value? For instance: `padding $default` is easier to understand than `padding default`.

Yes, `default` isn't an acceptable value for `padding`, but at first glance you might not catch that. And now if you try to set `cursor default`, it's not gonna behave the way you expect. All this pain and heartache could've been avoided if you just used a `$`.

Example: prefer `$my-var = 0` over `my-var = 0`


### extendPref (default: false, string or false)
Pass in either `@extend` or `@extends` and then enforce that. Both are valid in stylus. It doesn't really matter which one you use. I prefer `@extends` myself.

Example if set to `@extends`: prefer `@extends $some-var` over `@extend $some-var`

Example if set to `@extend`: prefer `@extend $some-var` over `@extend $some-var`


### indentSpaces (default: 4, number or false)
This works in conjunction with depthLimit. If you indent with spaces this to the number of spaces you indent with. If you use hard tabs, set this value to false.

By default this value is 4, so if you indent with hard tabs or 2 spaces you will need to manually set this value in a custom .stylintrc file. With default settings, this means the depth limit is 4 indents of 4 spaces each.


### leadingZero (default: true, boolean)
Checking for unecessary leading zeroes on decimal points. You don't need them.

Example: prefer `rgba( 0, 0, 0, .5 )` over `rgba( 0, 0, 0, 0.5 )`


### maxWarnings (default: 10, number)
Set 'max' number of warnings. Currently this just displays a slightly sterner message. Womp womp.


### mixed (default: false, boolean, relies on indentPref)
Returns true if mixed spaces and tabs are found. If a number is passed to indentPref (4 is the default), it assumes soft tabs (ie, spaces), and if false is passed to indentPref it assumes hard tabs.

If soft tabs, throws warning if hard tabs used. If hard tabs, throws warning if unnecessary extra spaces found.

Example if indentPref: 4 and mixed: true: prefer `\s\s\s\smargin\s0` over `\tmargin\s0`

Example if indentPref: 2 and mixed: true: prefer `\s\smargin\s0` over `\tmargin\s0`

Example if indentPref: false and mixed: true: prefer `\tmargin\s0` over `\s\s\s\smargin\s0`



### namingConvention (default: false, false | 'lowercase-dash' | 'lowercase-underscore' | 'camelCase')
Enforce a particular naming convention when declaring classes, ids, and variables. Throws a warning if you don't follow the convention. If set to false, allow any convention.

Example if set to `'lowercase-dash'`: prefer `$var-name` over `$var_name` or `$varName`

Example if set to `'lowercase-underscore'`: prefer `$var_name` over `$var-name` or `$varName`

Example if set to `'camelCase'`: prefer `$varName` over `$var_name` or `$var-name`


### parenSpace (default: false, boolean)
Enforce use of extra spaces inside parens.

This option used to be called mixinSpace, and you can still call it that if you want, but I will remove the old option by 1.0 probably.

Example: prefer `my-mixin( $myParam )` over `my-mixin($myParam)`


### semicolons (default: false, boolean)
Look for unecessary semicolons.

Example: prefer `margin 0` over `margin 0;`


### trailingWhitespace (default: true, boolean)
Looks for trailing whitespace. Throws a warning if any found.

Example: prefer `margin 0 auto` over `margin 0 auto


### universal (default: true, boolean)
Looks for instances of the inefficient * selector. Lots of resets use this, for good reason (resetting box model), but past that you really don't need this selector, and you should avoid it if possible.


### valid (default: false, boolean)
Check that a property is a valid css or html property. Currently just checks properties, value checks will come soon.

Example if true: `marg 0` will throw a warning, prefer `margin 0`


### zeroUnits (default: true, boolean)
Looks for instances of `0px`. You don't need the px. Checks all units, not just px.

Example: prefer `margin-right 0` over `margin-right 0em`


### zIndexDuplicates (default: false, boolean)
If a z-index value has been used before, throw a warning. Is this useful? WHO KNOWS


### zeroUnits (default: false, number or false)
Enforce some (very) basic z-index sanity. Any number passed in will be used as the base for your z-index values. Throws an error if your value is not normalized.

Example if set to 5: prefer `z-index 10` over `z-index 9`
Example if set to 10: prefer `z-index 20` over `z-index 15`
Example if set to 50: prefer `z-index 100` over `z-index 75`






## Upcoming Features:
The following is a list of features that are currently in progress.

### alphabeticalOrder (default: true, boolean)
Check that properties are in alphabetical order.

### duplicates (default: true, boolean)
Check for unecessary duplicate properties .

### checking opposite values
Not an option per se, but currently the linter either checks against my idea of what best practice is, or doesn't check at all. Ideally, you should be able to set an option to check for the opposite. For example, if you're weird and you want to force the use of colons everywhere, or brackets, or no $ in front of vars, you should be able to set that option.
