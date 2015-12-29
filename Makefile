all: installed.js

test: all npmls.json
	npm prune
	node -e "require('./')(process.cwd(), {depth: 0}, function(e, i) { if(e) throw e; console.log(i.map(function(dep) { return dep.name + '@' + dep.version}).join('\n')) })"
	node -e "require('./')(process.cwd(), {depth: 1}, function(e, i) { if(e) throw e; console.log(i.map(function(dep) { return dep.name + '@' + dep.version}).join('\n')) })"
	node -e "require('./')(process.cwd(), {depth: 1, dev: true}, function(e, i) { if(e) throw e; console.log(i.map(function(dep) { return dep.name + '@' + dep.version}).join('\n')) })"
	#node -e "require('./')(process.cwd(), {depth: Infinity, extraneous: true, dev: true}, function(e, i) { if(e) throw e; console.log(i.map(function(dep) { return dep.name + '@' + dep.version}).join('\n')) })"
	node -e "var data = require('./npmls.json'); console.log(require('./').toArray(data, {depth: 1, extraneous: false}).map(function(dep) { return dep.name + '@' + dep.version }).join('\n')) "

npmls.json: installed.js
	npm ls --long --json > $@

sample: installed-sample.json

installed-sample.json: installed.js
	node -e "var stringify = require('json-stringify-safe'); require('./')(process.cwd(), {depth: 0}, function(e, i) { if(e) throw e; console.log(stringify(i, null, 2))})" > installed-sample.json

prepublish: sample

installed.js: index.js
	babel index.js > installed.js

.PHONY: all test sample
