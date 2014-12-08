// run all tests
// tests
const colon                 = require('./tests/checkForColon'),
      semicolon             = require('./tests/checkForSemicolon'),
      commentStyleCorrect   = require('./tests/checkCommentStyle'),
      pxStyleCorrect        = require('./tests/checkForPx'),
      universalSelector     = require('./tests/checkForUniversal'),
      tooMuchNest           = require('./tests/checkNesting');

module.exports = function runTests(line, config) {
    // check for space after // comment (//comment is invalid)
    if (config && config.comments === true && commentStyleCorrect(line) === false) {
        warnings.push('Space after comment is preferred:\nLine: ' + l + ': ' + output);
    }
    else if (commentStyleCorrect(line) === false) {
        warnings.push('Space after comment is preferred:\nLine: ' + l + ': ' + output);
    }

    // check for 0px (margin 0 is preferred over margin 0px)
    if (config && config.unecessaryPX === true && pxStyleCorrect(line) === false) {
        warnings.push('0 is preferred over 0px.\nLine: ' + l + ': ' + output);
    }
    else if (pxStyleCorrect(line) === false) {
        warnings.push('0 is preferred over 0px.\nLine: ' + l + ': ' + output);
    }

    // check for * selector (* is discouraged)
    if (config && config.universal === true && universalSelector(line) === true) {
        warnings.push('* selector is slow. Consider a different selector.\nLine: ' + l + ': ' + output);
    }
    else if (universalSelector(line) === true) {
        warnings.push('* selector is slow. Consider a different selector.\nLine: ' + l + ': ' + output);
    }

    // check for unecessary : (margin 0 is preferred over margin: 0)
    if (config && config.colons === true && colon(line) === true) {
        warnings.push('Unecessary colon found:\nLine: ' + l + ': ' + output);
    }
    else if (colon(line) === true) {
        warnings.push('Unecessary colon found:\nLine: ' + l + ': ' + output);
    }

    // check for unecessary ; (margin 0; is invalid)
    if (config && config.semicolons === true && semicolon(line) === true) {
        errors.push('Unecessary semicolon found:\nLine: ' + l + ': ' + output);
    }
    else if (semicolon(line) === true) {
        errors.push('Unecessary semicolon found:\nLine: ' + l + ': ' + output);
    }

    // check selector depth
    if (config && config.depth === true && tooMuchNest(line, config.depthLimit) === true) {
        errors.push('Selector depth greater than 4:\nLine: ' + l + ': ' + output);
    }
    else if (tooMuchNest(line, 4) === true) {
        errors.push('Selector depth greater than 4:\nLine: ' + l + ': ' + output);
    }
}