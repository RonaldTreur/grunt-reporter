# grunt-reporter 

> Take full control over Grunt's output. Customize each task's output to your liking.

## Jump to Section

* [Introduction](#introduction)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Options](#options)
* [Rules](#rules)
* [Examples](#examples)
* [Contributing](#contributing)

## Introduction
[[Back To Top]](#jump-to-section)

So Mr. [Front-End Operations Engineer](http://www.smashingmagazine.com/2013/06/11/front-end-ops/), here you finally are. You've created the most awesome Grunt workflow, using over a dozen awesome plugins. You are running them [concurrently](https://www.npmjs.com/package/grunt-concurrent), [timing](https://www.npmjs.com/package/time-grunt) them and maybe even offer some additional [options](http://gruntjs.com/api/grunt.option) for some much needed customization. Say what? You probable created several flows so different departments or experts can all contribute to your project in the best way possible.

Your users love you for creating a fast and robust tool for them to build, distribute and add to your project. But unfortunately they don't have the slightest clue what is happening exactly when they run `grunt`. If something fails, they see no other way than to come knocking on your door, asking you to please help them out.

Of course... It's almost always their own fault ;-) But you can't blame them; the output presented by Grunt is not always that obvious. After a good many cries for help, you might decide it's time to schedule a company/team-meeting. You will get to show off your accomplishments and -most importantly- explain everyone involved how it all works.

But.. Wouldn't it be nice if you could somehow, easily manipulate Grunt's output so it would make more sense to those looking at it. If only the lines of text printed to the screen gave more insight into what is really going on. If only you could remove most of those lines so the important bits get to stand out and the perceived complexity would diminish.

Perhaps you already looked at plugins like [grunt-attention](https://www.npmjs.com/package/grunt-attention) or [grunt-verbosity](https://www.npmjs.com/package/grunt-verbosity). Great tools, but not enough you say? Then perhaps it's time to install grunt-reporter and fix things properly!

## Getting Started
[[Back To Top]](#jump-to-section)

This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, you probably shouldn't be here. If -on the other hand- you feel like a Grunt guru, then please continue to install this plugin with this command:

```shell
npm install grunt-reporter --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-reporter');
```

## Usage
[[Back To Top]](#jump-to-section)

In your project's Gruntfile, add a section named reporter to the data object passed into grunt.initConfig().

```js
grunt.initConfig({
  reporter: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})

// Load the task
grunt.loadNpmTasks('grunt-attention');
```

### Disabling grunt-reporter

**Important:** You can easily disable the whole reporter-plugin (for example, when debugging the build-process) using one of the following two options:

- Supply the `--norep`-option to grunt on the CLI
- Execute Grunt in [verbose](http://gruntjs.com/using-the-cli)-mode (`-v` or `--verbose`) 

Both options will still show the reporter targets loading, but no line will be changed. Obviously running in verbose mode does increase the amount of information shown by other plugins as well, which is why the `--norep`-option was introduced.

### Concurrent tasks

If you are using a plugin like [grunt-concurrent](https://www.npmjs.com/package/grunt-concurrent), then you will need to load the reporter-task (or the targets that are relevant) inside those concurrent tasks (prefably at the beginning). If you don't do this, then reporter won't be able to rewrite the output created in those concurrent tasks.


## Options
[[Back To Top]](#jump-to-section)

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



## Rules
[[Back To Top]](#jump-to-section)

The rule-objects you assign to the rules-property are what really puts you in control over the way output is shown by Grunt. Below is a list of the various properties you can assign to such an object (dubbed rule-properties).

When used, the properties mentioned below should be part of the `rules`-property you added to your target's `options`.

**Important:** The rules are checked in the order you supply them. So in most cases there is no need for fancy regular expressions if you need to differentiate between several rules that might match a single line of output. Simply supply them ordered most precise to least precise.

### from
> Target lines that match this pattern

**Important:** This property is mandatory within a rule-object!

Rules behave on a per-line basis. The pattern you provide to the `from`-property is used to match the original output lines from the plugin (task) you are trying to influence. 

On its own this property does nothing. It needs to be used in conjunction with the `to`, or `suppress`-property (see below).

Using `from` with either of these two properties can change every line that is printed. The `from`-property can be a regular expression or a simple string (that will be changed into a regular expression) that matches (part of) the line you want to rewrite. By using parenthesis in your expression you can create capture groups, which you can then reuse in the `to`-property.

If you're not up-to-speed concerning regular expressions, then please read [this resource](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions) or check the examples further below.

In string form:
```js
from: 'File ([^ ]+) created'
```

In regular expression form
```js
from: /File ([^ ]+) created/
```

### to
> Rewrite lines matching `from`

This is the replacement text for the lines that match the `from`-pattern. It will be printed instead of lines matching `from`.

If you added one or more capture groups to the `from`-pattern, you can refer to these using `$1`, `$2`, `$3`, etc in your string.

If the expression used in `from` does not match the whole line of output, then only the matched part will be replaced. If this was not your intention, make sure to update the expression you supplied to `from`.

```js
to: 'Successfully transformed $1'
```

### suppress
> Suppress (hide) lines matching `from`

All lines matching the `from`-pattern will be suppressed (hidden). When setting this to `true`, all other rule-properties you supply will be ignored. Unlike the `to`-option, it does not matter wether the `from`-expression matches the whole, or part of the line. As long as the pattern matched, the output will be suppressed.

**Note:** `suppress` is the only property that can be added to rule-object as well as to the `options` of your target. Using it within a rule gives you more fine-grained control over which lines you want to hide specifically.

```js
suppress: true
```

### summarize
> Show a short summary when the task completes, instead of rewriting lines

*Note:* When you use the `summarize`-property you'll also need to supply the `to`-property.

If you use the `suppress`-option mentioned above, no output will be shown at all. Often this is not what you want, since this means you'll get no feedback at all. On the other hand, having dozens of lines scrolling by just because an operation was applied to dozens of files is a bit too much.

If the above sounds familiar, then summarize might help you out! This rule-property allows you to show a short summary when the task is completed, so you'll know what happened.

Instead of rewriting every line that matches `from` with the line you defined in `to`, this will suppress (hide) all lines matching the `from`-pattern. The line you define in `to` is only shown once and only when the task is completed.

Note that this means you can't refer to capture-groups in your `to` rule-property. You do however get access to the special property `$count`. You can use this property wherever you want in your string. On the screen it will be replaced with the actual number of `from`-lines that were suppressed.

```js
from: 'File [^ ]+ created',
to: 'Processed $count files',
summarize: true
```

### output
> Change the output-type to something different

Grunt offers several options to plugins to provide feedback to the user. Most plugins use the default 'writeln' and 'ok' options. If you want to display lines differently, you can add this property to a rule-object to make sure the output is changed to you preference.

Valid options are:

- write
- writeln
- ok
- warn
- error
- success
- fail
- header
- subhead

The `ok` and `success` ones are especially nice for summarizing the output.

```js
output: 'ok'
```

## Examples
[[Back To Top]](#jump-to-section)

Below are some examples of custom targets for the grunt-reporter task.

### grunt-attention [NPM](https://www.npmjs.com/package/grunt-attention)
> Display attention-grabbing messages in the terminal without a header

Attention is for displaying important pieces of data for your end-users. Displaying the running-header is at least redundant, and potentially very annoying.

```js
reporter: {
	attention: {
		options: {
			tasks: 'attention',		// Run this only for this/these task(s)
			header: false			// Suppress the running-header
		}
	}
}
```

### Change multiple headers
> Rewrite a few task-headers at a time

Sometimes people new to Grunt tend to think Grunt crashed, because the "waiting..." message never disappeared. If you're new to Grunt or unfamiliar with grunt-watch, then this might make sense. Rewriting headers is one of the easiest things to do and it might also be one of the most important uses of this plugin. How about providing you users with clear messages every step of the way?

```js
taskHeaders: {
	options: {
		tasks: ['watch', 'jshint:dev', 'csslint:dev'],		// Run this  only for this/these task(s)
		header: {
			'watch': 'Waiting for your code-changes',		// Replace the watch-task's header
			'jshint:dev': 'Linting your Javascript',		// Replace the jshint-task's header
			'csslint:dev': 'Linting your CSS',				// Replace the csslint-task's header
		}
	}
}
```


### grunt-autoprefixer [NPM](https://www.npmjs.com/package/grunt-autoprefixer)
> Autoprefixer adds vendor-prefixed CSS properties and will let you know each time it updates a CSS-file

Autoprefixer generates a lot of output, especially if you ask it to create sourcemaps as well. Below is an example where all lines are suppressed (hidden). Instead it shows a single line when the operation is complete that summarizes the number of files that were processed.

```js
reporter: {
	autoprefixer: {
		options: {
			tasks: ['autoprefixer'],				// Run this only for this/these task(s)
			header: 'Autoprefixing CSS files',		// Replace the header and instead explain what is going to happen
			rules: [{
				from: 'File ([^ ]+) created.$',		// Catch the primary line like this (regexp-string)
				to: 'Processed $count files',		// Replace with this line
				summarize: true,					// Only show the 'to' line once at the end
				output: 'ok'						// Don't print a standard grunt-'line', but use the 'ok'-variant instead
			}, {
				from: 'File ([^ ]+) created \\(',	// Catch all sourcemap-related lines like this (regexp)
				suppress: true
			}]
		}
	}
}
```

### grunt-port-pick [NPM](https://www.npmjs.com/package/grunt-port-pick)
> Scan and pick an available port for a few of your grunt-tasks

If you are executing a task more than once, using `header` to rewrite the task might not do it for you. So use a custom rule to provide new headers, using only the target-name of the current task.

```js
portpick: {
	options: {
		tasks: ['portPick'],
		rules: [{
			from: /Running "[^ ]+:([^ ]+)" \([^ ]+\) task/,
			to: 'Selecting port for $1'
		}]
	}
}
```

## Contributing
[[Back To Top]](#jump-to-section)

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).



--------
<small>_This readme has been automatically generated by [readme generator](https://github.com/aponxi/grunt-readme-generator) on Sat Mar 07 2015 16:02:24 GMT+0100 (CET)._</small>