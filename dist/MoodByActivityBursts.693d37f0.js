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
})({"javascript/MoodByActivityBursts.js":[function(require,module,exports) {
var dashArrayForBursts = {
  "I want to": "0.25 4",
  "I have to": "3 4",
  "I want to and have to": "0.25 4 3 4",
  "of something else; I neither want to nor have to": "1000"
};
var tooltip;
/**
 *   svgClass: tag for svg clas, must include the '.'
 *   data: list of data entries from excel 
 *   centerX: x location for center of burst
 *   centerY: y location for center of burst
 *   mood: mood that the burst represents, ie "Good" -- used for color of burst
 *   returns void, handles drawing of one burst 
 */

function drawBurst(svgClass, data, centerX, centerY, activity, mood, avgMood, divisionFactor) {
  var svg = d3.select(svgClass);
  var lengthOfTick = 17;
  var totalTicks = getTotalFrequencyFromMap(data);
  var offset = totalTicks < 10 ? 1 : divisionFactor;
  var numVisibleTicks = Math.floor(totalTicks / offset);
  var innerRadius = numVisibleTicks < 10 ? 0 : numVisibleTicks * lengthOfTick / 10 - 10;
  var outerRadius = innerRadius + lengthOfTick;
  var radialScale = d3.scaleLinear().domain([0, numVisibleTicks]).range([0, 2 * Math.PI]);
  var count = 0;
  var keys = Object.keys(data); // drawing lines for single burst

  for (var i = 0; i < keys.length; i++) {
    var reason = keys[i];

    for (var j = 0; j < data[reason]; j += offset) {
      svg.append("line").attr("x1", centerX + innerRadius * Math.cos(radialScale(count))).attr("x2", centerX + outerRadius * Math.cos(radialScale(count))).attr("y1", centerY + innerRadius * Math.sin(radialScale(count))).attr("y2", centerY + outerRadius * Math.sin(radialScale(count))).attr("stroke", colorHexArray[mood]).attr("stroke-width", 2.5).style("stroke-linecap", "round").style("stroke-dasharray", dashArray[reason]);
      count += 1;
    }
  }

  svg.append('circle').attr('cx', centerX).attr('cy', centerY).attr('r', outerRadius).style('opacity', 0).on('mousemove', function () {
    var tooltipText = "<b>ACTIVITY:</b> " + activity + "</br></br><b>FREQUENCY: </b>" + totalTicks + "</br></br><b>MOOD: </b>" + mood.toLowerCase() + " (<b>AVERAGE: </b> " + avgMood + ")" + "</br></br><b>MOST FREQUENT ATTITUDE: </b>" + attitudeLongtoShort[getKeyWithHighestValue(data)];
    setTooltipText(tooltip, tooltipText, 20, 250);
  }).on("mouseout", function (d) {
    tooltip.style("visibility", "hidden");
  });
}
/**
 *   svgClass: tag for svg clas, must include the '.'
 *   categoryMap: map of short activity keys ("b5") to frequency
 *   categoryFullMap: map of long formed activity keys ("eating and drinking") to frequency
 *   title: title of graph
 *   personData: list of data entries
 *   returns void, handles drawing of entire vis 
 */


function drawMoodByActivityBursts(svgClass, categoryMap, categoryFullMap, personData, title) {
  var svg = d3.select(svgClass);
  var keyList = Array.from(categoryMap.keys()).slice(0, numIcons);
  var keyList2 = Array.from(categoryFullMap.keys()).slice(0, numIcons);
  var reasonByActivity = getFrequencyByKeys("Activity", "Reason", personData);
  var feelingByActivity = getFrequencyByKeys("Activity", "Feeling", personData);
  var burstMap = getFrequencyByThreeKeys("Activity", "Feeling", "Reason", keyList, personData);
  var avgMap = findAvgMood(keyList, feelingByActivity, false);
  var stdDevMap = findStdDevMood(keyList, feelingByActivity, avgMap);
  var xScale = d3.scaleBand().domain(keyList).range([padding * 2.5, width]);
  var yScale = d3.scaleLinear().domain([0, 4]).range([height - padding * 5, padding * 2]);
  tooltip = addTooltip("#moodBurstTooltip"); // draw std dev lines per activity

  svg.selectAll(".stdDevLines").data(keyList).enter().append("line").attr("x1", function (d) {
    return xScale(d) + 10;
  }).attr("x2", function (d) {
    return xScale(d) + 10;
  }).attr("y1", function (d) {
    return yScale(avgMap[d] - stdDevMap[d]);
  }).attr("y2", function (d) {
    return yScale(avgMap[d] + stdDevMap[d]);
  }).attr("stroke", "#cdcdcd").attr("stroke-width", 2.5).style("opacity", 0.4).style("stroke-linecap", "round"); // draw dots for average mood per activity

  svg.selectAll(".avgDots").data(keyList).enter().append("circle").attr("cx", function (d) {
    return xScale(d) + 10;
  }).attr("cy", function (d) {
    return yScale(avgMap[d]);
  }).attr("r", 5).style("fill", function (d) {
    return colorHexArray[moodList[Math.round(avgMap[d])]];
  });
  var maxTicks = 0;
  keyList.forEach(function (activity, i) {
    // add icons
    svg.append('image').attr('xlink:href', 'images/' + activity + '.svg').attr('x', xScale(keyList[i]) - 25).attr('y', yScale(0) + 40).attr('width', iconWidth).attr('height', iconWidth).style('filter', function () {
      return 'url(#' + moodList[Math.round(avgMap[keyList[i]])] + ')';
    });
    Object.keys(burstMap[activity]).forEach(function (mood) {
      var tempNumTicks = getTotalFrequencyFromMap(burstMap[activity][mood]);
      maxTicks = maxTicks < tempNumTicks ? tempNumTicks : maxTicks;
    }); //draw bursts

    Object.keys(burstMap[activity]).forEach(function (mood) {
      var burstData = burstMap[activity][mood];
      drawBurst(svgClass, burstData, xScale(keyList[i]) + 10, yScale(moodList.indexOf(mood)), keyList2[i].split("(")[0].toLowerCase(), mood, moodList[Math.round(avgMap[activity])].toLowerCase(), Math.ceil(maxTicks / 30));
    });
  }); //add y axis

  var yAxis = d3.select(svgClass).append("g").attr("class", "y_axis").attr("transform", "translate(" + padding + ", 0)").call(d3.axisRight(yScale).ticks(5).tickFormat(function (d) {
    return moodList[d];
  }));
  yAxis.selectAll("text").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "end").style("fill", function (d) {
    return colorHexArray[moodList[d]];
  }).style("font-size", 12); // add title

  drawTitle(svg, title); // add avg line + std legend

  svg.append("line").attr("x1", width * 0.8).attr("x2", width * 0.8).attr("y1", height - padding * 1.75).attr("y2", height - padding * 0.1).attr("stroke", "#cdcdcd").attr("stroke-width", 2.5).style("opacity", 0.4).style("stroke-linecap", "round");
  svg.append("circle").attr("cx", width * 0.8).attr("cy", height - padding * 1.15).attr("r", 6).style("fill", textColor);
  svg.append("text").attr("x", width * 0.78).attr("y", height - padding * 1.15 - 15).text("average").style("font-family", "Courier new").style("text-anchor", "end").style("fill", textColor).style("font-size", 12);
  svg.append("text").attr("x", width * 0.78).attr("y", height - padding * 1.15).text("mood").style("font-family", "Courier new").style("text-anchor", "end").style("fill", textColor).style("font-size", 12);
  svg.append("text").attr("x", width * 0.81).attr("y", height - padding * 0.1 - 15).text("standard").style("font-family", "Courier new").style("text-anchor", "start").style("fill", textColor).style("font-size", 12);
  svg.append("text").attr("x", width * 0.81).attr("y", height - padding * 0.1).text("deviation").style("font-family", "Courier new").style("text-anchor", "start").style("fill", textColor).style("font-size", 12); // add attitude legend

  svg.append("text").attr("x", padding * 3 + width * 0.22).attr("y", height - padding * 1.75).text("one tick represents " + Math.ceil(maxTicks / 30) + " ticks").style("font-family", "Courier new").style("text-anchor", "middle").style("fill", textColor).style("font-size", 12);
  var attitudeLegend = svg.append("g").attr("class", "attitudeLegend").attr("width", width * 0.44).attr("transform", "translate(" + padding * 3 + "," + (height - padding * 1.75) + ")");
  drawAttitudeLegendData(attitudeLegend, attitudeList);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57049" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/MoodByActivityBursts.js"], null)
//# sourceMappingURL=/MoodByActivityBursts.693d37f0.js.map