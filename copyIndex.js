import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import Polyline from 'ol/format/Polyline';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {
    Circle as CircleStyle,
    Fill,
    Icon,
    Stroke,
    Style,
    Text
} from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { getVectorContext } from 'ol/render';

var key = 'Get your own API key at https://www.maptiler.com/cloud/';
var attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

var center = [-5639523.95, -3501274.52];
var map = new Map({
    target: document.getElementById('map'),
    view: new View({
        // center: center,
        center: [35.217018, 31.771959],
        projection: 'EPSG:4326',
        zoom: 2,
        minZoom: 2,
        maxZoom: 19,
    }),
    layers: [
        new TileLayer({
            source: new XYZ({
                attributions: attributions,
                url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=' + 'GA7N1mQcvcTE7mnV8sG1',
                tileSize: 512,
            }),
        })],
});

// The polyline string is read from a JSON similiar to those returned
// by directions APIs such as Openrouteservice and Mapbox.


// var endMarker = new Feature({
//     type: 'icon',
//     geometry: new Point([35, 32]),

// });

var startMarker = new Feature({
    geometry: new Point([35.217018, 31.771959]),
});
startMarker.setStyle(new Style({

    image: new Icon({
        color: 'yellow',
        crossOrigin: 'anonymous',

        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        // imgSize: [20, 20],
        // src: './airplane.png'

        // src: '/marker.png'
        src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
        // src: '2wCEAAkGBxITEhUTExMWFhUTFxcZFRUWFRcVFRcVFRgWGBcXFxMYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi4mICUtLS8uLS0vLS0tLS0tLS0tLTUtLS01LS0tLy0tLy0rNy0tLS0tLi0tLS0tLi0tLS8tLf'            // src: './marker.png'
    }),
    text: new Text({
        font: '25px Calibri,sans-serif',
        text: 'Start Point',
        fill: new Fill({ color: 'yellow' }),
        stroke: new Stroke({
            color: 'green', width: 3
        })
    }),
}))


var vectorSourceVar = new VectorSource({
    features: [startMarker]
})
var vectorLayerVar = new VectorLayer({
    source: vectorSourceVar,
    style: new Style({
        image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: './images/airplane.png'
            // src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
            // src: 'https://openlayers.org/en/v4.6.5/examples/data/dot.png'
            // src: '2wCEAAkGBxITEhUTExMWFhUTFxcZFRUWFRcVFRcVFRgWGBcXFxMYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi4mICUtLS8uLS0vLS0tLS0tLS0tLTUtLS01LS0tLy0tLy0rNy0tLS0tLi0tLS0tLi0tLS8tLf'            // src: './marker.png'
        })

    })

});
map.addLayer(vectorLayerVar);

// function addVectorLayer() {




// }



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
            request.response.states.forEach((el) => {
                if (el[2] === "Israel") {
                    console.log(el);

                    let lon = el[5]
                    let lat = el[6]
                    vectorSourceVar.addFeature(
                        new Feature({
                            geometry: new Point([lon, lat]),
                        })
                    )
                }
            })
            // if (el[2] === "Israel") {
        } else {
            console.error(request.statusText);
        }
    }
}.bind(this);
request.onerror = function (e) {
    console.error(request.statusText);
};
request.send(null);
