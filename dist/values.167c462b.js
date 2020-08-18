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
})({"javascript/values.js":[function(require,module,exports) {
/**
 *   svgClass: tag for svg class, must include the '.'
 *   timeData: time data for records
 *   returns void, draws data vis for values.
 */
function drawValuesVis(svgClass, ikigaiData, typesData, everyoneData) {
  var email = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var svg = d3.select(svgClass);
  var height = svg.attr("height");
  var width = svg.attr("width");
  var titleVerticalPadding = 70;
  var legendVerticalPadding = padding * 2.5;
  var verticalPadding = 72;
  var lineWidth = 2;
  var valueImageSize = 48;
  var imageSize = 56;
  var horizontalPadding = 24;
  drawTitle(svg, "Values"); // console.log(typesData);
  // console.log(ikigaiData);
  // console.log(everyoneData);

  var valueCountMap = {};
  var personalityShorttoLong = {
    "I": "Introversion",
    "E": "Extroversion",
    "S": "Observing",
    "N": "Intuition",
    "T": "Thinking",
    "F": "Feeling",
    "J": "Judging",
    "P": "Prospecting"
  };
  var valueLongtoShort = {
    "Achieving stability of society, of relationships, and of self": "Stability",
    "Enjoying life": "enjoying life",
    "Looking out for my family, friends, and community": "Looking out",
    "Achieving personal success": "Personal Success"
  };

  function incrementMapCount(map, key) {
    var count = map[key];
    map[key] = count == null ? 1 : count + 1;
    return map;
  }

  function getPersonalityMultiples(totalData, usersOfGroup, traitKey, emailKey) {
    var countKey = "count";
    var countMap = {
      group: {},
      total: {}
    };
    totalData.forEach(function (d) {
      d[traitKey].split("").forEach(function (trait) {
        incrementMapCount(countMap.total, trait); // Increment total data.

        incrementMapCount(countMap.total, countKey);

        if (usersOfGroup.includes(d[emailKey])) {
          incrementMapCount(countMap.group, trait); // Increment group's data.

          incrementMapCount(countMap.group, countKey);
        }
      });
    });
    Object.keys(countMap).forEach(function (type) {
      Object.keys(countMap[type]).filter(function (key) {
        return key != countKey;
      }).forEach(function (key) {
        // Divide by number of total data for group.
        countMap[type][key] = countMap[type][key] / countMap[type][countKey];
      });
    }); // console.log("Percentage in category: ")
    // console.log(countMap)

    var categoryCountMap = {};
    Object.keys(countMap.total).filter(function (key) {
      return key != countKey && key != "X";
    }).forEach(function (key) {
      countMap.group[key] = countMap.group[key] == undefined ? 0 : countMap.group[key];
      categoryCountMap[key] = countMap.group[key] / countMap.total[key];
    }); // console.log("Percentage in group / Percentage in total: ")
    // console.log(categoryCountMap)

    return categoryCountMap;
  }

  function getCategoryRepresentedMultiples(totalData, usersOfGroup, category, emailKey) {
    var countKey = "count";
    var countMap = {
      group: {},
      total: {}
    };
    totalData.forEach(function (d) {
      incrementMapCount(countMap.total, d[category]); // Increment total data.

      incrementMapCount(countMap.total, countKey);

      if (usersOfGroup.includes(d[emailKey])) {
        incrementMapCount(countMap.group, d[category]); // Increment group's data.

        incrementMapCount(countMap.group, countKey);
      }
    });
    Object.keys(countMap).forEach(function (type) {
      Object.keys(countMap[type]).filter(function (key) {
        return key != countKey;
      }).forEach(function (key) {
        // Divide by number of total data for group.
        countMap[type][key] = countMap[type][key] / countMap[type][countKey];
      });
    });
    var categoryCountMap = {};
    Object.keys(countMap.total).filter(function (key) {
      return key != countKey;
    }).forEach(function (key) {
      countMap.group[key] = countMap.group[key] == undefined ? 0 : countMap.group[key];
      categoryCountMap[key] = countMap.group[key] / countMap.total[key];
    });
    return categoryCountMap;
  }

  function getMinMaxOfCountMap(countMap) {
    var max = d3.max(Object.keys(countMap), function (d) {
      return countMap[d];
    });
    var min = d3.min(Object.keys(countMap), function (d) {
      return countMap[d];
    });
    var maxCategory = Object.keys(countMap).find(function (d) {
      return max == countMap[d];
    });
    var minCategory = Object.keys(countMap).find(function (d) {
      return min == countMap[d];
    });
    return {
      min: minCategory,
      max: maxCategory
    };
  }

  var myData = null;

  if (email != null) {
    myData = {
      value: typesData.find(function (d) {
        return d[keys.types.email] == email;
      })[keys.types.value],
      included: false
    };
  }

  typesData.forEach(function (d) {
    incrementMapCount(valueCountMap, d[keys.types.value]);
  });
  var mostFrequentValues = Object.keys(valueCountMap).map(function (key) {
    return {
      value: key,
      count: valueCountMap[key]
    };
  }).sort(function (a, b) {
    return b.count - a.count; // Sort values by user count.
  }).slice(0, 4); // Top 4 most frequent values.

  mostFrequentValues.forEach(function (v) {
    var users = typesData.filter(function (d) {
      return d[keys.types.value] == v.value;
    }).map(function (d) {
      return d[keys.types.email];
    });
    var activityMultiples = getCategoryRepresentedMultiples(everyoneData, users, keys.everyone.activity, keys.everyone.email);
    var attitudeMultiples = getCategoryRepresentedMultiples(everyoneData, users, keys.everyone.attitude, keys.everyone.email);
    var ikigaiMultiples = getCategoryRepresentedMultiples(ikigaiData, users, keys.ikigai.category, keys.ikigai.email);
    var occupationMultiples = getCategoryRepresentedMultiples(typesData, users, keys.types.occupation, keys.types.email);
    var personalityMultiples = getPersonalityMultiples(typesData, users, keys.types.personality, keys.types.email); // console.log(personalityMultiples);

    v.users = users;
    v.activity = activityMultiples;
    v.attitude = attitudeMultiples;
    v.ikigai = ikigaiMultiples;
    v.occupation = occupationMultiples;
    v.personality = personalityMultiples;

    if (myData != null && myData.value == v.value) {
      myData.included = true;
    }
  }); // console.log(mostFrequentValues);

  var graphStart = titleVerticalPadding + verticalPadding;
  var graphEnd = height - legendVerticalPadding - valueImageSize - verticalPadding;
  var graphHeight = Math.floor((graphEnd - graphStart) / 4);
  var valueYScale = d3.scaleLinear().domain([0, 3]).range([graphStart, graphEnd]);
  var ikigaiWidth = 200;
  var maxUserCount = d3.max(mostFrequentValues, function (d) {
    return d.count;
  });
  var minUserCount = d3.min(mostFrequentValues, function (d) {
    return d.count;
  });
  var staticWidth = valueImageSize + horizontalPadding * 4 + imageSize * 2;
  var lengthXScale = d3.scaleLinear().domain([minUserCount, maxUserCount]).range([staticWidth + ikigaiWidth, width - imageSize]);
  var ikigaiXScale = d3.scaleBand().domain(ikigaiGroups).range([staticWidth, staticWidth + ikigaiWidth]); // Add tooltip.

  var tooltipId = 'valuesVisTooltipId';
  var tooltip = addTooltip(tooltipId);
  mostFrequentValues.forEach(function (d, i) {
    var y = valueYScale(i);
    var underOverRepActivities = getMinMaxOfCountMap(d.activity);
    Object.keys(underOverRepActivities).forEach(function (key) {
      underOverRepActivities[key] = underOverRepActivities[key].substring(0, 2);
    });
    var underOverRepOccupation = getMinMaxOfCountMap(d.occupation);
    var g = svg.append("g");
    g.append("image").attr("xlink:href", "images/" + valueLongtoShort[d.value] + ".svg").attr("x", 0).attr("y", y - valueImageSize / 2).attr("width", valueImageSize).attr("height", valueImageSize);
    g.append("line").attr("x1", valueImageSize + horizontalPadding).attr("x2", lengthXScale(d.count) + imageSize).attr("y1", y).attr("y2", y).attr("stroke", greyColor).attr("stroke-width", lineWidth).attr("stroke-linecap", "round").style("stroke-dasharray", dashArray[getMinMaxOfCountMap(d.attitude).max]);
    g.append("image").attr("class", "valuesImage").attr("xlink:href", "images/" + occupationLongtoShort[underOverRepOccupation.max] + ".svg").attr("x", valueImageSize + horizontalPadding * 2).attr("y", y - imageSize).attr("width", imageSize).attr("height", imageSize).attr("transform", "rotate(180 " + (valueImageSize + horizontalPadding * 2 + imageSize / 2) + " " + (y - imageSize / 2) + ")");
    g.append("image").attr("class", "valuesImage").attr("xlink:href", "images/" + occupationLongtoShort[underOverRepOccupation.min] + ".svg").attr("x", valueImageSize + horizontalPadding * 2).attr("y", y).attr("width", imageSize).attr("height", imageSize);
    g.append("image").attr("xlink:href", "images/" + underOverRepActivities.max + ".svg").attr("x", valueImageSize + horizontalPadding * 3 + imageSize).attr("y", y - imageSize).attr("width", imageSize).attr("height", imageSize).attr("filter", function () {
      return "url(#Grey)";
    });
    g.append("image").attr("xlink:href", "images/" + underOverRepActivities.min + ".svg").attr("x", valueImageSize + horizontalPadding * 3 + imageSize).attr("y", y).attr("width", imageSize).attr("height", imageSize).attr("filter", function () {
      return "url(#Grey)";
    });
    var ikigaiRadius = 5;
    var averageIkigai = getAverageFromList(Object.keys(d.ikigai).map(function (key) {
      return d.ikigai[key];
    }));
    var underOverRepIkigai = getMinMaxOfCountMap(d.ikigai);
    var minIkigaiCount = d.ikigai[underOverRepIkigai.min];
    var maxIkigaiCount = d.ikigai[underOverRepIkigai.max];
    var domainRange = Math.max(maxIkigaiCount - averageIkigai, averageIkigai - minIkigaiCount);
    var ikigaiYScale = d3.scaleLinear().domain([averageIkigai - domainRange, averageIkigai + domainRange]).range([y + graphHeight / 2 - ikigaiRadius, y - graphHeight / 2 + ikigaiRadius]);
    ikigaiGroups.forEach(function (i) {
      if (d.ikigai[i] == undefined) {
        // Handle no data.
        d.ikigai[i] = averageIkigai;
        g.append("circle").attr("cx", ikigaiXScale(i)).attr("cy", ikigaiYScale(d.ikigai[i])).attr("r", ikigaiRadius - lineWidth / 2).attr("fill", "none").attr("stroke", ikigaiColorHexArray[i]).attr("stroke-width", lineWidth);
      } else {
        g.append("circle").attr("cx", ikigaiXScale(i)).attr("cy", ikigaiYScale(d.ikigai[i])).attr("r", ikigaiRadius).attr("fill", ikigaiColorHexArray[i]);
      }
    }); // console.log(d.value + ": " + getMinMaxOfCountMap(d.personality).max)

    var overrepPersonality = getMinMaxOfCountMap(d.personality).max;
    var personalityImageSize = overrepPersonality == "I" || overrepPersonality == "E" ? imageSize / 3 : imageSize;
    g.append("image").attr("xlink:href", "images/" + personalityShorttoLong[overrepPersonality] + ".svg").attr("x", lengthXScale(d.count) + imageSize - personalityImageSize).attr("y", y - personalityImageSize - 12).attr("width", personalityImageSize).attr("height", personalityImageSize);
    var hoverTargets = [{
      x: 0,
      y: y - valueImageSize / 2,
      height: valueImageSize,
      width: valueImageSize,
      text: "</br></br><b>OVER-REPRESENTED ATTITUDE: </b>" + attitudeLongtoShort[getMinMaxOfCountMap(d.attitude).max].toLowerCase()
    }, {
      x: valueImageSize + horizontalPadding * 2,
      y: y - imageSize,
      height: imageSize * 2,
      width: imageSize,
      text: "</br></br><b>OVER-REPRESENTED OCCUPATION: </b>" + underOverRepOccupation.max.toLowerCase() + "</br></br><b>UNDER-REPRESENTED OCCUPATION: </b>" + underOverRepOccupation.min.toLowerCase()
    }, {
      x: valueImageSize + horizontalPadding * 3 + imageSize,
      y: y - imageSize,
      height: imageSize * 2,
      width: imageSize,
      text: "</br></br><b>OVER-REPRESENTED ACTIVITY: </b>" + activityShortToLong[underOverRepActivities.max].toLowerCase() + "</br></br><b>UNDER-REPRESENTED ACTIVITY: </b>" + activityShortToLong[underOverRepActivities.min].toLowerCase()
    }, {
      x: ikigaiXScale(ikigaiGroups[0]) - ikigaiRadius * 2,
      y: y - imageSize,
      height: imageSize * 2,
      width: ikigaiXScale(ikigaiGroups[ikigaiGroups.length - 1]) - ikigaiXScale(ikigaiGroups[0]) + ikigaiRadius * 4,
      text: "</br></br><b>OVER-REPRESENTED IKIGAI: </b>" + ikigaiKeyToLabel[underOverRepIkigai.max].toLowerCase() + "</br></br><b>UNDER-REPRESENTED IKIGAI: </b>" + ikigaiKeyToLabel[underOverRepIkigai.min].toLowerCase()
    }, {
      x: lengthXScale(d.count) + imageSize - personalityImageSize,
      y: y - personalityImageSize - 12,
      height: personalityImageSize,
      width: personalityImageSize,
      text: "</br></br><b>OVER-REPRESENTED PERSONALITY: </b>" + personalityShorttoLong[overrepPersonality].toLowerCase()
    }];
    hoverTargets.forEach(function (targetRect) {
      g.append("rect").attr("x", targetRect.x).attr("y", targetRect.y).attr("height", targetRect.height).attr("width", targetRect.width).attr("opacity", 0).on("mousemove", function () {
        var tooltipText = "<b>VALUE:</b> " + d.value.toLowerCase() + "</br></br><b># OF PARTICIPANTS: </b>" + d.count + targetRect.text;

        if (myData != null && d.value == myData.value) {
          tooltipText += "</br></br><b>YOU ARE IN THIS VALUE GROUP</b>";
        } else if (myData != null && myData.included == false) {
          tooltipText += "</br></br><b>YOUR MOST IMPORTANT VALUE IS NOT THE GROUP’S TOP 4 VALUES</b>";
        }

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
    x: 0,
    y: height - padding * 2.5,
    width: 100,
    circleRadius: 4,
    verticalPadding: 18,
    horizontalPadding: 16
  };
  var colorLegend = svg.append('g').attr('width', colorLegendAttr.width).attr('transform', 'translate(' + colorLegendAttr.x + ',' + colorLegendAttr.y + ')');
  drawIkigaiColorLegend(colorLegend, colorLegendAttr);
  var overrepLegendAttr = {
    x: colorLegendAttr.x + colorLegendAttr.width + 32,
    y: height - padding * 3,
    height: padding * 3,
    width: width * 0.3,
    imageSize: 44
  };
  var overrepLegend = svg.append("g").attr("class", "attitudeLegend").attr("width", overrepLegendAttr.width).attr("transform", "translate(" + overrepLegendAttr.x + "," + overrepLegendAttr.y + ")");
  drawOverrepLegend(overrepLegend, overrepLegendAttr);
  var overrepTextLegendAttr = {
    x: overrepLegendAttr.x + overrepLegendAttr.width + 32,
    y: height - padding * 2.8,
    height: padding * 3,
    width: width * 0.2,
    imageSize: 44
  };
  var overrepTextLegend = svg.append("g").attr("class", "attitudeLegend").attr("width", overrepTextLegendAttr.width).attr("transform", "translate(" + overrepTextLegendAttr.x + "," + overrepTextLegendAttr.y + ")");
  var overrepTextLegendText = [{
    extraPadding: 0,
    lines: ["distance from line", "represents how far", "ikigai group is from the average"]
  }, {
    extraPadding: 16 * 3,
    lines: ["line represents", "value group's average"]
  }, {
    extraPadding: 16 * 5,
    lines: ["length of line represents", "# of participants with", "that value"]
  }];
  overrepTextLegendText.forEach(function (paragraph, ip) {
    paragraph.lines.forEach(function (line, il) {
      drawText(overrepTextLegend, line, {
        x: 0,
        y: 16 * il + paragraph.extraPadding + 12 * ip,
        textAnchor: "start"
      });
    });
  });
  var attitudeLegendAttr = {
    x: overrepTextLegendAttr.x + overrepTextLegendAttr.width + 72,
    y: height - padding * 2.5,
    width: width - (overrepTextLegendAttr.x + overrepTextLegendAttr.width + 100)
  };
  var attitudeLegend = svg.append("g").attr("class", "attitudeLegend").attr("width", attitudeLegendAttr.width).attr("transform", "translate(" + attitudeLegendAttr.x + "," + attitudeLegendAttr.y + ")");
  drawAttitudeLegend(attitudeLegend, "Most over-represented attitude", attitudeList);
}

function drawOverrepLegend(overrepLegend, overrepLegendAttr) {
  drawText(overrepLegend, "over-represented groups", {
    x: overrepLegendAttr.width / 2,
    y: 0,
    alignmentBaseline: "hanging"
  });
  drawText(overrepLegend, "under-represented groups", {
    x: overrepLegendAttr.width / 2,
    y: overrepLegendAttr.height - 8,
    alignmentBaseline: "bottom"
  });
  overrepLegend.append("line").attr("x1", 0).attr("x2", overrepLegendAttr.width).attr("y1", overrepLegendAttr.height / 2).attr("y2", overrepLegendAttr.height / 2).attr("stroke", greyColor).attr("stroke-width", 2).attr("stroke-linecap", "round");
  overrepLegend.append("image").attr("xlink:href", "images/i10.svg").attr("x", 0).attr("y", overrepLegendAttr.height / 2 - overrepLegendAttr.imageSize).attr("width", overrepLegendAttr.imageSize).attr("height", overrepLegendAttr.imageSize).attr("filter", function () {
    return "url(#Grey)";
  });
  overrepLegend.append("image").attr("xlink:href", "images/i6.svg").attr("x", 0).attr("y", overrepLegendAttr.height / 2).attr("width", overrepLegendAttr.imageSize).attr("height", overrepLegendAttr.imageSize).attr("filter", function () {
    return "url(#Grey)";
  });
  drawText(overrepLegend, "activity /", {
    x: overrepLegendAttr.imageSize,
    y: overrepLegendAttr.height / 2 + 16,
    textAnchor: "start"
  });
  drawText(overrepLegend, "occupation /", {
    x: overrepLegendAttr.imageSize,
    y: overrepLegendAttr.height / 2 + 16 * 2,
    textAnchor: "start"
  });
  drawText(overrepLegend, "personality", {
    x: overrepLegendAttr.imageSize,
    y: overrepLegendAttr.height / 2 + 16 * 3,
    textAnchor: "start"
  });
  overrepLegend.append("circle").attr("fill", textColor).attr("r", 4).attr("cx", overrepLegendAttr.width - 100).attr("cy", overrepLegendAttr.height * 0.25);
  drawText(overrepLegend, "ikigai group", {
    x: overrepLegendAttr.width,
    y: overrepLegendAttr.height * 0.25,
    textAnchor: "end"
  });
  overrepLegend.append("circle").attr("fill", textColor).attr("r", 4).attr("cx", overrepLegendAttr.width - 100).attr("cy", overrepLegendAttr.height * 0.75);
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/values.js"], null)
//# sourceMappingURL=/values.167c462b.js.map