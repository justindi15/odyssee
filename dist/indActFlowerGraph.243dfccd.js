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
})({"javascript/indActFlowerGraph.js":[function(require,module,exports) {
/**
 *   svgClass: tag for svg class, must include the '.'
 *   title: title of graph
 *   personData: list of data entries
 *   returns void, draws data vis for individual activity flowers
 */
function drawIndActivityFlower(svgClass, title, personData) {
  var svg = d3.select(svgClass);
  var height = svg.attr('height');
  var width = svg.attr('width');
  var newMoodList = Array.from(moodList);
  var categoryMap = getFrequencyByKey("Activity", personData);
  var categoryFullMap = getFrequencyByKey("Activity", personData, 1); // Show top 7 activities or activities with more than 5 records, whichever is fewer.

  var numIcons = 7;
  var keyList = Array.from(categoryMap.keys()).slice(0, numIcons);
  var keyListFiltered = keyList.filter(function (k) {
    return categoryMap.get(k) > 5;
  });
  keyList = keyListFiltered.length != 0 && keyListFiltered.length < keyList.length ? keyListFiltered : keyList;
  var keyList2 = Array.from(categoryFullMap.keys()).slice(0, numIcons);
  var keyList2Filtered = keyList2.filter(function (k) {
    return categoryFullMap.get(k) > 5;
  });
  keyList2 = keyList2Filtered.length != 0 && keyList2Filtered.length < keyList2.length ? keyList2Filtered : keyList2; // Sort activities by greatest to least entries.

  keyList.sort(function (a, b) {
    return compareKeyList(a, b, personData);
  });
  keyList2.sort(function (a, b) {
    return compareKeyList(a, b, personData);
  }); // Setup scales.

  var xScale = d3.scaleBand().domain(keyList).range([padding * 2, width - padding * 2]); // Add title.

  drawTitle(svg, title); // Function for drawing flower.

  function drawFlower(svgClass, centerX, centerY, length, flowerMap, n) {
    var svg = d3.select(svgClass); // n: Number of petals.
    // let n = data.length;

    var innerRadius = 0;
    var outerRadius = innerRadius + length; // Setup scales.

    var radialScale = d3.scaleLinear().domain([0, n - 1]).range([-Math.PI, 0]);
    var count = 0;
    newMoodList.sort(compareMoods).forEach(function (mood) {
      attitudeList.forEach(function (attitude) {
        // console.log("mood, attitude: " + mood + ", " + attitude)
        // console.log(flowerMap[mood][attitude])
        var numPetals = flowerMap[mood][attitude];

        while (numPetals > 0) {
          svg.append("line").attr("x1", centerX + innerRadius * Math.cos(radialScale(count))).attr("x2", centerX + outerRadius * Math.cos(radialScale(count))).attr("y1", centerY + innerRadius * Math.sin(radialScale(count))).attr("y2", centerY + outerRadius * Math.sin(radialScale(count))).attr("stroke", colorHexArray[mood]).attr("stroke-width", 2.5).style("stroke-linecap", "round").style("stroke-dasharray", dashArray[attitudeShorttoLong[attitude]]);
          count += 1;
          numPetals -= 1;
        }
      });
    });
  }

  function emptyFlowerMap() {
    var flowerMap = {};
    newMoodList.forEach(function (mood) {
      flowerMap[mood] = {};
      attitudeList.forEach(function (attitude) {
        flowerMap[mood][attitude] = 0;
      });
    });
    return flowerMap;
  } // Check if there are more than 40 entries.


  var maxPoints = d3.max(keyList, function (d) {
    return getPersonDataByActivity(personData, d).length;
  });
  var petalDivisor = maxPoints > 40 ? 2 : 1; // Setup tooltip.

  var tooltipId = "indActFlowerGraphTooltipId";
  var tooltip = d3.select("body").append("div").attr("id", tooltipId).style("padding", 10).style("position", "absolute").style("z-index", "10").style("visibility", "hidden").attr("white-space", "pre-line").style("background-color", backgroundColor).style("border-radius", "15px").style("border", "1px solid #cdcdcd");
  var petalChartBottomPadding = 140;
  var petalChartTopPadding = 80;
  var interFlowerPadding = 16;
  var flowerGraphWidth = width - padding * 4;
  var petalScaleMaxYOptions = [(height - petalChartBottomPadding - petalChartTopPadding) / 2, (flowerGraphWidth - interFlowerPadding * (keyList.length - 1)) / keyList.length / 2];
  var petalScale = d3.scaleLinear().domain([0, maxPoints]).range([8, Math.min(petalScaleMaxYOptions[0], petalScaleMaxYOptions[1])]); // Draw flowers.

  keyList.forEach(function (d, i) {
    var data = getPersonDataByActivity(personData, d); // console.log(data)
    // Initialize rounding offset.

    var roundingOffset = Math.round(Math.random()); // Set up data map for flower petals.

    var flowerDataMap = emptyFlowerMap();
    data.forEach(function (d) {
      // console.log(d.Feeling + ", " + d.Reason + ": " + flowerDataMap[d.Feeling][attitudeLongtoShort[d.Reason]])
      flowerDataMap[d.Feeling][attitudeLongtoShort[d.Reason]] += 1;
    });
    var n = 0; // n: Number of petals.
    // Update flowerDataMap if more than 40 entries.
    // Update n to reflect number of petals.

    newMoodList.forEach(function (mood) {
      attitudeList.forEach(function (attitude) {
        var num = flowerDataMap[mood][attitude];

        if (petalDivisor == 1 || num % 2 == 0) {
          num = num / petalDivisor;
        } else {
          // Alternate between rounding up and rounding down.
          num = Math.floor(num / petalDivisor) + roundingOffset;
          roundingOffset = roundingOffset == 0 ? 1 : 0;
        }

        flowerDataMap[mood][attitude] = num;
        n += num;
      });
    }); // console.log(flowerDataMap)

    var length = petalScale(data.length);
    var centeringOffset = (width - 4 * padding) / keyList.length / 2;
    var flowerCenter = {
      x: xScale(keyList[i]) + centeringOffset,
      y: height - length - petalChartBottomPadding
    };
    svg.append('filter').attr('id', 'Grey').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 0 0.8 0 0 0 1 0");
    svg.append('image').attr('xlink:href', 'images/' + d + '.svg').attr('x', flowerCenter.x - length / 2).attr('y', flowerCenter.y).attr('width', length).attr('height', length).style('filter', function () {
      return 'url(#Grey)';
    }).on("mousemove", function () {
      var tooltipText = "<b>ACTIVITY:</b> " + keyList2[i].split("(")[0].toLowerCase() + "</br></br><b>FREQUENCY: </b>" + data.length;
      tooltip.html(tooltipText).style("font-family", "Courier new").style("font-size", 12).style("text-align", "left").style("color", textColor).style("visibility", "visible").style("max-width", 250).style("top", event.pageY + 20).style("left", function () {
        if (d3.event.clientX < 750) {
          return event.pageX + 20 + "px";
        } else {
          return event.pageX - document.getElementById(tooltipId).clientWidth - 20 + "px";
        }
      });
    }).on("mouseout", function (d) {
      tooltip.style("visibility", "hidden");
    }); // Draw flower.

    drawFlower(svgClass, flowerCenter.x, flowerCenter.y, length, flowerDataMap, n);
  }); // Add legends.

  var moodLegendAttr = {
    x: padding,
    y: height - padding * 2.5,
    width: width / 2 - padding * 4
  };
  var attitudeLegendAttr = {
    x: width / 2 + padding * 3,
    y: height - padding * 2.5,
    width: width - (width / 2 + padding * 3) - padding
  };
  var moodLegend = svg.append("g").attr("class", "moodLegend").attr("width", moodLegendAttr.width).attr("transform", "translate(" + moodLegendAttr.x + "," + moodLegendAttr.y + ")");
  var flowerLegend = svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height - padding * 2.5) + ")");
  var attitudeLegend = svg.append("g").attr("class", "attitudeLegend").attr("width", attitudeLegendAttr.width).attr("transform", "translate(" + attitudeLegendAttr.x + "," + attitudeLegendAttr.y + ")");
  drawMoodLegendData(moodLegend, newMoodList);
  drawFlowerLegend(flowerLegend, petalDivisor);
  drawAttitudeLegendData(attitudeLegend, attitudeList); // Function for drawing flower legend.

  function drawFlowerLegend(flowerLegend, petalDivisor) {
    var attitudes = ["I want to", "I have to", "I want to and have to", "of something else; I neither want to nor have to"];
    var flowerPadding = 12;
    var flowerCenter = {
      x: 0,
      y: padding * 1.65 - flowerPadding - 12
    };
    var flowerPetalLength = 24;
    var count = 0;
    var innerRadius = 0;
    var outerRadius = innerRadius + flowerPetalLength;
    var text = petalDivisor == 1 ? ["all records", "for an activity"] : ["one petal represents", "two records for an activity"]; // Setup scales.

    var radialScale = d3.scaleLinear().domain([0, attitudes.length - 1]).range([-Math.PI, 0]); // Add text.

    flowerLegend.append("text").attr("x", 0).attr("y", flowerCenter.y - flowerPetalLength - flowerPadding).style("text-anchor", "middle").style("font-family", "Courier new").style("fill", textColor).style("font-size", 12).text(text[0]); // Add petals.

    attitudes.forEach(function (attitude) {
      flowerLegend.append("line").attr("x1", flowerCenter.x + innerRadius * Math.cos(radialScale(count))).attr("x2", flowerCenter.x + outerRadius * Math.cos(radialScale(count))).attr("y1", flowerCenter.y + innerRadius * Math.sin(radialScale(count))).attr("y2", flowerCenter.y + outerRadius * Math.sin(radialScale(count))).attr("stroke", textColor).attr("stroke-width", 2.5).style("stroke-linecap", "round").style("stroke-dasharray", dashArray[attitude]);
      count += 1;
    }); // Add text.

    flowerLegend.append("text").attr("x", 0).attr("y", padding * 1.65).style("text-anchor", "middle").style("font-family", "Courier new").style("fill", textColor).style("font-size", 12).text(text[1]);
  }
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/indActFlowerGraph.js"], null)
//# sourceMappingURL=/indActFlowerGraph.243dfccd.js.map