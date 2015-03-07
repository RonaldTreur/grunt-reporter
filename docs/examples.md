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