### stylint - cli stylus linter. still pretty rough, please report any issues you see and update often. i'm adding new features and fixing bugs all the time.

#### CLI
-h or --help 	Display list of commands

-w or --watch 	Watch file or directory and run lint on change

-a or --all 	Use with --watch. Tells stylint to lint entire dir on change instead of curr file

-c or --config 	Pass in location of custom config file

-s or --strict 	Run all tests, regardless of config

-v or --version Display current version

###### warning toggle (inline comment: @stylint off || @stylint on)
Disable linting for a particular block of code. By default the linter will check every line. Linter will be disabled until turned back on. Use this to suppress warnings on a case by case basis.

#### Options
The following is a list of the options available to stylinter. Use the --config flag to pass in the location of your custom .styluslintrc config file.

###### colons (default: true, boolean)
Checks for existence of unecessary colons ( : ). Warning: this will throw errors on hashes currently.

###### commaSpace (default: true, boolean)
Checks for spaces after commas.

###### depth (default: true, boolean)
Check that selector does not exceed the selector depth limit.

###### depthLimit (default: 4, number)
Set the max depth limit for selectors.

###### efficient (default: true, boolean)
Check for places where properties can be written more efficiently.

###### maxWarnings (default: 10, number)
Set 'max' number of warnings. Currently this just displays a slightly sterner message, will be stronger.

###### unecessaryPx (default: true, boolean)
Looks for instances of 0px.

###### semicolons (default: true, boolean)
Look for unecessary semicolons.

###### spaces (default: false, boolean)
Sets preference to spaces.

###### tabs (default: true, boolean)
Sets preference to tabs.

###### vars (default: true, boolean)
Enforce use of $ when defining a variable (in stylus this is optional, but still useful).

###### extend (default: 'extends', string)
Pass in either extend or extends and then enforce that. Both are valid in stylus.

###### block (default: true, boolean)
Enforce use of @block when defining a block variable.

###### extraSpace (default: true, boolean)
Enforce use of extra spaces inside ()

###### universal (default: true, boolean)
Looks for instances of the inefficient * selector

#### Upcoming Features:
The following is a list of features that are in progress.

###### alphabeticalOrder (default: true, boolean)
Check that properties are in alphabetical order.

###### duplicates (default: true, boolean)
Check for unecessary duplicate properties .

###### indent (default: 4, number)
Check for inconsistent indentation. Default is 4 spaces.

###### valid (default: true, boolean)
Check that property or value is an actual option, and not a typo.

###### brackets (default: true, boolean)
Check for unecessary brackets. If true, throws a warning.
