var OriginalReporter = require('./OriginalReporter'),
	SuppressedReporter = require('./SuppressedReporter'),
	ScanReporter = require('./ScanReporter'),
	ComplexReporter = require('./ComplexReporter');

function TaskReporter(name, config, orig, grunt) {
	var reporter;

	if (config.suppress) {
		reporter = new SuppressedReporter(orig);
	} else if (config.scan) {
		reporter = new ScanReporter(orig);
	} else if (config.rules) {
		reporter = new ComplexReporter(orig, config);
	} else {
		reporter = new OriginalReporter(orig);
	}

	extendReporter(reporter, name, config, grunt);
	return reporter;
}

function extendReporter(reporter, name, config, grunt) {
	reporter.writeTaskHeader = function(message) {
		var text;

		if (grunt.util.kindOf(config.header) === 'object') {
			text = config.header[name];
		} else {
			text = config.header;
		}

		if (text === false) {
			return;
		} else if (text && text !== true) {
			message = text;
		}
		
		this.header(message);
	};

	reporter.taskName = name;
}

module.exports = TaskReporter;