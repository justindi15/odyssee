// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}
},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/rebound/dist/rebound.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
/**
 *  Copyright (c) 2013, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.rebound = factory();
})(this, function () {
  'use strict';

  var _onFrame = void 0;

  if (typeof window !== 'undefined') {
    _onFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
  }

  if (!_onFrame && typeof process !== 'undefined' && process.title === 'node') {
    _onFrame = setImmediate;
  }

  _onFrame = _onFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

  var _onFrame$1 = _onFrame;
  /* eslint-disable flowtype/no-weak-types */

  var concat = Array.prototype.concat;
  var slice = Array.prototype.slice; // Bind a function to a context object.

  function bind(func, context) {
    for (var _len = arguments.length, outerArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      outerArgs[_key - 2] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, innerArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      func.apply(context, concat.call(outerArgs, slice.call(innerArgs)));
    };
  } // Add all the properties in the source to the target.


  function extend(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  } // Cross browser/node timer functions.


  function onFrame(func) {
    return _onFrame$1(func);
  } // Lop off the first occurence of the reference in the Array.


  function removeFirst(array, item) {
    var idx = array.indexOf(item);
    idx !== -1 && array.splice(idx, 1);
  }

  var colorCache = {};
  /**
   * Converts a hex-formatted color string to its rgb-formatted equivalent. Handy
   * when performing color tweening animations
   * @public
   * @param colorString A hex-formatted color string
   * @return An rgb-formatted color string
   */

  function hexToRGB(colorString) {
    if (colorCache[colorString]) {
      return colorCache[colorString];
    }

    var normalizedColor = colorString.replace('#', '');

    if (normalizedColor.length === 3) {
      normalizedColor = normalizedColor[0] + normalizedColor[0] + normalizedColor[1] + normalizedColor[1] + normalizedColor[2] + normalizedColor[2];
    }

    var parts = normalizedColor.match(/.{2}/g);

    if (!parts || parts.length < 3) {
      throw new Error('Expected a color string of format #rrggbb');
    }

    var ret = {
      r: parseInt(parts[0], 16),
      g: parseInt(parts[1], 16),
      b: parseInt(parts[2], 16)
    };
    colorCache[colorString] = ret;
    return ret;
  }
  /**
   * Converts a rgb-formatted color string to its hex-formatted equivalent. Handy
   * when performing color tweening animations
   * @public
   * @param colorString An rgb-formatted color string
   * @return A hex-formatted color string
   */


  function rgbToHex(rNum, gNum, bNum) {
    var r = rNum.toString(16);
    var g = gNum.toString(16);
    var b = bNum.toString(16);
    r = r.length < 2 ? '0' + r : r;
    g = g.length < 2 ? '0' + g : g;
    b = b.length < 2 ? '0' + b : b;
    return '#' + r + g + b;
  }

  var util = Object.freeze({
    bind: bind,
    extend: extend,
    onFrame: onFrame,
    removeFirst: removeFirst,
    hexToRGB: hexToRGB,
    rgbToHex: rgbToHex
  });
  /**
   * This helper function does a linear interpolation of a value from
   * one range to another. This can be very useful for converting the
   * motion of a Spring to a range of UI property values. For example a
   * spring moving from position 0 to 1 could be interpolated to move a
   * view from pixel 300 to 350 and scale it from 0.5 to 1. The current
   * position of the `Spring` just needs to be run through this method
   * taking its input range in the _from_ parameters with the property
   * animation range in the _to_ parameters.
   * @public
   */

  function mapValueInRange(value, fromLow, fromHigh, toLow, toHigh) {
    var fromRangeSize = fromHigh - fromLow;
    var toRangeSize = toHigh - toLow;
    var valueScale = (value - fromLow) / fromRangeSize;
    return toLow + valueScale * toRangeSize;
  }
  /**
   * Interpolate two hex colors in a 0 - 1 range or optionally provide a
   * custom range with fromLow,fromHight. The output will be in hex by default
   * unless asRGB is true in which case it will be returned as an rgb string.
   *
   * @public
   * @param asRGB Whether to return an rgb-style string
   * @return A string in hex color format unless asRGB is true, in which case a string in rgb format
   */


  function interpolateColor(val, startColorStr, endColorStr) {
    var fromLow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var fromHigh = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var asRGB = arguments[5];
    var startColor = hexToRGB(startColorStr);
    var endColor = hexToRGB(endColorStr);
    var r = Math.floor(mapValueInRange(val, fromLow, fromHigh, startColor.r, endColor.r));
    var g = Math.floor(mapValueInRange(val, fromLow, fromHigh, startColor.g, endColor.g));
    var b = Math.floor(mapValueInRange(val, fromLow, fromHigh, startColor.b, endColor.b));

    if (asRGB) {
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    } else {
      return rgbToHex(r, g, b);
    }
  }

  function degreesToRadians(deg) {
    return deg * Math.PI / 180;
  }

  function radiansToDegrees(rad) {
    return rad * 180 / Math.PI;
  }

  var MathUtil = Object.freeze({
    mapValueInRange: mapValueInRange,
    interpolateColor: interpolateColor,
    degreesToRadians: degreesToRadians,
    radiansToDegrees: radiansToDegrees
  }); // Math for converting from
  // [Origami](http://facebook.github.io/origami/) to
  // [Rebound](http://facebook.github.io/rebound).
  // You mostly don't need to worry about this, just use
  // SpringConfig.fromOrigamiTensionAndFriction(v, v);

  function tensionFromOrigamiValue(oValue) {
    return (oValue - 30.0) * 3.62 + 194.0;
  }

  function origamiValueFromTension(tension) {
    return (tension - 194.0) / 3.62 + 30.0;
  }

  function frictionFromOrigamiValue(oValue) {
    return (oValue - 8.0) * 3.0 + 25.0;
  }

  function origamiFromFriction(friction) {
    return (friction - 25.0) / 3.0 + 8.0;
  }

  var OrigamiValueConverter = Object.freeze({
    tensionFromOrigamiValue: tensionFromOrigamiValue,
    origamiValueFromTension: origamiValueFromTension,
    frictionFromOrigamiValue: frictionFromOrigamiValue,
    origamiFromFriction: origamiFromFriction
  });

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  /**
   * Plays each frame of the SpringSystem on animation
   * timing loop. This is the default type of looper for a new spring system
   * as it is the most common when developing UI.
   * @public
   */

  /**
   *  Copyright (c) 2013, Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree. An additional grant
   *  of patent rights can be found in the PATENTS file in the same directory.
   *
   * 
   */


  var AnimationLooper = function () {
    function AnimationLooper() {
      classCallCheck(this, AnimationLooper);
      this.springSystem = null;
    }

    AnimationLooper.prototype.run = function run() {
      var springSystem = getSpringSystem.call(this);
      onFrame(function () {
        springSystem.loop(Date.now());
      });
    };

    return AnimationLooper;
  }();
  /**
   * Resolves the SpringSystem to a resting state in a
   * tight and blocking loop. This is useful for synchronously generating
   * pre-recorded animations that can then be played on a timing loop later.
   * Sometimes this lead to better performance to pre-record a single spring
   * curve and use it to drive many animations; however, it can make dynamic
   * response to user input a bit trickier to implement.
   * @public
   */


  var SimulationLooper = function () {
    function SimulationLooper(timestep) {
      classCallCheck(this, SimulationLooper);
      this.springSystem = null;
      this.time = 0;
      this.running = false;
      this.timestep = timestep || 16.667;
    }

    SimulationLooper.prototype.run = function run() {
      var springSystem = getSpringSystem.call(this);

      if (this.running) {
        return;
      }

      this.running = true;

      while (!springSystem.getIsIdle()) {
        springSystem.loop(this.time += this.timestep);
      }

      this.running = false;
    };

    return SimulationLooper;
  }();
  /**
   * Resolves the SpringSystem one step at a
   * time controlled by an outside loop. This is useful for testing and
   * verifying the behavior of a SpringSystem or if you want to control your own
   * timing loop for some reason e.g. slowing down or speeding up the
   * simulation.
   * @public
   */


  var SteppingSimulationLooper = function () {
    function SteppingSimulationLooper() {
      classCallCheck(this, SteppingSimulationLooper);
      this.springSystem = null;
      this.time = 0;
      this.running = false;
    }

    SteppingSimulationLooper.prototype.run = function run() {} // this.run is NOOP'd here to allow control from the outside using
    // this.step.
    // Perform one step toward resolving the SpringSystem.
    ;

    SteppingSimulationLooper.prototype.step = function step(timestep) {
      var springSystem = getSpringSystem.call(this);
      springSystem.loop(this.time += timestep);
    };

    return SteppingSimulationLooper;
  }();

  function getSpringSystem() {
    if (this.springSystem == null) {
      throw new Error('cannot run looper without a springSystem');
    }

    return this.springSystem;
  }

  var Loopers = Object.freeze({
    AnimationLooper: AnimationLooper,
    SimulationLooper: SimulationLooper,
    SteppingSimulationLooper: SteppingSimulationLooper
  });
  /**
   * Provides math for converting from Origami PopAnimation
   * config values to regular Origami tension and friction values. If you are
   * trying to replicate prototypes made with PopAnimation patches in Origami,
   * then you should create your springs with
   * SpringSystem.createSpringWithBouncinessAndSpeed, which uses this Math
   * internally to create a spring to match the provided PopAnimation
   * configuration from Origami.
   */

  var BouncyConversion = function () {
    function BouncyConversion(bounciness, speed) {
      classCallCheck(this, BouncyConversion);
      this.bounciness = bounciness;
      this.speed = speed;
      var b = this.normalize(bounciness / 1.7, 0, 20.0);
      b = this.projectNormal(b, 0.0, 0.8);
      var s = this.normalize(speed / 1.7, 0, 20.0);
      this.bouncyTension = this.projectNormal(s, 0.5, 200);
      this.bouncyFriction = this.quadraticOutInterpolation(b, this.b3Nobounce(this.bouncyTension), 0.01);
    }

    BouncyConversion.prototype.normalize = function normalize(value, startValue, endValue) {
      return (value - startValue) / (endValue - startValue);
    };

    BouncyConversion.prototype.projectNormal = function projectNormal(n, start, end) {
      return start + n * (end - start);
    };

    BouncyConversion.prototype.linearInterpolation = function linearInterpolation(t, start, end) {
      return t * end + (1.0 - t) * start;
    };

    BouncyConversion.prototype.quadraticOutInterpolation = function quadraticOutInterpolation(t, start, end) {
      return this.linearInterpolation(2 * t - t * t, start, end);
    };

    BouncyConversion.prototype.b3Friction1 = function b3Friction1(x) {
      return 0.0007 * Math.pow(x, 3) - 0.031 * Math.pow(x, 2) + 0.64 * x + 1.28;
    };

    BouncyConversion.prototype.b3Friction2 = function b3Friction2(x) {
      return 0.000044 * Math.pow(x, 3) - 0.006 * Math.pow(x, 2) + 0.36 * x + 2;
    };

    BouncyConversion.prototype.b3Friction3 = function b3Friction3(x) {
      return 0.00000045 * Math.pow(x, 3) - 0.000332 * Math.pow(x, 2) + 0.1078 * x + 5.84;
    };

    BouncyConversion.prototype.b3Nobounce = function b3Nobounce(tension) {
      var friction = 0;

      if (tension <= 18) {
        friction = this.b3Friction1(tension);
      } else if (tension > 18 && tension <= 44) {
        friction = this.b3Friction2(tension);
      } else {
        friction = this.b3Friction3(tension);
      }

      return friction;
    };

    return BouncyConversion;
  }();
  /**
   * Maintains a set of tension and friction constants
   * for a Spring. You can use fromOrigamiTensionAndFriction to convert
   * values from the [Origami](http://facebook.github.io/origami/)
   * design tool directly to Rebound spring constants.
   * @public
   */


  var SpringConfig = function () {
    /**
     * Convert an origami Spring tension and friction to Rebound spring
     * constants. If you are prototyping a design with Origami, this
     * makes it easy to make your springs behave exactly the same in
     * Rebound.
     * @public
     */
    SpringConfig.fromOrigamiTensionAndFriction = function fromOrigamiTensionAndFriction(tension, friction) {
      return new SpringConfig(tensionFromOrigamiValue(tension), frictionFromOrigamiValue(friction));
    };
    /**
     * Convert an origami PopAnimation Spring bounciness and speed to Rebound
     * spring constants. If you are using PopAnimation patches in Origami, this
     * utility will provide springs that match your prototype.
     * @public
     */


    SpringConfig.fromBouncinessAndSpeed = function fromBouncinessAndSpeed(bounciness, speed) {
      var bouncyConversion = new BouncyConversion(bounciness, speed);
      return SpringConfig.fromOrigamiTensionAndFriction(bouncyConversion.bouncyTension, bouncyConversion.bouncyFriction);
    };
    /**
     * Create a SpringConfig with no tension or a coasting spring with some
     * amount of Friction so that it does not coast infininitely.
     * @public
     */


    SpringConfig.coastingConfigWithOrigamiFriction = function coastingConfigWithOrigamiFriction(friction) {
      return new SpringConfig(0, frictionFromOrigamiValue(friction));
    };

    function SpringConfig(tension, friction) {
      classCallCheck(this, SpringConfig);
      this.tension = tension;
      this.friction = friction;
    }

    return SpringConfig;
  }();

  SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG = SpringConfig.fromOrigamiTensionAndFriction(40, 7);
  /**
   * Consists of a position and velocity. A Spring uses
   * this internally to keep track of its current and prior position and
   * velocity values.
   */

  var PhysicsState = function PhysicsState() {
    classCallCheck(this, PhysicsState);
    this.position = 0;
    this.velocity = 0;
  };
  /**
   * Provides a model of a classical spring acting to
   * resolve a body to equilibrium. Springs have configurable
   * tension which is a force multipler on the displacement of the
   * spring from its rest point or `endValue` as defined by [Hooke's
   * law](http://en.wikipedia.org/wiki/Hooke's_law). Springs also have
   * configurable friction, which ensures that they do not oscillate
   * infinitely. When a Spring is displaced by updating it's resting
   * or `currentValue`, the SpringSystems that contain that Spring
   * will automatically start looping to solve for equilibrium. As each
   * timestep passes, `SpringListener` objects attached to the Spring
   * will be notified of the updates providing a way to drive an
   * animation off of the spring's resolution curve.
   * @public
   */


  var Spring = function () {
    function Spring(springSystem) {
      classCallCheck(this, Spring);
      this.listeners = [];
      this._startValue = 0;
      this._currentState = new PhysicsState();
      this._displacementFromRestThreshold = 0.001;
      this._endValue = 0;
      this._overshootClampingEnabled = false;
      this._previousState = new PhysicsState();
      this._restSpeedThreshold = 0.001;
      this._tempState = new PhysicsState();
      this._timeAccumulator = 0;
      this._wasAtRest = true;
      this._id = 's' + Spring._ID++;
      this._springSystem = springSystem;
    }
    /**
     * Remove a Spring from simulation and clear its listeners.
     * @public
     */


    Spring.prototype.destroy = function destroy() {
      this.listeners = [];

      this._springSystem.deregisterSpring(this);
    };
    /**
     * Get the id of the spring, which can be used to retrieve it from
     * the SpringSystems it participates in later.
     * @public
     */


    Spring.prototype.getId = function getId() {
      return this._id;
    };
    /**
     * Set the configuration values for this Spring. A SpringConfig
     * contains the tension and friction values used to solve for the
     * equilibrium of the Spring in the physics loop.
     * @public
     */


    Spring.prototype.setSpringConfig = function setSpringConfig(springConfig) {
      this._springConfig = springConfig;
      return this;
    };
    /**
     * Retrieve the SpringConfig used by this Spring.
     * @public
     */


    Spring.prototype.getSpringConfig = function getSpringConfig() {
      return this._springConfig;
    };
    /**
     * Set the current position of this Spring. Listeners will be updated
     * with this value immediately. If the rest or `endValue` is not
     * updated to match this value, then the spring will be dispalced and
     * the SpringSystem will start to loop to restore the spring to the
     * `endValue`.
     *
     * A common pattern is to move a Spring around without animation by
     * calling.
     *
     * ```
     * spring.setCurrentValue(n).setAtRest();
     * ```
     *
     * This moves the Spring to a new position `n`, sets the endValue
     * to `n`, and removes any velocity from the `Spring`. By doing
     * this you can allow the `SpringListener` to manage the position
     * of UI elements attached to the spring even when moving without
     * animation. For example, when dragging an element you can
     * update the position of an attached view through a spring
     * by calling `spring.setCurrentValue(x)`. When
     * the gesture ends you can update the Springs
     * velocity and endValue
     * `spring.setVelocity(gestureEndVelocity).setEndValue(flingTarget)`
     * to cause it to naturally animate the UI element to the resting
     * position taking into account existing velocity. The codepaths for
     * synchronous movement and spring driven animation can
     * be unified using this technique.
     * @public
     */


    Spring.prototype.setCurrentValue = function setCurrentValue(currentValue, skipSetAtRest) {
      this._startValue = currentValue;
      this._currentState.position = currentValue;

      if (!skipSetAtRest) {
        this.setAtRest();
      }

      this.notifyPositionUpdated(false, false);
      return this;
    };
    /**
     * Get the position that the most recent animation started at. This
     * can be useful for determining the number off oscillations that
     * have occurred.
     * @public
     */


    Spring.prototype.getStartValue = function getStartValue() {
      return this._startValue;
    };
    /**
     * Retrieve the current value of the Spring.
     * @public
     */


    Spring.prototype.getCurrentValue = function getCurrentValue() {
      return this._currentState.position;
    };
    /**
     * Get the absolute distance of the Spring from its resting endValue
     * position.
     * @public
     */


    Spring.prototype.getCurrentDisplacementDistance = function getCurrentDisplacementDistance() {
      return this.getDisplacementDistanceForState(this._currentState);
    };
    /**
     * Get the absolute distance of the Spring from a given state value
     */


    Spring.prototype.getDisplacementDistanceForState = function getDisplacementDistanceForState(state) {
      return Math.abs(this._endValue - state.position);
    };
    /**
     * Set the endValue or resting position of the spring. If this
     * value is different than the current value, the SpringSystem will
     * be notified and will begin running its solver loop to resolve
     * the Spring to equilibrium. Any listeners that are registered
     * for onSpringEndStateChange will also be notified of this update
     * immediately.
     * @public
     */


    Spring.prototype.setEndValue = function setEndValue(endValue) {
      if (this._endValue === endValue && this.isAtRest()) {
        return this;
      }

      this._startValue = this.getCurrentValue();
      this._endValue = endValue;

      this._springSystem.activateSpring(this.getId());

      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];
        var onChange = listener.onSpringEndStateChange;
        onChange && onChange(this);
      }

      return this;
    };
    /**
     * Retrieve the endValue or resting position of this spring.
     * @public
     */


    Spring.prototype.getEndValue = function getEndValue() {
      return this._endValue;
    };
    /**
     * Set the current velocity of the Spring, in pixels per second. As
     * previously mentioned, this can be useful when you are performing
     * a direct manipulation gesture. When a UI element is released you
     * may call setVelocity on its animation Spring so that the Spring
     * continues with the same velocity as the gesture ended with. The
     * friction, tension, and displacement of the Spring will then
     * govern its motion to return to rest on a natural feeling curve.
     * @public
     */


    Spring.prototype.setVelocity = function setVelocity(velocity) {
      if (velocity === this._currentState.velocity) {
        return this;
      }

      this._currentState.velocity = velocity;

      this._springSystem.activateSpring(this.getId());

      return this;
    };
    /**
     * Get the current velocity of the Spring, in pixels per second.
     * @public
     */


    Spring.prototype.getVelocity = function getVelocity() {
      return this._currentState.velocity;
    };
    /**
     * Set a threshold value for the movement speed of the Spring below
     * which it will be considered to be not moving or resting.
     * @public
     */


    Spring.prototype.setRestSpeedThreshold = function setRestSpeedThreshold(restSpeedThreshold) {
      this._restSpeedThreshold = restSpeedThreshold;
      return this;
    };
    /**
     * Retrieve the rest speed threshold for this Spring.
     * @public
     */


    Spring.prototype.getRestSpeedThreshold = function getRestSpeedThreshold() {
      return this._restSpeedThreshold;
    };
    /**
     * Set a threshold value for displacement below which the Spring
     * will be considered to be not displaced i.e. at its resting
     * `endValue`.
     * @public
     */


    Spring.prototype.setRestDisplacementThreshold = function setRestDisplacementThreshold(displacementFromRestThreshold) {
      this._displacementFromRestThreshold = displacementFromRestThreshold;
    };
    /**
     * Retrieve the rest displacement threshold for this spring.
     * @public
     */


    Spring.prototype.getRestDisplacementThreshold = function getRestDisplacementThreshold() {
      return this._displacementFromRestThreshold;
    };
    /**
     * Enable overshoot clamping. This means that the Spring will stop
     * immediately when it reaches its resting position regardless of
     * any existing momentum it may have. This can be useful for certain
     * types of animations that should not oscillate such as a scale
     * down to 0 or alpha fade.
     * @public
     */


    Spring.prototype.setOvershootClampingEnabled = function setOvershootClampingEnabled(enabled) {
      this._overshootClampingEnabled = enabled;
      return this;
    };
    /**
     * Check if overshoot clamping is enabled for this spring.
     * @public
     */


    Spring.prototype.isOvershootClampingEnabled = function isOvershootClampingEnabled() {
      return this._overshootClampingEnabled;
    };
    /**
     * Check if the Spring has gone past its end point by comparing
     * the direction it was moving in when it started to the current
     * position and end value.
     * @public
     */


    Spring.prototype.isOvershooting = function isOvershooting() {
      var start = this._startValue;
      var end = this._endValue;
      return this._springConfig.tension > 0 && (start < end && this.getCurrentValue() > end || start > end && this.getCurrentValue() < end);
    };
    /**
     * The main solver method for the Spring. It takes
     * the current time and delta since the last time step and performs
     * an RK4 integration to get the new position and velocity state
     * for the Spring based on the tension, friction, velocity, and
     * displacement of the Spring.
     * @public
     */


    Spring.prototype.advance = function advance(time, realDeltaTime) {
      var isAtRest = this.isAtRest();

      if (isAtRest && this._wasAtRest) {
        return;
      }

      var adjustedDeltaTime = realDeltaTime;

      if (realDeltaTime > Spring.MAX_DELTA_TIME_SEC) {
        adjustedDeltaTime = Spring.MAX_DELTA_TIME_SEC;
      }

      this._timeAccumulator += adjustedDeltaTime;
      var tension = this._springConfig.tension;
      var friction = this._springConfig.friction;
      var position = this._currentState.position;
      var velocity = this._currentState.velocity;
      var tempPosition = this._tempState.position;
      var tempVelocity = this._tempState.velocity;
      var aVelocity = void 0;
      var aAcceleration = void 0;
      var bVelocity = void 0;
      var bAcceleration = void 0;
      var cVelocity = void 0;
      var cAcceleration = void 0;
      var dVelocity = void 0;
      var dAcceleration = void 0;
      var dxdt = void 0;
      var dvdt = void 0;

      while (this._timeAccumulator >= Spring.SOLVER_TIMESTEP_SEC) {
        this._timeAccumulator -= Spring.SOLVER_TIMESTEP_SEC;

        if (this._timeAccumulator < Spring.SOLVER_TIMESTEP_SEC) {
          this._previousState.position = position;
          this._previousState.velocity = velocity;
        }

        aVelocity = velocity;
        aAcceleration = tension * (this._endValue - tempPosition) - friction * velocity;
        tempPosition = position + aVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + aAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        bVelocity = tempVelocity;
        bAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;
        tempPosition = position + bVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + bAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        cVelocity = tempVelocity;
        cAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;
        tempPosition = position + cVelocity * Spring.SOLVER_TIMESTEP_SEC;
        tempVelocity = velocity + cAcceleration * Spring.SOLVER_TIMESTEP_SEC;
        dVelocity = tempVelocity;
        dAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;
        dxdt = 1.0 / 6.0 * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
        dvdt = 1.0 / 6.0 * (aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration);
        position += dxdt * Spring.SOLVER_TIMESTEP_SEC;
        velocity += dvdt * Spring.SOLVER_TIMESTEP_SEC;
      }

      this._tempState.position = tempPosition;
      this._tempState.velocity = tempVelocity;
      this._currentState.position = position;
      this._currentState.velocity = velocity;

      if (this._timeAccumulator > 0) {
        this._interpolate(this._timeAccumulator / Spring.SOLVER_TIMESTEP_SEC);
      }

      if (this.isAtRest() || this._overshootClampingEnabled && this.isOvershooting()) {
        if (this._springConfig.tension > 0) {
          this._startValue = this._endValue;
          this._currentState.position = this._endValue;
        } else {
          this._endValue = this._currentState.position;
          this._startValue = this._endValue;
        }

        this.setVelocity(0);
        isAtRest = true;
      }

      var notifyActivate = false;

      if (this._wasAtRest) {
        this._wasAtRest = false;
        notifyActivate = true;
      }

      var notifyAtRest = false;

      if (isAtRest) {
        this._wasAtRest = true;
        notifyAtRest = true;
      }

      this.notifyPositionUpdated(notifyActivate, notifyAtRest);
    };

    Spring.prototype.notifyPositionUpdated = function notifyPositionUpdated(notifyActivate, notifyAtRest) {
      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];

        if (notifyActivate && listener.onSpringActivate) {
          listener.onSpringActivate(this);
        }

        if (listener.onSpringUpdate) {
          listener.onSpringUpdate(this);
        }

        if (notifyAtRest && listener.onSpringAtRest) {
          listener.onSpringAtRest(this);
        }
      }
    };
    /**
     * Check if the SpringSystem should advance. Springs are advanced
     * a final frame after they reach equilibrium to ensure that the
     * currentValue is exactly the requested endValue regardless of the
     * displacement threshold.
     * @public
     */


    Spring.prototype.systemShouldAdvance = function systemShouldAdvance() {
      return !this.isAtRest() || !this.wasAtRest();
    };

    Spring.prototype.wasAtRest = function wasAtRest() {
      return this._wasAtRest;
    };
    /**
     * Check if the Spring is atRest meaning that it's currentValue and
     * endValue are the same and that it has no velocity. The previously
     * described thresholds for speed and displacement define the bounds
     * of this equivalence check. If the Spring has 0 tension, then it will
     * be considered at rest whenever its absolute velocity drops below the
     * restSpeedThreshold.
     * @public
     */


    Spring.prototype.isAtRest = function isAtRest() {
      return Math.abs(this._currentState.velocity) < this._restSpeedThreshold && (this.getDisplacementDistanceForState(this._currentState) <= this._displacementFromRestThreshold || this._springConfig.tension === 0);
    };
    /**
     * Force the spring to be at rest at its current position. As
     * described in the documentation for setCurrentValue, this method
     * makes it easy to do synchronous non-animated updates to ui
     * elements that are attached to springs via SpringListeners.
     * @public
     */


    Spring.prototype.setAtRest = function setAtRest() {
      this._endValue = this._currentState.position;
      this._tempState.position = this._currentState.position;
      this._currentState.velocity = 0;
      return this;
    };

    Spring.prototype._interpolate = function _interpolate(alpha) {
      this._currentState.position = this._currentState.position * alpha + this._previousState.position * (1 - alpha);
      this._currentState.velocity = this._currentState.velocity * alpha + this._previousState.velocity * (1 - alpha);
    };

    Spring.prototype.getListeners = function getListeners() {
      return this.listeners;
    };

    Spring.prototype.addListener = function addListener(newListener) {
      this.listeners.push(newListener);
      return this;
    };

    Spring.prototype.removeListener = function removeListener(listenerToRemove) {
      removeFirst(this.listeners, listenerToRemove);
      return this;
    };

    Spring.prototype.removeAllListeners = function removeAllListeners() {
      this.listeners = [];
      return this;
    };

    Spring.prototype.currentValueIsApproximately = function currentValueIsApproximately(value) {
      return Math.abs(this.getCurrentValue() - value) <= this.getRestDisplacementThreshold();
    };

    return Spring;
  }();

  Spring._ID = 0;
  Spring.MAX_DELTA_TIME_SEC = 0.064;
  Spring.SOLVER_TIMESTEP_SEC = 0.001;
  /**
   * A set of Springs that all run on the same physics
   * timing loop. To get started with a Rebound animation, first
   * create a new SpringSystem and then add springs to it.
   * @public
   */

  var SpringSystem = function () {
    function SpringSystem(looper) {
      classCallCheck(this, SpringSystem);
      this.listeners = [];
      this._activeSprings = [];
      this._idleSpringIndices = [];
      this._isIdle = true;
      this._lastTimeMillis = -1;
      this._springRegistry = {};
      this.looper = looper || new AnimationLooper();
      this.looper.springSystem = this;
    }
    /**
     * A SpringSystem is iterated by a looper. The looper is responsible
     * for executing each frame as the SpringSystem is resolved to idle.
     * There are three types of Loopers described below AnimationLooper,
     * SimulationLooper, and SteppingSimulationLooper. AnimationLooper is
     * the default as it is the most useful for common UI animations.
     * @public
     */


    SpringSystem.prototype.setLooper = function setLooper(looper) {
      this.looper = looper;
      looper.springSystem = this;
    };
    /**
     * Add a new spring to this SpringSystem. This Spring will now be solved for
     * during the physics iteration loop. By default the spring will use the
     * default Origami spring config with 40 tension and 7 friction, but you can
     * also provide your own values here.
     * @public
     */


    SpringSystem.prototype.createSpring = function createSpring(tension, friction) {
      var springConfig = void 0;

      if (tension === undefined || friction === undefined) {
        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
      } else {
        springConfig = SpringConfig.fromOrigamiTensionAndFriction(tension, friction);
      }

      return this.createSpringWithConfig(springConfig);
    };
    /**
     * Add a spring with a specified bounciness and speed. To replicate Origami
     * compositions based on PopAnimation patches, use this factory method to
     * create matching springs.
     * @public
     */


    SpringSystem.prototype.createSpringWithBouncinessAndSpeed = function createSpringWithBouncinessAndSpeed(bounciness, speed) {
      var springConfig = void 0;

      if (bounciness === undefined || speed === undefined) {
        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
      } else {
        springConfig = SpringConfig.fromBouncinessAndSpeed(bounciness, speed);
      }

      return this.createSpringWithConfig(springConfig);
    };
    /**
     * Add a spring with the provided SpringConfig.
     * @public
     */


    SpringSystem.prototype.createSpringWithConfig = function createSpringWithConfig(springConfig) {
      var spring = new Spring(this);
      this.registerSpring(spring);
      spring.setSpringConfig(springConfig);
      return spring;
    };
    /**
     * Check if a SpringSystem is idle or active. If all of the Springs in the
     * SpringSystem are at rest, i.e. the physics forces have reached equilibrium,
     * then this method will return true.
     * @public
     */


    SpringSystem.prototype.getIsIdle = function getIsIdle() {
      return this._isIdle;
    };
    /**
     * Retrieve a specific Spring from the SpringSystem by id. This
     * can be useful for inspecting the state of a spring before
     * or after an integration loop in the SpringSystem executes.
     * @public
     */


    SpringSystem.prototype.getSpringById = function getSpringById(id) {
      return this._springRegistry[id];
    };
    /**
     * Get a listing of all the springs registered with this
     * SpringSystem.
     * @public
     */


    SpringSystem.prototype.getAllSprings = function getAllSprings() {
      var vals = [];

      for (var _id in this._springRegistry) {
        if (this._springRegistry.hasOwnProperty(_id)) {
          vals.push(this._springRegistry[_id]);
        }
      }

      return vals;
    };
    /**
     * Manually add a spring to this system. This is called automatically
     * if a Spring is created with SpringSystem#createSpring.
     *
     * This method sets the spring up in the registry so that it can be solved
     * in the solver loop.
     * @public
     */


    SpringSystem.prototype.registerSpring = function registerSpring(spring) {
      this._springRegistry[spring.getId()] = spring;
    };
    /**
     * Deregister a spring with this SpringSystem. The SpringSystem will
     * no longer consider this Spring during its integration loop once
     * this is called. This is normally done automatically for you when
     * you call Spring#destroy.
     * @public
     */


    SpringSystem.prototype.deregisterSpring = function deregisterSpring(spring) {
      removeFirst(this._activeSprings, spring);
      delete this._springRegistry[spring.getId()];
    };

    SpringSystem.prototype.advance = function advance(time, deltaTime) {
      while (this._idleSpringIndices.length > 0) {
        this._idleSpringIndices.pop();
      }

      for (var i = 0, len = this._activeSprings.length; i < len; i++) {
        var spring = this._activeSprings[i];

        if (spring.systemShouldAdvance()) {
          spring.advance(time / 1000.0, deltaTime / 1000.0);
        } else {
          this._idleSpringIndices.push(this._activeSprings.indexOf(spring));
        }
      }

      while (this._idleSpringIndices.length > 0) {
        var idx = this._idleSpringIndices.pop();

        idx >= 0 && this._activeSprings.splice(idx, 1);
      }
    };
    /**
     * This is the main solver loop called to move the simulation
     * forward through time. Before each pass in the solver loop
     * onBeforeIntegrate is called on an any listeners that have
     * registered themeselves with the SpringSystem. This gives you
     * an opportunity to apply any constraints or adjustments to
     * the springs that should be enforced before each iteration
     * loop. Next the advance method is called to move each Spring in
     * the systemShouldAdvance forward to the current time. After the
     * integration step runs in advance, onAfterIntegrate is called
     * on any listeners that have registered themselves with the
     * SpringSystem. This gives you an opportunity to run any post
     * integration constraints or adjustments on the Springs in the
     * SpringSystem.
     * @public
     */


    SpringSystem.prototype.loop = function loop(currentTimeMillis) {
      var listener = void 0;

      if (this._lastTimeMillis === -1) {
        this._lastTimeMillis = currentTimeMillis - 1;
      }

      var ellapsedMillis = currentTimeMillis - this._lastTimeMillis;
      this._lastTimeMillis = currentTimeMillis;
      var i = 0;
      var len = this.listeners.length;

      for (i = 0; i < len; i++) {
        listener = this.listeners[i];
        listener.onBeforeIntegrate && listener.onBeforeIntegrate(this);
      }

      this.advance(currentTimeMillis, ellapsedMillis);

      if (this._activeSprings.length === 0) {
        this._isIdle = true;
        this._lastTimeMillis = -1;
      }

      for (i = 0; i < len; i++) {
        listener = this.listeners[i];
        listener.onAfterIntegrate && listener.onAfterIntegrate(this);
      }

      if (!this._isIdle) {
        this.looper.run();
      }
    };
    /**
     * Used to notify the SpringSystem that a Spring has become displaced.
     * The system responds by starting its solver loop up if it is currently idle.
     */


    SpringSystem.prototype.activateSpring = function activateSpring(springId) {
      var spring = this._springRegistry[springId];

      if (this._activeSprings.indexOf(spring) === -1) {
        this._activeSprings.push(spring);
      }

      if (this.getIsIdle()) {
        this._isIdle = false;
        this.looper.run();
      }
    };
    /**
     * Add a listener to the SpringSystem to receive before/after integration
     * notifications allowing Springs to be constrained or adjusted.
     * @public
     */


    SpringSystem.prototype.addListener = function addListener(listener) {
      this.listeners.push(listener);
    };
    /**
     * Remove a previously added listener on the SpringSystem.
     * @public
     */


    SpringSystem.prototype.removeListener = function removeListener(listener) {
      removeFirst(this.listeners, listener);
    };
    /**
     * Remove all previously added listeners on the SpringSystem.
     * @public
     */


    SpringSystem.prototype.removeAllListeners = function removeAllListeners() {
      this.listeners = [];
    };

    return SpringSystem;
  }();

  var index = _extends({}, Loopers, {
    OrigamiValueConverter: OrigamiValueConverter,
    MathUtil: MathUtil,
    Spring: Spring,
    SpringConfig: SpringConfig,
    SpringSystem: SpringSystem,
    util: _extends({}, util, MathUtil)
  });

  return index;
});
},{"process":"node_modules/process/browser.js"}],"node_modules/@oberon-amsterdam/horizontal/index.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var rebound_1 = require("rebound");
var SCROLL_AMOUNT = 100;
var SCROLL_AMOUNT_STEP = SCROLL_AMOUNT * 10;
var HorizontalScroll = /** @class */ (function (_super) {
    __extends(HorizontalScroll, _super);
    /**
     * Initialize a new horizontal scroll instance.
     * Will immediately bind to container.
     *
     */
    function HorizontalScroll(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.scrollAmount, scrollAmount = _c === void 0 ? SCROLL_AMOUNT : _c, _d = _b.scrollAmountStep, scrollAmountStep = _d === void 0 ? SCROLL_AMOUNT_STEP : _d, _e = _b.container, container = _e === void 0 ? document.documentElement : _e, _f = _b.showScrollbars, showScrollbars = _f === void 0 ? false : _f, _g = _b.preventVerticalScroll, preventVerticalScroll = _g === void 0 ? false : _g;
        var _this = _super.call(this) || this;
        _this.observer = null;
        _this.containerIsIntersecting = false;
        _this.style = null;
        _this.cssClass = "__horizontal-container-" + Math.round(Math.random() * 100000);
        _this.preventVerticalScroll = false;
        // ignore keydown events when any of these elements are focused
        _this.blacklist = ['input', 'select', 'textarea'];
        _this.wheel = function (e) {
            var angle = Math.atan2(e.deltaY, e.deltaX) / Math.PI;
            var forward = !(angle < 0.675 && angle > -0.375);
            var offset = Math.sqrt(Math.pow(e.deltaX, 2) + Math.pow(e.deltaY, 2));
            if (_this.preventVerticalScroll) {
                return;
            }
            switch (e.deltaMode) {
                case WheelEvent.DOM_DELTA_LINE:
                    offset *= SCROLL_AMOUNT;
                    break;
                case WheelEvent.DOM_DELTA_PAGE:
                    offset *= SCROLL_AMOUNT_STEP;
                    break;
                default:
                    break;
            }
            if (forward) {
                offset *= -1;
            }
            var distance = Math.max(_this.container.scrollLeft + offset, 0);
            if (distance < _this.container.scrollWidth - _this.container.clientWidth) {
                if (e.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
                    // force spring to new value & don't animate
                    _this.spring.setCurrentValue(distance);
                }
                else {
                    _this.spring.setEndValue(distance);
                }
            }
        };
        _this.keydown = function (e) {
            // only listen to key events if the container actually is in view
            if (_this.observer && !_this.containerIsIntersecting) {
                return;
            }
            var target = e.target;
            // if any blacklisted elements are focused, we'll won't handle this keydown.
            if (target &&
                target !== document.body &&
                _this.blacklist.includes(target.nodeName.toLowerCase())) {
                return;
            }
            var scrollValue = _this.container.scrollLeft;
            var max = _this.container.scrollWidth - _this.container.clientWidth;
            var prevent = true;
            switch (e.code) {
                case 'Home':
                    scrollValue = 0;
                    break;
                case 'End':
                    scrollValue = max;
                    break;
                case 'ArrowUp':
                    if (_this.preventVerticalScroll) {
                        prevent = true;
                        break;
                    }
                    else {
                        scrollValue -= SCROLL_AMOUNT;
                        break;
                    }
                case 'ArrowDown':
                    if (_this.preventVerticalScroll) {
                        prevent = true;
                        break;
                    }
                    else {
                        scrollValue += SCROLL_AMOUNT;
                        break;
                    }
                case 'ArrowLeft':
                    scrollValue -= SCROLL_AMOUNT;
                    break;
                case 'ArrowRight':
                    scrollValue += SCROLL_AMOUNT;
                    break;
                case 'PageUp':
                    scrollValue -= SCROLL_AMOUNT_STEP;
                    break;
                case 'PageDown':
                case 'Space':
                    scrollValue += SCROLL_AMOUNT_STEP;
                    break;
                default:
                    prevent = false;
                    break;
            }
            // correct scroll value if it's out of bounds
            scrollValue = Math.max(scrollValue, 0);
            scrollValue = Math.min(scrollValue, max);
            // if nothing changed, do nothing
            if (scrollValue === _this.spring.getEndValue()) {
                return;
            }
            if (prevent) {
                e.preventDefault();
            }
            if (_this.spring) {
                if (_this.spring.isAtRest()) {
                    _this.spring.setCurrentValue(_this.container.scrollLeft);
                }
                _this.spring.setEndValue(scrollValue);
            }
        };
        if (typeof container === 'undefined') {
            return _this;
        }
        _this.preventVerticalScroll = preventVerticalScroll;
        // bind events
        _this.container = container;
        _this.container.addEventListener('wheel', _this.wheel);
        document.addEventListener('keydown', _this.keydown);
        // set up interaction observer
        if (_this.container !== document.documentElement) {
            if ('IntersectionObserver' in window) {
                _this.observer = new IntersectionObserver(function (_a) {
                    var _b = __read(_a, 1), entry = _b[0];
                    _this.containerIsIntersecting = entry.isIntersecting;
                });
                _this.observer.observe(_this.container);
            }
            else {
                // tslint:disable-next-line:no-console
                console.warn('[horizontal-scroll] WARN: IntersectionObserver not available, assuming key navigation is always applicable to your container.');
            }
        }
        // add CSS to hide scrollbars
        if (!showScrollbars) {
            _this.container.classList.add(_this.cssClass);
            _this.style = document.createElement('style');
            document.head.appendChild(_this.style);
            var sheet = _this.style.sheet;
            if (sheet) {
                sheet.insertRule("\n                        ." + _this.cssClass + " {\n                            overflow-y: hidden;\n                            overflow-x: auto;\n\n                            /* prevents unwanted gestures and bounce effects */\n                            overscroll-behavior: auto;\n\n                            /* vendor specific hacks to hide scrollbars */\n                            scrollbar-width: none;\n                            -ms-overflow-style: none;\n                        }\n                    ");
                var webkitCss = "::-webkit-scrollbar { display: none; }";
                if (_this.container !== document.documentElement) {
                    webkitCss = "." + _this.cssClass + webkitCss;
                }
                sheet.insertRule(webkitCss);
            }
        }
        // init spring
        _this.springSystem = new rebound_1.SpringSystem();
        _this.spring = _this.springSystem.createSpring();
        _this.spring.setCurrentValue(_this.container.scrollLeft);
        _this.spring.setOvershootClampingEnabled(true);
        _this.spring.addListener({
            onSpringUpdate: function (currSpring) {
                var value = currSpring.getCurrentValue();
                _this.emit('scroll', value);
                // disallow gestures on the vertical axis. also disallow on horizontal when we've scrolled
                _this.container.style.overscrollBehaviorY = 'none';
                _this.container.style.overscrollBehaviorX = value > 0 ? 'none' : 'auto';
                _this.container.scrollLeft = value;
            },
        });
        _this.spring.notifyPositionUpdated();
        return _this;
    }
    HorizontalScroll.prototype.destroy = function () {
        if (typeof this.container === 'undefined') {
            return;
        }
        this.container.removeEventListener('wheel', this.wheel);
        document.removeEventListener('keydown', this.keydown);
        if (this.style) {
            this.style.remove();
        }
        this.container.classList.remove(this.cssClass);
        this.spring.destroy();
        this.springSystem.removeAllListeners();
        if (this.observer) {
            this.observer.disconnect();
        }
    };
    return HorizontalScroll;
}(events_1.EventEmitter));
exports.default = HorizontalScroll;

},{"events":"node_modules/events/events.js","rebound":"node_modules/rebound/dist/rebound.js"}],"node_modules/is-dom-node/dist/is-dom-node.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! @license is-dom-node v1.0.4

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
function isDomNode(x) {
  return typeof window.Node === 'object' ? x instanceof window.Node : x !== null && typeof x === 'object' && typeof x.nodeType === 'number' && typeof x.nodeName === 'string';
}

