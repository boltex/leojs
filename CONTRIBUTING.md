# How to install and run the development version

Thanks for trying out the development version of Leojs! :sunglasses: Contributions and pull requests are more than welcome!

## Introduction

If you're new to vscode and want to try out Leo with this vscode extension, you might want to look at this [Getting Started](https://code.visualstudio.com/docs#vscode-in-action) page to get an overview of vscode.

Furthermore, if you've never ran a vscode extension in an **Extension Development Host**, here is a [short overview about running and modifying a simple extension](https://code.visualstudio.com/api/get-started/your-first-extension).

If you're having problems, try [running this sample extension](https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample#running-the-sample) first to catch underlying problems or missing dependencies.

## Converting from Python to Typescript

### Raw String

Raw String (prefixed with an 'r') do not exist in js. Except for regex defined with slashes.

Those regex defined with slashes are equivalent to raw strings being compiled into a regex in python.

If raw strings are needed for strings OTHER THAN regex, then the have to be escaped. (\\r, \\n, etc.)

This applies for regular strings and multiline strings.

### Multiline string

Multiline strings can be made with back-ticks "`" .

### Regex 'match' methods

The regexp 'match' method exists in python, but it only matches at the start of the string.

This implies that when the 'match' method is used in js, a caret "^" has to be prefixed onto the regex to match at the start of the string.

### Regex 'end-of-line' and 'm' switch

If a regex uses the '\$' character to match an end-of-line, it needs the 'm' switch if the tested string has '\n' at the end. (is considered multiline)

No need for 'm' switch for a '\$' match if the tested string has no newlines at all.

### For 'in/of' loops

A "for in" loop in python loops over the values which is equivalent to a "for of" loop in js.

Although legal in js, it is NOT equivalent: A "for in" loop in js loops over the keys, not the values.
