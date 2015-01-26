all: installed.js

test: all
	npm prune
	node -e "require('./')(process.cwd(), {depth: 0}, function(e, i) { if(e) throw e; console.log(i.map(function(dep) { return dep.name + '@' + dep.version}).join('\n')) })"
	node -e "require('./')(process.cwd(), {depth: 1}, function(e, i) { if(e) throw e; console.log(i.map(function(dep) { return dep.name + '@' + dep.version}).join('\n')) })"
	node -e "require('./')(process.cwd(), {depth: 1, dev: true}, function(e, i) { if(e) throw e; console.log(i.map(function(dep) { return dep.name + '@' + dep.version}).join('\n')) })"
	node -e "require('./')(process.cwd(), {depth: 1, extraneous: false}, function(e, i) { if(e) throw e; console.log(i.map(function(dep) { return dep.name + '@' + dep.version}).join('\n')) })"

sample: installed-sample.json

installed-sample.json: installed.js
	node -e "var stringify = require('json-stringify-safe'); require('./')(process.cwd(), {depth: 0}, function(e, i) { if(e) throw e; console.log(stringify(i, null, 2))})" > installed-sample.json

prepublish: test sample

installed.js: index.js
	6to5 index.js > installed.js

.PHONY: all test sample