var _default = isDomNode;
exports.default = _default;
},{}],"node_modules/is-dom-node-list/dist/is-dom-node-list.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isDomNode = _interopRequireDefault(require("is-dom-node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*! @license is-dom-node-list v1.2.1

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
function isDomNodeList(x) {
  var prototypeToString = Object.prototype.toString.call(x);
  var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;
  return typeof window.NodeList === 'object' ? x instanceof window.NodeList : x !== null && typeof x === 'object' && typeof x.length === 'number' && regex.test(prototypeToString) && (x.length === 0 || (0, _isDomNode.default)(x[0]));
}

var _default = isDomNodeList;
exports.default = _default;
},{"is-dom-node":"node_modules/is-dom-node/dist/is-dom-node.es.js"}],"node_modules/tealight/dist/tealight.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isDomNode = _interopRequireDefault(require("is-dom-node"));

var _isDomNodeList = _interopRequireDefault(require("is-dom-node-list"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*! @license Tealight v0.3.6

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
function tealight(target, context) {
  if (context === void 0) context = document;

  if (target instanceof Array) {
    return target.filter(_isDomNode.default);
  }

  if ((0, _isDomNode.default)(target)) {
    return [target];
  }

  if ((0, _isDomNodeList.default)(target)) {
    return Array.prototype.slice.call(target);
  }

  if (typeof target === "string") {
    try {
      var query = context.querySelectorAll(target);
      return Array.prototype.slice.call(query);
    } catch (err) {
      return [];
    }
  }

  return [];
}

var _default = tealight;
exports.default = _default;
},{"is-dom-node":"node_modules/is-dom-node/dist/is-dom-node.es.js","is-dom-node-list":"node_modules/is-dom-node-list/dist/is-dom-node-list.es.js"}],"node_modules/rematrix/dist/rematrix.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.identity = identity;
exports.inverse = inverse;
exports.multiply = multiply;
exports.parse = parse;
exports.rotate = rotate;
exports.rotateX = rotateX;
exports.rotateY = rotateY;
exports.rotateZ = rotateZ;
exports.scale = scale;
exports.scaleX = scaleX;
exports.scaleY = scaleY;
exports.scaleZ = scaleZ;
exports.skew = skew;
exports.skewX = skewX;
exports.skewY = skewY;
exports.toString = toString;
exports.translate = translate;
exports.translateX = translateX;
exports.translateY = translateY;
exports.translateZ = translateZ;

