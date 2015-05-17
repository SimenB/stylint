'use strict';

var fs = require('fs');
var async = require('async');


/**
 * @description parses file for testing by removing extra new lines and block comments
 * @param  {string} file        [the current file being parsed]
 * @param  {number} len         [total number of files to parse]
 * @param  {number} fileNum     [the current file being parsed (# of len) ]
 * @returns test function
 */
module.exports = function parse() {
	return async.map(this.cache.files, fs.readFile, this.stripBlockComments.bind(this) );
};
