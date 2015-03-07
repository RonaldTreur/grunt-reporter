function SuppressedReporter(orig) {
	var self = this;

	var _suppress = function() {
		return orig;
	};

	['header', 'subhead', 'write', 'writeln', 'ok', 'success'].forEach(function(key) {
		self[key] = _suppress;
	});

	['warn', 'error', 'fail'].forEach(function(key) {
		self[key] = function() {
			return orig.subhead.apply(orig, arguments);
		};
	});
}

module.exports = SuppressedReporter;