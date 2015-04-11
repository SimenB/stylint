var fs                = require('fs');
var glob              = require('glob').Glob;
var osType            = require('os').type().toLowerCase();
var pathIsAbsolute    = require('path-is-absolute');
var stampit           = require('stampit');

/**`
 * @description collection of utility functions for the linter
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
module.exports = stampit().methods({
	emojiAllClear: function( emoji, os ) {
		if ( emoji || this.config.emoji === true ) {
			if ( os || osType.indexOf('windows') >= 0 ) {
				return ':)';
			}
			else {
				return '\uD83D\uDC4D  ';
			}
		}
		else {
			return '';
		}
	},
	emojiWarning: function( emoji, os ) {
		if ( emoji || this.config.emoji === true ) {
			if ( os || osType.indexOf('windows') >= 0 ) {
				return ':(';
			}
			else {
				return '\uD83D\uDCA9  ';
			}
		}
		else {
			return '';
		}
	},
	getContext: function( indentType, line ) {
		var textIndex = 0;
		var currContext = 0;
		var whitespaceCount = 0;
		var arr = line.split(/[\s\t]/);

		if ( typeof indentType !== 'number' ) {
			while ( line.charAt( textIndex++ ) === '\t' ) {
				currContext++;
			}
		}
		else {
			arr.forEach(function( val, i ) {
				if ( arr[i].length === 0 ) {
					whitespaceCount++; // spaces or tabs
				}
				else {
					currContext = whitespaceCount / this.config.indentSpaces;
				}
			}.bind(this));
		}

		return currContext;
	},
	getFiles: function( path ) {
		if ( typeof path !== 'string' ) {
			throw new TypeError('Path needs to be a string');
		}

		// console.log('get files');

		glob(path, {}, function( err, files ) {
			if ( err ) { throw err; }
			var len = files.length - 1;

			files.forEach(function( file, i ) {
				// console.log( file );
				return this.parse( this, file, len, i );
			}.bind( this ));
		}.bind( this ));
	},
	resetOnChange: function( newPath ) {
		this.state.dir = newPath;
		this.cache.warnings = [];
		this.cache.alphaCache = [];
		this.cache.selectorCache = [];
		this.cache.rootCache = [];
		this.cache.zCache = [];
		this.cache.prevLine = '';
		this.cache.prevFile = '';
		this.cache.prevContext = 0;
		return this.read( this, newPath );
	},
	setConfig: function( potentialPath ) {
		var path = pathIsAbsolute( potentialPath ) ? potentialPath : process.cwd() + '/' + potentialPath;
		return JSON.parse( fs.readFileSync( path ) );
	},
	// remove all whitespace from a string
	stripWhiteSpace: function( str ) {
		return str.split(/[\s\t]/).filter(
			function( str ) {
				return str.length > 0;
			}
		);
	}
});
