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