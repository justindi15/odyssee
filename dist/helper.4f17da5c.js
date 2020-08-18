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
})({"javascript/helper.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Helper functions for data manipulation.

/** 
 *   data: list of data entries
 *   email: email of user
 *   returns list of all data entries for a person
 */
function getPersonData(data, email) {
  return data.filter(function (d) {
    return d.Email == email;
  });
}
/** 
 *   personData: list of data entries
 *   activity: activity to filter by
 *   returns list of personData entries by activity
 */


function getPersonDataByActivity(personData, activity) {
  return personData.filter(function (d) {
    return d.Activity.substring(0, 2) == activity;
  });
}

function getPersonDataByActivityType(personData, type) {
  return personData.filter(function (d) {
    return d.Activity.substring(0, 1) == type;
  });
}

function getPersonDataByActivities(personData, list) {
  return personData.filter(function (d) {
    return list.includes(d.Activity.substring(0, 2));
  });
}

function getPersonDataByActivitiesAndMood(personData, actList, moodList) {
  return personData.filter(function (d) {
    return actList.includes(d.Activity.substring(0, 2));
  }).filter(function (d) {
    return moodList.includes(d.Feeling);
  });
}

function getDataByPTypePData(everyoneData, typesData, pData, pType, column, cValue) {
  // list of ppl with personality type
  var filteredList = typesData.filter(function (d) {
    return d.Personality == pType;
  }).map(function (d) {
    return d["What's your email?"];
  });
  var filteredEmailList = pData.filter(function (d) {
    return d[column] == cValue;
  }).map(function (d) {
    return d["What's your email?"];
  }).filter(function (d) {
    return filteredList.includes(d);
  });
  var everyoneList = pData.filter(function (d) {
    return d[column] == cValue;
  }).map(function (d) {
    return d["What's your email?"];
  });
  var data1 = everyoneData.filter(function (d) {
    return filteredEmailList.includes(d.Email);
  });
  var data2 = everyoneData.filter(function (d) {
    return everyoneList.includes(d.Email);
  });
  return [{
    "percent": filteredEmailList.length / filteredList.length,
    "fMood": getFrequencyByKey("Feeling", data1).keys().next().value,
    "fAttitude": getFrequencyByKey("Reason", data1).keys().next().value
  }, {
    "percent": everyoneList.length / typesData.length,
    "fMood": getFrequencyByKey("Feeling", data2).keys().next().value,
    "fAttitude": getFrequencyByKey("Reason", data2).keys().next().value
  }];
}

function getDataByPTypeValue(everyoneData, typesData, pType, value) {
  var filteredList = typesData.filter(function (d) {
    return d.Personality == pType;
  });
  var filteredListWithValue = filteredList.filter(function (d) {
    return d.Values == value;
  }).map(function (d) {
    return d["What's your email?"];
  });
  var everyoneListWithValue = typesData.filter(function (d) {
    return d.Values == value;
  }).map(function (d) {
    return d["What's your email?"];
  });
  var data1 = everyoneData.filter(function (d) {
    return filteredListWithValue.includes(d.Email);
  });
  var data2 = everyoneData.filter(function (d) {
    return everyoneListWithValue.includes(d.Email);
  });
  return [{
    "percent": filteredListWithValue.length / filteredList.length,
    "fMood": getFrequencyByKey("Feeling", data1).keys().next().value,
    "fAttitude": getFrequencyByKey("Reason", data1).keys().next().value
  }, {
    "percent": everyoneListWithValue.length / typesData.length,
    "fMood": getFrequencyByKey("Feeling", data2).keys().next().value,
    "fAttitude": getFrequencyByKey("Reason", data2).keys().next().value
  }];
}

function getActivityListByPType(everyoneData, typesData, pType) {
  var emailList = typesData.filter(function (d) {
    return d.Personality == pType;
  }).map(function (d) {
    return d["What's your email?"];
  });
  return everyoneData.filter(function (d) {
    return emailList.includes(d.Email);
  });
}

function getDataByPType(everyoneData, typesData, pType, activity, f) {
  var moodList = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var emailList = typesData.filter(function (d) {
    return d.Personality == pType;
  }).map(function (d) {
    return d["What's your email?"];
  });
  var filteredData = everyoneData.filter(function (d) {
    return emailList.includes(d.Email);
  });
  var filteredActivityData;

  if (moodList.length != 0) {
    filteredActivityData = f(filteredData, activity, moodList);
  } else {
    filteredActivityData = f(filteredData, activity);
  }

  var groupActivityData;

  if (moodList.length != 0) {
    groupActivityData = f(everyoneData, activity, moodList);
  } else {
    groupActivityData = f(everyoneData, activity);
  }

  if (moodList.length != 0) {
    return [{
      "percent": filteredActivityData.length / getPersonDataByActivities(filteredData, activity).length,
      "fMood": getFrequencyByKey("Feeling", groupActivityData).keys().next().value,
      "fAttitude": getFrequencyByKey("Reason", groupActivityData).keys().next().value
    }, {
      "percent": groupActivityData.length / getPersonDataByActivities(everyoneData, activity).length,
      "fMood": getFrequencyByKey("Feeling", groupActivityData).keys().next().value,
      "fAttitude": getFrequencyByKey("Reason", groupActivityData).keys().next().value
    }];
  }

  return [{
    "percent": filteredActivityData.length / filteredData.length,
    "fMood": getFrequencyByKey("Feeling", groupActivityData).keys().next().value,
    "fAttitude": getFrequencyByKey("Reason", groupActivityData).keys().next().value
  }, {
    "percent": groupActivityData.length / everyoneData.length,
    "fMood": getFrequencyByKey("Feeling", groupActivityData).keys().next().value,
    "fAttitude": getFrequencyByKey("Reason", groupActivityData).keys().next().value
  }];
}
/** 
 *   str: column name in excel, ie Activity, Reason, Feeling
 *   data: list of data entries 
 *   index: used for split (ie. "b5" or "Intellectual")
 *   returns sorted map of keys to frequency, ie ("b5: 24")
 */


function getFrequencyByKey(str, data) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var map = new Map();

  for (var i = 0; i < data.length; i++) {
    var key = data[i][str].split(":")[index];

    if (!map.has(key)) {
      map.set(key, 1);
    } else {
      map.set(key, map.get(key) + 1);
    }
  }

  var sortedMap = new Map(_toConsumableArray(map.entries()).sort(function (a, b) {
    return b[1] - a[1];
  }));
  return sortedMap;
}
/** 
 *   data: list of data entries
 *   returns sorted map divided first by str1 then by str2
 */


function getFrequencyByKeys(str1, str2, data) {
  var map = {};

  for (var i = 0; i < data.length; i++) {
    var key = data[i][str1].split(":")[0];
    var key2 = data[i][str2];

    if (!(key in map)) {
      map[key] = {};
      map[key][key2] = 1;
    } else {
      map[key][key2] = !(key2 in map[key]) ? 1 : map[key][key2] + 1;
    }
  } // var sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));


  return map;
}
/** 
 *   data: list of data entries
 *   returns sorted map divided first by str1 then by str2, then by str3
 */


function getFrequencyByThreeKeys(str1, str2, str3, keyList, data) {
  var map = {};

  for (var i = 0; i < data.length; i++) {
    var key = data[i][str1].split(":")[0];

    if (keyList.indexOf(key) != -1) {
      var key2 = data[i][str2];
      var key3 = data[i][str3];

      if (!(key in map)) {
        map[key] = {};
        map[key][key2] = {};
        map[key][key2][key3] = 1;
      } else if (!(key2 in map[key])) {
        map[key][key2] = {};
        map[key][key2][key3] = 1;
      } else if (!(key3 in map[key][key2])) {
        map[key][key2][key3] = 1;
      } else {
        map[key][key2][key3] = map[key][key2][key3] + 1;
      }
    }
  }

  return map;
}

function createMapFromPersonality(data, key) {
  var convertLongToShortMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var finalMap = {};

  for (var i = 0; i < data.length; i++) {
    var email = data[i]["What's your email?"];
    var value = data[i][key];

    if (convertLongToShortMap != null) {
      finalMap[email] = convertLongToShortMap[value];
    } else {
      finalMap[email] = value;
    }
  }

  return finalMap;
}

function getFrequencyFromPersonalityMap(personData, personalityMap, key) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var map = {};

  for (var i = 0; i < personData.length; i++) {
    var email = personData[i]["Email"];

    if (email in personalityMap) {
      var key1 = personalityMap[email];
      var key2 = personData[i][key].split(":")[index];

      if (!(key1 in map)) {
        map[key1] = {};
        map[key1][key2] = 1;
      } else {
        map[key1][key2] = !(key2 in map[key1]) ? 1 : map[key1][key2] + 1;
      }
    }
  }

  return map;
}
/**
 *   keyList: list of keys, usually top 5/6 keys
 *   map: map of (all) keys to list of frequencies, ie "b5: {"Good": 3, "Ok": 5}"
 *   returns map of keys in keyList to mode of second breakdown, ie "b5: Ok"
 */