/*! @license Rematrix v0.3.0

	Copyright 2018 Julian Lloyd.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/**
 * @module Rematrix
 */

/**
 * Transformation matrices in the browser come in two flavors:
 *
 *  - `matrix` using 6 values (short)
 *  - `matrix3d` using 16 values (long)
 *
 * This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
 * to expand short form matrices to their equivalent long form.
 *
 * @param  {array} source - Accepts both short and long form matrices.
 * @return {array}
 */
function format(source) {
  if (source.constructor !== Array) {
    throw new TypeError('Expected array.');
  }

  if (source.length === 16) {
    return source;
  }

  if (source.length === 6) {
    var matrix = identity();
    matrix[0] = source[0];
    matrix[1] = source[1];
    matrix[4] = source[2];
    matrix[5] = source[3];
    matrix[12] = source[4];
    matrix[13] = source[5];
    return matrix;
  }

  throw new RangeError('Expected array with either 6 or 16 values.');
}
/**
 * Returns a matrix representing no transformation. The product of any matrix
 * multiplied by the identity matrix will be the original matrix.
 *
 * > **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity.
 *
 * @return {array}
 */


function identity() {
  var matrix = [];

  for (var i = 0; i < 16; i++) {
    i % 5 == 0 ? matrix.push(1) : matrix.push(0);
  }

  return matrix;
}
/**
 * Returns a matrix describing the inverse transformation of the source
 * matrix. The product of any matrix multiplied by its inverse will be the
 * identity matrix.
 *
 * > **Tip:** Similar to how `5 * (1/5) === 1`, where `1/5` is the inverse.
 *
 * @param  {array} source - Accepts both short and long form matrices.
 * @return {array}
 */


