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