// check that commas are followed by spaces
module.exports = function checkCommaStyle( line ) {
    var spaceAfter = /,[a-zA-Z]/,
        spaceAfterNum = /,(?:\d*\.)?\d+/;

    // if , is present on line
    if ( line.indexOf(',') !== -1 && line.indexOf(',') !== line.length - 1 ) {
        // if no space after or space below
        if ( spaceAfter.test(line) || spaceAfterNum.test(line) ) {
            return false;
        }
        else {
            return true;
        }
    }
}