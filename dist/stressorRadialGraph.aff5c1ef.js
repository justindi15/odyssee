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
})({"javascript/stressorRadialGraph.js":[function(require,module,exports) {
function drawStressorRadialGraphSetup(svg, center, circleRadius, circleRadiusIncrement, outerText, innerText) {
  var titleAttr = {
    fontSize: 25,
    fontFamily: "Courier new",
    textAnchor: "middle",
    alignment: "middle"
  };
  svg.append("text").attr("x", center.x).attr("y", center.y).text("Stressors").style("font-family", titleAttr.fontFamily).style("font-size", titleAttr.fontSize).style("fill", textColor).style("text-anchor", titleAttr.textAnchor).style("alignment-baseline", titleAttr.alignment);
  drawText(svg, innerText, {
    x: center.x,
    y: center.y + circleRadius + circleRadiusIncrement - 12
  });
  drawImperfectCircle(svg, center, circleRadius + circleRadiusIncrement, {
    strokeWidth: 1.5
  });
  drawText(svg, outerText, {
    x: center.x,
    y: center.y + circleRadius + circleRadiusIncrement * 2 - 12
  });
  drawImperfectCircle(svg, center, circleRadius + circleRadiusIncrement * 2, {
    strokeWidth: 1.5
  });
}
/**
 *   svgClass: tag for svg class, must include the "."
 *   everyoneData: record data for everyone
 *   personalityData: personality data for everyone
 */


function drawStressorRadialGraph(svgClass, everyoneData, personalityData) {
  var email = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var svg = d3.select(svgClass);
  var height = svg.attr("height");
  var width = svg.attr("width"); // console.log(personalityData);
  // console.log(everyoneData);

  var circleRadius = 160;
  var circleRadiusIncrement = 100;
  var center = {
    x: width / 2,
    y: (height - padding * 2.5) / 2
  }; // Setup scales.

  var radialScale = d3.scaleBand().domain(categories).range([0, Math.PI * 2]); // For each category stressor tagged by user in personalityData, look through the activity with highest 
  // percentage of bad and awful records. These will be the activities that fall into the group.

  var categoryActivityCountMap = {};
  var categoryActivityMap = {};
  var categoryReasonMap = {};
  var categoryMoodMap = {}; // myData defaults to null, will update to hold longTerm and shortTerm stressors if they exist.

  var myData = null; // Setup categoryActivityCountMap.
  // Structure - { category: { short: { activity: negative mood count }, long: { ... }} }

  categories.forEach(function (category) {
    var activityCountMap = {};
    var reasonCountMap = {};
    var moodCountMap = {};
    var countMaps = [activityCountMap, reasonCountMap, moodCountMap];
    initializeCountMaps(countMaps);
    var longTermEmailList = getEmailListForCategory(personalityData, category, keys.personality.longTermStressor);
    var shortTermEmailList = getEmailListForCategory(personalityData, category, keys.personality.shortTermStressor);
    var longTermRecords = everyoneData.filter(function (record) {
      return longTermEmailList.includes(record[keys.everyone.email]);
    });
    var shortTermRecords = everyoneData.filter(function (record) {
      return shortTermEmailList.includes(record[keys.everyone.email]);
    });

    if (email != null && longTermEmailList.includes(email)) {
      myData = myData == null ? {} : myData;
      myData.longTerm = category;
    }

    if (email != null && shortTermEmailList.includes(email)) {
      myData = myData == null ? {} : myData;
      myData.shortTerm = category;
    }

    getCountMapNegativePercentageFromRecords(longTermRecords, "long", activityCountMap, reasonCountMap, moodCountMap);
    getCountMapNegativePercentageFromRecords(shortTermRecords, "short", activityCountMap, reasonCountMap, moodCountMap);
    categoryActivityCountMap[category] = activityCountMap;
    categoryReasonMap[category] = reasonCountMap;
    categoryMoodMap[category] = moodCountMap;
    categoryActivityMap[category] = {};
  }); // console.log("Activity Maps: ");
  // console.log(categoryActivityCountMap);
  // console.log(categoryActivityMap);
  // console.log("Reason Map: ");
  // console.log(categoryReasonMap);
  // console.log("Mood Map: ");
  // console.log(categoryMoodMap);

  function updateCategoryMaxValue(category, type, countMap) {
    var updateMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : countMap;
    var map = countMap[category][type];
    var maxNegativeCount = d3.max(Object.keys(map), function (key) {
      return map[key];
    }); // console.log(category + ": " + maxNegativeCount)

    updateMap[category][type] = Object.keys(map).find(function (key) {
      // if (map[key] == maxNegativeCount) {
      //     console.log(key)
      // }
      return map[key] == maxNegativeCount;
    });
  }

  function updateCategoryNominalValues(category, type) {
    updateCategoryMaxValue(category, type, categoryReasonMap);
    updateCategoryMaxValue(category, type, categoryMoodMap);
    updateCategoryMaxValue(category, type, categoryActivityCountMap, categoryActivityMap);
  } // Convert countMaps to point to value most apparent to negative feelings across all activities, but within the same category.


  categories.forEach(function (category) {
    updateCategoryNominalValues(category, "long");
    updateCategoryNominalValues(category, "short");
  }); // console.log("Activity Maps: ");
  // console.log(categoryActivityCountMap);
  // console.log(categoryActivityMap);
  // console.log("Reason Map: ");
  // console.log(categoryReasonMap);
  // console.log("Mood Map: ");
  // console.log(categoryMoodMap);

  function getMaxActivityCountPercentForType(type, categoryActivityMap, categoryActivityCountMap) {
    return d3.max(Object.keys(categoryActivityCountMap), function (category) {
      var maxNegActivity = categoryActivityMap[category][type];
      return categoryActivityCountMap[category][type][maxNegActivity];
    });
  }

  var maxNegativePercentageCounts = [getMaxActivityCountPercentForType("long", categoryActivityMap, categoryActivityCountMap), getMaxActivityCountPercentForType("short", categoryActivityMap, categoryActivityCountMap)];
  var maxNegPercent = d3.max(maxNegativePercentageCounts);
  var lengthScale = d3.scaleLinear().domain([0, maxNegPercent]).range([0, circleRadiusIncrement * 2]);

  function decToPercentString(dec) {
    return Math.round(dec * 100) + "%";
  }

  drawStressorRadialGraphSetup(svg, center, circleRadius, circleRadiusIncrement, decToPercentString(maxNegPercent), decToPercentString(maxNegPercent / 2));
  var tooltipId = "stressorRadialGraphTooltipId";
  var tooltip = d3.select("body").append("div").attr("id", tooltipId).style("padding", 10).style("position", "absolute").style("z-index", "10").style("visibility", "hidden").attr("white-space", "pre-line").style("background-color", backgroundColor).style("border-radius", "15px").style("border", "1px solid #cdcdcd");
  categories.forEach(function (category) {
    var maxNegActivity = categoryActivityMap[category];
    var innerRadius = circleRadius;
    var outerRadius = {
      long: circleRadius + lengthScale(categoryActivityCountMap[category]["long"][maxNegActivity.long]),
      short: circleRadius + lengthScale(categoryActivityCountMap[category]["short"][maxNegActivity.short])
    };
    var iconSize = 48; // Calculate angle in degrees.

    var angle = radialScale(category) * 180 / Math.PI - 225; // Add zigzag arc.

    var zigzagPadding = 16;
    var zigzagRadius = circleRadius - iconSize / 2; // Center arc with respect to icons.

    var zigzagAttr = {
      strokeWidth: 1.5,
      stroke: colorHexArray["Awful"],
      maxOffset: 8,
      minAngle: angle + zigzagPadding,
      maxAngle: angle + 90 - zigzagPadding
    };
    drawZigzagArc(svg, center, zigzagRadius, zigzagAttr); // Add category text.

    var textAttr = {
      fontSize: 12,
      fontFamily: "Courier new",
      fontWeight: "bold",
      textAnchor: "middle",
      alignment: "middle",
      x: center.x + (innerRadius - 12 - iconSize) * Math.cos(radialScale(category) + Math.PI / 4),
      y: center.y + (innerRadius - 12 - iconSize) * Math.sin(radialScale(category) + Math.PI / 4)
    };
    textAttr.transform = "rotate(" + (angle < -45 ? angle + 180 : angle) + " " + textAttr.x + " " + textAttr.y + ")";
    drawText(svg, category, textAttr);
    var constants = {
      svg: svg,
      center: center,
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      radialScale: radialScale,
      category: category,
      categoryMoodMap: categoryMoodMap,
      categoryReasonMap: categoryReasonMap,
      categoryActivityMap: categoryActivityMap,
      iconSize: iconSize,
      angle: angle,
      tooltip: tooltip,
      tooltipId: tooltipId
    }; // Add icons and radial lines.

    drawStressorRadialGraphBar(constants, "long", myData);
    drawStressorRadialGraphBar(constants, "short", myData);
  }); // Add legend.

  drawStressorRadialGraphLegend(svg, categoryActivityMap, categoryActivityMap); // Add annotation.

  var baseY = height * 0.14;
  drawText(svg, "The sources of our stress are somewhat related to", {
    x: width / 2,
    y: baseY,
    fontWeight: "bold"
  });
  drawText(svg, "the activities we feel most negatively about.", {
    x: width / 2,
    y: baseY + 16,
    fontWeight: "bold"
  });
  svg.append("line").attr("x1", width / 2).attr("x2", width / 2).attr("y1", baseY + 16 * 2).attr("y2", baseY + 16 * 2 + 56).attr("stroke", greyColor).attr("stroke-width", 1.5).attr("stroke-linecap", "round");
  svg.append("line").attr("x1", width * 0.37).attr("x2", width * 0.63).attr("y1", baseY + 16 * 2 + 56).attr("y2", baseY + 16 * 2 + 56).attr("stroke", greyColor).attr("stroke-width", 1.5).attr("stroke-linecap", "round");
}

function drawStressorRadialGraphBar(constants, type, myData) {
  // Unwrap constants.
  var svg = constants.svg;
  var center = constants.center;
  var innerRadius = constants.innerRadius;
  var outerRadius = constants.outerRadius;
  var radialScale = constants.radialScale;
  var category = constants.category;
  var categoryMoodMap = constants.categoryMoodMap;
  var categoryReasonMap = constants.categoryReasonMap;
  var categoryActivityMap = constants.categoryActivityMap;
  var iconSize = constants.iconSize;
  var angle = constants.angle;
  var angleOffset = 8 * Math.PI / 180;
  angleOffset = type == "long" ? -angleOffset : angleOffset; // Add icons.

  var imagePadding = iconSize / 2;
  var imageAttr = {
    x: center.x + (innerRadius - imagePadding) * Math.cos(radialScale(category) + Math.PI / 4 + angleOffset),
    y: center.y + (innerRadius - imagePadding) * Math.sin(radialScale(category) + Math.PI / 4 + angleOffset)
  };
  var lineAttr = {
    x1: center.x + innerRadius * Math.cos(radialScale(category) + Math.PI / 4 + angleOffset),
    y1: center.y + innerRadius * Math.sin(radialScale(category) + Math.PI / 4 + angleOffset),
    x2: center.x + outerRadius[type] * Math.cos(radialScale(category) + Math.PI / 4 + angleOffset),
    y2: center.y + outerRadius[type] * Math.sin(radialScale(category) + Math.PI / 4 + angleOffset)
  };
  var termAttr = {
    size: type == "long" ? constants.iconSize * 0.8 : constants.iconSize * 0.5,
    x: center.x + (outerRadius[type] + 12) * Math.cos(radialScale(category) + Math.PI / 4 + angleOffset),
    y: center.y + (outerRadius[type] + 12) * Math.sin(radialScale(category) + Math.PI / 4 + angleOffset)
  };
  termAttr.transform = "rotate(" + angle + " " + termAttr.x + " " + termAttr.y + ")";
  var g = svg.append("g");
  g.append("image").attr("xlink:href", "images/" + type + "-term.svg").attr("x", termAttr.x - termAttr.size / 2).attr("y", termAttr.y - termAttr.size / 2).attr("width", termAttr.size).attr("height", termAttr.size).style("filter", function () {
    return "url(#" + categoryMoodMap[category][type] + ")";
  }).attr("transform", termAttr.transform);
  angle = Math.atan((lineAttr.y2 - lineAttr.y1) / (lineAttr.x2 - lineAttr.x1)) * 180 / Math.PI - 90;

  if (category == "health" || category == "logistical") {
    angle += 180;
  }

  var transform = "rotate(" + angle + " " + imageAttr.x + " " + imageAttr.y + ")";
  g.append("image").attr("xlink:href", "images/" + categoryActivityMap[category][type] + ".svg").attr("x", imageAttr.x - iconSize / 2).attr("y", imageAttr.y - iconSize / 2).attr("width", iconSize).attr("height", iconSize).style("filter", function () {
    return "url(#" + categoryMoodMap[category][type] + ")";
  }).attr("transform", transform);
  g.append("line").attr("x1", lineAttr.x1).attr("x2", lineAttr.x2).attr("y1", lineAttr.y1).attr("y2", lineAttr.y2).attr("stroke", colorHexArray[categoryMoodMap[category][type]]).attr("stroke-width", 2.5).style("stroke-linecap", "round").style("stroke-dasharray", dashArray[categoryReasonMap[category][type]]);
  g.on("mousemove", function () {
    var tooltipText = "<b>STRESSOR:</b> " + type + "-term" + " - " + category + "</br></br><b>ACTIVITY: </b>" + activityShortToLong[categoryActivityMap[category][type]].toLowerCase() + "</br></br><b>MOST FREQUENT MOOD: </b>" + categoryMoodMap[category][type].toLowerCase() + "</br></br><b>MOST FREQUENT ATTITUDE: </b>" + attitudeLongtoShort[categoryReasonMap[category][type]].toLowerCase();

    if (myData != null && category == myData.shortTerm && type == "short") {
      tooltipText += "</br></br><b>YOU ARE IN THIS SHORT-TERM STRESSOR GROUP</b>";
    }

    if (myData != null && category == myData.longTerm && type == "long") {
      tooltipText += "</br></br><b>YOU ARE IN THIS LONG-TERM STRESSOR GROUP</b>";
    }

    constants.tooltip.html(tooltipText).style("font-family", "Courier new").style("font-size", 12).style("text-align", "left").style("color", textColor).style("visibility", "visible").style("max-width", 250).style("top", event.pageY + 20).style("left", function () {
      if (d3.event.clientX < 750) {
        return event.pageX + 20 + "px";
      } else {
        return event.pageX - document.getElementById(constants.tooltipId).clientWidth - 20 + "px";
      }
    });
  }).on("mouseout", function (d) {
    constants.tooltip.style("visibility", "hidden");
  });
}

function drawStressorRadialGraphLegend(svg, categoryActivityMap, categoryActivityMap) {
  var height = svg.attr("height");
  var width = svg.attr("width");
  var interLegendPadding = 24; // Draw most negative activity.

  var mostNegAttr = {
    x: padding,
    y: height - padding * 2.5,
    width: width / 3 / 2 - interLegendPadding
  };
  var mostNegLegend = svg.append("g").attr("width", mostNegAttr.width).attr("transform", "translate(" + mostNegAttr.x + "," + mostNegAttr.y + ")"); // Add text.

  mostNegLegend.append("text").text("Most negative activity").attr("x", mostNegAttr.width / 2).attr("y", 15).attr("text-anchor", "middle").style("font-family", "Courier new").style("fill", textColor).style("font-size", 12); // Setup icon size and filter.

  var iconSize = 36;
  svg.append('filter').attr('id', 'Text').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.3 0 0 0 0 0.3 0 0 0 0 0.3 0 0 0 1 0"); // Calculate most negative activity (long-term).

  var longTermMaxPercent = d3.max(categories, function (category) {
    return categoryActivityMap[category]["long"];
  });
  categories.forEach(function (category) {
    if (categoryActivityMap[category]["long"] == longTermMaxPercent) {
      // Add icon.
      mostNegLegend.append("image").attr("xlink:href", "images/" + categoryActivityMap[category]["long"] + ".svg").attr("x", mostNegAttr.width / 2 - iconSize / 2).attr("y", padding * 2.5 / 2 - iconSize / 2 - 12).attr("width", iconSize).attr("height", iconSize).style("filter", function () {
        return "url(#Text)";
      });
    }
  }); // Draw mood legend.

  var moodLegendAttr = {
    x: width / 3 / 2 + interLegendPadding + padding,
    y: height - padding * 2.5,
    width: width / 3 / 2 - interLegendPadding - padding
  };
  var moodLegend = svg.append("g").attr("class", "moodLegend").attr("width", moodLegendAttr.width).attr("transform", "translate(" + moodLegendAttr.x + "," + moodLegendAttr.y + ")");
  drawMoodLegend(moodLegend, "Most frequent mood", negativeMoods); // Draw line legend.

  var lineLegendAttr = {
    x: width / 3 + padding / 2 + interLegendPadding / 2,
    y: height - padding * 2.5,
    width: width / 3 - interLegendPadding,
    iconSize: {
      long: 32,
      short: 22
    }
  };
  var lineLegend = svg.append("g").attr("width", lineLegendAttr.width).attr("transform", "translate(" + lineLegendAttr.x + "," + lineLegendAttr.y + ")"); // Add text.

  var textLineYPos = [15, 15 + 16, 15 + 20 + 24 + 12, 15 + 20 + 24 + 16 + 12];
  var longStressorTextAttr = {
    x: lineLegendAttr.width / 2 - lineLegendAttr.iconSize.long - 8 - 12,
    textAnchor: "end"
  };
  drawText(lineLegend, "long-term", {
    x: longStressorTextAttr.x,
    y: textLineYPos[0],
    textAnchor: longStressorTextAttr.textAnchor
  });
  drawText(lineLegend, "stressor", {
    x: longStressorTextAttr.x,
    y: textLineYPos[1],
    textAnchor: longStressorTextAttr.textAnchor
  });
  lineLegend.append("image").attr("xlink:href", "images/long-term.svg").attr("x", lineLegendAttr.width / 2 - lineLegendAttr.iconSize.long - 8).attr("y", 16 - lineLegendAttr.iconSize.long / 2).attr("width", lineLegendAttr.iconSize.long).attr("height", lineLegendAttr.iconSize.long);
  lineLegend.append("image").attr("xlink:href", "images/short-term.svg").attr("x", lineLegendAttr.width / 2 + 8).attr("y", 16 - lineLegendAttr.iconSize.short / 2).attr("width", lineLegendAttr.iconSize.short).attr("height", lineLegendAttr.iconSize.short);
  var shortStressorTextAttr = {
    x: lineLegendAttr.width / 2 + 8 + lineLegendAttr.iconSize.short + 12,
    textAnchor: "start"
  };
  drawText(lineLegend, "short-term", {
    x: shortStressorTextAttr.x,
    y: textLineYPos[0],
    textAnchor: shortStressorTextAttr.textAnchor
  });
  drawText(lineLegend, "stressor", {
    x: shortStressorTextAttr.x,
    y: textLineYPos[1],
    textAnchor: shortStressorTextAttr.textAnchor
  });
  lineLegend.append("line").attr("x1", lineLegendAttr.width / 2).attr("x2", lineLegendAttr.width / 2).attr("y1", 15 + 20).attr("y2", 15 + 20 + 24).attr("stroke", textColor).attr("stroke-width", 2.5).style("stroke-linecap", "round").style("stroke-dasharray", dashArray["I have to"]);
  var lengthTextAttr = {
    x: lineLegendAttr.width / 2,
    alignmentBaseline: "hanging"
  };
  drawText(lineLegend, "length represents ratio of", {
    x: lengthTextAttr.x,
    y: textLineYPos[2],
    alignmentBaseline: "hanging"
  });
  drawText(lineLegend, "Bad/Awful records to total records", {
    x: lengthTextAttr.x,
    y: textLineYPos[3],
    alignmentBaseline: lengthTextAttr.alignmentBaseline
  }); // Draw attitude legend.

  var attitudeLegendAttr = {
    x: width / 3 * 2 + interLegendPadding / 2 + padding,
    y: height - padding * 2.5,
    width: width / 3 - interLegendPadding * 2 - padding
  };
  var attitudeLegend = svg.append("g").attr("class", "attitudeLegend").attr("width", attitudeLegendAttr.width).attr("transform", "translate(" + attitudeLegendAttr.x + "," + attitudeLegendAttr.y + ")");
  drawAttitudeLegend(attitudeLegend, "Most frequent attitude", attitudeList);
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/stressorRadialGraph.js"], null)
//# sourceMappingURL=/stressorRadialGraph.aff5c1ef.js.map