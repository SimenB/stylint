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
		var emojiClear = '';
		if ( emoji || this.config.emoji === true ) {
			if ( os || osType.indexOf('windows') >= 0 ) {
				emojiClear = ':)';
			}
			else {
				emojiClear = '\uD83D\uDC4D  ';
			}
		}
		return emojiClear;
	},

	emojiWarning: function( emoji, os ) {
		var emojiWarning = '';
		if ( emoji || this.config.emoji === true ) {
			if ( os || osType.indexOf('windows') >= 0 ) {
				emojiWarning = ':(';
			}
			else {
				emojiWarning = '\uD83D\uDCA9  ';
			}
		}
		return emojiWarning;
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

	getFiles: function( dir ) {
		if ( typeof dir !== 'string' ) {
			throw new TypeError('Path needs to be a string');
		}

		glob(dir, {}, function( err, files ) {
			if ( err ) { throw err; }
			this.cache.filesLen = files.length - 1;

			return files.forEach(function( file, i ) {
				this.cache.file = file;
				this.cache.fileNo = i;
				return this.parse();
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
		return this.core.read( this, newPath );
	},

	setConfig: function( potentialPath ) {
		var path = pathIsAbsolute( potentialPath ) ? potentialPath : process.cwd() + '/' + potentialPath;
		return JSON.parse( fs.readFileSync( path ) );
	},

	// remove all whitespace from a string, customizable regex
	stripWhiteSpace: function( re, str ) {
		return str.split(re).filter(function( str ) {
			return str.length > 0;
		});
	}
});
