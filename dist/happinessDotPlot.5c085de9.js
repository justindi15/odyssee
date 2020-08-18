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
})({"javascript/happinessDotPlot.js":[function(require,module,exports) {
/**
 *   svgClass: tag for svg class, must include the "."
 *   personalityData: list of personality data for everyone
 *   everyoneData: records for everyone
 *   returns void, draws data vis for happiness dot plot
 */
function drawHappinessDotPlot(svgClass, everyoneData, personalityData) {
  var email = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var baseSvg = d3.select(svgClass);
  var height = baseSvg.attr("height");
  var width = baseSvg.attr("width");
  var svgX = width / 2 - (width - 400) / 2;
  var svg = baseSvg.append("svg").attr("height", height).attr("width", width - 400).attr("x", svgX);
  height = svg.attr("height");
  width = svg.attr("width"); // console.log(personalityData);
  // Add title.

  drawTitle(svg, "Remembered vs. Experienced Happiness"); // Setup happinessData.

  var happinessData = {};

  for (var i = 1; i <= 5; i++) {
    happinessData[i] = [];
  }

  var myData = null;
  personalityData.forEach(function (person) {
    var recordsForUser = getPersonData(everyoneData, person[keys.personality.email]); // average of moods is y position

    var rememberedHappiness = Number(person[keys.personality.happiness]); // x position

    var moodScores = recordsForUser.map(function (record) {
      return moodToScore[record[keys.everyone.mood]];
    });
    var experiencedHappiness = getAverage(moodScores); // Remembered can be NaN if user did not record any data. Also check that experienced is not NaN to be safe.

    if (!isNaN(rememberedHappiness) && !isNaN(experiencedHappiness)) {
      happinessData[rememberedHappiness].push(experiencedHappiness);

      if (email == person[keys.personality.email]) {
        myData = {
          experienced: experiencedHappiness,
          remembered: rememberedHappiness
        };
      }
    }
  }); // console.log(happinessData);
  // Get group average and standard deviation.

  var experiencedData = Object.keys(happinessData).map(function (r) {
    return happinessData[r];
  }).flat();
  var rememberedData = Object.keys(happinessData).map(function (r) {
    return happinessData[r].map(function (_) {
      return Number(r);
    });
  }).flat();
  var groupAverage = {
    experienced: getAverage(experiencedData),
    remembered: getAverage(rememberedData)
  };
  var groupStdDev = {
    experienced: calculateStdDev(experiencedData, groupAverage.experienced),
    remembered: calculateStdDev(rememberedData, groupAverage.remembered)
  }; // console.log(experiencedData);
  // console.log(rememberedData);
  // console.log(groupAverage);
  // console.log(groupStdDev);
  // Setup scales.

  var rememberedScale = d3.scaleLinear().domain([0, 5]).range([height - 6 * padding, 120]);
  var experiencedScale = d3.scaleLinear().domain([0, 5]).range([4 * padding, width - 3 * padding]);
  var graphPadding = 48; // Add graph labels.

  var graphLabelInterTextPadding = 48;

  for (var _i = 0; _i <= 5; _i++) {
    drawText(svg, _i == 5 ? "5 - Strongly Agree" : _i, {
      x: experiencedScale(0) - graphPadding,
      y: rememberedScale(_i),
      textAnchor: "start"
    });
  }

  for (var _i2 = 1; _i2 <= 5; _i2++) {
    drawText(svg, _i2 == 5 ? "5 - Amazing" : _i2, {
      x: experiencedScale(_i2),
      y: rememberedScale(0) + graphPadding,
      textAnchor: _i2 == 5 ? "start" : "middle"
    });
  }

  drawText(svg, '"I am generally happy with my life."', {
    x: experiencedScale(0) - graphPadding - graphLabelInterTextPadding,
    y: rememberedScale(2.5),
    transform: "rotate(270 " + (experiencedScale(0) - graphPadding - graphLabelInterTextPadding) + " " + rememberedScale(2.5) + ")",
    fontWeight: "bold"
  });
  drawText(svg, '"How are you feeling?"', {
    x: experiencedScale(2.5),
    y: rememberedScale(0) + graphPadding + graphLabelInterTextPadding,
    fontWeight: "bold"
  }); // Plot standard deviation lines and labels.

  var plotLineInterPadding = 56;
  var plotLineTextOffset = 20;
  var groupMin = {
    experienced: d3.min(experiencedData),
    remembered: d3.min(rememberedData)
  };
  var plotLineAttr = {
    experienced: {
      x1: experiencedScale(groupAverage.experienced - groupStdDev.experienced),
      x2: experiencedScale(groupAverage.experienced + groupStdDev.experienced),
      y: rememberedScale(groupMin.remembered) + plotLineInterPadding
    },
    remembered: {
      x: experiencedScale(groupMin.experienced) - plotLineInterPadding,
      y1: rememberedScale(groupAverage.remembered - groupStdDev.remembered),
      y2: rememberedScale(groupAverage.remembered + groupStdDev.remembered)
    }
  };
  svg.append("line").attr("x1", plotLineAttr.experienced.x1).attr("x2", plotLineAttr.experienced.x2).attr("y1", plotLineAttr.experienced.y).attr("y2", plotLineAttr.experienced.y).attr("stroke", greyColor).attr("stroke-width", 2);
  drawTab(svg, plotLineAttr.experienced.x1, plotLineAttr.experienced.y, "vertical");
  drawTab(svg, plotLineAttr.experienced.x2, plotLineAttr.experienced.y, "vertical");
  drawText(svg, "experienced happiness", {
    x: experiencedScale(groupAverage.experienced),
    y: plotLineAttr.experienced.y + plotLineTextOffset
  });
  svg.append("line").attr("x1", plotLineAttr.remembered.x).attr("x2", plotLineAttr.remembered.x).attr("y1", plotLineAttr.remembered.y1).attr("y2", plotLineAttr.remembered.y2).attr("stroke", greyColor).attr("stroke-width", 2);
  drawTab(svg, plotLineAttr.remembered.x, plotLineAttr.remembered.y1, "horizontal");
  drawTab(svg, plotLineAttr.remembered.x, plotLineAttr.remembered.y2, "horizontal");
  drawText(svg, "remembered happiness", {
    x: plotLineAttr.remembered.x - plotLineTextOffset,
    y: rememberedScale(groupAverage.remembered),
    transform: "rotate(270 " + (plotLineAttr.remembered.x - plotLineTextOffset) + " " + rememberedScale(groupAverage.remembered) + ")"
  });
  var tooltipId = "happinessDotPlotTooltipId";
  var tooltip = d3.select("body").append("div").attr("id", tooltipId).style("padding", 10).style("position", "absolute").style("z-index", "10").style("visibility", "hidden").attr("white-space", "pre-line").style("background-color", backgroundColor).style("border-radius", "15px").style("border", "1px solid #cdcdcd").style("font-family", "Courier new").style("font-size", 12).style("text-align", "left").style("color", textColor).style("max-width", 250); // Plot points.

  Object.keys(happinessData).forEach(function (r) {
    if (happinessData[r].length > 0) {
      var average = getAverage(happinessData[r]);
      var rectAttr = {
        height: 36,
        width: experiencedScale(5) - experiencedScale(0) + graphPadding + 12
      };
      var tooltipText = "<b>REMEMBERED HAPPINESS:</b> " + r + "</br></br><b>EXPERIENCED HAPPINESS AVG: </b>" + Math.round(average * 100) / 100 + "</br></br><b>FREQUENCY: </b>" + happinessData[r].length;
      var g = svg.append("g");
      var rect = g.append("rect").attr("x", experiencedScale(0) - graphPadding - 12).attr("y", rememberedScale(r) - rectAttr.height / 2).attr("height", rectAttr.height).attr("width", rectAttr.width).attr("fill", "#c4c4c41a").attr("opacity", 0).attr("rx", 4).attr("stroke", greyColor).attr("stroke-width", 1); // Draw points per person.

      happinessData[r].forEach(function (e) {
        g.append("circle").attr("cx", experiencedScale(e)).attr("cy", rememberedScale(r)).attr("r", 4).attr("fill", colorHexArray[scoreToMood[Math.round(e)]]);
      }); // Draw average.

      g.append("circle").attr("cx", experiencedScale(average)).attr("cy", rememberedScale(r)).attr("r", 5).attr("fill", textColor);

      if (myData != null) {
        if (email != null && myData.remembered == r) {
          tooltipText += "</br></br><b>YOU ARE IN THIS REMEMBERED HAPPINESS GROUP</b>";
        }

        g.append("circle").attr("cx", experiencedScale(myData.experienced)).attr("cy", rememberedScale(myData.remembered)).attr("r", 10).attr("fill", "none").attr("stroke", greyColor).attr("stroke-width", 1.5);
      }

      g.on("mousemove", function () {
        showTooltip(tooltipText, rect);
      }).on("mouseout", function () {
        hideTooltip(rect);
      });
    }
  });

  function showTooltip(html, rect) {
    tooltip.html(html).style("visibility", "visible").style("top", event.pageY + 20).style("left", function () {
      if (d3.event.clientX < 750) {
        return event.pageX + 20 + "px";
      } else {
        return event.pageX - document.getElementById(tooltipId).clientWidth - 20 + "px";
      }
    });
    rect.attr("opacity", 1);
  }

  function hideTooltip(rect) {
    tooltip.style("visibility", "hidden");
    rect.attr("opacity", 0);
  } // Draw mood legend.


  var moodLegendAttr = {
    x: 2 * padding,
    y: height - padding * 2.5,
    width: (width - 4 * padding) * 2 / 3
  };
  var moodLegend = svg.append("g").attr("class", "moodLegend").attr("width", moodLegendAttr.width).attr("transform", "translate(" + moodLegendAttr.x + "," + moodLegendAttr.y + ")");
  drawMoodLegend(moodLegend, "Most frequent mood", moodList);
  drawStdDevAvgLegend(svg);
  var baseAnnotationY = rememberedScale(5);
  var annotation = ["Remembered happiness", "varies more than", "experienced happiness."];
  annotation.forEach(function (line, i) {
    drawText(baseSvg, line, {
      x: svgX + width * 0.9,
      y: baseAnnotationY + 16 * i,
      textAnchor: "start",
      fontWeight: "bold"
    });
  });
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/happinessDotPlot.js"], null)
//# sourceMappingURL=/happinessDotPlot.5c085de9.js.map