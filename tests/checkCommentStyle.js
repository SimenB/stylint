// check for space after comment line
const comment = /\/\/\s/;

module.exports = function checkCommentStyle(line) {
    if (line.indexOf('//') !== -1) {
        // check for space after comment, if no space, return warning
        if (!comment.test(line)) {
            return false;
        }
    }
}