function inverse(source) {
  var m = format(source);
  var s0 = m[0] * m[5] - m[4] * m[1];
  var s1 = m[0] * m[6] - m[4] * m[2];
  var s2 = m[0] * m[7] - m[4] * m[3];
  var s3 = m[1] * m[6] - m[5] * m[2];
  var s4 = m[1] * m[7] - m[5] * m[3];
  var s5 = m[2] * m[7] - m[6] * m[3];
  var c5 = m[10] * m[15] - m[14] * m[11];
  var c4 = m[9] * m[15] - m[13] * m[11];
  var c3 = m[9] * m[14] - m[13] * m[10];
  var c2 = m[8] * m[15] - m[12] * m[11];
  var c1 = m[8] * m[14] - m[12] * m[10];
  var c0 = m[8] * m[13] - m[12] * m[9];
  var determinant = 1 / (s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0);

  if (isNaN(determinant) || determinant === Infinity) {
    throw new Error('Inverse determinant attempted to divide by zero.');
  }

  return [(m[5] * c5 - m[6] * c4 + m[7] * c3) * determinant, (-m[1] * c5 + m[2] * c4 - m[3] * c3) * determinant, (m[13] * s5 - m[14] * s4 + m[15] * s3) * determinant, (-m[9] * s5 + m[10] * s4 - m[11] * s3) * determinant, (-m[4] * c5 + m[6] * c2 - m[7] * c1) * determinant, (m[0] * c5 - m[2] * c2 + m[3] * c1) * determinant, (-m[12] * s5 + m[14] * s2 - m[15] * s1) * determinant, (m[8] * s5 - m[10] * s2 + m[11] * s1) * determinant, (m[4] * c4 - m[5] * c2 + m[7] * c0) * determinant, (-m[0] * c4 + m[1] * c2 - m[3] * c0) * determinant, (m[12] * s4 - m[13] * s2 + m[15] * s0) * determinant, (-m[8] * s4 + m[9] * s2 - m[11] * s0) * determinant, (-m[4] * c3 + m[5] * c1 - m[6] * c0) * determinant, (m[0] * c3 - m[1] * c1 + m[2] * c0) * determinant, (-m[12] * s3 + m[13] * s1 - m[14] * s0) * determinant, (m[8] * s3 - m[9] * s1 + m[10] * s0) * determinant];
}
/**
 * Returns a 4x4 matrix describing the combined transformations
 * of both arguments.
 *
 * > **Note:** Order is very important. For example, rotating 45°
 * along the Z-axis, followed by translating 500 pixels along the
 * Y-axis... is not the same as translating 500 pixels along the
 * Y-axis, followed by rotating 45° along on the Z-axis.
 *
 * @param  {array} m - Accepts both short and long form matrices.
 * @param  {array} x - Accepts both short and long form matrices.
 * @return {array}
 */


function multiply(m, x) {
  var fm = format(m);
  var fx = format(x);
  var product = [];

  for (var i = 0; i < 4; i++) {
    var row = [fm[i], fm[i + 4], fm[i + 8], fm[i + 12]];

    for (var j = 0; j < 4; j++) {
      var k = j * 4;
      var col = [fx[k], fx[k + 1], fx[k + 2], fx[k + 3]];
      var result = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];
      product[i + k] = result;
    }
  }

  return product;
}
/**
 * Attempts to return a 4x4 matrix describing the CSS transform
 * matrix passed in, but will return the identity matrix as a
 * fallback.
 *
 * > **Tip:** This method is used to convert a CSS matrix (retrieved as a
 * `string` from computed styles) to its equivalent array format.
 *
 * @param  {string} source - `matrix` or `matrix3d` CSS Transform value.
 * @return {array}
 */


function parse(source) {
  if (typeof source === 'string') {
    var match = source.match(/matrix(3d)?\(([^)]+)\)/);

    if (match) {
      var raw = match[2].split(', ').map(parseFloat);
      return format(raw);
    }
  }

  return identity();
}
/**
 * Returns a 4x4 matrix describing Z-axis rotation.
 *
 * > **Tip:** This is just an alias for `Rematrix.rotateZ` for parity with CSS
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */


function rotate(angle) {
  return rotateZ(angle);
}
/**
 * Returns a 4x4 matrix describing X-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */


