'use strict';

var fs = require( 'fs' );
var async = require( 'async' );
var glob = require( 'glob' ).Glob;
// var osType = require('os').type().toLowerCase();
var pathIsAbsolute = require( 'path-is-absolute' );
var stampit = require( 'stampit' );


/**`
 * @description collection of utility functions for the linter
 * @return {Object} [i expose the modules to the entire app, so we only do it once]
 */
var utils = stampit().methods( {
	checkPrefix: function( prop, css, valid ) {
		return valid.prefixes.some( function( prefix ) {
			return prop === prefix + css;
		} );
	},

	checkPseudo: function( prop, html, valid ) {
		return valid.pseudo.some( function( pseudo ) {
			return prop === html + pseudo;
		} );
	},

	getFiles: function( dir ) {
		if ( typeof dir !== 'string' ) {
			throw new TypeError( 'getFiles err. Expected string, but received: ' + typeof dir );
		}

		glob( dir, {}, function( err, files ) {
			if ( err ) { throw err; }
			this.cache.filesLen = files.length - 1;
			this.cache.files = files;
			return async.map( this.cache.files, fs.readFile, this.parse.bind( this ) );
		}.bind( this ) );
	},

	// takes a string, outputs said string + reporter boilerplate
	// @TODO hook up reporter boilerplate
	msg: function( msg ) {
		var arr;

		// determine which group the msg belongs to
		arr = this.state.severity === 'Warning' ? this.cache.warnings : this.cache.errs;
		// this.state.severity === 'Warning' ? arr = this.cache.warnings : arr = this.cache.errs;

		// push the final output
		return arr.push( this.reporter( msg ) );
	},

	resetOnChange: function( newPath ) {
		this.state.path = newPath ? newPath : '';
		this.cache.errs = [];
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
		var path = '';
		if ( typeof potentialPath !== 'string' ) {
			throw new TypeError( 'setConfig err. Expected string, but received: ' + typeof dir );
		}

		path = pathIsAbsolute( potentialPath ) ? potentialPath : process.cwd() + '/' + potentialPath;
		return JSON.parse( fs.readFileSync( path ) );
	},

	setContext: function( line ) {
		var i = 0;
		var context = 0;
		var whitespace = 0;

		this.state.prevContext = this.state.context;

		if ( line.charAt( 0 ) === '\t' ) {
			while ( line.charAt( i++ ) === '\t' ) {
				context++;
			}
		}
		if ( line.charAt( 0 ) === ' ' ) {
			line.split( /[\s\t]/ ).forEach( function( val ) {
				if ( val.length === 0 ) {
					whitespace++; // spaces or tabs
				}
				else {
					context = whitespace / this.config.indentPref;
				}
			}.bind( this ) );
		}

		return context.toString();
	},

	// strip all whitespace from a string, customizable regex, returns new array
	splitAndStrip: function( re, line ) {
		return line.split( re ).filter( function( str ) {
			return str.length > 0;
		} );
	},

	// removes line comments and interpolation
	trimLine: function( line ) {
		var startsWithCommentRe = /(^\/\/)/;
		this.state.hasComment = false;

		// strip line comments
		if ( line.indexOf( '//' ) !== -1 &&
			!startsWithCommentRe.test( line.trim() ) ) {

			this.cache.comment = line.slice( line.indexOf( '//' ), line.length );
			line = line.slice( 0, line.indexOf( '//' ) - 1 );
			this.state.hasComment = true;
		}

		// strip interpolated variables
		return line.replace( /{\S+}/, '' );
	}
} );

module.exports = utils;