function findMode(keyList, map) {
  var finalMap = {};
  keyList.forEach(function (id) {
    var keys = Object.keys(map[id]);
    var maxKey = "";
    var maxValue = 0;
    keys.forEach(function (reason) {
      if (map[id][reason] > maxValue) {
        maxKey = reason;
        maxValue = map[id][reason];
      }
    });
    finalMap[id] = maxKey;
  });
  return finalMap;
}

function getAverageFromList(lst) {
  return lst.reduce(function (a, b) {
    return a + b;
  }, 0) / lst.length;
}
/**
 *   keyList: list of keys, usually top 5/6 keys
 *   map: map of (all) keys to list of frequencies, ie "b5: {"Good": 3, "Ok": 5}"
 *   returns map of keys in keyList to average moodLegend, starts at 0
 */


function findAvgMood(keyList, map) {
  var isRounded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var finalMap = {};
  keyList.forEach(function (id) {
    var keys = Object.keys(map[id]);
    var value = 0;
    var count = 0;
    keys.forEach(function (mood) {
      value = value + map[id][mood] * moodList.indexOf(mood);
      count = count + map[id][mood];
    });
    finalMap[id] = isRounded ? Math.round(value / count) : value / count;
  });
  return finalMap;
}

function getAverage(list) {
  return list.reduce(function (a, b) {
    return a + b;
  }, 0) / list.length;
}

