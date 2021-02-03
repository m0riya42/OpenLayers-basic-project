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
})({"indexExtern.js":[function(require,module,exports) {
// import { isoCountries, degrees_to_radians } from './utils'
function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
} //Convert country to code and to Flag:
// console.log(isoCountries['israel']);
// const flagSrc = "http://purecatamphetamine.github.io/country-flag-icons/3x2/#isoCountry#.svg"

/****************************************/

/*            Basic Map                 */

/****************************************/
// API key at https://www.maptiler.com/cloud/


var key = 'GA7N1mQcvcTE7mnV8sG1';
var attributions = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' + '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
var mapVectorSource = new ol.source.Vector({
  features: []
});
var mapVectorLayer = new ol.layer.Vector({
  source: mapVectorSource
});
var map = new ol.Map({
  target: document.getElementById('map'),
  view: new ol.View({
    // center: center,
    center: [35.217018, 31.771959],
    projection: 'EPSG:4326',
    zoom: 5,
    minZoom: 1,
    maxZoom: 20
  }),
  layers: [new ol.layer.Tile({
    // source: new OSM() //original map
    source: new ol.source.XYZ({
      attributions: attributions,
      url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=' + key,
      tileSize: 512
    })
  }), mapVectorLayer]
});
/****************************************/

/*         Israel Start Icon            */

/****************************************/

var startMarker = new ol.Feature({
  geometry: new ol.geom.Point([35.217018, 31.771959])
});
startMarker.setStyle(new ol.style.Style({
  image: new ol.style.Icon({
    // color: 'yellow',
    crossOrigin: 'anonymous',
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    // src: flagSrc.replace("#isoCountry#", isoCountries['israel']),
    // src: images.israelIcon,
    // src: getUnicodeFlagIcon('US'),
    // src: './images/israelIcon.png',
    src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
  }),
  text: new ol.style.Text({
    font: '15px Narkisim, bold',
    text: 'Israel',
    fill: new ol.style.Fill({
      color: '#f3f3f3'
    }),
    stroke: new ol.style.Stroke({
      color: '#002986',
      width: 3
    })
  })
}));
mapVectorSource.addFeature(startMarker);
/****************************************/

/*         Flash Animation              */

/****************************************/

var duration = 3000;

function flash(feature) {
  var start = new Date().getTime();
  var listenerKey = mapVectorLayer.on('postrender', animate);

  function animate(event) {
    var vectorContext = ol.render.getVectorContext(event);
    var frameState = event.frameState;
    var flashGeom = feature.getGeometry().clone();
    var elapsed = frameState.time - start;
    var elapsedRatio = elapsed / duration; // radius will be 5 at start and 30 at end.

    var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
    var opacity = ol.easing.easeOut(1 - elapsedRatio);
    var style = new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        stroke: new ol.style.Stroke({
          color: 'rgba(243, 243, 243, ' + opacity + ')',
          width: 0.25 + opacity
        })
      })
    });
    vectorContext.setStyle(style);
    vectorContext.drawGeometry(flashGeom);

    if (elapsed > duration) {
      ol.Observable.unByKey(listenerKey);
      return;
    } // tell OpenLayers to continue postrender animation


    map.render();
  }
}

mapVectorSource.on('addfeature', function (e) {
  flash(e.feature);
});
/****************************************/

/*         Request for Airplanes        */

/****************************************/

function createAirplaneIcon(el) {
  var airplane = new ol.Feature({
    geometry: new ol.geom.Point([el[5], el[6]]),
    _icao24: el[0],
    _callsign: el[1] // id: el[0]

  });
  airplane.setId(parseInt(el[0]));
  console.log(airplane);
  console.log(mapVectorSource.getFeaturesAtCoordinate([el[5], el[6]])); // airplane._icao24 = el[0];
  // airplane._callsign = el[1];

  setAirplaneAngle({
    newRotation: el[10],
    airplane: airplane
  }); // let lon = 
  // let lat = el[6]

  mapVectorSource.addFeature(airplane);
}

function setAirplaneAngle(_ref) {
  var newRotation = _ref.newRotation,
      airplane = _ref.airplane;
  var rotation = degrees_to_radians(newRotation);

  if (!airplane.getStyle() || airplane.getStyle().getImage().getRotation() !== rotation) {
    airplane.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
        // src: images.airplane,
        src: "./images/airplane.png",
        rotation: rotation
      })
    }));
  } else {
    console.log("same rotation");
  }
}

function requestForIsraelAirplanes() {
  // let a = new Date(2021, 02, 02, 21, 15, 30).getTime()
  var a = new Date().getTime();
  var searchA = Math.floor(a / 1000 + 900 + 330 * 60);
  console.log(searchA);
  console.log(a);
  var requestURL = 'https://opensky-network.org/api/states/all?time=' + searchA;
  var request = new XMLHttpRequest(); // let flagOneAirplane = true;

  request.open('GET', requestURL, true);
  request.responseType = 'json';

  request.onload = function (e) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        // console.log(request.response)
        request.response.states.forEach(function (el) {
          if (el[2] === "Israel" && !mapVectorSource.getFeatureById(parseInt(el[0]))) {
            //} && flagOneAirplane) {
            // if (!mapVectorSource.getFeatureById(el[0])) {
            console.log(el); // flagOneAirplane = false;

            createAirplaneIcon(el); // debugger
          } else {
            //update coordinates:
            if (mapVectorSource.getFeatureById(parseInt(el[0]))) {
              console.log("airplane: ".concat(el[0], " updated")); // mapVectorSource.getFeatureById(parseInt(el[0])).getGeometry().setCoordinates([el[5], el[6]]);

              var airplane = mapVectorSource.getFeatureById(parseInt(el[0]));
              debugger;
              airplane.getGeometry().setCoordinates([el[5], el[6]]);
              setAirplaneAngle({
                newRotation: el[10],
                airplane: airplane
              });
            }
          }
        });
      } else {
        console.error(request.statusText);
      }
    }
  }.bind(this);

  request.onerror = function (e) {
    console.error(request.statusText);
  };

  request.send(null);
}

setInterval(requestForIsraelAirplanes, 10000); // requestForIsraelAirplanes();
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52042" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","indexExtern.js"], null)
//# sourceMappingURL=/indexExtern.1347d5d9.js.map