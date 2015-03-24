# Contributing to Stylint

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to Stylint.

If you just want to report an bug with Stylint, or suggest features, please open an issue [issue](https://github.com/rossPatton/stylint/issues).

These are just guidelines, not rules, use your best judgement and feel free to
propose changes to this document in a pull request.


# Submitting Issues
Include the version of Stylint you are using and your OS.

Include screenshots and animated GIFs whenever possible.

Include code examples whenever possible (especially if reporting a bug).

Perform a cursory search to see if a similar issue has already been submitted.


# Pull Requests
No PR is too small! Documentation, typo fixing, code coverage, code style fixes.
You don't have to write a new feature or tackle an existing issue to submit a PR.

Submit your PR against the develop branch, not master.

If your PR relates to an existing issue, please link to it in the PR.

Include screenshots and animated GIFs in your pull request whenever possible.

[Idiomatic](https://github.com/rwaldron/idiomatic.js/) JS style is preferred.

Tests are in the ./test folder. Run them using npm test. If your PR includes code changes, please update or add new tests accordingly. We use Mocha/Chai/Sinon/Istanbul. Anything you can do help improve coverage is immensely helpful.

Individual checks are in the src/checks folder. If you are adding a new check, please keep in mind they are designed to be as small and atomic ( and testable ) as possible. True/False return values are used to determine if the test passes or fails, and an undefined return value means the test wasn't applicable.

Tabs, not spaces please
