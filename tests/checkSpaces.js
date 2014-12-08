/**
 * if using spaces, check for consistent indentation (in this case, 4 spaces per indent)
 * also check that line is not commented out
 */
const spaces = /( ){4}\D\W+/g;           // if using spaces for indents, check consistency

module.exports = function checkSpaces() {
    if (!_.isNull(line.match(spaces)) && line.indexOf('/') === -1) {
        // console.log(line.match(spaces).length);
        // console.log('Indentation not consistent:\nLine: ' + count + ': ' + output);
        // if (!line.match(spaces.length % 4)) {
        //  warnings.push('Indentation not consistent:\nLine: ' + count + ': ' + output);
        // }
    }
}