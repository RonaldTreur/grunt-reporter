function OriginalReporter(orig) {
	var self = this;

	this.header = function() {
		return orig.header.apply(orig, arguments);
	};
	this.subhead = function() {
		return orig.subhead.apply(orig, arguments);
	};
	this.writeln = function() {
		return orig.writeln.apply(orig, arguments);
	};
	this.ok = function() {
		return orig.ok.apply(orig, arguments);
	};

	['header', 'subhead', 'write', 'writeln', 'ok', 'warn', 'error', 'success', 'fail'].forEach(function(key) {
		self[key] = function() {
			return orig[key].apply(orig, arguments);
		};
	});
}

module.exports = OriginalReporter;