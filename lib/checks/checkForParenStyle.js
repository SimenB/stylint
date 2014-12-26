// checks for extra space when declaring mixins before variables
var tabs = /^(\t)/,
    spaces = /^(\s)/;

module.exports = function checkMixinStyle( line ) {
    // if mixin exists and it has params
    if ( line.indexOf('(') !== -1 && line.indexOf('()') === -1 ) {
        if ( line.indexOf('( ') === -1 || line.indexOf(' )') === -1) {
            return false;
        }
        else {
            return true;
        }
    }
}