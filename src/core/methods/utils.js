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
	checkPrefix: function(prop, css, valid) {
		return valid.prefixes.some(function(prefix) {
			return prop === prefix + css;
		});
	},

	checkPseudo: function(prop, html, valid) {
		return valid.pseudo.some(function(pseudo) {
			return prop === html + pseudo;
		});
	},

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

	getFiles: function( dir ) {
		if ( typeof dir !== 'string' ) {
			throw new TypeError('Path needs to be a string');
		}

		glob(dir, {}, function( err, files ) {
			if ( err ) { throw err; }
			this.cache.filesLen = files.length - 1;

			return files.forEach(function(file, i) {
				this.cache.file = file;
				this.cache.fileNo = i;
				return this.parse();
			}.bind( this ));

		}.bind( this ));
	},

	resetOnChange: function( newPath ) {
		this.state.path = newPath;
		this.cache.warnings = [];
		this.cache.alphaCache = [];
		this.cache.selectorCache = [];
		this.cache.rootCache = [];
		this.cache.zCache = [];
		this.cache.prevLine = '';
		this.cache.prevFile = '';
		this.cache.prevContext = 0;

		if ( this.state.watching ) {
			return this.read();
		}
	},

	setConfig: function( potentialPath ) {
		var path = pathIsAbsolute( potentialPath ) ? potentialPath : process.cwd() + '/' + potentialPath;
		return JSON.parse( fs.readFileSync( path ) );
	},

	setContext: function( line ) {
		this.state.prevContext = this.state.context;
		var i = 0;
		var context = 0;
		var whitespace = 0;
		var arr = [];

		if ( this.config.indentPref === 'tabs' ) {
			while ( line.charAt( i++ ) === '\t' ) {
				context++;
			}
		}
		else if ( typeof this.config.indentPref === 'number' ) {
			arr = line.split(/[\s\t]/);
			arr.forEach(function( val, i ) {
				if ( arr[i].length === 0 ) {
					whitespace++; // spaces or tabs
				}
				else {
					context = whitespace / this.config.indentPref;
				}
			}.bind(this));
		}

		this.state.context = context;
		return context;
	},

	// remove all whitespace from a string, customizable regex
	stripWhiteSpace: function( re, str ) {
		return str.split(re).filter(function( str ) {
			return str.length > 0;
		});
	}
});
