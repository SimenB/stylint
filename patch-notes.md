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
