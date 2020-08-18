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
})({"javascript/thirtyDays.js":[function(require,module,exports) {
function getWeekdayLetterFromIndex(weekday) {
  switch (weekday) {
    case 0:
      return "S";

    case 1:
      return "M";

    case 2:
      return "T";

    case 3:
      return "W";

    case 4:
      return "R";

    case 5:
      return "F";

    case 6:
      return "S";
  }
}
/**
 *   svgClass: tag for svg class, must include the '.'
 *   timeData: time data for records
 *   email: email of user if displaying individual data
 *   returns void, draws data vis for 30 days bivariate time.
 */


function drawThirtyDaysVis(svgClass, timeData) {
  var email = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  timeData.forEach(function (e) {
    var activity = e[keys.time.activity];
    activityShortToLong[activity.split(":")[0]] = activity.split(":")[1].substring(1).split("(")[0];
  });
  var svg = d3.select(svgClass);
  var height = svg.attr("height");
  var width = svg.attr("width");
  drawTitle(svg, "30 days");
  var dateTimeParser = d3.timeParse("%m/%d/%y %H:%M %p");
  timeData.forEach(function (d) {
    d.dateTime = dateTimeParser(d[keys.time.dateTime]);
  });
  var monthMap = {};

  function hourFromFiveToTimeSegment(hourFromFive) {
    var segment = undefined;
    Object.keys(timeSegments).forEach(function (s) {
      var timeSegment = timeSegments[s];

      if (timeSegment.start <= hourFromFive && timeSegment.end >= hourFromFive) {
        segment = s;
      }
    });
    return segment;
  }

  var _loop = function _loop(i) {
    monthMap[i] = {
      date: null,
      weekday: null
    };
    Object.keys(timeSegments).forEach(function (segment) {
      monthMap[i][segment] = {
        mood: [],
        activity: [],
        data: []
      };
    });
  };

  for (var i = 1; i <= 30; i++) {
    _loop(i);
  }

  var timeFrame = {
    start: {
      month: 4,
      day: 15
    },
    end: {
      month: 5,
      day: 14
    }
  }; // Determine start and end dates for a user if displaying individual data.

  if (email != null) {
    var timeDataForUser = timeData.filter(function (d) {
      return d[keys.time.email] == email;
    });
    var minMonth = d3.min(timeDataForUser, function (d) {
      return d.dateTime.getMonth();
    });
    var timeDataForUserOfMinMonth = timeDataForUser.filter(function (d) {
      return d.dateTime.getMonth() == minMonth;
    });
    var minDate = d3.min(timeDataForUserOfMinMonth, function (d) {
      return d.dateTime.getDate();
    });
    minMonth = minMonth + 1; // getMonth() indexes month from 0, but we want to index month from 1.
    // console.log("min month: " + minMonth + " | min date: " + minDate)

    timeFrame.start.month = minMonth;
    timeFrame.start.day = minDate;
  }

  timeFrame.daysOfStartMonth = new Date(2020, timeFrame.start.month, 0).getDate();
  var daysLeftInStartMonth = timeFrame.daysOfStartMonth - timeFrame.start.day + 1;
  timeFrame.end.month = daysLeftInStartMonth < 30 ? timeFrame.start.month + 1 : timeFrame.start.month;
  timeFrame.end.day = daysLeftInStartMonth < 30 ? 30 - daysLeftInStartMonth : 30; // console.log(timeFrame.daysOfStartMonth)

  timeData.forEach(function (d) {
    if (email == null || d[keys.time.email] == email) {
      var dateTime = dateTimeParser(d[keys.time.dateTime]);
      var hour = dateTime.getHours();
      var hourFromFive = hour < 5 ? 19 + hour : hour - 5;
      var date = dateTime.getDate();
      var month = dateTime.getMonth() + 1;

      if (month == timeFrame.start.month && date >= timeFrame.start.day || month == timeFrame.end.month && date <= timeFrame.end.day) {
        var day = month == timeFrame.start.month ? date - timeFrame.start.day + 1 : month == timeFrame.end.month ? date - timeFrame.start.day + 1 + timeFrame.daysOfStartMonth : null;
        var timeSegment = hourFromFiveToTimeSegment(hourFromFive); // console.log(dateTime)
        // console.log("Month: " + month + " Date: " + date + " hr from five: " + hourFromFive + " Time segment: " + timeSegment)
        // console.log("day: " + day)

        monthMap[day][timeSegment].mood.push(d[keys.time.mood]);
        monthMap[day][timeSegment].activity.push(d[keys.time.activity]);
        monthMap[day][timeSegment].data.push({
          mood: d[keys.time.mood],
          activity: d[keys.time.activity],
          hourFromFive: hourFromFive
        });
        monthMap[day].date = month + "." + (date < 10 ? "0" + date : date);
        monthMap[day].weekday = getWeekdayLetterFromIndex(dateTime.getDay());
      }
    }
  }); // console.log(timeData);
  // console.log(monthMap);

  var graphAttr = {
    x: 150,
    y: 72,
    horizontalPadding: 24,
    verticalPadding: 4,
    height: height - 3.5 * padding - 72,
    width: width - 150
  };
  var bivarTimeGraph = svg.append("g").attr("transform", "translate(" + graphAttr.x + ", " + graphAttr.y + ")"); // Setup scales.

  var timeYScale = d3.scaleTime().domain([0, 24]).range([0, graphAttr.height]);
  var monthXScale = d3.scaleTime().domain([1, 30]).range([graphAttr.horizontalPadding, graphAttr.width - graphAttr.horizontalPadding]);
  var iconSize = 32;
  Object.keys(timeSegments).forEach(function (key) {
    var timeSegment = timeSegments[key]; // Draw clock image.

    bivarTimeGraph.append("image").attr("xlink:href", "images/" + timeSegment.image + ".svg").attr("x", monthXScale(1) - graphAttr.horizontalPadding - iconSize - iconSize / 2).attr("y", timeYScale(timeSegment.start) - iconSize / 2).attr("width", iconSize).attr("height", iconSize); // Draw time segment label.

    drawText(bivarTimeGraph, timeSegment.title, {
      x: monthXScale(1) - graphAttr.horizontalPadding * 2 - iconSize,
      y: timeYScale(timeSegment.start),
      textAnchor: "end",
      fontWeight: "bold"
    });
  }); // Draw x axis labels.

  ["Day", "Day of the Week", "Date"].forEach(function (d, i) {
    drawText(bivarTimeGraph, d, {
      x: monthXScale(1) - graphAttr.horizontalPadding - iconSize / 2,
      y: timeYScale(24) + graphAttr.verticalPadding * (i + 1) + 12 * i,
      textAnchor: "end"
    });
  });

  function getModeFromList(lst) {
    var map = {};
    lst.forEach(function (d) {
      var count = map[d];
      map[d] = count == null ? 1 : count + 1;
    });
    var maxCount = d3.max(lst, function (d) {
      return map[d];
    });
    return Object.keys(map).find(function (d) {
      return map[d] = maxCount;
    });
  } // Add tooltip.


  var tooltipId = 'thirtyDaysBivariateVisTooltipId';
  var tooltip = addTooltip(tooltipId); // Draw data.

  var strokeWidth = 1;
  Object.keys(monthMap).forEach(function (day) {
    [day, monthMap[day].weekday, monthMap[day].date].forEach(function (d, i) {
      drawText(bivarTimeGraph, d, {
        x: monthXScale(day),
        y: timeYScale(24) + graphAttr.verticalPadding * (i + 1) + 12 * i
      });
    });
    var data = [];
    Object.keys(timeSegments).forEach(function (segment) {
      var timeSegment = timeSegments[segment];
      var moods = monthMap[day][segment].mood;
      var activities = monthMap[day][segment].activity;

      if (moods.length > 0 && activities.length > 0) {
        if (email == null) {
          var mostFrequentMood = getModeFromList(moods);
          var mostFrequentActivity = getModeFromList(activities);
          data.push([{
            mood: mostFrequentMood,
            activity: mostFrequentActivity,
            hourFromFive: (timeSegment.start + timeSegment.end) / 2,
            frequency: moods.length
          }]);
        } else {
          data.push(monthMap[day][segment].data);
        }
      }
    });
    data = data.flat().sort(function (a, b) {
      return a.hourFromFive < b.hourFromFive ? -1 : 1;
    });
    var lineEnd = null;
    var g = bivarTimeGraph.append("g"); // console.log(day)
    // console.log(data)

    var i = 0;

    var _loop2 = function _loop2() {
      var d = data[i];
      var mood = d.mood;
      var activity = d.activity.substring(0, 2);
      var hourFromFive = d.hourFromFive;
      var start = lineEnd == null ? timeYScale(0) : lineEnd;
      var end = timeYScale(hourFromFive) - iconSize / 2;
      end = start <= end ? end : start;
      g.append("line").attr("x1", monthXScale(day)).attr("x2", monthXScale(day)).attr("y1", start).attr("y2", end).attr("stroke", colorHexArray[mood]).attr("stroke-width", strokeWidth);
      g.append("image").attr("xlink:href", "images/" + activity + ".svg").attr("x", monthXScale(day) - iconSize / 2).attr("y", timeYScale(hourFromFive) - iconSize / 2).attr("width", iconSize).attr("height", iconSize).style('filter', function () {
        return 'url(#' + mood + ')';
      }).on("mousemove", function () {
        var tooltipText = "";

        if (email == null) {
          tooltipText = "<b>MOST FREQUENT ACTIVITY:</b> " + activityShortToLong[activity].toLowerCase() + "</br></br><b>MOST FREQUENT MOOD: </b>" + mood.toLowerCase() + "</br></br><b>FREQUENCY: </b>" + d.frequency;
        } else {
          tooltipText = "<b>ACTIVITY:</b> " + activityShortToLong[activity].toLowerCase() + "</br></br><b>MOOD: </b>" + mood.toLowerCase();
        } // Show tooltip.


        tooltip.html(tooltipText).style("visibility", "visible").style("top", event.pageY + 20).style("left", function () {
          if (d3.event.clientX < 750) {
            return event.pageX + 20 + "px";
          } else {
            return event.pageX - document.getElementById(tooltipId).clientWidth - 20 + "px";
          }
        });
      }).on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
      start = timeYScale(hourFromFive) + iconSize / 2;
      i = i + 1; // Increment i here.

      end = i >= data.length ? timeYScale(24) - graphAttr.verticalPadding : (timeYScale(hourFromFive) + timeYScale(data[i].hourFromFive)) / 2; // Prevent overlapping of icons.

      while (end < start) {
        i = i + 1;
        end = i >= data.length ? timeYScale(24) - graphAttr.verticalPadding : (timeYScale(hourFromFive) + timeYScale(data[i].hourFromFive)) / 2;
      }

      g.append("line").attr("x1", monthXScale(day)).attr("x2", monthXScale(day)).attr("y1", start).attr("y2", end).attr("stroke", colorHexArray[mood]).attr("stroke-width", strokeWidth);
      lineEnd = end;
    };

    while (i < data.length) {
      _loop2();
    }
  }); // Draw legends.

  var moodLegendAttr = {
    x: graphAttr.x,
    y: height - padding * 2.5,
    width: width / 4
  };
  var activityLegendAttr = {
    x: graphAttr.x + width / 4 + padding,
    y: height - padding * 2.5,
    width: 200
  };
  var moodLegend = svg.append("g").attr("class", "moodLegend").attr("width", moodLegendAttr.width).attr("transform", "translate(" + moodLegendAttr.x + "," + moodLegendAttr.y + ")");
  var activityLegend = svg.append("g").attr("class", "moodLegend").attr("width", activityLegendAttr.width).attr("transform", "translate(" + activityLegendAttr.x + "," + activityLegendAttr.y + ")");
  drawMoodLegend(moodLegend, "Most frequent mood", moodList);
  drawActivityLegend(activityLegend);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52571" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/thirtyDays.js"], null)
//# sourceMappingURL=/thirtyDays.ee166bda.js.map