'use strict';

// check for 0unit (0 is preferred)
module.exports = function checkForZeroUnits( line ) {
    if ( typeof line !== 'string' ) { return; }

    // return true if 0 + any unit type is found
    if ( line.indexOf(' 0px') !== -1 ||
        line.indexOf(' 0%') !== -1 ||
        line.indexOf(' 0em') !== -1 ||
        line.indexOf(' 0rem') !== -1 ||
        line.indexOf(' 0vh') !== -1 ||
        line.indexOf(' 0vw') !== -1 ||
        line.indexOf(' 0vmin') !== -1 ||
        line.indexOf(' 0vmax') !== -1 ||
        line.indexOf(' 0ex') !== -1 ||
        line.indexOf(' 0ch') !== -1 ||
        line.indexOf(' 0mm') !== -1 ||
        line.indexOf(' 0cm') !== -1 ||
        line.indexOf(' 0in') !== -1 ||
        line.indexOf(' 0pt') !== -1 ||
        line.indexOf(' 0pc') !== -1 ||
        line.indexOf(' 0mozmm') !== -1 ) {
        return true;
    }
    else {
        return false;
    }
}