function rotateX(angle) {
  var theta = Math.PI / 180 * angle;
  var matrix = identity();
  matrix[5] = matrix[10] = Math.cos(theta);
  matrix[6] = matrix[9] = Math.sin(theta);
  matrix[9] *= -1;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing Y-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */


function rotateY(angle) {
  var theta = Math.PI / 180 * angle;
  var matrix = identity();
  matrix[0] = matrix[10] = Math.cos(theta);
  matrix[2] = matrix[8] = Math.sin(theta);
  matrix[2] *= -1;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing Z-axis rotation.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */


function rotateZ(angle) {
  var theta = Math.PI / 180 * angle;
  var matrix = identity();
  matrix[0] = matrix[5] = Math.cos(theta);
  matrix[1] = matrix[4] = Math.sin(theta);
  matrix[4] *= -1;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing 2D scaling. The first argument
 * is used for both X and Y-axis scaling, unless an optional
 * second argument is provided to explicitly define Y-axis scaling.
 *
 * @param  {number} scalar    - Decimal multiplier.
 * @param  {number} [scalarY] - Decimal multiplier.
 * @return {array}
 */


function scale(scalar, scalarY) {
  var matrix = identity();
  matrix[0] = scalar;
  matrix[5] = typeof scalarY === 'number' ? scalarY : scalar;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing X-axis scaling.
 *
 * @param  {number} scalar - Decimal multiplier.
 * @return {array}
 */


function scaleX(scalar) {
  var matrix = identity();
  matrix[0] = scalar;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing Y-axis scaling.
 *
 * @param  {number} scalar - Decimal multiplier.
 * @return {array}
 */


function scaleY(scalar) {
  var matrix = identity();
  matrix[5] = scalar;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing Z-axis scaling.
 *
 * @param  {number} scalar - Decimal multiplier.
 * @return {array}
 */


function scaleZ(scalar) {
  var matrix = identity();
  matrix[10] = scalar;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing shear. The first argument
 * defines X-axis shearing, and an optional second argument
 * defines Y-axis shearing.
 *
 * @param  {number} angleX   - Measured in degrees.
 * @param  {number} [angleY] - Measured in degrees.
 * @return {array}
 */


function skew(angleX, angleY) {
  var thetaX = Math.PI / 180 * angleX;
  var matrix = identity();
  matrix[4] = Math.tan(thetaX);

  if (angleY) {
    var thetaY = Math.PI / 180 * angleY;
    matrix[1] = Math.tan(thetaY);
  }

  return matrix;
}
/**
 * Returns a 4x4 matrix describing X-axis shear.
 *
 * @param  {number} angle - Measured in degrees.
 * @return {array}
 */


function skewX(angle) {
  var theta = Math.PI / 180 * angle;
  var matrix = identity();
  matrix[4] = Math.tan(theta);
  return matrix;
}
/**
 * Returns a 4x4 matrix describing Y-axis shear.
 *
 * @param  {number} angle - Measured in degrees
 * @return {array}
 */


function skewY(angle) {
  var theta = Math.PI / 180 * angle;
  var matrix = identity();
  matrix[1] = Math.tan(theta);
  return matrix;
}
/**
 * Returns a CSS Transform property value equivalent to the source matrix.
 *
 * @param  {array} source - Accepts both short and long form matrices.
 * @return {string}
 */


function toString(source) {
  return "matrix3d(" + format(source).join(', ') + ")";
}
/**
 * Returns a 4x4 matrix describing 2D translation. The first
 * argument defines X-axis translation, and an optional second
 * argument defines Y-axis translation.
 *
 * @param  {number} distanceX   - Measured in pixels.
 * @param  {number} [distanceY] - Measured in pixels.
 * @return {array}
 */


function translate(distanceX, distanceY) {
  var matrix = identity();
  matrix[12] = distanceX;

  if (distanceY) {
    matrix[13] = distanceY;
  }

  return matrix;
}
/**
 * Returns a 4x4 matrix describing X-axis translation.
 *
 * @param  {number} distance - Measured in pixels.
 * @return {array}
 */


function translateX(distance) {
  var matrix = identity();
  matrix[12] = distance;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing Y-axis translation.
 *
 * @param  {number} distance - Measured in pixels.
 * @return {array}
 */


function translateY(distance) {
  var matrix = identity();
  matrix[13] = distance;
  return matrix;
}
/**
 * Returns a 4x4 matrix describing Z-axis translation.
 *
 * @param  {number} distance - Measured in pixels.
 * @return {array}
 */


function translateZ(distance) {
  var matrix = identity();
  matrix[14] = distance;
  return matrix;
}
},{}],"node_modules/miniraf/dist/miniraf.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! @license miniraf v1.0.0

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
var polyfill = function () {
  var clock = Date.now();
  return function (callback) {
    var currentTime = Date.now();

    if (currentTime - clock > 16) {
      clock = currentTime;
      callback(currentTime);
    } else {
      setTimeout(function () {
        return polyfill(callback);
      }, 0);
    }
  };
}();

var index = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || polyfill;
var _default = index;
exports.default = _default;
},{}],"node_modules/scrollreveal/dist/scrollreveal.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tealight = _interopRequireDefault(require("tealight"));

var _rematrix = require("rematrix");

var _miniraf = _interopRequireDefault(require("miniraf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*! @license ScrollReveal v4.0.6

	Copyright 2020 Fisssion LLC.

	Licensed under the GNU General Public License 3.0 for
	compatible open source projects and non-commercial use.

	For commercial sites, themes, projects, and applications,
	keep your source code private/proprietary by purchasing
	a commercial license from https://scrollrevealjs.org/
*/
var defaults = {
  delay: 0,
  distance: '0',
  duration: 600,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
  interval: 0,
  opacity: 0,
  origin: 'bottom',
  rotate: {
    x: 0,
    y: 0,
    z: 0
  },
  scale: 1,
  cleanup: false,
  container: document.documentElement,
  desktop: true,
  mobile: true,
  reset: false,
  useDelay: 'always',
  viewFactor: 0.0,
  viewOffset: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  afterReset: function afterReset() {},
  afterReveal: function afterReveal() {},
  beforeReset: function beforeReset() {},
  beforeReveal: function beforeReveal() {}
};

function failure() {
  document.documentElement.classList.remove('sr');
  return {
    clean: function clean() {},
    destroy: function destroy() {},
    reveal: function reveal() {},
    sync: function sync() {},

    get noop() {
      return true;
    }

  };
}

function success() {
  document.documentElement.classList.add('sr');

  if (document.body) {
    document.body.style.height = '100%';
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.style.height = '100%';
    });
  }
}

var mount = {
  success: success,
  failure: failure
};

function isObject(x) {
  return x !== null && x instanceof Object && (x.constructor === Object || Object.prototype.toString.call(x) === '[object Object]');
}

function each(collection, callback) {
  if (isObject(collection)) {
    var keys = Object.keys(collection);
    return keys.forEach(function (key) {
      return callback(collection[key], key, collection);
    });
  }

  if (collection instanceof Array) {
    return collection.forEach(function (item, i) {
      return callback(item, i, collection);
    });
  }

  throw new TypeError('Expected either an array or object literal.');
}

function logger(message) {
  var details = [],
      len = arguments.length - 1;

  while (len-- > 0) details[len] = arguments[len + 1];

  if (this.constructor.debug && console) {
    var report = "%cScrollReveal: " + message;
    details.forEach(function (detail) {
      return report += "\n — " + detail;
    });
    console.log(report, 'color: #ea654b;'); // eslint-disable-line no-console
  }
}

function rinse() {
  var this$1 = this;

  var struct = function () {
    return {
      active: [],
      stale: []
    };
  };

  var elementIds = struct();
  var sequenceIds = struct();
  var containerIds = struct();
  /**
   * Take stock of active element IDs.
   */

  try {
    each((0, _tealight.default)('[data-sr-id]'), function (node) {
      var id = parseInt(node.getAttribute('data-sr-id'));
      elementIds.active.push(id);
    });
  } catch (e) {
    throw e;
  }
  /**
   * Destroy stale elements.
   */


  each(this.store.elements, function (element) {
    if (elementIds.active.indexOf(element.id) === -1) {
      elementIds.stale.push(element.id);
    }
  });
  each(elementIds.stale, function (staleId) {
    return delete this$1.store.elements[staleId];
  });
  /**
   * Take stock of active container and sequence IDs.
   */

  each(this.store.elements, function (element) {
    if (containerIds.active.indexOf(element.containerId) === -1) {
      containerIds.active.push(element.containerId);
    }

    if (element.hasOwnProperty('sequence')) {
      if (sequenceIds.active.indexOf(element.sequence.id) === -1) {
        sequenceIds.active.push(element.sequence.id);
      }
    }
  });
  /**
   * Destroy stale containers.
   */

  each(this.store.containers, function (container) {
    if (containerIds.active.indexOf(container.id) === -1) {
      containerIds.stale.push(container.id);
    }
  });
  each(containerIds.stale, function (staleId) {
    var stale = this$1.store.containers[staleId].node;
    stale.removeEventListener('scroll', this$1.delegate);
    stale.removeEventListener('resize', this$1.delegate);
    delete this$1.store.containers[staleId];
  });
  /**
   * Destroy stale sequences.
   */

  each(this.store.sequences, function (sequence) {
    if (sequenceIds.active.indexOf(sequence.id) === -1) {
      sequenceIds.stale.push(sequence.id);
    }
  });
  each(sequenceIds.stale, function (staleId) {
    return delete this$1.store.sequences[staleId];
  });
}

function clean(target) {
  var this$1 = this;
  var dirty;

  try {
    each((0, _tealight.default)(target), function (node) {
      var id = node.getAttribute('data-sr-id');

      if (id !== null) {
        dirty = true;
        var element = this$1.store.elements[id];

        if (element.callbackTimer) {
          window.clearTimeout(element.callbackTimer.clock);
        }

        node.setAttribute('style', element.styles.inline.generated);
        node.removeAttribute('data-sr-id');
        delete this$1.store.elements[id];
      }
    });
  } catch (e) {
    return logger.call(this, 'Clean failed.', e.message);
  }

  if (dirty) {
    try {
      rinse.call(this);
    } catch (e) {
      return logger.call(this, 'Clean failed.', e.message);
    }
  }
}

function destroy() {
  var this$1 = this;
  /**
   * Remove all generated styles and element ids
   */

  each(this.store.elements, function (element) {
    element.node.setAttribute('style', element.styles.inline.generated);
    element.node.removeAttribute('data-sr-id');
  });
  /**
   * Remove all event listeners.
   */

  each(this.store.containers, function (container) {
    var target = container.node === document.documentElement ? window : container.node;
    target.removeEventListener('scroll', this$1.delegate);
    target.removeEventListener('resize', this$1.delegate);
  });
  /**
   * Clear all data from the store
   */

  this.store = {
    containers: {},
    elements: {},
    history: [],
    sequences: {}
  };
}

var getPrefixedCssProp = function () {
  var properties = {};
  var style = document.documentElement.style;

  function getPrefixedCssProperty(name, source) {
    if (source === void 0) source = style;

    if (name && typeof name === 'string') {
      if (properties[name]) {
        return properties[name];
      }

      if (typeof source[name] === 'string') {
        return properties[name] = name;
      }

      if (typeof source["-webkit-" + name] === 'string') {
        return properties[name] = "-webkit-" + name;
      }

      throw new RangeError("Unable to find \"" + name + "\" style property.");
    }

    throw new TypeError('Expected a string.');
  }

  getPrefixedCssProperty.clearCache = function () {
    return properties = {};
  };

  return getPrefixedCssProperty;
}();

function style(element) {
  var computed = window.getComputedStyle(element.node);
  var position = computed.position;
  var config = element.config;
  /**
   * Generate inline styles
   */

  var inline = {};
  var inlineStyle = element.node.getAttribute('style') || '';
  var inlineMatch = inlineStyle.match(/[\w-]+\s*:\s*[^;]+\s*/gi) || [];
  inline.computed = inlineMatch ? inlineMatch.map(function (m) {
    return m.trim();
  }).join('; ') + ';' : '';
  inline.generated = inlineMatch.some(function (m) {
    return m.match(/visibility\s?:\s?visible/i);
  }) ? inline.computed : inlineMatch.concat(['visibility: visible']).map(function (m) {
    return m.trim();
  }).join('; ') + ';';
  /**
   * Generate opacity styles
   */

  var computedOpacity = parseFloat(computed.opacity);
  var configOpacity = !isNaN(parseFloat(config.opacity)) ? parseFloat(config.opacity) : parseFloat(computed.opacity);
  var opacity = {
    computed: computedOpacity !== configOpacity ? "opacity: " + computedOpacity + ";" : '',
    generated: computedOpacity !== configOpacity ? "opacity: " + configOpacity + ";" : ''
  };
  /**
   * Generate transformation styles
   */

  var transformations = [];

  if (parseFloat(config.distance)) {
    var axis = config.origin === 'top' || config.origin === 'bottom' ? 'Y' : 'X';
    /**
     * Let’s make sure our our pixel distances are negative for top and left.
     * e.g. { origin: 'top', distance: '25px' } starts at `top: -25px` in CSS.
     */

    var distance = config.distance;

    if (config.origin === 'top' || config.origin === 'left') {
      distance = /^-/.test(distance) ? distance.substr(1) : "-" + distance;
    }

    var ref = distance.match(/(^-?\d+\.?\d?)|(em$|px$|%$)/g);
    var value = ref[0];
    var unit = ref[1];

    switch (unit) {
      case 'em':
        distance = parseInt(computed.fontSize) * value;
        break;

      case 'px':
        distance = value;
        break;

      case '%':
        /**
         * Here we use `getBoundingClientRect` instead of
         * the existing data attached to `element.geometry`
         * because only the former includes any transformations
         * current applied to the element.
         *
         * If that behavior ends up being unintuitive, this
         * logic could instead utilize `element.geometry.height`
         * and `element.geoemetry.width` for the distance calculation
         */
        distance = axis === 'Y' ? element.node.getBoundingClientRect().height * value / 100 : element.node.getBoundingClientRect().width * value / 100;
        break;

      default:
        throw new RangeError('Unrecognized or missing distance unit.');
    }

    if (axis === 'Y') {
      transformations.push((0, _rematrix.translateY)(distance));
    } else {
      transformations.push((0, _rematrix.translateX)(distance));
    }
  }

  if (config.rotate.x) {
    transformations.push((0, _rematrix.rotateX)(config.rotate.x));
  }

  if (config.rotate.y) {
    transformations.push((0, _rematrix.rotateY)(config.rotate.y));
  }

  if (config.rotate.z) {
    transformations.push((0, _rematrix.rotateZ)(config.rotate.z));
  }

  if (config.scale !== 1) {
    if (config.scale === 0) {
      /**
       * The CSS Transforms matrix interpolation specification
       * basically disallows transitions of non-invertible
       * matrixes, which means browsers won't transition
       * elements with zero scale.
       *
       * That’s inconvenient for the API and developer
       * experience, so we simply nudge their value
       * slightly above zero; this allows browsers
       * to transition our element as expected.
       *
       * `0.0002` was the smallest number
       * that performed across browsers.
       */
      transformations.push((0, _rematrix.scale)(0.0002));
    } else {
      transformations.push((0, _rematrix.scale)(config.scale));
    }
  }

  var transform = {};

  if (transformations.length) {
    transform.property = getPrefixedCssProp('transform');
    /**
     * The default computed transform value should be one of:
     * undefined || 'none' || 'matrix()' || 'matrix3d()'
     */

    transform.computed = {
      raw: computed[transform.property],
      matrix: (0, _rematrix.parse)(computed[transform.property])
    };
    transformations.unshift(transform.computed.matrix);
    var product = transformations.reduce(_rematrix.multiply);
    transform.generated = {
      initial: transform.property + ": matrix3d(" + product.join(', ') + ");",
      final: transform.property + ": matrix3d(" + transform.computed.matrix.join(', ') + ");"
    };
  } else {
    transform.generated = {
      initial: '',
      final: ''
    };
  }
  /**
   * Generate transition styles
   */


  var transition = {};

  if (opacity.generated || transform.generated.initial) {
    transition.property = getPrefixedCssProp('transition');
    transition.computed = computed[transition.property];
    transition.fragments = [];
    var delay = config.delay;
    var duration = config.duration;
    var easing = config.easing;

    if (opacity.generated) {
      transition.fragments.push({
        delayed: "opacity " + duration / 1000 + "s " + easing + " " + delay / 1000 + "s",
        instant: "opacity " + duration / 1000 + "s " + easing + " 0s"
      });
    }

    if (transform.generated.initial) {
      transition.fragments.push({
        delayed: transform.property + " " + duration / 1000 + "s " + easing + " " + delay / 1000 + "s",
        instant: transform.property + " " + duration / 1000 + "s " + easing + " 0s"
      });
    }
    /**
     * The default computed transition property should be undefined, or one of:
     * '' || 'none 0s ease 0s' || 'all 0s ease 0s' || 'all 0s 0s cubic-bezier()'
     */


    var hasCustomTransition = transition.computed && !transition.computed.match(/all 0s|none 0s/);

    if (hasCustomTransition) {
      transition.fragments.unshift({
        delayed: transition.computed,
        instant: transition.computed
      });
    }

    var composed = transition.fragments.reduce(function (composition, fragment, i) {
      composition.delayed += i === 0 ? fragment.delayed : ", " + fragment.delayed;
      composition.instant += i === 0 ? fragment.instant : ", " + fragment.instant;
      return composition;
    }, {
      delayed: '',
      instant: ''
    });
    transition.generated = {
      delayed: transition.property + ": " + composed.delayed + ";",
      instant: transition.property + ": " + composed.instant + ";"
    };
  } else {
    transition.generated = {
      delayed: '',
      instant: ''
    };
  }

  return {
    inline: inline,
    opacity: opacity,
    position: position,
    transform: transform,
    transition: transition
  };
}

function animate(element, force) {
  if (force === void 0) force = {};
  var pristine = force.pristine || this.pristine;
  var delayed = element.config.useDelay === 'always' || element.config.useDelay === 'onload' && pristine || element.config.useDelay === 'once' && !element.seen;
  var shouldReveal = element.visible && !element.revealed;
  var shouldReset = !element.visible && element.revealed && element.config.reset;

  if (force.reveal || shouldReveal) {
    return triggerReveal.call(this, element, delayed);
  }

  if (force.reset || shouldReset) {
    return triggerReset.call(this, element);
  }
}

function triggerReveal(element, delayed) {
  var styles = [element.styles.inline.generated, element.styles.opacity.computed, element.styles.transform.generated.final];

  if (delayed) {
    styles.push(element.styles.transition.generated.delayed);
  } else {
    styles.push(element.styles.transition.generated.instant);
  }

  element.revealed = element.seen = true;
  element.node.setAttribute('style', styles.filter(function (s) {
    return s !== '';
  }).join(' '));
  registerCallbacks.call(this, element, delayed);
}

function triggerReset(element) {
  var styles = [element.styles.inline.generated, element.styles.opacity.generated, element.styles.transform.generated.initial, element.styles.transition.generated.instant];
  element.revealed = false;
  element.node.setAttribute('style', styles.filter(function (s) {
    return s !== '';
  }).join(' '));
  registerCallbacks.call(this, element);
}

function registerCallbacks(element, isDelayed) {
  var this$1 = this;
  var duration = isDelayed ? element.config.duration + element.config.delay : element.config.duration;
  var beforeCallback = element.revealed ? element.config.beforeReveal : element.config.beforeReset;
  var afterCallback = element.revealed ? element.config.afterReveal : element.config.afterReset;
  var elapsed = 0;

  if (element.callbackTimer) {
    elapsed = Date.now() - element.callbackTimer.start;
    window.clearTimeout(element.callbackTimer.clock);
  }

  beforeCallback(element.node);
  element.callbackTimer = {
    start: Date.now(),
    clock: window.setTimeout(function () {
      afterCallback(element.node);
      element.callbackTimer = null;

      if (element.revealed && !element.config.reset && element.config.cleanup) {
        clean.call(this$1, element.node);
      }
    }, duration - elapsed)
  };
}

var nextUniqueId = function () {
  var uid = 0;
  return function () {
    return uid++;
  };
}();

function sequence(element, pristine) {
  if (pristine === void 0) pristine = this.pristine;
  /**
   * We first check if the element should reset.
   */

  if (!element.visible && element.revealed && element.config.reset) {
    return animate.call(this, element, {
      reset: true
    });
  }

  var seq = this.store.sequences[element.sequence.id];
  var i = element.sequence.index;

  if (seq) {
    var visible = new SequenceModel(seq, 'visible', this.store);
    var revealed = new SequenceModel(seq, 'revealed', this.store);
    seq.models = {
      visible: visible,
      revealed: revealed
    };
    /**
     * If the sequence has no revealed members,
     * then we reveal the first visible element
     * within that sequence.
     *
     * The sequence then cues a recursive call
     * in both directions.
     */

    if (!revealed.body.length) {
      var nextId = seq.members[visible.body[0]];
      var nextElement = this.store.elements[nextId];

      if (nextElement) {
        cue.call(this, seq, visible.body[0], -1, pristine);
        cue.call(this, seq, visible.body[0], +1, pristine);
        return animate.call(this, nextElement, {
          reveal: true,
          pristine: pristine
        });
      }
    }
    /**
     * If our element isn’t resetting, we check the
     * element sequence index against the head, and
     * then the foot of the sequence.
     */


    if (!seq.blocked.head && i === [].concat(revealed.head).pop() && i >= [].concat(visible.body).shift()) {
      cue.call(this, seq, i, -1, pristine);
      return animate.call(this, element, {
        reveal: true,
        pristine: pristine
      });
    }

    if (!seq.blocked.foot && i === [].concat(revealed.foot).shift() && i <= [].concat(visible.body).pop()) {
      cue.call(this, seq, i, +1, pristine);
      return animate.call(this, element, {
        reveal: true,
        pristine: pristine
      });
    }
  }
}

function Sequence(interval) {
  var i = Math.abs(interval);

  if (!isNaN(i)) {
    this.id = nextUniqueId();
    this.interval = Math.max(i, 16);
    this.members = [];
    this.models = {};
    this.blocked = {
      head: false,
      foot: false
    };
  } else {
    throw new RangeError('Invalid sequence interval.');
  }
}

function SequenceModel(seq, prop, store) {
  var this$1 = this;
  this.head = [];
  this.body = [];
  this.foot = [];
  each(seq.members, function (id, index) {
    var element = store.elements[id];

    if (element && element[prop]) {
      this$1.body.push(index);
    }
  });

  if (this.body.length) {
    each(seq.members, function (id, index) {
      var element = store.elements[id];

      if (element && !element[prop]) {
        if (index < this$1.body[0]) {
          this$1.head.push(index);
        } else {
          this$1.foot.push(index);
        }
      }
    });
  }
}

function cue(seq, i, direction, pristine) {
  var this$1 = this;
  var blocked = ['head', null, 'foot'][1 + direction];
  var nextId = seq.members[i + direction];
  var nextElement = this.store.elements[nextId];
  seq.blocked[blocked] = true;
  setTimeout(function () {
    seq.blocked[blocked] = false;

    if (nextElement) {
      sequence.call(this$1, nextElement, pristine);
    }
  }, seq.interval);
}

function initialize() {
  var this$1 = this;
  rinse.call(this);
  each(this.store.elements, function (element) {
    var styles = [element.styles.inline.generated];

    if (element.visible) {
      styles.push(element.styles.opacity.computed);
      styles.push(element.styles.transform.generated.final);
      element.revealed = true;
    } else {
      styles.push(element.styles.opacity.generated);
      styles.push(element.styles.transform.generated.initial);
      element.revealed = false;
    }

    element.node.setAttribute('style', styles.filter(function (s) {
      return s !== '';
    }).join(' '));
  });
  each(this.store.containers, function (container) {
    var target = container.node === document.documentElement ? window : container.node;
    target.addEventListener('scroll', this$1.delegate);
    target.addEventListener('resize', this$1.delegate);
  });
  /**
   * Manually invoke delegate once to capture
   * element and container dimensions, container
   * scroll position, and trigger any valid reveals
   */

  this.delegate();
  /**
   * Wipe any existing `setTimeout` now
   * that initialization has completed.
   */

  this.initTimeout = null;
}

function isMobile(agent) {
  if (agent === void 0) agent = navigator.userAgent;
  return /Android|iPhone|iPad|iPod/i.test(agent);
}

function deepAssign(target) {
  var sources = [],
      len = arguments.length - 1;

  while (len-- > 0) sources[len] = arguments[len + 1];

  if (isObject(target)) {
    each(sources, function (source) {
      each(source, function (data, key) {
        if (isObject(data)) {
          if (!target[key] || !isObject(target[key])) {
            target[key] = {};
          }

          deepAssign(target[key], data);
        } else {
          target[key] = data;
        }
      });
    });
    return target;
  } else {
    throw new TypeError('Target must be an object literal.');
  }
}

function reveal(target, options, syncing) {
  var this$1 = this;
  if (options === void 0) options = {};
  if (syncing === void 0) syncing = false;
  var containerBuffer = [];
  var sequence$$1;
  var interval = options.interval || defaults.interval;

  try {
    if (interval) {
      sequence$$1 = new Sequence(interval);
    }

    var nodes = (0, _tealight.default)(target);

    if (!nodes.length) {
      throw new Error('Invalid reveal target.');
    }

    var elements = nodes.reduce(function (elementBuffer, elementNode) {
      var element = {};
      var existingId = elementNode.getAttribute('data-sr-id');

      if (existingId) {
        deepAssign(element, this$1.store.elements[existingId]);
        /**
         * In order to prevent previously generated styles
         * from throwing off the new styles, the style tag
         * has to be reverted to its pre-reveal state.
         */

        element.node.setAttribute('style', element.styles.inline.computed);
      } else {
        element.id = nextUniqueId();
        element.node = elementNode;
        element.seen = false;
        element.revealed = false;
        element.visible = false;
      }

      var config = deepAssign({}, element.config || this$1.defaults, options);

      if (!config.mobile && isMobile() || !config.desktop && !isMobile()) {
        if (existingId) {
          clean.call(this$1, element);
        }

        return elementBuffer; // skip elements that are disabled
      }

      var containerNode = (0, _tealight.default)(config.container)[0];

      if (!containerNode) {
        throw new Error('Invalid container.');
      }

      if (!containerNode.contains(elementNode)) {
        return elementBuffer; // skip elements found outside the container
      }

      var containerId;
      {
        containerId = getContainerId(containerNode, containerBuffer, this$1.store.containers);

        if (containerId === null) {
          containerId = nextUniqueId();
          containerBuffer.push({
            id: containerId,
            node: containerNode
          });
        }
      }
      element.config = config;
      element.containerId = containerId;
      element.styles = style(element);

      if (sequence$$1) {
        element.sequence = {
          id: sequence$$1.id,
          index: sequence$$1.members.length
        };
        sequence$$1.members.push(element.id);
      }

      elementBuffer.push(element);
      return elementBuffer;
    }, []);
    /**
     * Modifying the DOM via setAttribute needs to be handled
     * separately from reading computed styles in the map above
     * for the browser to batch DOM changes (limiting reflows)
     */

    each(elements, function (element) {
      this$1.store.elements[element.id] = element;
      element.node.setAttribute('data-sr-id', element.id);
    });
  } catch (e) {
    return logger.call(this, 'Reveal failed.', e.message);
  }
  /**
   * Now that element set-up is complete...
   * Let’s commit any container and sequence data we have to the store.
   */


  each(containerBuffer, function (container) {
    this$1.store.containers[container.id] = {
      id: container.id,
      node: container.node
    };
  });

  if (sequence$$1) {
    this.store.sequences[sequence$$1.id] = sequence$$1;
  }
  /**
   * If reveal wasn't invoked by sync, we want to
   * make sure to add this call to the history.
   */


  if (syncing !== true) {
    this.store.history.push({
      target: target,
      options: options
    });
    /**
     * Push initialization to the event queue, giving
     * multiple reveal calls time to be interpreted.
     */

    if (this.initTimeout) {
      window.clearTimeout(this.initTimeout);
    }

    this.initTimeout = window.setTimeout(initialize.bind(this), 0);
  }
}

function getContainerId(node) {
  var collections = [],
      len = arguments.length - 1;

  while (len-- > 0) collections[len] = arguments[len + 1];

  var id = null;
  each(collections, function (collection) {
    each(collection, function (container) {
      if (id === null && container.node === node) {
        id = container.id;
      }
    });
  });
  return id;
}
/**
 * Re-runs the reveal method for each record stored in history,
 * for capturing new content asynchronously loaded into the DOM.
 */


function sync() {
  var this$1 = this;
  each(this.store.history, function (record) {
    reveal.call(this$1, record.target, record.options, true);
  });
  initialize.call(this);
}

var polyfill = function (x) {
  return (x > 0) - (x < 0) || +x;
};

var mathSign = Math.sign || polyfill;

function getGeometry(target, isContainer) {
  /**
   * We want to ignore padding and scrollbars for container elements.
   * More information here: https://goo.gl/vOZpbz
   */
  var height = isContainer ? target.node.clientHeight : target.node.offsetHeight;
  var width = isContainer ? target.node.clientWidth : target.node.offsetWidth;
  var offsetTop = 0;
  var offsetLeft = 0;
  var node = target.node;

  do {
    if (!isNaN(node.offsetTop)) {
      offsetTop += node.offsetTop;
    }

    if (!isNaN(node.offsetLeft)) {
      offsetLeft += node.offsetLeft;
    }

    node = node.offsetParent;
  } while (node);

  return {
    bounds: {
      top: offsetTop,
      right: offsetLeft + width,
      bottom: offsetTop + height,
      left: offsetLeft
    },
    height: height,
    width: width
  };
}

function getScrolled(container) {
  var top, left;

  if (container.node === document.documentElement) {
    top = window.pageYOffset;
    left = window.pageXOffset;
  } else {
    top = container.node.scrollTop;
    left = container.node.scrollLeft;
  }

  return {
    top: top,
    left: left
  };
}

function isElementVisible(element) {
  if (element === void 0) element = {};
  var container = this.store.containers[element.containerId];

  if (!container) {
    return;
  }

  var viewFactor = Math.max(0, Math.min(1, element.config.viewFactor));
  var viewOffset = element.config.viewOffset;
  var elementBounds = {
    top: element.geometry.bounds.top + element.geometry.height * viewFactor,
    right: element.geometry.bounds.right - element.geometry.width * viewFactor,
    bottom: element.geometry.bounds.bottom - element.geometry.height * viewFactor,
    left: element.geometry.bounds.left + element.geometry.width * viewFactor
  };
  var containerBounds = {
    top: container.geometry.bounds.top + container.scroll.top + viewOffset.top,
    right: container.geometry.bounds.right + container.scroll.left - viewOffset.right,
    bottom: container.geometry.bounds.bottom + container.scroll.top - viewOffset.bottom,
    left: container.geometry.bounds.left + container.scroll.left + viewOffset.left
  };
  return elementBounds.top < containerBounds.bottom && elementBounds.right > containerBounds.left && elementBounds.bottom > containerBounds.top && elementBounds.left < containerBounds.right || element.styles.position === 'fixed';
}

function delegate(event, elements) {
  var this$1 = this;
  if (event === void 0) event = {
    type: 'init'
  };
  if (elements === void 0) elements = this.store.elements;
  (0, _miniraf.default)(function () {
    var stale = event.type === 'init' || event.type === 'resize';
    each(this$1.store.containers, function (container) {
      if (stale) {
        container.geometry = getGeometry.call(this$1, container, true);
      }

      var scroll = getScrolled.call(this$1, container);

      if (container.scroll) {
        container.direction = {
          x: mathSign(scroll.left - container.scroll.left),
          y: mathSign(scroll.top - container.scroll.top)
        };
      }

      container.scroll = scroll;
    });
    /**
     * Due to how the sequencer is implemented, it’s
     * important that we update the state of all
     * elements, before any animation logic is
     * evaluated (in the second loop below).
     */

    each(elements, function (element) {
      if (stale) {
        element.geometry = getGeometry.call(this$1, element);
      }

      element.visible = isElementVisible.call(this$1, element);
    });
    each(elements, function (element) {
      if (element.sequence) {
        sequence.call(this$1, element);
      } else {
        animate.call(this$1, element);
      }
    });
    this$1.pristine = false;
  });
}

function isTransformSupported() {
  var style = document.documentElement.style;
  return 'transform' in style || 'WebkitTransform' in style;
}

function isTransitionSupported() {
  var style = document.documentElement.style;
  return 'transition' in style || 'WebkitTransition' in style;
}

var version = "4.0.6";
var boundDelegate;
var boundDestroy;
var boundReveal;
var boundClean;
var boundSync;
var config;
var debug;
var instance;

function ScrollReveal(options) {
  if (options === void 0) options = {};
  var invokedWithoutNew = typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype;

  if (invokedWithoutNew) {
    return new ScrollReveal(options);
  }

  if (!ScrollReveal.isSupported()) {
    logger.call(this, 'Instantiation failed.', 'This browser is not supported.');
    return mount.failure();
  }

  var buffer;

  try {
    buffer = config ? deepAssign({}, config, options) : deepAssign({}, defaults, options);
  } catch (e) {
    logger.call(this, 'Invalid configuration.', e.message);
    return mount.failure();
  }

  try {
    var container = (0, _tealight.default)(buffer.container)[0];

    if (!container) {
      throw new Error('Invalid container.');
    }
  } catch (e) {
    logger.call(this, e.message);
    return mount.failure();
  }

  config = buffer;

  if (!config.mobile && isMobile() || !config.desktop && !isMobile()) {
    logger.call(this, 'This device is disabled.', "desktop: " + config.desktop, "mobile: " + config.mobile);
    return mount.failure();
  }

  mount.success();
  this.store = {
    containers: {},
    elements: {},
    history: [],
    sequences: {}
  };
  this.pristine = true;
  boundDelegate = boundDelegate || delegate.bind(this);
  boundDestroy = boundDestroy || destroy.bind(this);
  boundReveal = boundReveal || reveal.bind(this);
  boundClean = boundClean || clean.bind(this);
  boundSync = boundSync || sync.bind(this);
  Object.defineProperty(this, 'delegate', {
    get: function () {
      return boundDelegate;
    }
  });
  Object.defineProperty(this, 'destroy', {
    get: function () {
      return boundDestroy;
    }
  });
  Object.defineProperty(this, 'reveal', {
    get: function () {
      return boundReveal;
    }
  });
  Object.defineProperty(this, 'clean', {
    get: function () {
      return boundClean;
    }
  });
  Object.defineProperty(this, 'sync', {
    get: function () {
      return boundSync;
    }
  });
  Object.defineProperty(this, 'defaults', {
    get: function () {
      return config;
    }
  });
  Object.defineProperty(this, 'version', {
    get: function () {
      return version;
    }
  });
  Object.defineProperty(this, 'noop', {
    get: function () {
      return false;
    }
  });
  return instance ? instance : instance = this;
}

ScrollReveal.isSupported = function () {
  return isTransformSupported() && isTransitionSupported();
};

Object.defineProperty(ScrollReveal, 'debug', {
  get: function () {
    return debug || false;
  },
  set: function (value) {
    return debug = typeof value === 'boolean' ? value : debug;
  }
});
ScrollReveal();
var _default = ScrollReveal;
exports.default = _default;
},{"tealight":"node_modules/tealight/dist/tealight.es.js","rematrix":"node_modules/rematrix/dist/rematrix.es.js","miniraf":"node_modules/miniraf/dist/miniraf.es.js"}],"node_modules/sweet-scroll/sweet-scroll.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/*! @preserve sweet-scroll v4.0.0 - tsuyoshiwada | MIT License */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.SweetScroll = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    // @link https://github.com/JedWatson/exenv/blob/master/index.js
    var canUseDOM = !!(typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement);
    var canUseHistory = !canUseDOM
        ? false
        : window.history && 'pushState' in window.history && window.location.protocol !== 'file:';
    var canUsePassiveOption = (function () {
        var support = false;
        if (!canUseDOM) {
            return support;
        }
        /* tslint:disable:no-empty */
        try {
            var win = window;
            var opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    support = true;
                },
            });
            win.addEventListener('test', null, opts);
            win.removeEventListener('test', null, opts);
        }
        catch (e) { }
        /* tslint:enable */
        return support;
    })();

    var isString = function (obj) { return typeof obj === 'string'; };
    var isFunction = function (obj) { return typeof obj === 'function'; };
    var isArray = function (obj) { return Array.isArray(obj); };
    var isNumeric = function (obj) { return !isArray(obj) && obj - parseFloat(obj) + 1 >= 0; };
    var hasProp = function (obj, key) { return obj && obj.hasOwnProperty(key); };

    var raf = canUseDOM
        ? window.requestAnimationFrame.bind(window)
        : null;
    var caf = canUseDOM
        ? window.cancelAnimationFrame.bind(window)
        : null;

    /* tslint:disable:curly */
    /* tslint:disable:no-conditional-assignment */
    var cos = Math.cos, sin = Math.sin, pow = Math.pow, sqrt = Math.sqrt, PI = Math.PI;
    var easings = {
        linear: function (p) { return p; },
        easeInQuad: function (_, t, b, c, d) { return c * (t /= d) * t + b; },
        easeOutQuad: function (_, t, b, c, d) { return -c * (t /= d) * (t - 2) + b; },
        easeInOutQuad: function (_, t, b, c, d) {
            return (t /= d / 2) < 1 ? (c / 2) * t * t + b : (-c / 2) * (--t * (t - 2) - 1) + b;
        },
        easeInCubic: function (_, t, b, c, d) { return c * (t /= d) * t * t + b; },
        easeOutCubic: function (_, t, b, c, d) { return c * ((t = t / d - 1) * t * t + 1) + b; },
        easeInOutCubic: function (_, t, b, c, d) {
            return (t /= d / 2) < 1 ? (c / 2) * t * t * t + b : (c / 2) * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function (_, t, b, c, d) { return c * (t /= d) * t * t * t + b; },
        easeOutQuart: function (_, t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b; },
        easeInOutQuart: function (_, t, b, c, d) {
            return (t /= d / 2) < 1 ? (c / 2) * t * t * t * t + b : (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function (_, t, b, c, d) { return c * (t /= d) * t * t * t * t + b; },
        easeOutQuint: function (_, t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b; },
        easeInOutQuint: function (_, t, b, c, d) {
            return (t /= d / 2) < 1
                ? (c / 2) * t * t * t * t * t + b
                : (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function (_, t, b, c, d) { return -c * cos((t / d) * (PI / 2)) + c + b; },
        easeOutSine: function (_, t, b, c, d) { return c * sin((t / d) * (PI / 2)) + b; },
        easeInOutSine: function (_, t, b, c, d) { return (-c / 2) * (cos((PI * t) / d) - 1) + b; },
        easeInExpo: function (_, t, b, c, d) { return (t === 0 ? b : c * pow(2, 10 * (t / d - 1)) + b); },
        easeOutExpo: function (_, t, b, c, d) { return (t === d ? b + c : c * (-pow(2, (-10 * t) / d) + 1) + b); },
        easeInOutExpo: function (_, t, b, c, d) {
            if (t === 0)
                return b;
            if (t === d)
                return b + c;
            if ((t /= d / 2) < 1)
                return (c / 2) * pow(2, 10 * (t - 1)) + b;
            return (c / 2) * (-pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (_, t, b, c, d) { return -c * (sqrt(1 - (t /= d) * t) - 1) + b; },
        easeOutCirc: function (_, t, b, c, d) { return c * sqrt(1 - (t = t / d - 1) * t) + b; },
        easeInOutCirc: function (_, t, b, c, d) {
            return (t /= d / 2) < 1
                ? (-c / 2) * (sqrt(1 - t * t) - 1) + b
                : (c / 2) * (sqrt(1 - (t -= 2) * t) + 1) + b;
        },
    };

    var $$ = function (selector) {
        return Array.prototype.slice.call((!selector ? [] : document.querySelectorAll(selector)));
    };
    var $ = function (selector) { return $$(selector).shift() || null; };
    var isElement = function (obj) { return obj instanceof Element; };
    var isWindow = function ($el) { return $el === window; };
    var isRootContainer = function ($el) {
        return $el === document.documentElement || $el === document.body;
    };
    var matches = function ($el, selector) {
        if (isElement(selector)) {
            return $el === selector;
        }
        var results = $$(selector);
        var i = results.length;
        // tslint:disable-next-line no-empty
        while (--i >= 0 && results[i] !== $el) { }
        return i > -1;
    };

    var getHeight = function ($el) {
        return Math.max($el.scrollHeight, $el.clientHeight, $el.offsetHeight);
    };
    var getWidth = function ($el) {
        return Math.max($el.scrollWidth, $el.clientWidth, $el.offsetWidth);
    };
    var getSize = function ($el) { return ({
        width: getWidth($el),
        height: getHeight($el),
    }); };
    var getViewportAndElementSizes = function ($el) {
        var isRoot = isWindow($el) || isRootContainer($el);
        return {
            viewport: {
                width: isRoot
                    ? Math.min(window.innerWidth, document.documentElement.clientWidth)
                    : $el.clientWidth,
                height: isRoot ? window.innerHeight : $el.clientHeight,
            },
            size: isRoot
                ? {
                    width: Math.max(getWidth(document.body), getWidth(document.documentElement)),
                    height: Math.max(getHeight(document.body), getHeight(document.documentElement)),
                }
                : getSize($el),
        };
    };

    var directionMethodMap = {
        y: 'scrollTop',
        x: 'scrollLeft',
    };
    var directionPropMap = {
        y: 'pageYOffset',
        x: 'pageXOffset',
    };
    var getScroll = function ($el, direction) {
        return isWindow($el) ? $el[directionPropMap[direction]] : $el[directionMethodMap[direction]];
    };
    var setScroll = function ($el, offset, direction) {
        if (isWindow($el)) {
            var top_1 = direction === 'y';
            $el.scrollTo(!top_1 ? offset : $el.pageXOffset, top_1 ? offset : $el.pageYOffset);
        }
        else {
            $el[directionMethodMap[direction]] = offset;
        }
    };
    var getOffset = function ($el, $context) {
        var rect = $el.getBoundingClientRect();
        if (rect.width || rect.height) {
            var scroll_1 = { top: 0, left: 0 };
            var $ctx = void 0;
            if (isWindow($context) || isRootContainer($context)) {
                $ctx = document.documentElement;
                scroll_1.top = window[directionPropMap.y];
                scroll_1.left = window[directionPropMap.x];
            }
            else {
                $ctx = $context;
                var cRect = $ctx.getBoundingClientRect();
                scroll_1.top = cRect.top * -1 + $ctx[directionMethodMap.y];
                scroll_1.left = cRect.left * -1 + $ctx[directionMethodMap.x];
            }
            return {
                top: rect.top + scroll_1.top - $ctx.clientTop,
                left: rect.left + scroll_1.left - $ctx.clientLeft,
            };
        }
        return rect;
    };

    var wheelEventName = (function () {
        if (!canUseDOM) {
            return 'wheel';
        }
        return 'onwheel' in document ? 'wheel' : 'mousewheel';
    })();
    var eventName = function (name) { return (name === 'wheel' ? wheelEventName : name); };
    var apply = function ($el, method, event, listener, passive) {
        event.split(' ').forEach(function (name) {
            $el[method](eventName(name), listener, canUsePassiveOption ? { passive: passive } : false);
        });
    };
    var addEvent = function ($el, event, listener, passive) { return apply($el, 'addEventListener', event, listener, passive); };
    var removeEvent = function ($el, event, listener, passive) { return apply($el, 'removeEventListener', event, listener, passive); };

    var reRelativeToken = /^(\+|-)=(\d+(?:\.\d+)?)$/;
    var parseCoordinate = function (coordinate, enableVertical) {
        var res = { top: 0, left: 0, relative: false };
        // Object ({ top: {n}, left: {n} })
        if (hasProp(coordinate, 'top') || hasProp(coordinate, 'left')) {
            res = __assign({}, res, coordinate);
            // Array ([{n}, [{n}])
        }
        else if (isArray(coordinate)) {
            if (coordinate.length > 1) {
                res.top = coordinate[0];
                res.left = coordinate[1];
            }
            else if (coordinate.length === 1) {
                res.top = enableVertical ? coordinate[0] : 0;
                res.left = !enableVertical ? coordinate[0] : 0;
            }
            else {
                return null;
            }
            // Number
        }
        else if (isNumeric(coordinate)) {
            if (enableVertical) {
                res.top = coordinate;
            }
            else {
                res.left = coordinate;
            }
            // String ('+={n}', '-={n}')
        }
        else if (isString(coordinate)) {
            var m = coordinate.trim().match(reRelativeToken);
            if (!m) {
                return null;
            }
            var op = m[1];
            var val = parseInt(m[2], 10);
            if (op === '+') {
                res.top = enableVertical ? val : 0;
                res.left = !enableVertical ? val : 0;
            }
            else {
                res.top = enableVertical ? -val : 0;
                res.left = !enableVertical ? -val : 0;
            }
            res.relative = true;
        }
        else {
            return null;
        }
        return res;
    };

    var defaultOptions = {
        trigger: '[data-scroll]',
        header: '[data-scroll-header]',
        duration: 1000,
        easing: 'easeOutQuint',
        offset: 0,
        vertical: true,
        horizontal: false,
        cancellable: true,
        updateURL: false,
        preventDefault: true,
        stopPropagation: true,
        // Callbacks
        before: null,
        after: null,
        cancel: null,
        complete: null,
        step: null,
    };

    var CONTAINER_CLICK_EVENT = 'click';
    var CONTAINER_STOP_EVENT = 'wheel touchstart touchmove';
    var SweetScroll = /** @class */ (function () {
        /**
         * Constructor
         */
        function SweetScroll(options, container) {
            var _this = this;
            this.$el = null;
            this.ctx = {
                $trigger: null,
                opts: null,
                progress: false,
                pos: null,
                startPos: null,
                easing: null,
                start: 0,
                id: 0,
                cancel: false,
                hash: null,
            };
            /**
             * Handle each frame of the animation.
             */
            this.loop = function (time) {
                var _a = _this, $el = _a.$el, ctx = _a.ctx;
                if (!ctx.start) {
                    ctx.start = time;
                }
                if (!ctx.progress || !$el) {
                    _this.stop();
                    return;
                }
                var options = ctx.opts;
                var offset = ctx.pos;
                var start = ctx.start;
                var startOffset = ctx.startPos;
                var easing = ctx.easing;
                var duration = options.duration;
                var directionMap = { top: 'y', left: 'x' };
                var timeElapsed = time - start;
                var t = Math.min(1, Math.max(timeElapsed / duration, 0));
                Object.keys(offset).forEach(function (key) {
                    var value = offset[key];
                    var initial = startOffset[key];
                    var delta = value - initial;
                    if (delta !== 0) {
                        var val = easing(t, duration * t, 0, 1, duration);
                        setScroll($el, Math.round(initial + delta * val), directionMap[key]);
                    }
                });
                if (timeElapsed <= duration) {
                    _this.hook(options, 'step', t);
                    ctx.id = SweetScroll.raf(_this.loop);
                }
                else {
                    _this.stop(true);
                }
            };
            /**
             * Handling of container click event.
             */
            this.handleClick = function (e) {
                var opts = _this.opts;
                var $el = e.target;
                for (; $el && $el !== document; $el = $el.parentNode) {
                    if (!matches($el, opts.trigger)) {
                        continue;
                    }
                    var dataOptions = JSON.parse($el.getAttribute('data-scroll-options') || '{}');
                    var data = $el.getAttribute('data-scroll');
                    var to = data || $el.getAttribute('href');
                    var options = __assign({}, opts, dataOptions);
                    var preventDefault = options.preventDefault, stopPropagation = options.stopPropagation, vertical = options.vertical, horizontal = options.horizontal;
                    if (preventDefault) {
                        e.preventDefault();
                    }
                    if (stopPropagation) {
                        e.stopPropagation();
                    }
                    // Passes the trigger element to callback
                    _this.ctx.$trigger = $el;
                    if (horizontal && vertical) {
                        _this.to(to, options);
                    }
                    else if (vertical) {
                        _this.toTop(to, options);
                    }
                    else if (horizontal) {
                        _this.toLeft(to, options);
                    }
                    break;
                }
            };
            /**
             * Handling of container stop events.
             */
            this.handleStop = function (e) {
                var ctx = _this.ctx;
                var opts = ctx.opts;
                if (opts && opts.cancellable) {
                    ctx.cancel = true;
                    _this.stop();
                }
                else {
                    e.preventDefault();
                }
            };
            this.opts = __assign({}, defaultOptions, (options || {}));
            var $container = null;
            if (canUseDOM) {
                if (typeof container === 'string') {
                    $container = $(container);
                }
                else if (container != null) {
                    $container = container;
                }
                else {
                    $container = window;
                }
            }
            this.$el = $container;
            if ($container) {
                this.bind(true, false);
            }
        }
        /**
         * SweetScroll instance factory.
         */
        SweetScroll.create = function (options, container) {
            return new SweetScroll(options, container);
        };
        /**
         * Scroll animation to the specified position.
         */
        SweetScroll.prototype.to = function (distance, options) {
            if (!canUseDOM) {
                return;
            }
            var _a = this, $el = _a.$el, ctx = _a.ctx, currentOptions = _a.opts;
            var $trigger = ctx.$trigger;
            var opts = __assign({}, currentOptions, (options || {}));
            var optOffset = opts.offset, vertical = opts.vertical, horizontal = opts.horizontal;
            var $header = isElement(opts.header) ? opts.header : $(opts.header);
            var reg = /^#/;
            var hash = isString(distance) && reg.test(distance) ? distance : null;
            ctx.opts = opts; // Temporary options
            ctx.cancel = false; // Disable the call flag of `cancel`
            ctx.hash = hash;
            // Stop current animation
            this.stop();
            // Does not move if the container is not found
            if (!$el) {
                return;
            }
            // Get scroll offset
            var offset = parseCoordinate(optOffset, vertical);
            var coordinate = parseCoordinate(distance, vertical);
            var scroll = { top: 0, left: 0 };
            if (coordinate) {
                if (coordinate.relative) {
                    var current = getScroll($el, vertical ? 'y' : 'x');
                    scroll.top = vertical ? current + coordinate.top : coordinate.top;
                    scroll.left = !vertical ? current + coordinate.left : coordinate.left;
                }
                else {
                    scroll = coordinate;
                }
            }
            else if (isString(distance) && distance !== '#') {
                var $target = $(distance);
                if (!$target) {
                    return;
                }
                scroll = getOffset($target, $el);
            }
            if (offset) {
                scroll.top += offset.top;
                scroll.left += offset.left;
            }
            if ($header) {
                scroll.top = Math.max(0, scroll.top - getSize($header).height);
            }
            // Normalize scroll offset
            var _b = getViewportAndElementSizes($el), viewport = _b.viewport, size = _b.size;
            scroll.top = vertical
                ? Math.max(0, Math.min(size.height - viewport.height, scroll.top))
                : getScroll($el, 'y');
            scroll.left = horizontal
                ? Math.max(0, Math.min(size.width - viewport.width, scroll.left))
                : getScroll($el, 'x');
            // Call `before`
            // Stop scrolling when it returns false
            if (this.hook(opts, 'before', scroll, $trigger) === false) {
                ctx.opts = null;
                return;
            }
            // Set offset
            ctx.pos = scroll;
            // Run animation!!
            this.start(opts);
            // Bind stop events
            this.bind(false, true);
        };
        /**
         * Scroll animation to specified left position.
         */
        SweetScroll.prototype.toTop = function (distance, options) {
            this.to(distance, __assign({}, (options || {}), { vertical: true, horizontal: false }));
        };
        /**
         * Scroll animation to specified top position.
         */
        SweetScroll.prototype.toLeft = function (distance, options) {
            this.to(distance, __assign({}, (options || {}), { vertical: false, horizontal: true }));
        };
        /**
         * Scroll animation to specified element.
         */
        SweetScroll.prototype.toElement = function ($element, options) {
            var $el = this.$el;
            if (!canUseDOM || !$el) {
                return;
            }
            this.to(getOffset($element, $el), options || {});
        };
        /**
         * Stop the current scroll animation.
         */
        SweetScroll.prototype.stop = function (gotoEnd) {
            if (gotoEnd === void 0) { gotoEnd = false; }
            var _a = this, $el = _a.$el, ctx = _a.ctx;
            var pos = ctx.pos;
            if (!$el || !ctx.progress) {
                return;
            }
            SweetScroll.caf(ctx.id);
            ctx.progress = false;
            ctx.start = 0;
            ctx.id = 0;
            if (gotoEnd && pos) {
                setScroll($el, pos.left, 'x');
                setScroll($el, pos.top, 'y');
            }
            this.complete();
        };
        /**
         * Update options.
         */
        SweetScroll.prototype.update = function (options) {
            if (this.$el) {
                var opts = __assign({}, this.opts, options);
                this.stop();
                this.unbind(true, true);
                this.opts = opts;
                this.bind(true, false);
            }
        };
        /**
         * Destroy instance.
         */
        SweetScroll.prototype.destroy = function () {
            if (this.$el) {
                this.stop();
                this.unbind(true, true);
                this.$el = null;
            }
        };
        /**
         * Callback methods.
         */
        /* tslint:disable:no-empty */
        SweetScroll.prototype.onBefore = function (_, __) {
            return true;
        };
        SweetScroll.prototype.onStep = function (_) { };
        SweetScroll.prototype.onAfter = function (_, __) { };
        SweetScroll.prototype.onCancel = function () { };
        SweetScroll.prototype.onComplete = function (_) { };
        /* tslint:enable */
        /**
         * Start scrolling animation.
         */
        SweetScroll.prototype.start = function (opts) {
            var ctx = this.ctx;
            ctx.opts = opts;
            ctx.progress = true;
            ctx.easing = isFunction(opts.easing)
                ? opts.easing
                : easings[opts.easing];
            // Update start offset.
            var $container = this.$el;
            var start = {
                top: getScroll($container, 'y'),
                left: getScroll($container, 'x'),
            };
            ctx.startPos = start;
            // Loop
            ctx.id = SweetScroll.raf(this.loop);
        };
        /**
         * Handle the completion of scrolling animation.
         */
        SweetScroll.prototype.complete = function () {
            var _a = this, $el = _a.$el, ctx = _a.ctx;
            var hash = ctx.hash, cancel = ctx.cancel, opts = ctx.opts, pos = ctx.pos, $trigger = ctx.$trigger;
            if (!$el || !opts) {
                return;
            }
            if (hash != null && hash !== window.location.hash) {
                var updateURL = opts.updateURL;
                if (canUseDOM && canUseHistory && updateURL !== false) {
                    window.history[updateURL === 'replace' ? 'replaceState' : 'pushState'](null, '', hash);
                }
            }
            this.unbind(false, true);
            ctx.opts = null;
            ctx.$trigger = null;
            if (cancel) {
                this.hook(opts, 'cancel');
            }
            else {
                this.hook(opts, 'after', pos, $trigger);
            }
            this.hook(opts, 'complete', cancel);
        };
        /**
         * Callback function and method call.
         */
        SweetScroll.prototype.hook = function (options, type) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var _a;
            var callback = options[type];
            var callbackResult;
            var methodResult;
            // callback
            if (isFunction(callback)) {
                callbackResult = callback.apply(this, args.concat([this]));
            }
            // method
            methodResult = (_a = this)["on" + (type[0].toUpperCase() + type.slice(1))].apply(_a, args);
            return callbackResult !== undefined ? callbackResult : methodResult;
        };
        /**
         * Bind events of container element.
         */
        SweetScroll.prototype.bind = function (click, stop) {
            var _a = this, $el = _a.$el, opts = _a.ctx.opts;
            if ($el) {
                if (click) {
                    addEvent($el, CONTAINER_CLICK_EVENT, this.handleClick, false);
                }
                if (stop) {
                    addEvent($el, CONTAINER_STOP_EVENT, this.handleStop, opts ? opts.cancellable : true);
                }
            }
        };
        /**
         * Unbind events of container element.
         */
        SweetScroll.prototype.unbind = function (click, stop) {
            var _a = this, $el = _a.$el, opts = _a.ctx.opts;
            if ($el) {
                if (click) {
                    removeEvent($el, CONTAINER_CLICK_EVENT, this.handleClick, false);
                }
                if (stop) {
                    removeEvent($el, CONTAINER_STOP_EVENT, this.handleStop, opts ? opts.cancellable : true);
                }
            }
        };
        /**
         * You can set Polyfill (or Ponyfill) for browsers that do not support requestAnimationFrame.
         */
        SweetScroll.raf = raf;
        SweetScroll.caf = caf;
        return SweetScroll;
    }());

    return SweetScroll;

}));

},{}],"index.js":[function(require,module,exports) {
"use strict";

var _horizontal = _interopRequireDefault(require("@oberon-amsterdam/horizontal"));

var _scrollreveal = _interopRequireDefault(require("scrollreveal"));

var _sweetScroll = _interopRequireDefault(require("sweet-scroll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//Horizontal Scrolling
var scroll = null;
handleScroll();
window.addEventListener("resize", handleScroll);

function handleScroll() {
  if (window.innerWidth > 768 && !scroll) {
    scroll = new _horizontal.default();
  }

  if (scroll && window.innerWidth <= 768) {
    scroll.destroy();
    scroll = null;
  }
} //Fade In Animations for all h1, h2, h3, and p


(0, _scrollreveal.default)().reveal(document.querySelectorAll('h1, h2, h3, p'), {
  easing: 'ease-in-out',
  duration: '800',
  delay: '300'
}); //except those in the chapters blob and footer blob

(0, _scrollreveal.default)().clean(document.querySelectorAll('#chapters-blob h1,#chapters-blob h2,#chapters-blob h3,#chapters-blob p'));
(0, _scrollreveal.default)().clean(document.querySelectorAll('.footer h1,.footer h2,.footer h3,.footer p'));
var scrollBehaviour = [{
  id: 'path-1',
  startPct: 1,
  endPct: 4
}, {
  id: 'path-2a',
  startPct: 6.5,
  endPct: 10
}, {
  id: 'path-2b',
  startPct: 13,
  endPct: 19
}, {
  id: 'path-activity-1',
  startPct: 23.5,
  endPct: 25
}, {
  id: 'path-activity-2',
  startPct: 23,
  endPct: 23.5
}, {
  id: 'path-3',
  startPct: 26,
  endPct: 28
}, {
  id: 'path-4',
  startPct: 28,
  endPct: 30
}, {
  id: 'path-5',
  startPct: 30,
  endPct: 32
}, {
  id: 'path-6',
  startPct: 34,
  endPct: 37
}, {
  id: 'path-7',
  startPct: 38,
  endPct: 40
}, {
  id: 'path-new-1',
  startPct: 42,
  endPct: 44
}, {
  id: 'path-new-2',
  startPct: 45,
  endPct: 47
}, {
  id: 'path-time-1',
  startPct: 48,
  endPct: 51
}, {
  id: 'path-time-2',
  startPct: 51,
  endPct: 52
}, {
  id: 'path-8',
  startPct: 52,
  endPct: 54
}, {
  id: 'path-9',
  startPct: 54.5,
  endPct: 56
}, {
  id: 'path-mood-1',
  startPct: 62,
  endPct: 63
}, {
  id: 'path-mood-2',
  startPct: 59,
  endPct: 62
}, {
  id: 'path-10',
  startPct: 63,
  endPct: 64
}, {
  id: 'path-11',
  startPct: 66,
  endPct: 68
}, {
  id: 'path-new-3',
  startPct: 70.5,
  endPct: 72.5
}, {
  id: 'path-new-4',
  startPct: 74.25,
  endPct: 76
}, {
  id: 'path-12',
  startPct: 77.7,
  endPct: 80
}, {
  id: 'path-attitude-1',
  startPct: 80,
  endPct: 81
}, {
  id: 'path-attitude-2',
  startPct: 81,
  endPct: 84
}, {
  id: 'path-13',
  startPct: 85,
  endPct: 88
}, {
  id: 'path-14',
  startPct: 89.5,
  endPct: 90
}, {
  id: 'path-ending-note-1',
  startPct: 90.5,
  endPct: 93
}, {
  id: 'path-ending-note-2',
  startPct: 93.5,
  endPct: 95.5
}];
window.addEventListener("DOMContentLoaded", function (event) {
  scrollEventHandler();
  window.addEventListener("scroll", scrollEventHandler);
});

function scrollEventHandler() {
  // Calculate how far right the page the user is 
  var percentOfScroll = (document.documentElement.scrollLeft + document.body.scrollLeft) / (document.documentElement.scrollWidth - document.documentElement.clientWidth) * 100; // For each element that is getting drawn...

  for (var i = 0; i < scrollBehaviour.length; i++) {
    var data = scrollBehaviour[i];
    var elem = document.querySelector("#".concat(data.id)); // Get the length of this elements path

    console.log(data.id);
    var dashLen = elem.getTotalLength();
    console.log(percentOfScroll); // Calculate where the current scroll position falls relative to our path

    var fractionThroughThisElem = (percentOfScroll - data.startPct) / (data.endPct - data.startPct); // Clamp the fraction value to within this path (0 .. 1)

    fractionThroughThisElem = Math.max(fractionThroughThisElem, 0);
    fractionThroughThisElem = Math.min(fractionThroughThisElem, 1);
    var dashOffset = dashLen * (1 - fractionThroughThisElem);
    elem.setAttribute("stroke-dasharray", dashLen);
    elem.setAttribute("stroke-dashoffset", dashOffset);
  }
}
/*
    smooth scrolling links in chapters blob
*/


window.addEventListener('DOMContentLoaded', function () {
  var scroller = new _sweetScroll.default({
    vertical: window.innerWidth > 768 ? false : true,
    horizontal: window.innerWidth > 768 ? true : false,
    easing: 'easeInOutCubic'
  });
});
/*
    activity icons hover labels
*/

function displayActivityLabel(label) {
  document.getElementById('activity-display').innerHTML = label;
}

function displayExamples(examples) {
  document.getElementById('activity-examples').innerHTML = examples ? "E.g., ".concat(examples) : '';
}

[].concat(_toConsumableArray(document.querySelectorAll('.inflow-item')), _toConsumableArray(document.querySelectorAll('.bidirectional-item'))).forEach(function (item) {
  item.addEventListener('mouseover', function (event) {
    displayActivityLabel(item.querySelector('span').innerHTML);
    displayExamples(item.dataset.examples);
  });
  item.addEventListener('mouseout', function (event) {
    displayActivityLabel('');
    displayExamples('');
  });
});
/*
  Display Sticky scroll navbar after scrolling past Activity Start
*/
// Get the navbar

var stickyNav = document.getElementById("sticky-nav"); // Get Activity Section Offset

var activity = document.getElementById("activity-text");
var activityOffset = activity.offsetLeft;
var time = document.getElementById("time-anchor");
var timeOffset = time.offsetLeft;
var mood = document.getElementById("mood-div");
var moodOffset = mood.offsetLeft;
var attitude = document.getElementById("attitude-div");
var attitudeOffset = attitude.offsetLeft;
var ending_note_right_line = document.getElementById("ending-note-right-line");
var ending_note_right_lineOffset = ending_note_right_line.offsetLeft; // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position

function handleStickyNavDisplay() {
  if (window.pageXOffset >= activityOffset && window.pageXOffset < ending_note_right_lineOffset) {
    stickyNav.style.visibility = "visible";
  } else {
    stickyNav.style.visibility = "hidden";
  }
} //reset sticky nav elements


function resetElements() {
  var navdots = document.querySelectorAll('.sticky-nav-dot');

  for (var i = 0; i < navdots.length; i++) {
    navdots[i].style.backgroundColor = "lightgray";
  }

  var navlabels = document.querySelectorAll('.sticky-nav-label');

  for (var i = 0; i < navlabels.length; i++) {
    navlabels[i].style.visibility = "hidden";
  }
} //highlight the current section in the sticky navbar by making dot green and showing section label


function highlightCurrentSection() {
  resetElements();
  var halfScreenWidth = screen.width / 2;
  var offset = window.pageXOffset + halfScreenWidth;

  if (window.pageXOffset >= activityOffset && offset < timeOffset) {
    document.getElementById("activity-dot").style.backgroundColor = "#484848";
    document.getElementById("sticky-nav-activity-label").style.visibility = "visible";
  } else {
    if (offset >= timeOffset && offset < moodOffset) {
      document.getElementById("time-dot").style.backgroundColor = "#484848";
      document.getElementById("sticky-nav-time-label").style.visibility = "visible";
    } else {
      if (offset >= moodOffset && offset < attitudeOffset) {
        document.getElementById("mood-dot").style.backgroundColor = "#484848";
        document.getElementById("sticky-nav-mood-label").style.visibility = "visible";
      } else {
        if (offset >= attitudeOffset && window.pageXOffset < ending_note_right_lineOffset) {
          document.getElementById("attitude-dot").style.backgroundColor = "#484848";
          document.getElementById("sticky-nav-attitude-label").style.visibility = "visible";
        }
      }
    }
  }
} // When the user scrolls the page, execute sticky nav functions


window.onscroll = function () {
  handleStickyNavDisplay();
  highlightCurrentSection();
};
},{"@oberon-amsterdam/horizontal":"node_modules/@oberon-amsterdam/horizontal/index.js","scrollreveal":"node_modules/scrollreveal/dist/scrollreveal.es.js","sweet-scroll":"node_modules/sweet-scroll/sweet-scroll.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53611" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/odyssee.e31bb0bc.js.map