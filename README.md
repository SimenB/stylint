## stylint - cli stylus linter.

not stable yet. please report any issues you see and update often. i'm adding new features and fixing bugs all the time. don't be surprised if most things change by 1.0. it is however perfectly good to use now if you don't mind the terminal and hitting the occasional bug.

## CLI
-h or --help    Display list of commands

-w or --watch   Watch file or directory and run lint on change

-c or --config  Pass in location of custom config file

-s or --strict  Run all tests, regardless of config

-v or --version Display current version


## Options
The following is a list of the options available to stylinter. Use the -c or --config flag to pass in the location of your custom .stylintrc config file. I've made the default settings pretty weak, only checking for things that actually affect css output. Below is the default config.

```
{
    "borderNone": true,
    "colons": false,
    "commaSpace": true,
    "commentSpace": false,
    "cssLiteral": false,
    "depthLimit": 4,
    "efficient": true,
    "enforceVarStyle": false,
    "enforceBlockStyle": false,
    "extendPref": false,
    "indentSpaces": 4,
    "leadingZero": true,
    "maxWarnings": 10,
    "mixed": true,
    "parenSpace": false,
    "placeholders": true,
    "unecessaryPX": true,
    "semicolons": false,
    "trailingWhitespace": true,
    "universal": true
}
```


### warning toggle (inline comment: @stylint off || @stylint on)
Disable linting for a particular block of code by placing `@stylint off` in a line comment. Re-enable by placing `@stylint on` in a line comment farther down. Linter will not test any lines until turned back on. Use this to suppress warnings on a case by case basis. By default the linter will check every line except for @css blocks or places where certain rules have exceptions.


### borderNone (default: true, boolean)
Check for places where `border 0` could be used instead of border none

Example if true: prefer `border 0` over `border none`


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


### depthLimit (default: 4, number or false)
Set the max selector depth. Pseudo selectors like `&:first-child` or `&:hover` won't count towards the limit.

Set to false if you don't want to check for this.


### efficient (default: true, boolean)
Check for places where properties can be written more efficiently.

Example if true: prefer `margin 0` over `margin 0 0`


### enforceBlockStyle (default: false, boolean)
Enforce use of `@block` when defining a block variable.

Example: prefer `myBlock = @block` over `myBlock =`


### enforceVarStyle (default: false, boolean)
Enforce use of `$` when defining a variable (in stylus this is optional, but still useful imo).

Example: prefer `$my-var = 0` over `my-var = 0`


### extendPref (default: false, string or false)
Pass in either `@extend` or `@extends` and then enforce that. Both are valid in stylus.

Example if set to `@extends`: prefer `@extends $some-var` over `@extend $some-var`

Example if set to `@extend`: prefer `@extend $some-var` over `@extend $some-var`


### indentSpaces (default: 4, number or false)
This works in conjunction with depthLimit. If you indent with spaces set to a number, else set false.
By default this value is 4, so if you indent with hard tabs or 2 spaces you will need to manually set this value in a custom .stylintrc file. With default settings, this means the depth limit is 4 indents of 4 spaces each.


### leadingZero (default: true, boolean)
Checking for unecessary leading zeroes on decimal points.

Example: prefer `rgba( 0, 0, 0, .5 )` over `rgba( 0, 0, 0, 0.5 )`


### maxWarnings (default: 10, number)
Set 'max' number of warnings. Currently this just displays a slightly sterner message.


### mixed (default: true, boolean, relies on indentPref)
Returns true if mixed spaces and tabs are found. If a number is passed to indentPref, it assumes soft tabs (ie, spaces), and if false is passed to indentPref it assumes hard tabs.


### parenSpace (default: false, boolean)
Enforce use of extra spaces inside parens, when using mixins.

This option used to be called mixinSpace, and you can still use that, but I will remove it by 1.0 probably.

Example: prefer `my-mixin( $myParam )` over `my-mixin($myParam)`


### semicolons (default: false, boolean)
Look for unecessary semicolons.

Example: prefer `margin 0` over `margin 0;`


### trailingWhitespace (default: true, boolean)
Looks for trailing whitespace. Throws a warning if any found.


### unecessaryPx (default: true, boolean)
Looks for instances of `0px`.

Example: prefer `margin 0 auto` over `margin 0px auto`


### universal (default: true, boolean)
Looks for instances of the inefficient * selector.




## Upcoming Features:
The following is a list of features that are currently in progress.

### alphabeticalOrder (default: true, boolean)
Check that properties are in alphabetical order.

### brackets (default: true, boolean)
Check for unecessary brackets. If true, throws a warning.

### duplicates (default: true, boolean)
Check for unecessary duplicate properties .

### valid (default: true, boolean)
Check that property or value is an actual option, and not a typo.

### checking opposite values
Not an option per se, but currently the linter either checks against my idea of what best practice is, or doesn't check at all. Ideally, you should be able to set an option to check for the opposite. For example, if you're weird and you want to force the use of colons everywhere, or brackets, or no $ in front of vars, you should be able to set that option.
