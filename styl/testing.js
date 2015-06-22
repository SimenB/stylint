const app = require('../index')({
	path: __dirname + '/test.styl',
	config: {
		duplicates: true,
		sortOrder: 'alphabetical',
		strictMode: true
	}
});
