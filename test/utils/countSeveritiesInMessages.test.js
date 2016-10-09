'use strict'

var assert = require( 'assert' )
var countSeverities = require( '../../src/utils/countSeveritiesInMessages' )

describe( 'countSeveritiesInMessages', function() {
	it( 'should count warning correctly', function() {
		assert.deepEqual( countSeverities( [ { severity: 'warning' } ] ), { errorCount: 0, warningCount: 1 } )
	} )

	it( 'should count error correctly', function() {
		assert.deepEqual( countSeverities( [ { severity: 'error' } ] ), { errorCount: 1, warningCount: 0 } )
	} )

	it( 'should count both error and warning correctly', function() {
		assert.deepEqual( countSeverities( [ { severity: 'error' }, { severity: 'warning' } ] ), { errorCount: 1, warningCount: 1 } )
	} )

	it( 'should handle empty array', function() {
		assert.deepEqual( countSeverities( [] ), { errorCount: 0, warningCount: 0 } )
	} )

	it( 'should handle no arguments', function() {
		assert.deepEqual( countSeverities(), { errorCount: 0, warningCount: 0 } )
	} )
} )
