'use strict'

import readInstalled from 'read-installed'
import stringify from 'json-stringify-safe'

const DEFAULT_OPTIONS = Object.freeze({
  dev: false,      // exclude all dev dependencies
  depth: Infinity, // depth to traverse
  extraneous: true // includes extraneous deps. Set to false to filter extraneous dependencies out.
})

module.exports = installed
module.exports.toArray = toArray

function installed(dirname, options, fn) {
  if (!dirname) throw new Error('dirname required')
    // options is optional
  if (typeof options === 'function') {
    fn = options
    options = {}
  }
  if (typeof fn !== 'function') throw new Error('fn required')
  return read(dirname, options, fn)
}

function read(dirname, options = DEFAULT_OPTIONS, fn) {
  options = assign({}, DEFAULT_OPTIONS, options)
  readInstalled(dirname, options, (err, installed) => {
    if (err) return fn(err)
    let deps = toArray(installed, options)
    fn(null, deps)
  })
}

function toArray(installed, options = DEFAULT_OPTIONS) {
  options = assign({}, DEFAULT_OPTIONS, options)
  let deps = getDependencies(installed)
	if (!options.extraneous) deps = deps.filter(dep => !dep.extraneous)
	if (!options.dev)        deps = deps.filter(dep => !isDevDependency(dep))
  let depth = options.depth
	if (depth === -1) depth = Infinity
	deps = deps.filter(dep => {
		return dep.depth <= depth + 1
	})
  return deps
}

function getDependencies(mod, result, visited, depth) {
  depth = depth || 0
  result = result || []
  visited = visited || {} // cache of realpaths
  var dependencies = mod.dependencies || {}
  Object.keys(dependencies).forEach(name => {
    var dep = mod.dependencies[name]
    if (dep === mod) {
      delete mod.dependencies[name]
      return
    }
    if (typeof dep === 'string') return
    if (visited[dep.realPath]) return
    if (!dep.name) dep.name = name
    //if (!('depth' in dep)) dep.depth = depth
    visited[dep.realPath] = true
    var obj = assign({dependencies: dep._dependencies}, dep)
		delete obj._dependencies
    if (obj.parent === obj) delete obj.parent
    result.push(assign({}, obj))
    getDependencies(dep, result, visited, depth + 1)
  })
  return result
}

function isDevDependency(dep) {
  if (dep.root) return false
  if (!dep.parent) return false
  var devDependencies = dep.parent.devDependencies || {}
  return devDependencies[dep.name] != null
}

// Object.assign polyfill
function assign(target, firstSource) {
  if (Object.assign) return Object.assign(...arguments)
  if (target === undefined || target === null)
    throw new TypeError("Cannot convert first argument to object");
  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) continue;
    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
    }
  }
  return to;
}
