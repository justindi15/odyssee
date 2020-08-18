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
})({"depthBreadthVis.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function drawDepthBreadthPlot(svgClass, everyoneData, personalityData) {
  var svg = d3.select(svgClass);
  var dbData = groupMapByValue(createMapFromPersonality(personalityData, "Do you prefer breadth or depth in life?"));
  var depthActivityList = [];
  var breadthActivityList = []; // excluding rest, self-care, eating and drinking

  var exclusionList = ["i8:", "i3:", "i9:"]; // create aggregate lists for depth/breadth groups

  var _iterator = _createForOfIteratorHelper(dbData["Depth"]),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var email = _step.value;
      var personData = getPersonData(everyoneData, email);
      depthActivityList = depthActivityList.concat(personData);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  var _iterator2 = _createForOfIteratorHelper(dbData["Breadth"]),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var email = _step2.value;
      var personData = getPersonData(everyoneData, email);
      breadthActivityList = breadthActivityList.concat(personData);
    } // get top activities

  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  var depthActivityData = getFrequencyByKey("Activity", depthActivityList);
  var depthTopThree = getTopThreeActivities(depthActivityData, exclusionList);
  var depthPercent = getPercentageOfActivities(depthTopThree, depthActivityList, exclusionList);
  var depthMood = getFrequencyByKey("Feeling", depthActivityList).keys().next().value;
  var breadthActivityData = getFrequencyByKey("Activity", breadthActivityList);
  var breadthTopThree = getTopThreeActivities(breadthActivityData, exclusionList);
  var breadthPercent = getPercentageOfActivities(breadthTopThree, breadthActivityList, exclusionList);
  var breadthMood = getFrequencyByKey("Feeling", breadthActivityList).keys().next().value;
  var depthDistinctActivities = getDistinctActivitiesWithExclusion(depthActivityData, exclusionList.concat(depthTopThree));
  var breadthDistinctActivities = getDistinctActivitiesWithExclusion(breadthActivityData, exclusionList.concat(breadthTopThree)); // let depthDistinctPercent = getPercentageOfActivitiesWithExclusion(Array.from(depthActivityData.keys()), depthActivityList, exclusionList.concat(depthTopThree));
  // let breadthDistinctPercent = getPercentageOfActivitiesWithExclusion(Array.from(breadthActivityData.keys()), breadthActivityList, exclusionList.concat(breadthTopThree));

  var depthDistinctPercent = 1 - depthPercent;
  var breadthDistinctPercent = 1 - breadthPercent; // console.log(depthDistinctActivities)
  // console.log(breadthDistinctActivities)

  var rootScale = d3.scaleLinear().domain([0, 1]).range([height * 0.3, height]);
  var tooltip = addTooltip("depthBreadthTooltip"); // draw ground

  drawImperfectHorizontalLine(svg, padding * 2, width - padding * 2, rootScale(0)); // add text labels

  svg.append("text").attr("x", padding * 2 - 15).attr("y", rootScale(0)).text("breadth").style("text-anchor", "end").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", width - padding * 2 + 15).attr("y", rootScale(0)).text("depth").style("text-anchor", "start").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", width / 2).attr("y", rootScale(0) - 15).text("\"do you prefer breadth or depth in life?\"").style("text-anchor", "middle").style("font-family", "Courier new").style("font-size", 12).style("font-weight", "bold").style("fill", textColor); // draw plants

  svg.append("image").attr('xlink:href', 'images/depth_plant.svg').attr('id', 'depthPlant').attr('x', width * 0.55).attr('y', height * 0.14).attr('width', 300).attr('height', 300).on("mousemove", function () {
    var svgPosY = document.querySelector(svgClass).getBoundingClientRect().y;
    var timeSpentText = "";

    if (d3.event.clientY - svgPosY > rootScale(0)) {
      timeSpentText = "<u>EXPERIENCED DEPTH</u></br></br>" + "<b>% TIME SPENT:</b> " + Math.trunc(depthPercent * 100) + "%" + "</br></br><b># of DISTINCT ACTIVITIES*:</b> 3 most frequent" + "</br></br><b>MODE ACTIVITY FLOW: </b>inflow";
    } else {
      timeSpentText = "<u>EXPERIENCED BREADTH</u></br></br>" + "<b>% TIME SPENT:</b> " + Math.trunc(depthDistinctPercent * 100) + "%" + "</br></br><b># of DISTINCT ACTIVITIES*:</b> " + depthDistinctActivities.size + " (total excluding top 3)" + "</br></br><b>MODE ACTIVITY FLOW: </b>bi-directional";
    }

    var text = timeSpentText + "</br></br><b>MOST FREQUENT MOOD: </b>" + depthMood.toLowerCase();
    setTooltipText(tooltip, text, 20, 250);
  }).on("mouseout", function (d) {
    tooltip.style("visibility", "hidden");
  });
  svg.append("image").attr('xlink:href', 'images/breadth_plant.svg').attr('x', width * 0.15).attr('y', height * 0.14).attr('width', 300).attr('height', 300).on("mousemove", function () {
    var svgPosY = document.querySelector(svgClass).getBoundingClientRect().y;
    var timeSpentText = "";

    if (d3.event.clientY - svgPosY > rootScale(0)) {
      timeSpentText = "<u>EXPERIENCED DEPTH</u></br></br>" + "<b>% TIME SPENT:</b> " + Math.trunc(breadthPercent * 100) + "%" + "</br></br><b># of DISTINCT ACTIVITIES*:</b> 3 most frequent" + "</br></br><b>MODE ACTIVITY FLOW: </b>inflow";
    } else {
      timeSpentText = "<u>EXPERIENCED BREADTH</u></br></br>" + "<b>% TIME SPENT:</b> " + Math.trunc(breadthDistinctPercent * 100) + "%" + "</br></br><b># of DISTINCT ACTIVITIES*:</b> " + breadthDistinctActivities.size + " (total excluding top 3)" + "</br></br><b>MODE ACTIVITY FLOW: </b>bi-directional";
    }

    var text = timeSpentText + "</br></br><b>MOST FREQUENT MOOD: </b>" + breadthMood.toLowerCase();
    setTooltipText(tooltip, text, 20, 250);
  }).on("mouseout", function (d) {
    tooltip.style("visibility", "hidden");
  });
  drawPlantLegend(svg, padding * 7, height * 0.68);
  svg.append("text").attr("x", padding * 7.9).attr("y", height * 0.63).text("length of root").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", padding * 7.9).attr("y", height * 0.65).text("and width of plant represents").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", padding * 7.9).attr("y", height * 0.67).text("% of time spent on a specific").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", padding * 7.9).attr("y", height * 0.69).text("number of activities*").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor); // mode activity legend

  svg.append("text").attr("x", padding * 1.5).attr("y", height * 0.6).text("Mode activity flow type").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("line").attr("x1", padding * 2).attr("x2", padding * 2).attr("y1", height * 0.65).attr("y2", height * 0.7).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  svg.append("line").attr("x1", padding * 4).attr("x2", padding * 4).attr("y1", height * 0.65).attr("y2", height * 0.7).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  svg.append("text").attr("x", padding * 2).attr("y", height * 0.73).text("inflow").style("font-family", "Courier new").style("text-anchor", "middle").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", padding * 4).attr("y", height * 0.73).text("bi-directional").style("text-anchor", "middle").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", padding * 3).attr("y", height * 0.76).text("each shape represents").style("text-anchor", "middle").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", padding * 3).attr("y", height * 0.78).text("a distinct activity*").style("text-anchor", "middle").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor); // symbols for legend

  drawArrow(svg, 2, 0.656);
  drawArrow(svg, 2, 0.667);
  drawArrow(svg, 2, 0.677);
  drawArrow(svg, 2, 0.687);
  drawDiamond(svg, 4, 0.654);
  drawDiamond(svg, 4, 0.668);
  drawDiamond(svg, 4, 0.682); // add takeaway

  svg.append("text").attr("x", width - padding * 5).attr("y", height * 0.5 + 20).text("Self-proclaimed breadth and depth").style("text-anchor", "start").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", width - padding * 5).attr("y", height * 0.5 + 35).text("people don't differ in the").style("text-anchor", "start").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", width - padding * 5).attr("y", height * 0.5 + 50).text("breadth and depth of activities").style("text-anchor", "start").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", width - padding * 5).attr("y", height * 0.5 + 65).text("they do.").style("text-anchor", "start").style("font-family", "Courier new").style("font-size", 12).style("fill", textColor); // most frequent mood legend

  svg.append("text").attr("x", padding * 1.5).attr("y", height - 15).text("*excludes activities such as: rest, self-care, eating and drinking").style("font-family", "Courier new").style("font-size", 10).style("fill", textColor);
  drawMoodHalfLegend(svgClass, "Most frequent mood"); // add title

  drawTitle(svg, "Breadth vs. Depth");
}

