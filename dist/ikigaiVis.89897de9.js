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
})({"ikigaiVis.js":[function(require,module,exports) {
/**
 *   svgClass: tag for svg class, must include the '.'
 *   ikigaiData: 
 *   everyoneData: records for everyone
 *   returns void, draws data vis for happiness dot plot
 */
function drawIkigaiVis(svgClass, ikigaiData) {
  var email = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var svg = d3.select(svgClass);
  var height = svg.attr('height');
  var width = svg.attr('width'); // console.log(ikigaiData);
  // Add title.

  drawTitle(svg, 'Ikigai'); // Add ikigai chart.

  var imageAttr = {
    height: 540,
    width: 540
  };
  imageAttr.x = width / 2 - imageAttr.width / 2;
  imageAttr.y = height / 2 - imageAttr.height / 2;
  imageAttr.centerX = imageAttr.x + imageAttr.width / 2;
  imageAttr.centerY = imageAttr.y + imageAttr.height / 2;
  svg.append('image').attr('xlink:href', 'images/ikigai.svg').attr('x', imageAttr.x).attr('y', imageAttr.y).attr('width', imageAttr.width).attr('height', imageAttr.height); // Order for legend: Zen Master, Bohemian, Citizen, Profiteer

  var ikigaiList = ikigaiGroups; // Order: Happiness, Money, Skill, Passion, Contribution

  var ikigaiScoreList = [keys.ikigai.happiness, keys.ikigai.money, keys.ikigai.skill, keys.ikigai.passion, keys.ikigai.contribution];
  var myData = null;

  if (email != null) {
    myData = {
      ikigai: ikigaiData.find(function (d) {
        return d[keys.ikigai.email] == email;
      })[keys.ikigai.category]
    };
  } // Setup ikigaiMap


  var ikigaiMap = {};
  ikigaiList.forEach(function (category) {
    ikigaiMap[category] = {};
    ikigaiScoreList.forEach(function (type) {
      var dataForIkigai = ikigaiData.filter(function (d) {
        return d[keys.ikigai.category] == category;
      });
      ikigaiMap[category][type] = dataForIkigai.map(function (d) {
        return Number(d[type]);
      });
    });
  });
  ikigaiMap['total'] = {};
  ikigaiScoreList.forEach(function (type) {
    ikigaiMap['total'][type] = [];
    ikigaiScoreList.forEach(function (type) {
      ikigaiMap['total'][type] = ikigaiData.map(function (d) {
        return Number(d[type]);
      });
    });
  }); // Get averages.

  var ikigaiAverages = [];
  Object.keys(ikigaiMap).forEach(function (category) {
    Object.keys(ikigaiMap[category]).forEach(function (type) {
      ikigaiMap[category][type] = getAverageFromList(ikigaiMap[category][type]);
      ikigaiAverages.push(ikigaiMap[category][type]); // To find max later.
    });
  }); // console.log(ikigaiMap);

  var ikigaiGraphPadding = 24;
  var gIkigaiAttr = {
    height: 65,
    width: (width - imageAttr.width) / 2 - ikigaiGraphPadding
  }; // Setup scales.

  var ikigaiXScale = d3.scaleBand().domain(ikigaiScoreList).range([ikigaiGraphPadding, gIkigaiAttr.width]);
  var ikigaiMaxScore = d3.max(ikigaiAverages, function (d) {
    return d;
  });
  var ikigaiYScale = d3.scaleLinear().domain([0, ikigaiMaxScore]).range([0, gIkigaiAttr.height]); // Setup bar graphs.

  var ikigaiGraphMap = {
    'worker': {
      x1: imageAttr.centerX + imageAttr.width * 0.28,
      x2: width - padding,
      x: imageAttr.centerX + imageAttr.width / 2 - ikigaiGraphPadding,
      y: imageAttr.centerY - imageAttr.height * 0.31,
      textAnchor: 'end'
    },
    'zen master': {
      x1: imageAttr.centerX + imageAttr.width * 0.11,
      x2: width - 16,
      x: imageAttr.centerX + imageAttr.width / 2 + 14,
      y: imageAttr.centerY - imageAttr.height * 0.02,
      textAnchor: 'end'
    },
    'profiteer': {
      x1: padding,
      x2: imageAttr.centerX - imageAttr.width * 0.11,
      x: padding + 20,
      y: imageAttr.centerY + imageAttr.height * 0.45,
      textAnchor: 'start'
    },
    'bohemian': {
      x1: 16,
      x2: imageAttr.centerX - imageAttr.width * 0.32,
      x: width * 0.02,
      y: imageAttr.centerY - imageAttr.height * 0.28,
      textAnchor: 'start'
    }
  };
  Object.keys(ikigaiGraphMap).forEach(function (category) {
    ikigaiGraphMap[category]['graph'] = svg.append('g').attr('transform', 'translate(' + ikigaiGraphMap[category]['x'] + ', ' + (ikigaiGraphMap[category]['y'] - gIkigaiAttr.height) + ')');
    svg.append('line').attr('x1', ikigaiGraphMap[category]['x1']).attr('x2', ikigaiGraphMap[category]['x2']).attr('y1', ikigaiGraphMap[category]['y']).attr('y2', ikigaiGraphMap[category]['y']).attr('stroke', ikigaiColorHexArray[category]).attr('stroke-width', 2).style('stroke-linecap', 'round');
    drawText(svg, 'score', {
      x: ikigaiGraphMap[category]['textAnchor'] == 'start' ? ikigaiGraphMap[category]['x1'] - 12 : ikigaiGraphMap[category]['x2'] + 12,
      y: ikigaiGraphMap[category]['y'] - gIkigaiAttr.height - 12,
      textAnchor: ikigaiGraphMap[category]['textAnchor'],
      fontSize: 12
    });
  }); // Add tooltip.

  var tooltipId = 'ikigaiVisTooltipId';
  var tooltip = d3.select('body').append('div').attr('id', tooltipId).style('padding', 10).style('position', 'absolute').style('z-index', '10').style('visibility', 'hidden').attr('white-space', 'pre-line').style('background-color', backgroundColor).style('border-radius', '15px').style('border', '1px solid #cdcdcd').style('font-family', 'Courier new').style('font-size', 12).style('text-align', 'left').style('color', textColor).style('max-width', 250); // Add bar graphs.

  ikigaiList.forEach(function (category) {
    var ikigaiGraph = ikigaiGraphMap[category]['graph'];
    ikigaiScoreList.forEach(function (type) {
      var interLinePadding = 14;
      var typeAverage = ikigaiMap['total'][type];
      var categoryAverage = ikigaiMap[category][type]; // Add line for all entries.

      ikigaiGraph.append('line').attr('y1', gIkigaiAttr.height).attr('y2', gIkigaiAttr.height - ikigaiYScale(typeAverage)).attr('x1', ikigaiXScale(type) - interLinePadding / 2).attr('x2', ikigaiXScale(type) - interLinePadding / 2).attr('stroke', greyColor).attr('stroke-width', 2).style('stroke-linecap', 'round'); // Add line for ikigai group.

      ikigaiGraph.append('line').attr('y1', gIkigaiAttr.height).attr('y2', gIkigaiAttr.height - ikigaiYScale(categoryAverage)).attr('x1', ikigaiXScale(type) + interLinePadding / 2).attr('x2', ikigaiXScale(type) + interLinePadding / 2).attr('stroke', ikigaiColorHexArray[category]).attr('stroke-width', 2).style('stroke-linecap', 'round'); // Add label for type.

      drawText(ikigaiGraph, type.toLowerCase(), {
        x: ikigaiXScale(type),
        y: gIkigaiAttr.height + 12,
        fontSize: 12
      });
      var tooltipText = "<b>IKIGAI GROUP:</b> " + ikigaiKeyToLabel[category].toLowerCase() + "</br></br><b>" + type.toUpperCase() + " SCORE: </b>" + Math.round(categoryAverage * 100) / 100 + "</br></br><b>GROUP SCORE: </b>" + Math.round(typeAverage * 100) / 100;

      if (myData != null && myData.ikigai == category) {
        tooltipText += "</br></br><b>YOU ARE A " + ikigaiKeyToLabel[category].toUpperCase() + "</b>";
      } // Add tooltip target.


      ikigaiGraph.append('rect').attr('x', ikigaiXScale(type) - (gIkigaiAttr.width - ikigaiGraphPadding) / 10).attr('y', -8).attr('height', gIkigaiAttr.height + 24).attr('width', (gIkigaiAttr.width - ikigaiGraphPadding) / 5).attr('opacity', 0).on("mousemove", function () {
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
  });
  var colorLegendAttr = {
    x: width - width / 8 - 24,
    y: height - padding * 2.5,
    width: width / 8,
    circleRadius: 4,
    verticalPadding: 18,
    horizontalPadding: 16
  };
  var colorLegend = svg.append('g').attr('width', colorLegendAttr.width).attr('transform', 'translate(' + colorLegendAttr.x + ',' + colorLegendAttr.y + ')');
  drawIkigaiColorLegend(colorLegend, colorLegendAttr);
  var lineLegendAttr = {
    x: colorLegendAttr.x - width / 8 - 24,
    y: height - padding * 2.5,
    width: width / 8,
    lineHeight: 24,
    verticalPadding: 12,
    horizontalPadding: 12,
    strokeWidth: 2
  };
  var lineLegend = svg.append('g').attr('width', lineLegendAttr.width).attr('transform', 'translate(' + lineLegendAttr.x + ',' + lineLegendAttr.y + ')');
  var ikigaiGroupAverageWidth = lineLegendAttr.horizontalPadding * (ikigaiList.length - 1);
  ikigaiList.forEach(function (d, i) {
    var x = lineLegendAttr.width / 2 - ikigaiGroupAverageWidth / 2 + i * lineLegendAttr.horizontalPadding - lineLegendAttr.strokeWidth / 2;
    lineLegend.append('line').attr('x1', x).attr('x2', x).attr('y1', 0).attr('y2', lineLegendAttr.lineHeight).attr('stroke', ikigaiColorHexArray[d]).attr('stroke-width', lineLegendAttr.strokeWidth).style('stroke-linecap', 'round');
  });
  drawText(lineLegend, 'ikigai group average', {
    x: lineLegendAttr.width / 2,
    y: lineLegendAttr.lineHeight + lineLegendAttr.verticalPadding,
    fontSize: 12
  });
  lineLegend.append('line').attr('x1', lineLegendAttr.width / 2 - lineLegendAttr.strokeWidth / 2).attr('x2', lineLegendAttr.width / 2 - lineLegendAttr.strokeWidth / 2).attr('y1', lineLegendAttr.lineHeight + 2 * lineLegendAttr.verticalPadding).attr('y2', lineLegendAttr.lineHeight + 2 * lineLegendAttr.verticalPadding + lineLegendAttr.lineHeight).attr('stroke', greyColor).attr('stroke-width', lineLegendAttr.strokeWidth).style('stroke-linecap', 'round');
  drawText(lineLegend, "entire group average", {
    x: lineLegendAttr.width / 2,
    y: lineLegendAttr.lineHeight + 3 * lineLegendAttr.verticalPadding + lineLegendAttr.lineHeight,
    fontSize: 12
  });
  var baseAnnotationY = 72;
  var annotation = ["Based on the four ikigai pillars, we found", "four different profiles of people: profiteers,", "citizens, bohemians, and zen masters."];
  annotation.forEach(function (line, i) {
    drawText(svg, line, {
      x: padding,
      y: baseAnnotationY + 16 * i,
      textAnchor: "start",
      fontWeight: "bold"
    });
  });
  baseAnnotationY = height * 0.7;
  annotation = ["Zen masters are the happiest and profiteers", "are the saddest."];
  annotation.forEach(function (line, i) {
    drawText(svg, line, {
      x: ikigaiGraphMap['zen master'].x + 24,
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","ikigaiVis.js"], null)
//# sourceMappingURL=/ikigaiVis.89897de9.js.map