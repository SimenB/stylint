### 1.2.3
fix this issue: https://github.com/rossPatton/stylint/issues/200

fix this issue: https://github.com/rossPatton/stylint/issues/184

fix issue where blocks: always would throw false positives

fix this issue: https://github.com/rossPatton/stylint/issues/196

### 1.2.2
fix this issue: https://github.com/rossPatton/stylint/issues/189

### 1.2.1
fix this issue: https://github.com/rossPatton/stylint/issues/184

### 1.2.0
transparent mixin use is now supported via the mixins config property

fix this issue: https://github.com/rossPatton/stylint/issues/181

fix this https://github.com/rossPatton/stylint/issues/177

merge this PR: https://github.com/rossPatton/stylint/pull/186

merge this PR: https://github.com/rossPatton/stylint/pull/187

### 1.1.3
fix this issue: https://github.com/rossPatton/stylint/issues/185

### 1.1.2
fix this issue: https://github.com/rossPatton/stylint/issues/183

### 1.1.0
this enhancement: https://github.com/rossPatton/stylint/issues/129

this enhancement: https://github.com/rossPatton/stylint/issues/139

address new issue from: https://github.com/rossPatton/stylint/issues/144

address new issue from: https://github.com/rossPatton/stylint/issues/162

address new issue from: https://github.com/rossPatton/stylint/issues/164

this issue: https://github.com/rossPatton/stylint/issues/168

this issue: https://github.com/rossPatton/stylint/issues/173

this issue: https://github.com/rossPatton/stylint/issues/177

fix versioning mistake in package.json

### 1.0.11
fix this issue: https://github.com/rossPatton/stylint/issues/164

fix versioning mistake in package.json

### 1.0.10
use yargs for command line arguments

add editorconfig

fix incorrect links in readme

rule of silence

allow comments in stylintrc

fix this issue: https://github.com/rossPatton/stylint/issues/143

fix this issue: https://github.com/rossPatton/stylint/issues/144

fix this issue: https://github.com/rossPatton/stylint/issues/145

fix this issue: https://github.com/rossPatton/stylint/issues/158

fix this issue: https://github.com/rossPatton/stylint/issues/159

fix this issue: https://github.com/rossPatton/stylint/issues/162

fix this issue: https://github.com/rossPatton/stylint/issues/163

fix this issue: https://github.com/rossPatton/stylint/issues/165

#### 1.0.9
trying to fix this: https://github.com/rossPatton/stylint/issues/128 resulted in a bug where stylint errors if commentSpace is not defined in the config. this is a dumb mistake, i am dumb

#### 1.0.8
numerous fixes for post 1.0 checks (semicolons: always, colons: always, leadingZero: always)

fix for line comment space edge case


#### 1.0.7
attempt to address line feed issues on windows