function drawArrow(svg, xFactor, yFactor) {
  svg.append("line").attr("x1", padding * xFactor).attr("x2", padding * (xFactor - 0.1)).attr("y1", height * yFactor).attr("y2", height * (yFactor + 0.007)).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  svg.append("line").attr("x1", padding * xFactor).attr("x2", padding * (xFactor + 0.1)).attr("y1", height * yFactor).attr("y2", height * (yFactor + 0.007)).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
}

function drawDiamond(svg, xFactor, yFactor) {
  svg.append("line").attr("x1", padding * xFactor).attr("x2", padding * (xFactor - 0.1)).attr("y1", height * yFactor).attr("y2", height * (yFactor + 0.007)).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  svg.append("line").attr("x2", padding * xFactor).attr("x1", padding * (xFactor - 0.1)).attr("y1", height * (yFactor + 0.007)).attr("y2", height * (yFactor + 0.014)).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  svg.append("line").attr("x1", padding * xFactor).attr("x2", padding * (xFactor + 0.1)).attr("y1", height * yFactor).attr("y2", height * (yFactor + 0.007)).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  svg.append("line").attr("x2", padding * xFactor).attr("x1", padding * (xFactor + 0.1)).attr("y1", height * (yFactor + 0.007)).attr("y2", height * (yFactor + 0.014)).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
}
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55859" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","depthBreadthVis.js"], null)
//# sourceMappingURL=/depthBreadthVis.df497e73.js.map