var util = require('util');

function ComplexReporter(orig, config) {
	'strict mode';

	var self = this,
		_rules = [],
		_lastRule = null;

	self.init = function() {
		var rules = util.isArray(config.rules) ? config.rules : [config.rules];
		rules.forEach(self.addRule);

		// Create logger-methods
		['header', 'subhead', 'write', 'writeln', 'ok', 'warn', 'error', 'success', 'fail'].forEach(function(key) {
			self[key] = function() {
				var message = orig._format(arguments);
				self.log(key, message);
				return this;
			};
		});
	};
	
	
	self.log = function(type, message) {
		var rule = self.checkPreviousRule(message) || self.getRule(message);

		if (!rule) {
			orig[type](message);
			return;
		}

		message = rule.process(message);
		if (message) {
			orig[rule.output || type](message);
		}
	};

	self.checkPreviousRule = function(message) {
		if (_lastRule && _lastRule.matches(message)) {
			return _lastRule;
		}
		return null;
	};

	self.initRules = function() {
		var ln = _rules.length,
			i;

		for (i = 0; i < ln; i++) {
			_rules[i].initialize();
		}
	};	

	self.wrapUp = function() {
		var ln = _rules.length,
			i;

		for (i = 0; i < ln; i++) {
			_rules[i].wrapUp();
		}
	};

	self.addRule = function(rule) {
		if (!self.isValidRule(rule)) {
			orig.fail('This rule object is incomplete or invalid');
			orig.fail(JSON.stringify(rule));
			return false;
		}

		var reFrom = (rule.from instanceof RegExp) ? rule.from : new RegExp(rule.from.replace('/', '\/'));

		_rules.push({
			count: 0,
			reFrom: reFrom,
			outputType: rule.output || false,
			matches: reFrom.test.bind(reFrom),
			process: function(message) {
				this.count++;
				self._lastRule = this;
				if (rule.summarize || rule.suppress) {
					return false;
				} else {
					return message.replace(rule.from, rule.to);
				}
			},
			summarize: !!rule.summarize && function() {
				var summary = rule.to.replace('$count', this.count);

				this.count = 0;
				orig[this.outputType || 'ok'](summary);
			},
			initialize: function() {
				this.count = 0;
			},
			wrapUp: function() {
				if (this.summarize) {
					this.summarize();
				}
			}
		});
	};

	self.getRule = function(message) {
		var ln = _rules.length,
			i;

		for (i = 0; i < ln; i++) {
			if (_rules[i].matches(message)) {
				return _rules[i];
			}
		}

		return false;
	};

	self.isValidRule = function(rule) {
		// Check rule is an object and presence of 'from'
		if (!rule || typeof rule !== 'object' || !rule.from ||
			!(rule.from instanceof RegExp || (rule.from = rule.from.trim()))) {
			return false;
		}

		// Check presence of either 'suppress' or 'to'
		if (!rule.suppress && (!rule.to ||
			!(rule.to = rule.to.trim()))) {
			return false;
		}

		return true;
	};

	self.init();
}

module.exports = ComplexReporter;