#### 1.0.6
fix some issues with colons: always and semicolons: always [#123](https://github.com/rossPatton/stylint/issues/123) && [#124](https://github.com/rossPatton/stylint/issues/124)

add more properties and tags to the whitelist (picture, src)


#### 1.0.5
found some issues with setState (and how it affected the global duplicate check), should be fixed

also, added direct tests for setState method (before it was just being tested indirectly)

fixed issue leadingZero 'always' setting finding false positives


#### 1.0.4
added a real license


#### 1.0.3
cleanup a couple files, fit a maxWarnings bug in lint


#### 1.0.2
fixes ( or at least makes it less bad ) sortOrder regression, where cache was not being properly reset when linting directories

fix hashend, colon always, valid, and var prefix regressions

#### 1.0.1
aaaand now everything is broken

quickie fixes to mitigate issues with colon: 'always', sortOrder, and whitespace issues before i pass out of exhaustion

#### 1.0.0
various bug fixes

`@ignore` toggle added

cranked up default settings

added many many new options, as well as severity for all options (warning or error)

better node module support

more ways of passing in config objects (including auto detect)

support for custom reporters

refactor

test coverage

api changes

#### 0.9.10
fix edge case issue caused by file globbing that could potentially cause stylint to hang

##### 0.9.9
make universal less greedy

minor bug fix, some valid properties coming up as non-valid: https://github.com/rossPatton/stylint/issues/100

duplicates was reporting false positives if sortOrder also on. this has been fixed in the 1.0 branch but wasn't brought over

nesting / depthlimit check was counting extra white space between properties and value. technically, that's bad practice but it should be a separate check so lets remove that from the check: https://github.com/rossPatton/stylint/issues/101

##### 0.9.8
minor bug fix: some valid properties (anything with -bottom) were coming up as non-valid.

##### 0.9.7
added mso-table-lspace and mso-table-rspace to property whitelist (outlook)

fix this issue: https://github.com/rossPatton/stylint/issues/95

fix this issue: https://github.com/rossPatton/stylint/issues/96

##### 0.9.6
sortOrder check added: replaces alphabetical check: https://github.com/rossPatton/stylint/pull/92

improvement to comma check

##### 0.9.5
fix issue with efficient check: https://github.com/rossPatton/stylint/issues/91

add stackedProperties check: https://github.com/rossPatton/stylint/issues/77

which also 'solves' this imo: https://github.com/rossPatton/stylint/issues/63

resolve issue where hash check interfered with quotes check: https://github.com/rossPatton/stylint/issues/47

##### 0.9.4
hotfix for duplicates check regression https://github.com/rossPatton/stylint/commit/29d42014d315e6ef9dfeebf20636b43f13f2377b

##### 0.9.3
https://github.com/rossPatton/stylint/issues/78

https://github.com/rossPatton/stylint/pull/66

https://github.com/rossPatton/stylint/issues/62

https://github.com/rossPatton/stylint/issues/61

https://github.com/rossPatton/stylint/issues/60

https://github.com/rossPatton/stylint/pull/59

https://github.com/rossPatton/stylint/issues/57

https://github.com/rossPatton/stylint/issues/55

https://github.com/rossPatton/stylint/issues/54

https://github.com/rossPatton/stylint/issues/52

https://github.com/rossPatton/stylint/issues/44

##### 0.9.2
namingConvention improvements: https://github.com/rossPatton/stylint/issues/50

valid improvements: https://github.com/rossPatton/stylint/issues/46

universal improvements: https://github.com/rossPatton/stylint/issues/45

##### 0.9.1
strengthen naming convention checks to better accomodate interpolation

update documentation for placeholders and colors options

##### 0.9.0
add hexidecimal color check

##### 0.8.15
add more svg elements to the whitelist

##### 0.8.14
locking dependencies was a terrible, terrible idea

##### 0.8.13
lock dependencies for stability

add more support for svg css properties

git ignore coverage report

##### 0.8.12
fix require bugs

##### 0.8.11
maxWarnings kill switch

remove chalk from package.json as dependency

various readme tweaks

some minor cleanup / tweaking

##### 0.8.10
fix bug with alphabetical check throwing false positives in certain edge cases, only if hard tabs on

add more to the ignore regex for duplicates check

##### 0.8.9
more duplicatesCheck fixes

##### 0.8.8
resolve issue with duplicatesCheck throwing false positives when a selector is part of a list of selectors

universal check should be less aggressive

more valid properties added to the valid check

turning back on alphabet and duplicates check by default

turning off zIndex checks by default (they can be useful i think, but are definitely optional / potentially a pain on big projects )

##### 0.8.7
resolve issue with duplicatesCheck throwing false positives on brackets

alphabeticalCheck should be less aggressive

##### 0.8.6
more bugs showing up for alphabetical and duplicates checks, gonna toggle them off by default until they are fully ironed out

##### 0.8.5
merge in PR #31 (BEM Naming-Convention Option and expand list of valid css properties)
stylint -v should return correct version now
universal check rewrite - earlier version was throwing false positives when used for multiplication (in some cases)

##### 0.8.4
readme update

##### 0.8.3
fixes to duplicates and alphabetical sort, made more specific basically

both were a little too general, will probably need more testing

tweak mixed spaces and tabs ( look for (  ) instead of (\s\s) )

##### 0.8.2
duplicates was not toggle-able - fixed https://github.com/rossPatton/stylint/issues/27

duplicates needs some work - update README to reflect that

##### 0.8.1
add npm badge and gitter

README tweaks

##### 0.8.0
checks:
    duplicates added, on by default, check for duplicate selectors or properties

config:
    duplicates: bool, for toggling duplicates check
    globalDupe: bool, for controlling reach of duplicates check

tests:
    unit tests for all the above added, as well as tests for 0.7.4
    code coverage should be around 89%

##### 0.7.4
checks:
    alphabetical added, check that properties are in the correct order

config:
    alphabetical: bool, for toggling alphabetical check

##### 0.7.3
zIndexDuplicates added, off by default

zIndexNormalize added, off by default

##### 0.7.2
bug fixes

code coverage

reduced dependencies

##### 0.7.1
numerous bug fixes
valid property test improved, throws fewer false positives than before
