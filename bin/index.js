#!/usr/bin/env node

"use strict"

var installed = require('../')

var fs = require('fs')
var stringify = require('json-stringify-safe')

var argv = require('yargs')
.usage('Installed package data.\n\nUsage: $0 [options]')
.boolean('dev')
.describe('dev', 'Include development dependencies.')
.boolean('extraneous')
.default('extraneous', true)
.describe('extraneous', 'Show extraneous dependencies')
.describe('no-extraneous', 'Filter extraneous dependencies. This will include --dev dependencies if --dev is not enabled.')
.describe('depth', 'Traversal depth. use --depth=Infinity or --depth=-1 to traverse entire dependency tree.')
.default('depth', 0)
.boolean('color')
.default('color', process.stdout.isTTY)
.describe('color', 'Display coloured output. Auto-disabled if output is not a terminal.')
.describe('no-color', 'Don\'t display coloured output, strictly JSON.')
.describe('json', 'Produce JSON output. Implies --no-color.')
.help('help')
.version(require('../package.json').version, 'version')
.argv

if (argv.json) argv.color = false

installed(process.cwd(), argv, function(err, pkgs) {
  if (err) throw err;
  if (argv.color) {
    console.log(color(JSON.parse(stringify(pkgs, null, 2))))
  } else {
    console.log(stringify(pkgs, null, 2))
  }
})

function color(item) {
  return require('util').inspect(item, {colors: true, depth: 99})
}
