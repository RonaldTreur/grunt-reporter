function ScanReporter(orig) {
	var self = this;

	['header', 'subhead', 'write', 'writeln', 'ok', 'warn', 'error', 'success', 'fail'].forEach(function(key) {
		self[key] = function() {
			[].splice.call(arguments, 0, 0, '['+key+']: ');
			return orig[key].apply(orig, arguments);
		};
	});
}

module.exports = ScanReporter;