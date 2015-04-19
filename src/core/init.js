var stampit = require('stampit');

module.exports = stampit().enclose(function () {
	var configIndex;

	// if path/ passed in use that for the dir
	if ( process.argv[2] && this.flags.indexOf( process.argv[2] ) === -1 ) {
		this.state.path = process.argv[2];
	}
	else {
		this.state.path = process.cwd();
	}

	// display help message if user types --help
	if ( process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1 ) {
		return this.help( this );
	}

	// output version # from package.json
	if ( process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1 ) {
		return this.ver( this, __dirname );
	}

	// turn on strict if strict flag passed
	if ( process.argv.indexOf('-s') !== -1 || process.argv.indexOf('--strict') !== -1 ) {
		this.state.strictMode = true;
	}

	// if -c or --config flags used
	if ( process.argv.indexOf('-c') !== -1 || process.argv.indexOf('--config') !== -1 ) {
		if ( process.argv.indexOf('-c') !== -1 ) {
			configIndex = process.argv.indexOf('-c');
		}
		else {
			configIndex = process.argv.indexOf('--config');
		}

		this.config = this.setConfig( process.argv[ configIndex + 1] );
	}

	// fire watch or read based on flag
	if ( process.argv.indexOf('-w') !== -1 || process.argv.indexOf('--watch') !== -1 ) {
		return this.watch();
	}

	return this.read();
});
