// checks for extra space when declaring mixins before variables
module.exports = function checkMixinStyle( line ) {
    var tabs = /^(\t)/, 
        spaces = /^(\s)/;

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