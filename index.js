import 'ol/ol.css';
import { Map, View, Feature } from 'ol';
import { Transform } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
//  import  Point from 'ol/geometry/Point';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import OSM from 'ol/source/OSM';
import { hasFlag } from 'country-flag-icons'
import { countries } from 'country-flag-icons'





const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
      // center: [31.771959, 35.217018]
    })
  ],
  view: new View({
    zoom: 8,
    center: [35.217018, 31.771959],
    projection: 'EPSG:4326'
  })
});
// var
// var marker = new Feature({
//   geometry: new geometry.Point(Transform([16.9071388, 52.4901917], 'EPSG:4326', 'EPSG:3857')),
// });

var markers = new VectorSource({
  features: []//[marker]
});

var markerVectorLayer = new VectorLayer({
  source: markers,
});
map.addLayer(markerVectorLayer);

// debugger
console.log(map)
console.log(hasFlag('US'));

let a = new Date().getTime();
let searchA = Math.floor(a / 1000 + 900 + 330 * 60)
console.log(searchA);
console.log(a);
let requestURL = 'https://opensky-network.org/api/states/all?time=' + searchA;
let request = new XMLHttpRequest();


request.open('GET', requestURL, true);
request.responseType = 'json';
request.onload = function (e) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      // console.log(request.response)
      request.response.states.forEach((el) => { if (el[2] === "Israel") console.log(el) })      // if (el[2] === "Israel") {
    } else {
      console.error(request.statusText);
    }
  }
};
request.onerror = function (e) {
  console.error(request.statusText);
};
request.send(null);

// b = new Date()
// b.setTime(a)