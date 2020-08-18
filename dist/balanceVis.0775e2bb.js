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
})({"balanceVis.js":[function(require,module,exports) {
function drawBalanceGraph(svgClass, everyoneData, personalityData) {
  var svg = d3.select(svgClass);
  var balanceData = groupMapByValue(createMapFromPersonality(personalityData, "Balanced", balanceLongToShort));
  var balanceKeys = ["yes happy", "yes unhappy", "no happy", "no unhappy"];
  var bWidth = 1200;
  var dataForGraph = [];
  var avgStdDataForGraph = [];

  for (var _i = 0, _balanceKeys = balanceKeys; _i < _balanceKeys.length; _i++) {
    var key = _balanceKeys[_i];
    var totalHaveToPercent = 0;
    var totalWantToPercent = 0;
    var totalHaveToAvg = 0;
    var totalWantToAvg = 0;
    var haveToList = [];
    var wantToList = [];
    var count = 0;

    for (var i = 0; i < balanceData[key].length; i++) {
      var email = balanceData[key][i];
      var personData = getPersonData(everyoneData, email);
      var frequencyMap = getFrequencyByKey("Reason", personData);
      var haveToPercent = calculatePercentageByKey(frequencyMap, "I have to");
      var wantToPercent = calculatePercentageByKey(frequencyMap, "I want to");
      var haveToAvg = findAvgMoodByKey(personData, "Reason", "I have to");
      var wantToAvg = findAvgMoodByKey(personData, "Reason", "I want to"); // remove NaN values

      if (!Number.isNaN(haveToAvg)) {
        totalHaveToPercent += haveToPercent;
        totalHaveToAvg += haveToAvg;
        haveToList.push(haveToPercent);
      }

      if (!Number.isNaN(haveToAvg)) {
        totalWantToPercent += wantToPercent;
        totalWantToAvg += wantToAvg;
        wantToList.push(wantToPercent);
      }

      if (!Number.isNaN(haveToPercent)) {
        dataForGraph.push({
          "x": key + ":have to",
          "y": haveToPercent,
          "avg": haveToAvg
        });
      }

      if (!Number.isNaN(wantToPercent)) {
        dataForGraph.push({
          "x": key + ":want to",
          "y": wantToPercent,
          "avg": wantToAvg
        });
      }
    }

    avgStdDataForGraph.push({
      "x": key + ":have to",
      "y": totalHaveToPercent / haveToList.length,
      "count": haveToList.length,
      "min": d3.extent(haveToList)[0],
      "max": d3.extent(haveToList)[1],
      "avg": totalHaveToAvg / haveToList.length,
      "std": calculateStdDev(haveToList, totalHaveToPercent / haveToList.length)
    });
    avgStdDataForGraph.push({
      "x": key + ":want to",
      "y": totalWantToPercent / wantToList.length,
      "count": wantToList.length,
      "min": d3.extent(wantToList)[0],
      "max": d3.extent(wantToList)[1],
      "avg": totalWantToAvg / wantToList.length,
      "std": calculateStdDev(wantToList, totalWantToPercent / wantToList.length)
    });
  }

  var xScale = d3.scaleBand().domain(balanceKeys).range([padding * 5, bWidth - padding * 2.5]);
  var yScale = d3.scaleLinear().domain([0, 1]).range([height - padding * 5.75, 0]);
  var tooltip = addTooltip("#balanceTooltip"); // add tooltip highlight

  svg.selectAll(".balanceRect").data(avgStdDataForGraph).enter().append("rect").attr("id", function (d) {
    return d.x;
  }).attr('x', function (d) {
    var key1 = d.x.split(":")[0];
    var key2 = d.x.split(":")[1];
    var offset = key2 == "want to" ? 15 : -25;
    return xScale(key1) - offset;
  }).attr('y', yScale(0.82)).attr('height', yScale(0) - yScale(0.82)).attr('width', 30).attr('fill', '#c4c4c41a').attr('opacity', 0).attr('rx', 4).attr('stroke', greyColor).attr('stroke-width', 1).on("mousemove", function (d) {
    var attitude = d.x.split(":")[1];
    var tooltipText = "<b>ATTITUDE:</b> " + attitude + "</br></br><b>FREQUENCY: </b>" + d.count + "</br></br><b>AVERAGE TIME SPENT: </b>" + Math.trunc(d.y * 100) + "%" + "</br></br><b>MIN TIME SPENT: </b>" + Math.trunc(d.min * 100) + "%" + "</br></br><b>MAX TIME SPENT: </b>" + Math.trunc(d.max * 100) + "%";
    setTooltipText(tooltip, tooltipText, 20, 220);
    event.target.style.opacity = 1;
  }).on("mouseout", function (d) {
    tooltip.style("visibility", "hidden");
    event.target.style.opacity = 0;
  }); // add std lines for each balance/reason category

  svg.selectAll(".balanceStdLines").data(avgStdDataForGraph).enter().append("line").attr("x1", function (d) {
    var key1 = d.x.split(":")[0];
    var key2 = d.x.split(":")[1];
    var offset = key2 == "want to" ? 0 : 40;
    return xScale(key1) + offset;
  }).attr("x2", function (d) {
    var key1 = d.x.split(":")[0];
    var key2 = d.x.split(":")[1];
    var offset = key2 == "want to" ? 0 : 40;
    return xScale(key1) + offset;
  }).attr("y1", function (d) {
    return yScale(d.y - d.std);
  }).attr("y2", function (d) {
    return yScale(d.y + d.std);
  }).attr("stroke", function (d) {
    return colorHexArray[moodList[Math.round(d.avg)]];
  }).attr("stroke-width", 2.5).style("stroke-linecap", "round").style("stroke-dasharray", function (d) {
    return dashArray[attitudeShorttoLong[d.x.split(":")[1]]];
  }); // add dots for each user

  svg.selectAll(".userDots").data(dataForGraph).enter().append("circle").attr("cx", function (d) {
    var key1 = d.x.split(":")[0];
    var key2 = d.x.split(":")[1];
    var offset = key2 == "want to" ? 0 : 40;
    return xScale(key1) + offset;
  }).attr("cy", function (d) {
    return yScale(d.y);
  }).attr("r", 4).style("fill", function (d) {
    return colorHexArray[moodList[d.avg]];
  }); // add dots for group avg of each category

  svg.selectAll(".balanceAvgDots").data(avgStdDataForGraph).enter().append("circle").attr("cx", function (d) {
    var key1 = d.x.split(":")[0];
    var key2 = d.x.split(":")[1];
    var offset = key2 == "want to" ? 0 : 40;
    return xScale(key1) + offset;
  }).attr("cy", function (d) {
    return yScale(d.y);
  }).attr("r", 5).style("fill", textColor); // add icons on x axis

  for (var _i2 = 0, _balanceKeys2 = balanceKeys; _i2 < _balanceKeys2.length; _i2++) {
    var category = _balanceKeys2[_i2];
    svg.append('image').attr('xlink:href', 'images/' + category + '.svg').attr('x', xScale(category) - 10).attr('y', yScale(0) + 10).attr('width', iconWidth - 10).attr('height', iconWidth - 10);
    svg.append('text').attr('x', xScale(category) + iconWidth / 2 - 15).attr('y', yScale(0) + iconWidth + 10).text(balanceShortToLong1[category]).style("font-family", "Courier new").style("text-anchor", "middle").style("font-size", 11).style("fill", textColor);
    svg.append('text').attr('x', xScale(category) + iconWidth / 2 - 15).attr('y', yScale(0) + iconWidth + 25).text(balanceShortToLong2[category]).style("font-family", "Courier new").style("text-anchor", "middle").style("font-size", 11).style("fill", textColor);
  } //add x axis label


  svg.append("text").attr("x", bWidth * 0.48).attr("y", yScale(0) + iconWidth + 50).text("Do you think your life is balanced?").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "middle").style("font-size", 12).style("fill", textColor); //add y axis text

  svg.append("text").attr("x", padding * 4).attr("y", yScale(0.85)).text("% of time spent").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "end").style("font-size", 11).style("fill", textColor);
  var yAxis = d3.select(svgClass).append("g").attr("class", "y_axis").attr("transform", "translate(" + padding * 3.5 + ", 0)").call(d3.axisRight(yScale).ticks(5).tickFormat(function (d, i, n) {
    return n[i + 1] ? d * 100 : "";
  }));
  yAxis.selectAll("text").style("font-family", "Courier new").style("text-anchor", "end").style("fill", textColor).style("font-size", 11); // add takeaway

  svg.append("text").attr("x", bWidth * 0.715).attr("y", height * 0.01).text("There are two types of self-proclaimed").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "start").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", bWidth * 0.715).attr("y", height * 0.01 + 15).text("unbalanced and unhappy people: passion").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "start").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", bWidth * 0.715).attr("y", height * 0.01 + 30).text("seekers (people who do what they want)").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "start").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", bWidth * 0.715).attr("y", height * 0.01 + 45).text("and obligators (people who do what they").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "start").style("font-size", 12).style("fill", textColor);
  svg.append("text").attr("x", bWidth * 0.715).attr("y", height * 0.01 + 60).text("have to do).").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "start").style("font-size", 12).style("fill", textColor);
  svg.append("line").attr("x1", bWidth * 0.715).attr("x2", bWidth * 0.715).attr("y1", yScale(0.78)).attr("y2", yScale(0.82)).style("stroke", "#cdcdcd").style("stroke-width", 2.5);
  svg.append("line").attr("x1", bWidth * 0.715).attr("x2", bWidth * 0.765).attr("y1", yScale(0.82)).attr("y2", yScale(0.82)).style("stroke", "#cdcdcd").style("stroke-width", 2.5);
  svg.append("line").attr("x1", bWidth * 0.765).attr("x2", bWidth * 0.765).attr("y1", yScale(0.78)).attr("y2", yScale(0.82)).style("stroke", "#cdcdcd").style("stroke-width", 2.5); // add legends

  drawStdDevAvgLegend(svg);
  var attitudeLegendAttr = {
    x: bWidth * 0.55,
    y: height - padding * 2.5,
    width: bWidth * 0.1
  };
  var attitudeLegend = svg.append("g").attr("class", "attitudeLegend").attr("width", attitudeLegendAttr.width).attr("transform", "translate(" + attitudeLegendAttr.x + "," + attitudeLegendAttr.y + ")");
  drawAttitudeLegend(attitudeLegend, "Attitude", ["want to", "have to"]);
  drawMoodHalfLegend(svgClass, "Most frequent mood"); // add title

  drawTitle(svg, "Balanced vs. Unbalanced");
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","balanceVis.js"], null)
//# sourceMappingURL=/balanceVis.0775e2bb.js.map