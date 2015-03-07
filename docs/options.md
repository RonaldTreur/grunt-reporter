When used, the properties mentioned below should be part of the reporter target's `options`-property.

### tasks
> The task-names for which to rewrite the output

Either a string representing a task-name, or an array containing one, or multiple task-names.

You can supply a task-name, or a task:target combination. In the case of the latter the rewrite will only occur when that target is being executed. If you only supply a task-name, the rewrite will happen whenever the task is run, for every target.

```js
tasks: 'attention'
```

```js
tasks: ['jshint', 'csslint:dev']
```

**Important:** At the moment every task-name should only occur once in your target-configurations. This is because multiple reporters (each target will create one `reporter` for each task-name) for a single task are not supported at the moment.

### rules
> The changes you want to enforce for the tasks mentioned in 'tasks'

An object representing the change you like to see, or an array containing one or several of these rule-objects. This is what it all boils down to and the Rules-section below will dive deeper into the various rule-properties that exist and can be used.

```js
rules: {/*rule*/}
```

```js
rules: [{/*rule*/}, {/*rule*/}]
```

### header
> The text with which to replace the running-header

Either a string-, or a boolean-value (defaults to `true`). If you supply a text-value, this will replace the standard 'Running task:target (task) task'-message when this task is being executed by Grunt. A value of `false` will suppress the *Running..*-message completely. Providing `true` does not change a thing and keeps the original message intact.

Even when you suppress all output of a task (via rules), the running-header will still be shown. If you want to hide that instead (or as well), then make sure to set this property to `false`.

```js
header: false
```

```js
header: 'Linting your CSS...'
```

Note that using the following [rule](#rules) does exactly the same as the previous example:

```js
rules: {
	from: /Running "(.+)" (?:\((.+)\) )?task/
	to: 'Linting your CSS...'
}
```

The regular expression used in the `from`-property here is unnecessary complex, you could have used something like `Running "csslint" (csslint) task` instead. The regular expression shown will match each and every task-header, and is actually the one used by grunt-reporter internally to detect task-headers.

The `header`-option is a handy shortcut, since there is no need to add a rule to match the header. However, you might want to change the output-method of the header as well. In that case a custom rule is (currently) your only options.

### suppress
> Suppress (hide) everything

When set to `true`, nothing will be shown at all. When you set to this to `true`, any rules you provided will be ignored. If you require more fine-grained control, don't use this option, but use the rules-objects.

```js
suppress: true
```

### scan
> For debugging purposes only

When you want to change the output format of a given line, you might be interested to see what output-types are currently being used by the grunt-plugin. When you set the `scan`-property to `true`, make sure not to set `suppress` as well, since that will overrule this property.

When using `scan: true`, any additional rules you provided will be ignored.

```js
scan: true
```

