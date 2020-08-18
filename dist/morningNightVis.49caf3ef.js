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
})({"javascript/morningNightVis.js":[function(require,module,exports) {
/**
 *   svgClass: tag for svg class, must include the '.'
 *   timeData: time data for records
 *   returns void, draws data vis for Morning vs. Night people
 */
function drawMorningNightVis(svgClass, timeData) {
  var email = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var svg = d3.select(svgClass);
  var height = svg.attr('height');
  var width = svg.attr('width');
  drawTitle(svg, 'Morning vs. Night people');
  var graphAttr = {
    x: padding,
    y: 90,
    yIncrement: 56,
    height: height - 5 * padding,
    width: width - 2 * padding,
    verticalPadding: 28,
    horizontalPadding: 56
  };
  var morningNightGraph = svg.append("g").attr("transform", "translate(" + graphAttr.x + ", " + graphAttr.y + ")");
  var dateTimeParser = d3.timeParse("%m/%d/%y %H:%M %p"); // Setup maps.

  var timeMap = {};
  var timeMoodAverageMap = {};

  for (var i = 0; i < 24; i++) {
    timeMap[i] = [];
    timeMoodAverageMap[i] = {};
  }

  timeData.forEach(function (d) {
    var record = d;
    var dateTime = dateTimeParser(d[keys.time.dateTime]);
    record.dateTime = dateTime;
    var hour = dateTime.getHours();
    var hourFromFive = hour < 5 ? 19 + hour : hour - 5;
    record.hourFromFive = hourFromFive;
    timeMap[hourFromFive].push(record);
  }); // Setup scales.

  var moodYScale = d3.scaleLinear().domain([moodToScore["Awful"], moodToScore["Amazing"]]).range([graphAttr.height - 2 * graphAttr.verticalPadding, graphAttr.verticalPadding]);
  var timeXScale = d3.scaleTime().domain([0, 24]).range([graphAttr.horizontalPadding, graphAttr.width - 3.5 * graphAttr.horizontalPadding]);
  var reverseTimeScale = d3.scaleTime().domain([graphAttr.horizontalPadding, graphAttr.width - 3.5 * graphAttr.horizontalPadding]).range([0, 24]);
  console.log(timeData);
  var myData = null;

  if (email != null) {
    myData = {
      morningNight: timeData.find(function (d) {
        return d[keys.time.email] == email;
      })[keys.time.morningNight]
    };
  } // Draw bottom time labels.


  var iconSize = 32;
  Object.keys(timeSegments).forEach(function (key) {
    var timeSegment = timeSegments[key]; // Get list of records for time segment interval.

    var timeList = [];
    Object.keys(timeMap).forEach(function (hourFromFive) {
      if (hourFromFive >= timeSegment.start && hourFromFive <= timeSegment.end) {
        timeList.push(timeMap[hourFromFive]);
      }
    });
    timeList = timeList.flat();
    var averageMoodScore = getAverageFromList(timeList.map(function (d) {
      return moodToScore[d[keys.time.mood]];
    }));
    var averageMood = scoreToMood[Math.round(averageMoodScore)];
    var mostFrequentAttitudeCount = d3.max(attitudeList, function (a) {
      var attitude = attitudeShorttoLong[a];
      return timeList.filter(function (d) {
        return d[keys.time.attitude] == attitude;
      }).length;
    });
    var mostFrequentAttitude = attitudeShorttoLong[attitudeList.find(function (a) {
      var attitude = attitudeShorttoLong[a];
      return timeList.filter(function (d) {
        return d[keys.time.attitude] == attitude;
      }).length == mostFrequentAttitudeCount;
    })]; // console.log(mostFrequentAttitudeCount);
    // console.log(mostFrequentAttitude);
    // console.log(averageMoodScore);
    // console.log(averageMood);
    // Draw vertical line.

    morningNightGraph.append("line").attr("x1", timeXScale(timeSegment.start)).attr("x2", timeXScale(timeSegment.start)).attr("y1", 0).attr("y2", graphAttr.height - graphAttr.verticalPadding - iconSize / 2).attr("stroke", colorHexArray[averageMood]).style("stroke-dasharray", dashArray[mostFrequentAttitude]).attr("stroke-width", 2).style("stroke-linecap", "round"); // Draw clock image.

    morningNightGraph.append("image").attr("xlink:href", "images/" + timeSegment.image + ".svg").attr("x", timeXScale(timeSegment.start) - iconSize / 2).attr("y", graphAttr.height - graphAttr.verticalPadding - iconSize / 2).attr("width", iconSize).attr("height", iconSize); // Draw time segment label.

    drawText(morningNightGraph, timeSegment.title, {
      x: timeXScale(timeSegment.start),
      y: graphAttr.height
    });
  }); // Draw left mood text labels.

  moodList.forEach(function (mood) {
    drawText(morningNightGraph, mood, {
      x: 0,
      y: moodYScale(moodToScore[mood]),
      fill: colorHexArray[mood],
      textAnchor: "end",
      fontWeight: "bold"
    });
  }); // Draw curves.

  var lineGen = d3.line().curve(d3.curveMonotoneX); // Generate morning and night people points.

  var morningPoints = [];
  var nightPoints = [];
  Object.keys(timeMap).forEach(function (hourFromFive) {
    var x = timeXScale(hourFromFive);
    var timeList = timeMap[hourFromFive];
    var morningListForHour = timeList.filter(function (d) {
      return d[keys.time.morningNight] == "Morning";
    }).map(function (d) {
      return moodToScore[d[keys.time.mood]];
    });
    var nightListForHour = timeList.filter(function (d) {
      return d[keys.time.morningNight] == "Evening";
    }).map(function (d) {
      return moodToScore[d[keys.time.mood]];
    });
    var morningAverage = morningListForHour.length > 0 ? getAverageFromList(morningListForHour) : moodToScore["Ok"];
    morningPoints.push([x, moodYScale(morningAverage)]);
    var nightAverage = nightListForHour.length > 0 ? getAverageFromList(nightListForHour) : moodToScore["Ok"];
    nightPoints.push([x, moodYScale(nightAverage)]);
    timeMoodAverageMap[hourFromFive] = {
      morning: morningAverage,
      night: nightAverage
    };
  });

  function sortTime(a, b) {
    return a[0] < b[0] ? -1 : 1;
  }

  morningPoints.sort(sortTime);
  nightPoints.sort(sortTime); // Draw path.

  var morningData = lineGen(morningPoints);
  var nightData = lineGen(nightPoints);
  morningNightGraph.append("path").attr("d", morningData).attr("fill", "none").attr("stroke", greyColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  morningNightGraph.append("path").attr("d", nightData).attr("fill", "none").attr("stroke", greyColor).attr("stroke-width", 2).style("stroke-linecap", "round"); // Draw morning vs. night legend.

  var morningLegendAttr = {
    x: morningPoints[morningPoints.length - 1][0] + 12,
    y: morningPoints[morningPoints.length - 1][1] - iconSize / 2
  };
  var nightLegendAttr = {
    x: nightPoints[nightPoints.length - 1][0] + 12,
    y: nightPoints[nightPoints.length - 1][1] - iconSize / 2
  };
  morningNightGraph.append("image").attr("xlink:href", "images/morning.svg").attr("x", morningLegendAttr.x).attr("y", morningLegendAttr.y).attr("width", iconSize).attr("height", iconSize);
  morningNightGraph.append("image").attr("xlink:href", "images/night.svg").attr("x", nightLegendAttr.x).attr("y", nightLegendAttr.y).attr("width", iconSize).attr("height", iconSize);
  drawText(morningNightGraph, "Morning people", {
    x: morningLegendAttr.x + iconSize + 12,
    y: morningLegendAttr.y + iconSize / 2,
    textAnchor: "start"
  });
  drawText(morningNightGraph, "Night people", {
    x: nightLegendAttr.x + iconSize + 12,
    y: nightLegendAttr.y + iconSize / 2,
    textAnchor: "start"
  });
  drawText(morningNightGraph, "Are you a morning or night person?", {
    x: nightLegendAttr.x,
    y: Math.min(morningLegendAttr.y, nightLegendAttr.y) - 24,
    textAnchor: "start",
    fontWeight: "bold"
  });
  var baseAnnotationY = nightLegendAttr.y + iconSize + 28;
  var annotation = ["Morning people are happier than", "night people."];
  annotation.forEach(function (line, i) {
    drawText(morningNightGraph, line, {
      x: nightLegendAttr.x,
      y: baseAnnotationY + 16 * i,
      textAnchor: "start",
      fontWeight: "bold"
    });
  }); // Setup hover bar.

  var hoverCircleRadius = 5;
  var morningCircle = morningNightGraph.append("circle").attr("visibility", "hidden").attr("stroke", greyColor).attr("r", hoverCircleRadius);
  var nightCircle = morningNightGraph.append("circle").attr("visibility", "hidden").attr("stroke", greyColor).attr("r", hoverCircleRadius);
  var hoverSunIcon = morningNightGraph.append("image").attr("xlink:href", "images/morning.svg").attr("visibility", "hidden").attr("width", hoverCircleRadius * 3).attr("height", hoverCircleRadius * 3);
  var hoverMoonIcon = morningNightGraph.append("image").attr("xlink:href", "images/night.svg").attr("visibility", "hidden").attr("width", hoverCircleRadius * 2).attr("height", hoverCircleRadius * 2);
  var hoverRect = morningNightGraph.append("rect").attr("visibility", "hidden").attr("fill", "#c4c4c41a").attr("stroke", greyColor).attr("rx", hoverCircleRadius + 2); // Add tooltip.

  var tooltipId = 'morningNightVisTooltipId';
  var tooltip = addTooltip(tooltipId);
  svg.append("rect").attr("x", graphAttr.x).attr("y", graphAttr.y).attr("width", graphAttr.width).attr("height", graphAttr.height).attr("opacity", 0).on("mousemove", function () {
    var x = d3.event.clientX - event.target.getBoundingClientRect().left;
    var hourFromFive = Math.round(reverseTimeScale(x));
    var hour = hourFromFive + 5;

    if (timeMoodAverageMap[hourFromFive] == null) {
      return;
    }

    var morningAverage = timeMoodAverageMap[hourFromFive].morning;
    var nightAverage = timeMoodAverageMap[hourFromFive].night;
    var time = hour == 12 ? "12PM" : hour == 24 ? "12AM" : hour < 12 ? hour + "AM" : hour > 24 ? hour - 24 + "AM" : hour - 12 + "PM";
    var morningMoodAverage = scoreToMood[Math.round(morningAverage)];
    var nightMoodAverage = scoreToMood[Math.round(nightAverage)];
    var tooltipText = "<b>TIME OF DAY:</b> " + time + "</br></br><b>MOOD AVERAGE (MORNING): </b>" + Math.round(timeMoodAverageMap[hourFromFive].morning * 100) / 100 + " (" + morningMoodAverage + ")" + "</br></br><b>MOOD AVERAGE (NIGHT): </b>" + Math.round(timeMoodAverageMap[hourFromFive].night * 100) / 100 + " (" + nightMoodAverage + ")";

    if (myData != null) {
      tooltipText += "</br></br><b>YOU ARE A SELF-IDENTIFIED " + (myData.morningNight == "Evening" ? "NIGHT" : "MORNING") + " PERSON</b>";
    } // Adjust and show hover bar.


    var morningY = moodYScale(morningAverage);
    var nightY = moodYScale(nightAverage);
    morningCircle.attr("visibility", "visible").attr("cx", timeXScale(hourFromFive)).attr("cy", morningY).attr("fill", colorHexArray[morningMoodAverage]);
    hoverSunIcon.attr("visibility", "visible").attr("x", timeXScale(hourFromFive) - hoverCircleRadius * 3 / 2).attr("y", morningY + (hoverCircleRadius + 2 + 10) * (morningY >= nightY ? 1 : -1) - hoverCircleRadius * 3 / 2);
    nightCircle.attr("visibility", "visible").attr("cx", timeXScale(hourFromFive)).attr("cy", nightY).attr("fill", colorHexArray[nightMoodAverage]);
    hoverMoonIcon.attr("visibility", "visible").attr("x", timeXScale(hourFromFive) - hoverCircleRadius).attr("y", nightY + (hoverCircleRadius + 2 + 8) * (nightY > morningY ? 1 : -1) - hoverCircleRadius);
    hoverRect.attr("visibility", "visible").attr("x", timeXScale(hourFromFive) - (hoverCircleRadius + 2)).attr("y", moodYScale(morningAverage > nightAverage ? morningAverage : nightAverage) - (hoverCircleRadius + 2)).attr("height", Math.abs(morningY - nightY) + (hoverCircleRadius + 2) * 2).attr("width", (hoverCircleRadius + 2) * 2); // Show tooltip.

    tooltip.html(tooltipText).style("visibility", "visible").style("top", event.pageY + 20).style("left", function () {
      if (d3.event.clientX < 750) {
        return event.pageX + 20 + "px";
      } else {
        return event.pageX - document.getElementById(tooltipId).clientWidth - 20 + "px";
      }
    });
  }).on("mouseout", function () {
    morningCircle.attr("visibility", "hidden");
    hoverSunIcon.attr("visibility", "hidden");
    nightCircle.attr("visibility", "hidden");
    hoverMoonIcon.attr("visibility", "hidden");
    hoverRect.attr("visibility", "hidden");
    tooltip.style("visibility", "hidden");
  }); // Draw mood and attitude legend.

  drawMoodHalfLegend(svgClass, "Average mood for part of day for morning & night people");
  drawAttitudeHalfLegend(svgClass, attitudeList, "Most frequent attitude for morning & night people");
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/morningNightVis.js"], null)
//# sourceMappingURL=/morningNightVis.49caf3ef.js.map