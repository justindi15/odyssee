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
})({"javascript/general.js":[function(require,module,exports) {
// General drawing functions.
function drawTitle(svg, title) {
  var width = svg.attr("width");
  var titleAttr = {
    x: width / 2,
    y: 35,
    fontSize: 25,
    fontFamily: "Courier new",
    textAnchor: "middle"
  };
  svg.append('text').attr('x', titleAttr.x).attr('y', titleAttr.y).text(title).style("font-family", titleAttr.fontFamily).style("font-size", titleAttr.fontSize).style("fill", textColor).style("text-anchor", titleAttr.textAnchor);
}

function drawText(svg, text, attr) {
  var x = attr.x == null ? 0 : attr.x;
  var y = attr.y == null ? 0 : attr.y;
  var textAnchor = attr.textAnchor == null ? 'middle' : attr.textAnchor;
  var alignmentBaseline = attr.alignmentBaseline == null ? 'middle' : attr.alignmentBaseline;
  var fontSize = attr.fontSize == null ? 12 : attr.fontSize;
  var transform = attr.transform == null ? '' : attr.transform;
  var fill = attr.fill == null ? textColor : attr.fill;
  var fontWeight = attr.fontWeight == null ? 400 : attr.fontWeight;
  return svg.append('text').attr('x', x).attr('y', y).attr('text-anchor', textAnchor).attr('font-family', 'Courier new').attr('fill', fill).attr('font-size', fontSize).attr('font-weight', fontWeight).attr('alignment-baseline', alignmentBaseline).attr('transform', transform).text(text);
}

function drawTab(svg, x, y, orientation) {
  var tabHeight = 16;
  svg.append('line').attr('x1', orientation == 'horizontal' ? x - tabHeight / 2 : x).attr('x2', orientation == 'horizontal' ? x + tabHeight / 2 : x).attr('y1', orientation == 'vertical' ? y - tabHeight / 2 : y).attr('y2', orientation == 'vertical' ? y + tabHeight / 2 : y).attr('stroke', greyColor).attr('stroke-width', 2).style("stroke-linecap", "round");
}

function drawStdDevAvgLegend(svg) {
  // Add avg line + std legend.
  var height = svg.attr("height");
  var width = svg.attr("width");
  svg.append("line").attr("x1", width * 0.85).attr("x2", width * 0.85).attr("y1", height - padding * 2.25).attr("y2", height - padding * 0.6).attr("stroke", "#cdcdcd").attr("stroke-width", 2.5).style("stroke-linecap", "round");
  svg.append("circle").attr("cx", width * 0.85).attr("cy", height - padding * 1.4).attr("r", 5).style("fill", textColor);
  svg.append("text").attr("x", width * 0.83).attr("y", height - padding * 1.4).text("group average").style("font-family", "Courier new").style("text-anchor", "end").style("fill", textColor).style("font-size", 12);
  svg.append("circle").attr("cx", width * 0.85).attr("cy", height - padding * 1).attr("r", 4).style("fill", textColor);
  svg.append("text").attr("x", width * 0.83).attr("y", height - padding * 1).text("a user").style("font-family", "Courier new").style("text-anchor", "end").style("fill", textColor).style("font-size", 12);
  svg.append("text").attr("x", width * 0.87).attr("y", height - padding * 2.15 - 15).text("standard").style("font-family", "Courier new").style("text-anchor", "start").style("fill", textColor).style("font-size", 12);
  svg.append("text").attr("x", width * 0.87).attr("y", height - padding * 2.15).text("deviation").style("font-family", "Courier new").style("text-anchor", "start").style("fill", textColor).style("font-size", 12);
}

function drawMoodLegendData(moodLegend, moodList) {
  var width = moodLegend.attr("width");

  if (width == null) {
    console.error("drawMoodLegendData: must specify width for moodLegend.");
  }

  var xScale = d3.scaleLinear().domain([0, moodList.length - 1]).range([0, width]);
  moodLegend.selectAll(".moodDots").data(moodList).enter().append('circle').attr("cx", function (d, i) {
    return xScale(i);
  }).attr("cy", padding * 1).attr("r", 5).style("fill", function (d) {
    return colorHexArray[d];
  });
  moodLegend.selectAll(".moodText").data(moodList).enter().append('text').attr("x", function (d, i) {
    return xScale(i);
  }).attr("y", padding * 1.65).text(function (d) {
    return d;
  }).style("text-anchor", "middle").style("font-family", "Courier new").style("fill", textColor).style("font-size", 12);
}

function drawMoodLegend(moodLegend, title, moodList) {
  var width = moodLegend.attr("width");

  if (width == null) {
    console.error("drawMoodLegend: must specify width for moodLegend.");
  }

  moodLegend.append("text").attr("x", width / 2).attr("y", 15).text(title).style("text-anchor", "middle").style("font-family", "Courier new").style("fill", textColor).style("font-size", 12);
  drawMoodLegendData(moodLegend, moodList);
}

function drawMoodHalfLegend(svgClass) {
  var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Average mood";
  var svg = d3.select(svgClass);
  var height = svg.attr('height');
  var moodLegendAttr = {
    x: padding * 2,
    y: height - padding * 2.5,
    width: padding * 1.75 * (moodList.length - 1)
  };
  var moodLegend = svg.append("g").attr("class", "moodLegend").attr("width", moodLegendAttr.width).attr("transform", "translate(" + moodLegendAttr.x + "," + moodLegendAttr.y + ")");
  drawMoodLegend(moodLegend, title, moodList);
}

function drawAttitudeLegendData(attitudeLegend, attitudeList) {
  var width = attitudeLegend.attr("width");

  if (width == null) {
    console.error("drawAttitudeLegendData: must specify width for attitudeLegend.");
  }

  var xScale = d3.scaleLinear().domain([0, attitudeList.length - 1]).range([0, width]);
  attitudeLegend.selectAll(".attText").data(attitudeList).enter().append('text').attr("x", function (d, i) {
    return xScale(i);
  }).attr("y", padding * 1.65).text(function (d) {
    return d;
  }).style("text-anchor", "middle").style("font-family", "Courier new").style("fill", textColor).style("font-size", 12);
  attitudeLegend.selectAll(".attLine").data(attitudeList).enter().append('line').attr("x1", function (d, i) {
    return xScale(i);
  }).attr("x2", function (d, i) {
    return xScale(i);
  }).attr("y1", padding * 1.2).attr("y2", 35).attr("stroke", textColor).attr("stroke-width", 2.5).style("stroke-linecap", "round").style("stroke-dasharray", function (d, i) {
    return dashArray2[i];
  });
}

function drawAttitudeLegend(attitudeLegend, title, attitudeList) {
  var width = attitudeLegend.attr("width");

  if (width == null) {
    console.error("drawAttitudeLegend: must specify width for attitudeLegend.");
  }

  attitudeLegend.append("text").attr("x", width / 2).attr("y", 15).text(title).style("text-anchor", "middle").style("font-family", "Courier new").style("fill", textColor).style("font-size", 12);
  drawAttitudeLegendData(attitudeLegend, attitudeList);
}

function drawAttitudeHalfLegend(svgClass) {
  var attList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : attitudeList;
  var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Most frequent attitude";
  var svg = d3.select(svgClass);
  var height = svg.attr('height');
  var width = svg.attr('width');
  var attitudeLegendAttr = {
    x: width / 2 + padding * 2,
    y: height - padding * 2.5,
    width: width - (width / 2 + padding * 2) - padding * 2
  };
  var attitudeLegend = svg.append("g").attr("class", "attitudeLegend").attr("width", attitudeLegendAttr.width).attr("transform", "translate(" + attitudeLegendAttr.x + "," + attitudeLegendAttr.y + ")");
  drawAttitudeLegend(attitudeLegend, title, attList);
}

function drawActivityLegend(activityLegend) {
  var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var title = attr.title == null ? "Most frequent activity" : attr.title;
  var activityIcon = attr.activity == null ? "i10" : attr.activity;
  var iconSize = attr.iconSize == null ? 32 : attr.iconSize;
  var width = activityLegend.attr("width");

  if (width == null) {
    console.error("drawActivityLegend: must specify width for activityLegend.");
  }

  activityLegend.append("text").attr("x", width / 2).attr("y", 15).text(title).style("text-anchor", "middle").style("font-family", "Courier new").style("fill", textColor).style("font-size", 12);
  activityLegend.append("image").attr("xlink:href", "images/" + activityIcon + ".svg").attr("x", width / 2 - iconSize / 2).attr("y", padding - iconSize / 2).attr("width", iconSize).attr("height", iconSize);
}

function drawIkigaiColorLegend(colorLegend, colorLegendAttr) {
  drawText(colorLegend, 'Ikigai', {
    x: 0,
    y: 0,
    fontSize: 12,
    textAnchor: 'start'
  });
  ikigaiGroups.forEach(function (d, i) {
    var ikigaiGroupY = (i + 1) * colorLegendAttr.verticalPadding;
    colorLegend.append('circle').attr('cx', colorLegendAttr.circleRadius).attr('cy', ikigaiGroupY).attr('r', colorLegendAttr.circleRadius).attr('fill', ikigaiColorHexArray[d]);
    drawText(colorLegend, ikigaiKeyToLabel[d], {
      x: colorLegendAttr.horizontalPadding + colorLegendAttr.circleRadius * 2,
      y: ikigaiGroupY,
      fontSize: 12,
      textAnchor: 'start'
    });
  });
} // add color filters to website, must call this per svg 


function setUpFilters(svgClass) {
  var svg = d3.select(svgClass);
  svg.append('filter').attr('id', 'Amazing').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 1 0 0 0 0 0.772549 0 0 0 0 0 0 0 0 1 0");
  svg.append('filter').attr('id', 'Good').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.9490196 0 0 0 0 0.84705882 0 0 0 0 0.4705882 0 0 0 1 0");
  svg.append('filter').attr('id', 'Zen').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.9490196 0 0 0 0 0.84705882 0 0 0 0 0.4705882 0 0 0 1 0");
  svg.append('filter').attr('id', 'Ok').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.92941176 0 0 0 0 0.76470588 0 0 0 0 0.63921568 0 0 0 1 0");
  svg.append('filter').attr('id', 'Bohemian').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.92941176 0 0 0 0 0.76470588 0 0 0 0 0.63921568 0 0 0 1 0");
  svg.append('filter').attr('id', 'Bad').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.79215686 0 0 0 0 0.380392156 0 0 0 0 0.30196078 0 0 0 1 0");
  svg.append('filter').attr('id', 'Citizen').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.79215686 0 0 0 0 0.380392156 0 0 0 0 0.30196078 0 0 0 1 0");
  svg.append('filter').attr('id', 'Awful').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.6235294 0 0 0 0 0.1490196 0 0 0 0 0.3568627 0 0 0 1 0");
  svg.append('filter').attr('id', 'Profiteer').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.6235294 0 0 0 0 0.1490196 0 0 0 0 0.3568627 0 0 0 1 0");
  svg.append('filter').attr('id', 'Grey').append('feColorMatrix').attr('type', 'matrix').attr('color-interpolation-filters', 'sRGB').attr('values', "0 0 0 0 0.73 0 0 0 0 0.73 0 0 0 0 0.73 0 0 0 1 0");
} // Helper function for drawing imperfect circles and zigzag curves.


function getImperfectArcPoints(center, radius, start, end, step, maxOffset) {
  var points = [];

  for (var i = start; i <= end; i += step) {
    // Convert angle to radians.
    var theta = i * Math.PI / 180; // Calculate point on circle.

    var x = center.x + radius * Math.cos(theta); // x = rcos(a)

    var y = center.y + radius * Math.sin(theta); // y = rsin(a)
    // Add random radius offset in range [-maxOffset, maxOffset] to create zig zag.

    var rOffset = (2 * Math.random() - 1) * maxOffset;
    x += rOffset * Math.cos(theta);
    y += rOffset * Math.sin(theta); // Add point to points array.

    points.push([x, y]);
  }

  return points;
}

function drawImperfectCircle(svg, center, radius) {
  var attr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  // Unwrap optional attributes, set defaults.
  // Arc.
  var step = attr.step == null ? 8 : attr.step; // Control point increment.

  var maxOffset = attr.maxOffset == null ? Math.ceil(radius / 65) : attr.maxOffset; // Control radius max offset.
  // Stroke.

  var strokeWidth = attr.strokeWidth == null ? 2 : attr.strokeWidth; // Control thickness of line.

  var stroke = attr.stroke == null ? greyColor : attr.stroke; // Control color of line.
  // Setup arc generator.

  var circleArcGen = d3.line().curve(d3.curveCardinalClosed); // Generate imperfect circle arc points.

  var circlePoints = getImperfectArcPoints(center, radius, 0, 360 - step, step, maxOffset); // Draw path.

  var circleArc = circleArcGen(circlePoints);
  svg.append("path").attr("d", circleArc).attr("fill", "none").attr("stroke", stroke).attr("stroke-width", strokeWidth);
}

function drawZigzagArc(svg, center, radius) {
  var attr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  // Unwrap optional attributes, set defaults.
  // Zigzag.
  var step = attr.step == null ? 2 : attr.step; // Control width spacing of zigzag.

  var maxOffset = attr.maxOffset == null ? 8 : attr.maxOffset; // Control max height of zigzag.
  // Angle.

  var minAngle = attr.minAngle == null ? 0 : attr.minAngle; // Control arc angle start.

  var maxAngle = attr.maxAngle == null ? 360 : attr.maxAngle; // Control arc angle end.
  // Stroke.

  var strokeWidth = attr.strokeWidth == null ? 2 : attr.strokeWidth; // Control thickness of line.

  var stroke = attr.stroke == null ? greyColor : attr.stroke; // Control color of line.
  // Setup arc generator.

  var zigzagArcGen = d3.line().curve(d3.curveLinear); // Generate zigzag arc points.

  var zigzagArcPoints = getImperfectArcPoints(center, radius, minAngle, maxAngle, step, maxOffset); // Add zigzag arc path.

  var zigzagArc = zigzagArcGen(zigzagArcPoints);
  svg.append("path").attr("d", zigzagArc).attr("fill", "none").attr("stroke", stroke).attr("stroke-width", strokeWidth);
}

function addTooltip(tooltipId) {
  return d3.select("body").append("div").attr("id", tooltipId).style("padding", 10).style("position", "absolute").style("z-index", "10").style("visibility", "hidden").attr("white-space", "pre-line").style("background-color", backgroundColor).style("border-radius", "15px").style("border", "1px solid #cdcdcd").style("font-family", "Courier new").style("font-size", 12).style("text-align", "left").style("color", textColor);
}

function setTooltipText(tooltip, text, leftOffset, rightOffset) {
  tooltip.html(text).style("font-family", "Courier new").style("font-size", 12).style("text-align", "left").style("color", textColor).style("visibility", "visible").style("max-width", 250).style("top", event.pageY + 20).style("left", function () {
    if (d3.event.clientX < 750) {
      return event.pageX + leftOffset + "px";
    } else {
      return event.pageX - rightOffset + "px";
    }
  });
}

function drawImperfectHorizontalLine(svg, xStart, xEnd, y) {
  var points = []; // generate points

  for (var i = xStart; i <= xEnd; i += 50) {
    var direction = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
    var offset = Math.floor(Math.random() * 3);
    points.push({
      "x": i,
      "y": y + offset * direction
    });
  }

  points.push({
    "x": xEnd,
    "y": y
  });
  var lineGenerator = d3.line().x(function (d) {
    return d.x;
  }).y(function (d) {
    return d.y;
  }).curve(d3.curveMonotoneX);
  svg.append("path").datum(points).attr("d", lineGenerator).style("fill", "none").style("stroke", "#cdcdcd").attr("stroke-width", 2.5).style("stroke-linecap", "round");
}

function drawImperfectVerticalLine(svg, yStart, yEnd, x, dashArr) {
  var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "#cdcdcd";
  var points = []; // generate points

  for (var i = yStart; i <= yEnd; i += 50) {
    var direction = Math.floor(Math.random() * 2) == 0 ? -1 : 1;
    var offset = Math.floor(Math.random() * 3);
    points.push({
      "x": x + offset * direction,
      "y": i
    });
  }

  points.push({
    "x": x,
    "y": yEnd
  });
  console.log(points);
  var lineGenerator = d3.line().x(function (d) {
    return d.x;
  }).y(function (d) {
    return d.y;
  }).curve(d3.curveMonotoneX);
  svg.append("path").datum(points).attr("d", lineGenerator).style("fill", "none").style("stroke", color).attr("stroke-width", 2.5).style("stroke-linecap", function () {
    return dashArr == dashArray[3] ? null : "round";
  }).style("stroke-dasharray", dashArr);
}

function drawPlantLegend(svg, x, y) {
  var hasRoot = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  // pseduo plant data
  var dataset = [{
    "x": 1,
    "y": 0
  }, {
    "x": 2,
    "y": 0.301
  }, {
    "x": 3,
    "y": 0.477
  }, {
    "x": 4,
    "y": 0.602
  }, {
    "x": 5,
    "y": 0.699
  }, {
    "x": 6,
    "y": 0.778
  }, {
    "x": 7,
    "y": 0.845
  }, {
    "x": 8,
    "y": 0.903
  }, {
    "x": 9,
    "y": 0.954
  }, {
    "x": 10,
    "y": 1
  }];
  var yLeafScale = d3.scaleLinear().domain([0, 1]).range([y - 15, y - 30]);
  var xRightLeafScale = d3.scaleLinear().domain([1, 10]).range([x, x + padding * 0.5]);
  var xLeftLeafScale = d3.scaleLinear().domain([1, 10]).range([x, x - padding * 0.5]);
  var rightLeafGenerator = d3.line().y(function (d) {
    return yLeafScale(d.y);
  }).x(function (d) {
    return xRightLeafScale(d.x);
  }).curve(d3.curveMonotoneX);
  var leftLeafGenerator = d3.line().y(function (d) {
    return yLeafScale(d.y);
  }).x(function (d) {
    return xLeftLeafScale(d.x);
  }).curve(d3.curveMonotoneX);

  if (hasRoot) {
    svg.append("line").attr("x1", x).attr("x2", x).attr("y1", y - 15).attr("y2", y).attr("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  }

  svg.append("path").datum(dataset).attr("d", rightLeafGenerator).style("fill", "none").style("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
  svg.append("path").datum(dataset).attr("d", leftLeafGenerator).style("fill", "none").style("stroke", textColor).attr("stroke-width", 2).style("stroke-linecap", "round");
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/general.js"], null)
//# sourceMappingURL=/general.f9bff259.js.map