'use strict';

// if we disallowed hex colors, check for them and return true if found
module.exports = function checkHexColors( line ) {
  if ( typeof line !== 'string' ) {
    return false;
  }

  return ( line.match(/#\w{3,6}/) !== null && line.match(/\?=/) === null );
};
