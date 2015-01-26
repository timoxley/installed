# installed

Read all the installed packages in a folder, and produce an Array of all the data.

A wrapper around npm's [read-installed](https://github.com/npm/read-installed) that
produces a flat array rather than a nested tree structure. Also adds a few bells and whistles.

Arrays are a *far* easier to process and reason about than nested objects.

## Installation

```
npm install --save installed
```

## Usage

```js
var installed = require('installed')

// default options
var options = {
  dev: false,      // exclude all dev dependencies
  depth: Infinity, // depth to traverse
  extraneous: true // includes extraneous deps. Set to false to filter extraneous dependencies out.
}

// options is optional
installed(process.cwd(), options, function(err, pkgs) {
  if (err) throw err;
  var pkgVersions = pkgs.map(function(dep) {
    return dep.name + '@' + dep.version
  })

  console.log(pkgVersions.join('\n'))
})
```

## CLI

```
> installed --help
Get a JSON dump of installed package data.

Usage: installed [options]

Options:
  --dev            Include development dependencies.
  --extraneous     Show extraneous dependencies                                                                   [default: true]
  --no-extraneous  Filter extraneous dependencies. This will include --dev dependencies if --dev is not enabled.
  --depth          Traversal depth. use --depth=Infinity or --depth=-1 to traverse entire dependency tree.        [default: 0]
  --color          Display coloured output. Auto-disabled if output is not a terminal.                            [default: true]
  --no-color       Don't display coloured output, strictly JSON.
  --json           Produce JSON output. Implies --no-color.
  --help           Show help
  --version        Show version number
```

## Data Structure Sample

The program below serializes the result of running `installed` in the
`installed` directory. You can see the result of this output at [installed-sample.json](https://github.com/timoxley/installed/blob/master/installed-sample.json)

Note you'll need to use something like [json-stringify-safe](https://github.com/isaacs/json-stringify-safe) in order to safely serialize the data produced by `installed`, as it contains circular references.

```js
var stringify = require('json-stringify-safe');
var installed = require('installed')
var fs = require('fs')

installed(process.cwd(), {depth: 0}, function(err, pkgs) {
  if(err) throw err;
  console.log(stringify(i, null, 2))
})
```

## See Also

* [pkgrep](http://github.com/timoxley/pkgrep)

#### Note about versions < 1.2.0

[pkgrep](http://github.com/timoxley/pkgrep) was  briefly known as `installed` so versions of `installed` <
`1.2.0` are actually deprecated versions of `pkgrep`.

# License

MIT
