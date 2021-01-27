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
import { hasFlag } from 'country-flag-icons'
import { countries } from 'country-flag-icons'

// API key at https://www.maptiler.com/cloud/
var key = 'GA7N1mQcvcTE7mnV8sG1';
var attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';


var mapVectorSource = new VectorSource({
    features: []
})
var mapVectorLayer = new VectorLayer({
    source: mapVectorSource,
    style: new Style({
        image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            // src: './images/airplane.png'
            src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
            // src: 'https://openlayers.org/en/v4.6.5/examples/data/dot.png'

        })

    })

});
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
            // source: new OSM() //original map
            source: new XYZ({
                attributions: attributions,
                url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=' + key,
                tileSize: 512,
            }),
        }), mapVectorLayer],
});

// map.addLayer(mapVectorLayer);


//console.log(hasFlag('US'));

//Israel icon:
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
        // src: './airplane.png'
        // src: '/images/israelIcon.png'
        src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
        // src: ''            // src: './marker.png'
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
mapVectorSource.addFeature(startMarker);



function requestForIsraelAirplanes() {

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
                        mapVectorSource.addFeature(
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
}

requestForIsraelAirplanes();