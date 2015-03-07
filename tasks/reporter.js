/*
 * grunt-reporter
 * https://github.com/ronaldtreur/grunt-reporter
 *
 * Copyright (c) 2015 Ronald "Funcracker" Treur, contributors
 * Licensed under the MIT license.
 */

var util = require('util'),
	TaskReporter = require('./lib/TaskReporter');

var _runningPattern = /Running "(.+)" (?:\((.+)\) )?task/,
	_reporters = {};

module.exports = function(grunt) {
	var logger = grunt.log,
		disabled = grunt.option('norep'),
		_origReporter = {
			header:		logger.header.bind(logger),
			subhead:	logger.subhead.bind(logger),
			write:		logger.write.bind(logger),
			writeln:	logger.writeln.bind(logger),
			ok:			logger.ok.bind(logger),
			warn:		logger.warn.bind(logger),
			error:		logger.error.bind(logger),
			success:	logger.success.bind(logger),
			fail:		logger.fail.bind(logger),
			_format: 	logger._format.bind(logger)
		},
		_currentTask = null,
		_reporter = _origReporter;

	function scanHeader() {
		var message = _origReporter._format(arguments),
			assumed = manageControl(message);

		if (assumed) {
			_reporter.writeTaskHeader(message);
		} else {
			_reporter.header(message);
		}
	}

	function updateCurrentTask(matches) {
		_currentTask = null;
		if (_reporters[matches[1]]) {
			_currentTask = matches[1];
		} else if (_reporters[matches[2]]) {
			_currentTask = matches[2];
		}
	}

	function manageControl(message) {
		var controlling = !!_currentTask,
			matches = message && message.match(_runningPattern);

		if (matches) {
			// A new task is starting
			if (controlling && _reporter.wrapUp) {
				_reporter.wrapUp();
			}

			updateCurrentTask(matches);

			if (controlling && !_currentTask) {
				// Was controlling, but have to quit
				relinquishControl();
			} else if (_currentTask) {
				// Start controlling a new task
				assumeControl(_reporters[_currentTask]);
				return true;
			}
		}
		
		return false;
	}

	function assumeControl(reporter) {
		if (reporter.initRules) {
			reporter.initRules();
		}

		logger.subheader 	= reporter.subheader;
		logger.writeln		= reporter.writeln;
		logger.ok			= reporter.ok;
		_reporter 			= reporter;
	}

	function relinquishControl() {
		logger.subheader 	= _origReporter.subheader;
		logger.writeln 		= _origReporter.writeln;
		logger.ok			= _origReporter.ok;
		_reporter 			= _origReporter;
	}

	// Suppress all output created by this plugin (unless in verbose or disabled mode)
	if (!disabled && !grunt.option('verbose')) {
		_reporters.reporter = new TaskReporter('reporter', {
			suppress: true
		}, _origReporter, grunt);
	}
	
	// Scan every header line for new (manages) tasks
	logger.header = scanHeader;

	grunt.registerMultiTask('reporter', 'Restyle the output from your Grunt plugins', function() {
		var name = this.name || 'reporter',
			options = this.options({
				runningText: true,
				suppress: false
			});

		// Check for required options
		this.requiresConfig([name, this.target, 'options', 'tasks'].join('.'));

		// Don't do anything if in disabled or verbose mode
		if (disabled || grunt.option('verbose')) {
			return;
		}

		if (!util.isArray(options.tasks)) {
			options.tasks = [options.tasks]; 
		}

		// Create a custom reporter for every task mentioned
		options.tasks.forEach(function(task) {
			_reporters[task] = new TaskReporter(task, options, _origReporter, grunt);
		});
	});
};