function findAvgMoodByKey(personData, key, value) {
  var isRounded = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return function (value) {
    var filteredData = personData.filter(function (d) {
      return d[key] == value;
    });
    var value = 0;

    var _iterator = _createForOfIteratorHelper(filteredData),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var d = _step.value;
        value += moodList.indexOf(d.Feeling);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return Math.round(value / filteredData.length);
  }(value);
}
/**
 *   keyList: list of keys, usually top 5/6 keys
 *   map: map of (all) keys to list of frequencies, ie "b5: {"Good": 3, "Ok": 5}"
 *   avgMap: map of keys to averages, ie "b5: 2.722"
 *   returns map of keys in keyList to average moodLegend, starts at 0
 */


function findStdDevMood(keyList, map, avgMap) {
  var finalMap = {};
  keyList.forEach(function (id) {
    var keys = Object.keys(map[id]);
    var value = 0;
    var count = 0;
    keys.forEach(function (mood) {
      value = value + map[id][mood] * Math.pow(moodList.indexOf(mood) - avgMap[id], 2);
      count = count + map[id][mood];
    });
    finalMap[id] = Math.sqrt(value / count);
  });
  return finalMap;
}

function calculateStdDev(list, avg) {
  var total = 0;

  var _iterator2 = _createForOfIteratorHelper(list),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var n = _step2.value;
      total += Math.pow(n - avg, 2);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return Math.sqrt(total / list.length);
}

function findStdDevWithAvg(personData, key, value, avg) {
  var filteredData = personData.filter(function (d) {
    return d[key] == value;
  });
  var value = 0;

  var _iterator3 = _createForOfIteratorHelper(filteredData),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;
      value += item.Feeling * Math.pow(moodList.indexOf(item.Feeling) - avg, 2);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return Math.sqrt(value / filteredData.length);
}

function getTotalFrequencyFromMap(data) {
  var keys = Object.keys(data);
  var count = 0;
  keys.forEach(function (key) {
    count += data[key];
  });
  return count;
}

function getKeyWithHighestValue(map) {
  var max = 0;
  var maxKey = "";
  var keyList = Object.keys(map);
  keyList.forEach(function (d) {
    if (map[d] > max) {
      max = map[d];
      maxKey = d;
    }
  });
  return maxKey;
} // Return users whose answer for [personalityDataKey] matches [category], in the form of their emails.
// Example usage: return users whose daily stressor is work.


function getEmailListForCategory(personalityData, category, personalityDataKey) {
  return personalityData.filter(function (p) {
    return p[personalityDataKey].includes(categoryShortToLongMap[category]);
  }).map(function (p) {
    return p[keys.personality.email];
  });
} // Initialize count map for long-term versus short-term personalityData records.
// Example map structure: {long: {}, short: {}}


function initializeCountMaps(countMaps) {
  countMaps.forEach(function (map) {
    map["long"] = {};
    map["short"] = {};
  });
} // Increments count of map[type][key].
// Example map structure: {long: {act1: 9, act2: 17}, short: {act1: 12, act2: 14}}


function incrementCategorySubMapCount(map, type, key) {
  var count = map[type][key];
  map[type][key] = count == null ? 1 : count + 1;
} // Update counts of activities/attitudes/moods from [records] for [type].
// Example usage: updateCountMapFromRecords(longTermRecords, "long", activityCountMap, reasonCountMap, moodCountMap)
// Example structure for moodCountMap: {long: {mood1: 9, mood2: 17}, short: {mood1: 12, mood2: 14}}


