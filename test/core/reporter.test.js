'use strict'

var assert = require( 'assert' )
var stripColor = require( 'chalk' ).stripColor
var reporter = require( '../../src/core/reporter' )

function genMessage( file, rule, severity ) {
	return {
		lineNo: 1,
		col: -1,
		file: file,
		severity: severity,
		message: 'This is not OK',
		origLine: '',
		rule: rule
	}
}

function genWarning( file, rule ) {
	return genMessage( file, rule, 'Warning' )
}

function genError( file, rule ) {
	return genMessage( file, rule, 'Error' )
}

describe( 'reporter', function() {
	it( 'should have correct output on no message', function() {
		assert.equal( reporter( [] ), 'Stylint: 0 Errors.\nStylint: 0 Warnings.' )
	} )

	it( 'should include kill message', function() {
		assert.equal( reporter( [], true ), 'Stylint: 0 Errors.\nStylint: 0 Warnings.\nStylint: Over Error or Warning Limit.' )
	} )

	it( 'should include max errors and max warnings', function() {
		assert.equal( reporter( [], false, {
			maxErrors: 5,
			maxWarnings: 5
		} ), 'Stylint: 0 Errors. (Max Errors: 5)\nStylint: 0 Warnings. (Max Warnings: 5)' )
	} )

	it( 'should skip non-valid max errors and max warnings', function() {
		assert.equal( reporter( [], false, {
			maxErrors: -1,
			maxWarnings: 5
		} ), 'Stylint: 0 Errors.\nStylint: 0 Warnings. (Max Warnings: 5)' )
		assert.equal( reporter( [], false, { maxWarnings: 5 } ), 'Stylint: 0 Errors.\nStylint: 0 Warnings. (Max Warnings: 5)' )
		assert.equal( reporter( [], false, { maxErrors: 2 } ), 'Stylint: 0 Errors. (Max Errors: 2)\nStylint: 0 Warnings.' )
	} )

	it( 'should format error correctly', function() {
		assert.equal( stripColor( reporter( [genWarning( 'some file.styl', 'no-undefined' )] ) ), 'some file.styl\n1 no-undefined warning This is not OK\n\nStylint: 0 Errors.\nStylint: 1 Warnings.' )
	} )

	it( 'should format warning correctly', function() {
		assert.equal( stripColor( reporter( [genError( 'some file.styl', 'no-undefined' )] ) ), 'some file.styl\n1 no-undefined error This is not OK\n\nStylint: 1 Errors.\nStylint: 0 Warnings.' )
	} )

	it( 'should format error and warning correctly', function() {
		var error = genError( 'some file.styl', 'no-undefined' )
		var warning = genWarning( 'some file.styl', 'no-undefined' )

		assert.equal( stripColor( reporter( [error, warning] ) ), 'some file.styl\n1 no-undefined error This is not OK\n\nsome file.styl\n1 no-undefined warning This is not OK\n\nStylint: 1 Errors.\nStylint: 1 Warnings.' )
	} )

	it( 'should format column', function() {
		var error = genError( 'some file.styl', 'no-undefined' )

		error.col = 5

		assert.equal( stripColor( reporter( [error] ) ), 'some file.styl\n1:5 no-undefined error This is not OK\n\nStylint: 1 Errors.\nStylint: 0 Warnings.' )
	} )

	it( 'should not group files by default', function() {
		var error1 = genError( 'some file.styl', 'no-undefined' )
		var error2 = genError( 'some file.styl', 'no-undefined' )
		var error3 = genError( 'some other file.styl', 'no-undefined' )

		assert.equal( stripColor( reporter( [error1, error2, error3] ) ), 'some file.styl\n1 no-undefined error This is not OK\n\nsome file.styl\n1 no-undefined error This is not OK\n\nsome other file.styl\n1 no-undefined error This is not OK\n\nStylint: 3 Errors.\nStylint: 0 Warnings.' )
	} )

	it( 'should group files correctly', function() {
		var error1 = genError( 'some file.styl', 'no-undefined' )
		var error2 = genError( 'some file.styl', 'no-undefined' )
		var error3 = genError( 'some other file.styl', 'no-undefined' )

		assert.equal( stripColor( reporter( [error1, error2, error3], false, { groupOutputByFile: true } ) ), 'some file.styl\nFILE           LINEDATA SEVERITY MESSAGE        RULE        \nsome file.styl 1        error    This is not OK no-undefined\nsome file.styl 1        error    This is not OK no-undefined\n\nsome other file.styl\nFILE                 LINEDATA SEVERITY MESSAGE        RULE        \nsome other file.styl 1        error    This is not OK no-undefined\n\nStylint: 3 Errors.\nStylint: 0 Warnings.' )
	} )
} )
