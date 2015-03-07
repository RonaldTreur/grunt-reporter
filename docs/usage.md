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