function updateCountMapFromRecords(records, type, activityCountMap, reasonCountMap, moodCountMap) {
  records.forEach(function (record) {
    // Only update category maps if record has Bad or Awful for Feeling.
    if (negativeMoods.includes(record["Feeling"])) {
      var activity = record["Activity"].substring(0, 2);
      var reason = record["Reason"];
      var mood = record["Feeling"];
      incrementCategorySubMapCount(activityCountMap, type, activity);
      incrementCategorySubMapCount(reasonCountMap, type, reason);
      incrementCategorySubMapCount(moodCountMap, type, mood);
    }
  });
} // Given a map, create a new map using the values as keys


function groupMapByValue(data) {
  var finalMap = {};
  var keys = Object.keys(data);

  for (var i = 0; i < keys.length; i++) {
    if (!(data[keys[i]] in finalMap)) {
      finalMap[data[keys[i]]] = [keys[i]];
    } else {
      finalMap[data[keys[i]]].push(keys[i]);
    }
  }

  return finalMap;
}

function calculatePercentageByKey(data, key) {
  var total = 0;

  for (var _i = 0, _Array$from = Array.from(data.keys()); _i < _Array$from.length; _i++) {
    var k = _Array$from[_i];
    total += data.get(k);
  }

  return data.get(key) / total;
}

function getCountMapNegativePercentageFromRecords(records, type, activityCountMap, reasonCountMap, moodCountMap) {
  updateCountMapFromRecords(records, type, activityCountMap, reasonCountMap, moodCountMap); // Divide count of Bad/Awful feelings by total records for each activity.

  Object.keys(activityCountMap[type]).forEach(function (a) {
    var totalRecordCountForActivity = records.filter(function (record) {
      return record["Activity"].substring(0, 2) == a;
    }).length;
    activityCountMap[type][a] = activityCountMap[type][a] / totalRecordCountForActivity;
  });
}

function getTopThreeActivities(activityMap, exclusionList) {
  var keysIter = activityMap.keys();
  var finalList = [];

  while (finalList.length < 3) {
    var key = keysIter.next().value;

    if (!exclusionList.includes(key + ":")) {
      finalList.push(key + ":");
    }
  }

  return finalList;
}

function getPercentageOfActivities(activityList, aggregateList, exclusionList) {
  var count = 0;

  var _iterator4 = _createForOfIteratorHelper(activityList),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var activity = _step4.value;
      count += getPersonDataByActivity(aggregateList, activity.substring(0, 2)).length;
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  var dCount = 0;

  var _iterator5 = _createForOfIteratorHelper(exclusionList),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var act = _step5.value;
      dCount += getPersonDataByActivity(aggregateList, act.substring(0, 2)).length;
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  return count / (aggregateList.length - dCount);
}

function getPercentageOfActivitiesWithExclusion(activityList, aggregateList, exclusionList) {
  var count = 0;
  var dCount = 0;
  var tempList = activityList.filter(function (d) {
    return !exclusionList.includes(d + ":");
  });

  var _iterator6 = _createForOfIteratorHelper(tempList),
      _step6;

  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var activity = _step6.value;
      // console.log(activity)
      count += getPersonDataByActivity(aggregateList, activity).length;
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }

  return count / aggregateList.length;
}

function getDistinctActivitiesAvg(dataList, everyoneData, exclusionList) {
  var count = 0;

  var _iterator7 = _createForOfIteratorHelper(dataList),
      _step7;

  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var email = _step7.value;
      var personData = getPersonData(everyoneData, email);
      var tempList = personData.filter(function (d) {
        return !exclusionList.includes(d.Activity.substring(0, 3));
      });
      count += getFrequencyByKey("Activity", tempList).size;
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }

  return count / dataList.length;
}

function getDistinctActivitiesWithExclusion(data, exclusionList) {
  var finalSet = new Set();

  for (var _i2 = 0, _Array$from2 = Array.from(data.keys()); _i2 < _Array$from2.length; _i2++) {
    var item = _Array$from2[_i2];

    if (!exclusionList.includes(item + ":")) {
      finalSet.add(item);
    }
  }

  return finalSet;
} // Compare functions.
// Compare moods by amazing to awful.


function compareMoods(a, b) {
  var moodList = ["Awful", "Bad", "Ok", "Good", "Amazing"];

  if (moodList.indexOf(a) == -1 || moodList.indexOf(b) == -1) {
    console.error("compareMoods invalid inputs - " + a + ", " + b);
    return 0;
  }

  return moodList.indexOf(b) - moodList.indexOf(a);
} // Compare personData activites by most to least entries.


function compareKeyList(a, b, personData) {
  return getPersonDataByActivity(personData, b).length - getPersonDataByActivity(personData, a).length;
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","javascript/helper.js"], null)
//# sourceMappingURL=/helper.4f17da5c.js.map