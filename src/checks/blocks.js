'use strict';

var eqEndRe = /=$|=\s$/;

// depending on settings, enforce of disallow @block when defining block vars
module.exports = function blocks( line ) {
	if ( line.indexOf('=') === -1 ) { return; }
	var block;

	// if = ends the line and not a block var or hash
	if ( line.indexOf('@block') === -1 && eqEndRe.test( line ) ) {
		block = false;
	}
	else if ( line.indexOf('@block') !== -1 ) {
		block = true;
	}

	if ( this.config.blocks === 'always' && !block ) {
		this.cache.warnings.push( 'block variables must include @block' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}
	else if ( this.config.blocks === 'never' && block ) {
		this.cache.warnings.push( '@block is not allowed' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return block;
};
