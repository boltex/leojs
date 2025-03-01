# How to install and run the development version

Thanks for trying out the development version of Leojs! :sunglasses: Contributions and pull requests are more than welcome!

> To contribute to the LeoJS documentation website at [https://boltex.github.io/leojs/](https://boltex.github.io/leojs/) see the `/web/` folder.

## Introduction

If you're new to vscode and want to try out Leo with this vscode extension, you might want to look at this [Getting Started](https://code.visualstudio.com/docs#vscode-in-action) page to get an overview of vscode.

Furthermore, if you've never ran a vscode extension in an **Extension Development Host**, here is a [short overview about running and modifying a simple extension](https://code.visualstudio.com/api/get-started/your-first-extension).

If you're having problems, try [running this sample extension](https://github.com/Microsoft/vscode-extension-samples/tree/master/helloworld-sample#running-the-sample) first to catch underlying problems or missing dependencies.

## Development Version Installation

Make sure you have Node.js and Git installed, then clone the sources and run `npm install` in a terminal to install the remaining development dependencies.

![run extension](https://raw.githubusercontent.com/boltex/leojs/master/resources/run-extension.png)

You can then run the **Run Extension** target, as shown above, in the **Debug View**.

## Web extension version

See [VSCode for the web](https://code.visualstudio.com/docs/editor/vscode-web#_opening-a-project) for usage example

## Running Development version as a web extension

> For exact information on this procedure, see [Test your web extension](https://code.visualstudio.com/api/extension-guides/web-extensions#test-your-web-extension-in-vscode.dev).

To try out running as a web extension on vscode.dev, use the following commands:

First, you'll need to [install mkcert](https://github.com/FiloSottile/mkcert#installation).

Then, generate the localhost.pem and localhost-key.pem files into a location you won't lose them (for example $HOME/certs):

```
$ mkdir -p $HOME/certs
$ cd $HOME/certs
$ mkcert -install
$ mkcert localhost
```

Then, from your extension's path, start an HTTP server by running

```
$ npx serve --cors -l 5000 --ssl-cert $HOME/certs/localhost.pem --ssl-key $HOME/certs/localhost-key.pem
```

Finally, open vscode.dev pointing to a github repo, similar to: `https://vscode.dev/github/boltex/testleojs1` and run **Developer: Install Web Extension...** from the Command Palette and paste `https://localhost:5000`

> NOTE: To 'sideload' an extension in order to test it, you have to use VScode for the web from an adress starting with 'vscode.dev' and not 'github.dev' E.g. at https://vscode.dev/github/boltex/testleojs1 NOT FROM https://github.dev/boltex/testleojs1

# Converting from Python to Typescript

## Useful tricks and common pitfalls

### Standard Dict

They are falsy when empty in python, also, if an undefined key is referenced, it returns an empty dict instead of 'undefined'.

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

### Arrays of strings from **spitlines** VS **split('\n')**

Splitlines outputs one less entry if the last one was an empty string!
