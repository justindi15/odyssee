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
})({"javascript/occupationActivityVis.js":[function(require,module,exports) {
/**
 *   svgClass: tag for svg class, must include the '.'
 *   timeData: time data for records
 *   returns void, draws data vis for occupation.
 */
function drawOccupationVis(svgClass, ikigaiData, typesData, everyoneData) {
  var email = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var svg = d3.select(svgClass);
  var height = svg.attr("height");
  var width = svg.attr("width");
  var averageLineWidth = 48;
  var titleVerticalPadding = 70;
  var legendVerticalPadding = padding * 2.5;
  var interGraphVerticalPadding = 24;
  var lineWidth = 1.5;
  drawTitle(svg, "Occupation"); // console.log(typesData);

  var ikigaiList = [{
    category: 'bohemian',
    title: 'bohemians',
    id: 'Bohemian',
    x: 0,
    y: titleVerticalPadding
  }, {
    category: 'zen master',
    title: 'zen masters',
    id: 'Zen',
    x: width / 2,
    y: titleVerticalPadding
  }, {
    category: 'worker',
    title: 'citizens',
    id: 'Citizen',
    x: 0,
    y: titleVerticalPadding + (height - titleVerticalPadding - legendVerticalPadding) / 2 + interGraphVerticalPadding / 2
  }, {
    category: 'profiteer',
    title: 'profiteers',
    id: 'Profiteer',
    x: width / 2,
    y: titleVerticalPadding + (height - titleVerticalPadding - legendVerticalPadding) / 2 + interGraphVerticalPadding / 2
  }];
  var occupations = {
    company: {
      title: "Company",
      description: "Working for a company"
    },
    venture: {
      title: "Venture",
      description: "Working for my own venture"
    },
    looking: {
      title: "Looking",
      description: "Looking for jobs"
    },
    studying: {
      title: "Studying",
      description: "Studying"
    },
    caring: {
      title: "Caring",
      description: "Caring for family and friends"
    },
    exploring: {
      title: "Exploring",
      description: "Exploring and enjoying life"
    },
    other: {
      title: "Other",
      description: "Other"
    }
  };
  var myData = null;

  if (email != null) {
    myData = {
      ikigai: ikigaiData.find(function (d) {
        return d[keys.ikigai.email] == email;
      })[keys.ikigai.category],
      occupation: typesData.find(function (d) {
        return d[keys.types.email] == email;
      })[keys.types.occupation]
    };
  } // Determine average number of records for each occupation.


  Object.keys(occupations).forEach(function (o) {
    var emailsByOccupation = typesData.filter(function (d) {
      return d[keys.types.occupation] == occupations[o].description;
    }).map(function (d) {
      return d[keys.types.email];
    });
    occupations[o].average = emailsByOccupation.length / ikigaiList.length;
  }); // Get denominator for activity multiples.

  var activityCountMap = {};
  Object.keys(activityShortToLong).forEach(function (a) {
    // Number of records for "a" activities in entire group (across all ikigai + all occupations) divided by 
    // number of records for all activities in entire group).
    activityCountMap[a] = everyoneData.filter(function (d) {
      return d[keys.everyone.activity].substring(0, 2) == a;
    }).length / everyoneData.length;
  }); // Determine records per ikigai group.

  ikigaiList.forEach(function (i) {
    i.users = ikigaiData.filter(function (d) {
      return d[keys.ikigai.category] == i.category;
    }).map(function (d) {
      return d[keys.ikigai.email];
    }); // Get records per ikigai group.

    i.records = everyoneData.filter(function (d) {
      return i.users.includes(d[keys.everyone.email]);
    });
    Object.keys(occupations).forEach(function (o) {
      var emailsByOccupation = typesData.filter(function (d) {
        return occupations[o].description == d[keys.types.occupation];
      }).map(function (d) {
        return d[keys.types.email];
      });
      i[o] = {}; // Get records per ikigai group and occupation.

      i[o].users = i.users.filter(function (d) {
        return emailsByOccupation.includes(d);
      });
      i[o].records = i.records.filter(function (d) {
        return emailsByOccupation.includes(d[keys.everyone.email]);
      });
      Object.keys(activityShortToLong).forEach(function (a) {
        // Get record count per ikigai group, occupation, and activity.
        var recordCountByActivity = i[o].records.filter(function (d) {
          return d[keys.everyone.activity].substring(0, 2) == a;
        }).length; // Get activity multiple.

        i[o][a] = recordCountByActivity / i[o].records.length / activityCountMap[a];

        if (isNaN(i[o][a])) {
          i[o][a] = 0;
        }
      });
    });
  });
  console.log(ikigaiList);
  var maxUsers = d3.max(ikigaiList, function (i) {
    return d3.max(Object.keys(occupations), function (o) {
      return i[o].users.length;
    });
  }); // console.log(maxUsers);

  var graphAttr = {
    textWidth: 100,
    height: (height - titleVerticalPadding - legendVerticalPadding - interGraphVerticalPadding) / 2,
    width: width / 2,
    horizontalPadding: 12,
    verticalPadding: 12
  };
  var occupationScale = d3.scaleLinear().domain([0, Object.keys(occupations).length - 1]).range([graphAttr.textWidth + graphAttr.horizontalPadding * 4, graphAttr.width - graphAttr.horizontalPadding * 4]);
  var usersScale = d3.scaleLinear().domain([0, maxUsers]).range([graphAttr.height / 2, 0]); // Add tooltip.

  var tooltipId = "occupationActivityTooltipId";
  var tooltip = addTooltip(tooltipId);
  var baseImageSize = usersScale(0) - usersScale(1);
  ikigaiList.forEach(function (ikigai) {
    var ikigaiGraph = svg.append("g").attr("transform", "translate(" + ikigai.x + ", " + ikigai.y + ")");
    Object.keys(occupations).forEach(function (o, i) {
      var occupation = occupations[o];
      var overRepresentedActivity = "none";
      var numRecords = ikigai[o].records.length;
      var numUsers = ikigai[o].users.length;
      var imageSize = baseImageSize;
      var g = ikigaiGraph.append("g");
      d3.xml("images/" + occupation.title + ".svg").then(function (imageData) {
        // console.log(imageData.documentElement);
        // Find "center" to different height-width ratios.
        var imageBounds = imageData.documentElement.viewBox.baseVal;
        var imageHeight = graphAttr.height * 0.3;
        var imageWidth = imageBounds.width / imageBounds.height * imageHeight;
        g.append("image").attr("xlink:href", "images/" + occupation.title + ".svg").attr("x", occupationScale(i) - imageWidth / 2).attr("y", graphAttr.height / 2).attr("width", imageWidth).attr("height", imageHeight);
      });

      if (numRecords > 0) {
        if (usersScale(0) - usersScale(numUsers) <= baseImageSize) {
          imageSize = usersScale(0) - usersScale(numUsers);
        }

        g.append("line").attr("x1", occupationScale(i)).attr("x2", occupationScale(i)).attr("y1", usersScale(0)).attr("y2", usersScale(numUsers) + imageSize).attr("stroke", ikigaiColorHexArray[ikigai.category]).attr("stroke-width", lineWidth).attr("stroke-linecap", "round");
      }

      var maxActivityMultiple = d3.max(Object.keys(activityShortToLong), function (a) {
        return ikigai[o][a];
      });

      if (maxActivityMultiple > 0) {
        var maxActivity = Object.keys(activityShortToLong).find(function (a) {
          return ikigai[o][a] == maxActivityMultiple;
        });
        g.append("image").attr("xlink:href", "images/" + maxActivity + ".svg").attr("x", occupationScale(i) - imageSize / 2).attr("y", usersScale(numUsers)).attr("width", imageSize).attr("height", imageSize).attr("filter", function () {
          return "url(#" + ikigai.id + ")";
        });
        overRepresentedActivity = activityShortToLong[maxActivity];
      }

      if (occupation.average > 0) {
        g.append("line").attr("x1", occupationScale(i) - averageLineWidth / 2).attr("x2", occupationScale(i) + averageLineWidth / 2).attr("y1", usersScale(occupation.average)).attr("y2", usersScale(occupation.average)).attr("stroke", greyColor).attr("stroke-width", lineWidth).attr("stroke-linecap", "round");
      }

      var tooltipText = "<b>IKIGAI GROUP:</b> " + ikigai.title + "</br></br><b>OCCUPATION: </b>" + occupations[o].description.toLowerCase() + "</br></br><b>NUMBER OF USERS: </b>" + numUsers + "</br></br><b>OVER-REPRESENTED ACTIVITY: </b>" + overRepresentedActivity.toLowerCase();

      if (myData != null && myData.ikigai == ikigai.category && myData.occupation == occupations[o].description) {
        tooltipText += "</br></br><b>YOU ARE IN THIS IKIGAI/OCCUPATION GROUP</b>";
      }

      g.on("mousemove", function () {
        // Show tooltip.
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
    });
    drawText(ikigaiGraph, "users", {
      x: graphAttr.textWidth,
      y: usersScale(maxUsers),
      textAnchor: "end"
    });
    drawText(ikigaiGraph, ikigai.title, {
      x: graphAttr.textWidth,
      y: graphAttr.height / 2,
      textAnchor: "end",
      fontWeight: "bold"
    });
    ikigaiGraph.append("line").attr("x1", graphAttr.textWidth + graphAttr.horizontalPadding).attr("x2", graphAttr.width).attr("y1", graphAttr.height / 2).attr("y2", graphAttr.height / 2).attr("stroke", greyColor).attr("stroke-width", lineWidth).attr("stroke-linecap", "round");
  });
  var colorLegendAttr = {
    x: padding,
    y: height - padding * 2.5,
    width: 100,
    circleRadius: 4,
    verticalPadding: 18,
    horizontalPadding: 16
  };
  var colorLegend = svg.append('g').attr('width', colorLegendAttr.width).attr('transform', 'translate(' + colorLegendAttr.x + ',' + colorLegendAttr.y + ')');
  drawIkigaiColorLegend(colorLegend, colorLegendAttr);
  var activityLegendAttr = {
    x: colorLegendAttr.x + colorLegendAttr.width + 24,
    y: height - padding * 2.5,
    width: 200,
    imageSize: 36
  };
  var activityLegend = svg.append('g').attr('width', activityLegendAttr.width).attr('transform', 'translate(' + activityLegendAttr.x + ',' + activityLegendAttr.y + ')');
  activityLegend.append("image").attr("xlink:href", "images/i10.svg").attr("x", activityLegendAttr.width / 2 - activityLegendAttr.imageSize / 2).attr("y", 0).attr("width", activityLegendAttr.imageSize).attr("height", activityLegendAttr.imageSize);
  drawText(activityLegend, "over-represented", {
    x: activityLegendAttr.width / 2,
    y: activityLegendAttr.imageSize + 16
  });
  drawText(activityLegend, "activity", {
    x: activityLegendAttr.width / 2,
    y: activityLegendAttr.imageSize + 32
  });
  var groupAverageAttr = {
    x: activityLegendAttr.x + activityLegendAttr.width + 24,
    y: height - padding * 2.5,
    width: 200,
    imageSize: 36
  };
  var groupAverageLegend = svg.append('g').attr('width', groupAverageAttr.width).attr('transform', 'translate(' + groupAverageAttr.x + ',' + groupAverageAttr.y + ')');
  groupAverageLegend.append("line").attr("x1", 0).attr("x2", averageLineWidth).attr("y1", activityLegendAttr.imageSize + 16).attr("y2", activityLegendAttr.imageSize + 16).attr("stroke", greyColor).attr("stroke-width", lineWidth).attr("stroke-linecap", "round");
  drawText(groupAverageLegend, "entire group average", {
    x: averageLineWidth + 12,
    y: activityLegendAttr.imageSize + 16,
    textAnchor: "start"
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/occupationActivityVis.js"], null)
//# sourceMappingURL=/occupationActivityVis.65792f04.js.map