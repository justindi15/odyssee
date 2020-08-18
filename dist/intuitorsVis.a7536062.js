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
})({"javascript/intuitorsVis.js":[function(require,module,exports) {
var mWidth = 300;
var mHeight = 175;
var iconDim = 100;
var communicationList = ["b1", "b2", "b3", "b8", "b9"];
var isfjActList = ["b6", "b7"]; // excluding rest, self-care, eating and drinking

var exclusionList = ["i8:", "i3:", "i9:"];

function drawIntuitorsVis(svgClass, everyoneData, personalityData, typesData) {
  var svg = d3.select(svgClass);
  var tooltip = addTooltip("intuitorTooltip"); // console.log(typesData);

  var infjData = getDataByPType(everyoneData, typesData, "INFJ", "b4", getPersonDataByActivity);
  displayPersonalityTitle(svg, width * 0.3, 100, "INFJ: Creative");
  displayerPersonalityIcon(svg, width * 0.3, 100, "INFJ");
  drawSingleYIcon(svg, width * 0.3, 100, "b4");
  setUpSingleLineGraph(svg, width * 0.3, 100, "INFJ", infjData, tooltip, "% of records that are creative: ", "% of records");
  var intjData = getDataByPType(everyoneData, typesData, "INTJ", "b5", getPersonDataByActivity);
  displayPersonalityTitle(svg, width * 0.7, 100, "INTJ: Hard-working & Determined");
  displayerPersonalityIcon(svg, width * 0.7, 100, "INTJ");
  drawSingleYIcon(svg, width * 0.7, 100, "b5");
  setUpSingleLineGraph(svg, width * 0.7, 100, "INTJ", intjData, tooltip, "% of records that are intellectual: ", "% of records");
  var enfpData = getDataByPType(everyoneData, typesData, "ENFP", "i", getPersonDataByActivityType);
  displayPersonalityTitle(svg, width * 0.3, 450, "ENFP: Knows how to relax & Curious");
  displayerPersonalityIcon(svg, width * 0.3, 450, "ENFP");
  drawSingleYIcon(svg, width * 0.3, 450, "i10");
  setUpSingleLineGraph(svg, width * 0.3, 450, "ENFP", enfpData, tooltip, "% of records that are inflow activities: ", "% of records");
  var entpData = getDataByPTypeValue(everyoneData, typesData, "ENTP", "Understanding and advancing the welfare of all people");
  displayPersonalityTitle(svg, width * 0.7, 450, "ENTP: Knowledgable");
  displayerPersonalityIcon(svg, width * 0.7, 450, "ENTP");
  drawSingleYIcon(svg, width * 0.7, 450, "welfare");
  setUpSingleLineGraph(svg, width * 0.7, 450, "ENTP", entpData, tooltip, "% of participants who value understanding and advancing the welfare of all people: ", "% of participants");
  setUpLeftPersonalityTitleIcon(svg, "intuitors", "The Intuitors");
}

function drawFeelerThinkerVis(svgClass, everyoneData, personalityData, typesData) {
  var svg = d3.select(svgClass);
  var tooltip = addTooltip("feelerthinkerTooltip");
  var isfpData = getDataByPType(everyoneData, typesData, "ISFP", communicationList, getPersonDataByActivities);
  displayPersonalityTitle(svg, width * 0.15, 100, "ISFP: Fiercely Independent");
  displayerPersonalityIcon(svg, width * 0.15, 100, "ISFP");
  drawMultipleYIcons(svg, width * 0.15, 100, communicationList);
  setUpSingleLineGraph(svg, width * 0.15, 100, "ISFP", isfpData, tooltip, "% of records that are considered a form of communication: ", "% of records");
  var infpData = getDataByPTypeValue(everyoneData, typesData, "INFP", "Enjoying life");
  displayPersonalityTitle(svg, width * 0.55, 100, "INFP: Open-Minded & Flexible");
  displayerPersonalityIcon(svg, width * 0.55, 100, "INFP");
  drawSingleYIcon(svg, width * 0.55, 100, "enjoying life");
  setUpSingleLineGraph(svg, width * 0.55, 100, "INFP", infpData, tooltip, "% of participants who value exploring and enjoying life: ", "% of participants");
  var esfjDataBad = getDataByPType(everyoneData, typesData, "ESFJ", communicationList, getPersonDataByActivitiesAndMood, ["Bad"]);
  var esfjDataAwful = getDataByPType(everyoneData, typesData, "ESFJ", communicationList, getPersonDataByActivitiesAndMood, ["Awful"]);
  displayPersonalityTitle(svg, width * 0.15, 450, "ESFJ: Sensitive & Warm");
  displayerPersonalityIcon(svg, width * 0.15, 450, "ESFJ");
  drawMultipleYIcons(svg, width * 0.15, 450, communicationList);
  setUpMultipleLinesGraph(svg, width * 0.15, 450, "ESFJ", esfjDataBad, esfjDataAwful, tooltip, " % of records that are “bad” or “awful” for any form of communication: ", "% of records");
  console.log(esfjDataBad);
  console.log(esfjDataAwful);
  var enfjData = getDataByPTypePData(everyoneData, typesData, personalityData, "ENFJ", "Do you prefer breadth or depth in life?", "Depth");
  displayPersonalityTitle(svg, width * 0.55, 450, "ENFJ: Tolerant & Reliable");
  displayerPersonalityIcon(svg, width * 0.55, 450, "ENFJ");
  drawSingleYIcon(svg, width * 0.55, 450, "Depth");
  setUpSingleLineGraph(svg, width * 0.55, 450, "ENFJ", enfjData, tooltip, "% of participants who prefer depth over breadth: ", "% of participants");
  setUpLeftPersonalityTitleIcon(svg, "feelers", "The Feelers");
  setUpRightPersonalityTitleIcon(svg, "thinkers", "The Thinkers");
}

function drawObserverVis(svgClass, everyoneData, personalityData, typesData) {
  var svg = d3.select(svgClass); // excluding rest, self-care, eating and drinking

  var exclusionList = ["i8:", "i3:", "i9:"];
  var tooltip = addTooltip("observerTooltip");
  var istjData = getDataByPTypePData(everyoneData, typesData, personalityData, "ISTJ", "What do you spend most of your time doing?", "Working for a company");
  displayPersonalityTitle(svg, width * 0.3, 100, "ISTJ: Loyal to structured organizations");
  displayerPersonalityIcon(svg, width * 0.3, 100, "ISTJ");
  drawSingleYIcon(svg, width * 0.3, 100, "Company");
  setUpSingleLineGraph(svg, width * 0.3, 100, "ISTJ", istjData, tooltip, "% of participants who work at a company: ", "% of participants");
  var isfjDataGood = getDataByPType(everyoneData, typesData, "ISFJ", isfjActList, getPersonDataByActivitiesAndMood, ["Good"]);
  var isfjDataOk = getDataByPType(everyoneData, typesData, "ISFJ", isfjActList, getPersonDataByActivitiesAndMood, ["Ok"]);
  displayPersonalityTitle(svg, width * 0.7, 100, "ISFJ: Practical & Altruistic");
  displayerPersonalityIcon(svg, width * 0.7, 100, "ISFJ");
  drawSingleYIcon(svg, width * 0.68, 100, isfjActList[0]);
  drawSingleYIcon(svg, width * 0.72, 100, isfjActList[1]);
  setUpMultipleLinesGraph(svg, width * 0.7, 100, "ISFJ", isfjDataGood, isfjDataOk, tooltip, "% of “good” and “ok” records for manual work and logistical activities: ", "% of records");
  displayPersonalityTitle(svg, width * 0.3, 450, "ESTP: Not found in the data");
  svg.append("image").attr('xlink:href', 'images/ESTP.svg').attr("x", width * 0.3 + mWidth / 2 - iconDim / 2).attr("y", 450 + 10).attr("width", iconDim).attr("height", iconDim);
  var esfpData = getDataByPTypeValue(everyoneData, typesData, "ESFP", "Adhering to my culture or religion");
  displayPersonalityTitle(svg, width * 0.7, 450, "ESFP: Bold");
  displayerPersonalityIcon(svg, width * 0.7, 450, "ESFP");
  drawSingleYIcon(svg, width * 0.7, 450, "religion");
  setUpSingleLineGraph(svg, width * 0.7, 450, "ESFP", esfpData, tooltip, "% of participants who value adherence to a culture or religion: ", "% of participants");
  setUpLeftPersonalityTitleIcon(svg, "observers", "The Observers");
}

function drawPersonalityKey(svgClass) {
  var svg = d3.select(svgClass);
  svg.append("text").attr("x", width * 0.3).attr("y", height * 0.25).text("PERSONALITY DIMENSIONS").style("font-family", "Courier new").style("text-anchor", "middle").style("font-weight", "bold").style("font-size", 12).style("fill", textColor);
  svg.append("image").attr('xlink:href', 'images/Thinking.svg').attr("x", width * 0.05).attr("y", height * 0.35).attr("width", 100).attr("height", 100);
  addTextLabel(svg, width * 0.05 + 50, height * 0.35 + 100 + 20, "thinking");
  svg.append("image").attr('xlink:href', 'images/Feeling.svg').attr("x", width * 0.20).attr("y", height * 0.35).attr("width", 100).attr("height", 100);
  addTextLabel(svg, width * 0.20 + 50, height * 0.35 + 100 + 20, "feeling");
  svg.append("image").attr('xlink:href', 'images/Intuition.svg').attr("x", width * 0.35).attr("y", height * 0.35).attr("width", 100).attr("height", 100);
  addTextLabel(svg, width * 0.35 + 100 + 20, height * 0.35 + 50, "intuition", false);
  svg.append("image").attr('xlink:href', 'images/Perceiving.svg').attr("x", width * 0.05).attr("y", height * 0.57).attr("width", 100).attr("height", 100);
  addTextLabel(svg, width * 0.05 + 50, height * 0.57 + 100 + 20, "perceiving");
  svg.append("image").attr('xlink:href', 'images/Judging.svg').attr("x", width * 0.20).attr("y", height * 0.57).attr("width", 100).attr("height", 100);
  addTextLabel(svg, width * 0.20 + 50, height * 0.57 + 100 + 20, "judging");
  svg.append("image").attr('xlink:href', 'images/Observing.svg').attr("x", width * 0.35).attr("y", height * 0.47).attr("width", 100).attr("height", 100);
  addTextLabel(svg, width * 0.35 + 100 + 20, height * 0.47 + 50, "observing", false);
  svg.append("image").attr('xlink:href', 'images/Introversion.svg').attr("x", width * 0.355).attr("y", height * 0.63).attr("width", 25).attr("height", 25);
  svg.append("image").attr('xlink:href', 'images/Extroversion.svg').attr("x", width * 0.405).attr("y", height * 0.63).attr("width", 25).attr("height", 25);
  addTextLabel(svg, width * 0.34, height * 0.6, "introversion", false);
  addTextLabel(svg, width * 0.4, height * 0.7, "extroversion", false);
  svg.append("image").attr('xlink:href', 'images/ESTP.svg').attr("x", width * 0.3 - 75).attr("y", height * 0.85).attr("width", 150).attr("height", 150);
  addTextLabel(svg, width * 0.2 - 20, height * 0.85, "example:", false);
  addTextLabel(svg, width * 0.2 - 20, height * 0.85 + 15, "ESTP", false);
  addTextLabel(svg, width * 0.7, height * 0.53, "We categorized personality types by", false);
  addTextLabel(svg, width * 0.7, height * 0.53 + 15, "their dominant function.", false);
}

function addTextLabel(svg, x, y, text) {
  var isMiddle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  svg.append("text").attr("x", x).attr("y", y).text(text).style("font-family", "Courier new").style("text-anchor", function () {
    if (isMiddle) return "middle";
    return "left";
  }).style("font-size", 12).style("fill", textColor);
}

function setUpSingleLineGraph(svg, x, y, personality, data, tooltip, tooltipText) {
  var yLabel = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "";
  // add group label
  svg.append("text").attr("x", x + mWidth * 0.7).attr("y", y + mHeight + 15).text("group").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "middle").style("font-size", 11).style("fill", textColor); // display y axis label

  svg.append("text").attr("x", x + mWidth * 0.25).attr("y", y + 30).text(yLabel).style("font-family", "Courier new").style("text-anchor", "end").style("font-size", 10).style("fill", textColor);
  var yScale = d3.scaleLinear().domain([0, d3.max([data[0].percent, data[1].percent])]).range([y + mHeight - 10, y + 30]); // draw line 

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var xLine = x + mWidth / 4 + iconDim / 2 + mWidth * 0.3 * i - 5;
    drawImperfectVerticalLine(svg, yScale(d.percent), yScale(0), xLine, dashArray[d.fAttitude], colorHexArray[d.fMood]);
  } // draw tooltip areas


  svg.selectAll('.tooltip').data(data).enter().append('rect').attr('x', function (d, i) {
    return x + mWidth / 4 + iconDim / 2 + mWidth * 0.3 * i - 5 - 10;
  }).attr('y', function (d) {
    return yScale(d.percent);
  }).attr('width', 20).attr('height', function (d) {
    return yScale(0) - yScale(d.percent);
  }).style('opacity', 0).on("mousemove", function (d, i) {
    var titleText = i == 0 ? personality : "GROUP";
    var text = "<b>" + titleText + "</b></br></br>" + tooltipText + (d.percent * 100).toFixed(2) + "%";
    setTooltipText(tooltip, text, 20, 270, "uppercase");
  }).on("mouseout", function (d) {
    tooltip.style("visibility", "hidden");
  });
}

function setUpMultipleLinesGraph(svg, x, y, personality, data1, data2, tooltip, tooltipText) {
  var yLabel = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "";
  // add group label
  svg.append("text").attr("x", x + mWidth * 0.7).attr("y", y + mHeight + 15).text("group").style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "middle").style("font-size", 11).style("fill", textColor); // display y axis label

  svg.append("text").attr("x", x + mWidth * 0.25).attr("y", y + 30).text(yLabel).style("font-family", "Courier new").style("text-anchor", "end").style("font-size", 10).style("fill", textColor);
  var yScale = d3.scaleLinear().domain([0, d3.max(data1.concat(data2), function (d) {
    return d.percent;
  })]).range([y + mHeight - 10, y + 30]); // draw data1 line 

  for (var i = 0; i < data1.length; i++) {
    var d = data1[i];
    var x1 = x + mWidth / 4 + iconDim / 2 + mWidth * 0.3 * i - 10;
    drawImperfectVerticalLine(svg, yScale(d.percent), yScale(0), x1, dashArray[d.fAttitude], colorHexArray[d.fMood]);
  } // draw data2 lines 


  for (var i = 0; i < data2.length; i++) {
    var d = data2[i];
    var x2 = x + mWidth / 4 + iconDim / 2 + mWidth * 0.3 * i;
    drawImperfectVerticalLine(svg, yScale(d.percent), yScale(0), x2, dashArray[d.fAttitude], colorHexArray[d.fMood]);
  } // tooltip for group


  svg.append('rect').attr('x', function (d, i) {
    return x + mWidth / 4 + iconDim / 2 + mWidth * 0.3 - 15;
  }).attr('y', function (d) {
    return yScale(Math.max(0.02, data1[1].percent));
  }).attr('width', 20).attr('height', function (d) {
    return yScale(0) - yScale(Math.max(0.02, data1[1].percent));
  }).style('opacity', 0).on("mousemove", function () {
    var titleText = "GROUP";
    var text = "<b>" + titleText + "</b></br></br>" + tooltipText + ((data1[1].percent + data2[1].percent) * 100).toFixed(2) + "%";
    setTooltipText(tooltip, text, 20, 270);
  }).on("mouseout", function (d) {
    tooltip.style("visibility", "hidden");
  }); // tooltip for personality

  svg.append('rect').attr('x', function (d, i) {
    return x + mWidth / 4 + iconDim / 2 - 15;
  }).attr('y', function (d) {
    return yScale(Math.max(0.02, data1[0].percent));
  }).attr('width', 20).attr('height', function (d) {
    return yScale(0) - yScale(Math.max(0.02, data1[0].percent));
  }).style('opacity', 0).on("mousemove", function () {
    var titleText = personality;
    var text = "<b>" + titleText + "</b></br></br>" + tooltipText + ((data1[0].percent + data2[0].percent) * 100).toFixed(2) + "%";
    setTooltipText(tooltip, text, 20, 270);
  }).on("mouseout", function (d) {
    tooltip.style("visibility", "hidden");
  });
}

function setUpLeftPersonalityTitleIcon(svg, img, title) {
  svg.append("text").attr("x", width * 0.07).attr("y", height * 0.5).text(title).style("font-family", "Courier new").style("text-anchor", "middle").style("font-weight", "bold").style("font-size", 12).style("fill", textColor);
  svg.append("image").attr('xlink:href', 'images/' + img + '.svg').attr("x", width * 0.03).attr("y", height * 0.53).attr("width", 75).attr("height", 75);
}

function setUpRightPersonalityTitleIcon(svg, img, title) {
  svg.append("text").attr("x", width * 0.95).attr("y", height * 0.5).text(title).style("font-family", "Courier new").style("text-anchor", "middle").style("font-weight", "bold").style("font-size", 12).style("fill", textColor);
  svg.append("image").attr('xlink:href', 'images/' + img + '.svg').attr("x", width * 0.91).attr("y", height * 0.53).attr("width", 75).attr("height", 75);
}

function displayPersonalityTitle(svg, x, y, title) {
  svg.append("text").attr("x", x + mWidth / 2).attr("y", y).text(title).style("font-family", "Courier new").style("font-weight", "bold").style("text-anchor", "middle").style("font-size", 11).style("fill", textColor);
}

function displayerPersonalityIcon(svg, x, y, personality) {
  svg.append("image").attr('xlink:href', 'images/' + personality + '.svg').attr("x", x + mWidth / 4).attr("y", y + mHeight).attr("width", iconDim).attr("height", iconDim);
}

function drawSingleYIcon(svg, x, y, icon) {
  svg.append("image").attr('xlink:href', 'images/' + icon + '.svg').attr("x", x + mWidth * 0.05).attr("y", y + mHeight / 2).attr("width", iconDim / 2).attr("height", iconDim / 2).style("filter", "url(#Grey)");
}

function drawMultipleYIcons(svg, x, y, list) {
  //top row
  for (var i = 0; i < 3; i++) {
    svg.append("image").attr('xlink:href', 'images/' + list[i] + '.svg').attr("x", x + mWidth * (0.01 + i * 0.08)).attr("y", y + mHeight / 3).attr("width", iconDim / 3).attr("height", iconDim / 3).style("filter", "url(#Grey)");
  }

  for (var i = 3; i < 5; i++) {
    svg.append("image").attr('xlink:href', 'images/' + list[i] + '.svg').attr("x", x + mWidth * (0.01 + (i - 2) * 0.08)).attr("y", y + mHeight / 3 + iconDim / 3).attr("width", iconDim / 3).attr("height", iconDim / 3).style("filter", "url(#Grey)");
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/intuitorsVis.js"], null)
//# sourceMappingURL=/intuitorsVis.a7536062.js.map