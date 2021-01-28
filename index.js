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
import 'ol/ol.css';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { easeOut } from 'ol/easing';
import { fromLonLat } from 'ol/proj';
import { getVectorContext } from 'ol/render';
import { unByKey } from 'ol/Observable';
import { hasFlag } from 'country-flag-icons'
import { countries } from 'country-flag-icons'
import { isoCountries, degrees_to_radians } from './utils'
import images from "./images/*.png";


//Convert country to code and to Flag:
// console.log(isoCountries['israel']);
// const flagSrc = "http://purecatamphetamine.github.io/country-flag-icons/3x2/#isoCountry#.svg"


/****************************************/
/*            Basic Map                 */
/****************************************/

// API key at https://www.maptiler.com/cloud/
var key = 'GA7N1mQcvcTE7mnV8sG1';
var attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const mapVectorSource = new VectorSource({
    features: []
})
const mapVectorLayer = new VectorLayer({
    source: mapVectorSource,
});
const map = new Map({
    target: document.getElementById('map'),
    view: new View({
        // center: center,
        center: [35.217018, 31.771959],
        projection: 'EPSG:4326',
        zoom: 5,
        minZoom: 1,
        maxZoom: 20,
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


/****************************************/
/*         Israel Start Icon            */
/****************************************/


const startMarker = new Feature({
    geometry: new Point([35.217018, 31.771959]),
});
startMarker.setStyle(new Style({

    image: new Icon({
        // color: 'yellow',
        crossOrigin: 'anonymous',

        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        // src: flagSrc.replace("#isoCountry#", isoCountries['israel']),
        src: images.israelIcon,
        // src: getUnicodeFlagIcon('US'),
        // src: '/images/israelIcon.png'
        // src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
    }),
    text: new Text({
        font: '15px Narkisim, bold',
        text: 'Israel',
        fill: new Fill({ color: '#f3f3f3' }),
        stroke: new Stroke({
            color: '#002986', width: 3
        })
    }),
}))
mapVectorSource.addFeature(startMarker);



/****************************************/
/*         Flash Animation              */
/****************************************/

var duration = 3000;
function flash(feature) {
    var start = new Date().getTime();
    var listenerKey = mapVectorLayer.on('postrender', animate);

    function animate(event) {
        var vectorContext = getVectorContext(event);
        var frameState = event.frameState;
        var flashGeom = feature.getGeometry().clone();
        var elapsed = frameState.time - start;
        var elapsedRatio = elapsed / duration;
        // radius will be 5 at start and 30 at end.
        var radius = easeOut(elapsedRatio) * 25 + 5;
        var opacity = easeOut(1 - elapsedRatio);

        var style = new Style({
            image: new CircleStyle({
                radius: radius,
                stroke: new Stroke({
                    color: 'rgba(243, 243, 243, ' + opacity + ')',
                    width: 0.25 + opacity,
                }),
            }),
        });

        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom);
        if (elapsed > duration) {
            unByKey(listenerKey);
            return;
        }
        // tell OpenLayers to continue postrender animation
        map.render();
    }
}
mapVectorSource.on('addfeature', function (e) {
    flash(e.feature);
});



/****************************************/
/*         Request for Airplanes        */
/****************************************/

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
                    if (el[2] === "Israel" && !mapVectorSource.getFeatureById(parseInt(el[0]))) {
                        // if (!mapVectorSource.getFeatureById(el[0])) {
                        console.log(el);
                        debugger
                        let airplane = new Feature({
                            geometry: new Point([el[5], el[6]]),
                            _icao24: el[0],
                            _callsign: el[1],
                            // id: el[0]
                        })
                        airplane.setId(parseInt(el[0]));
                        console.log(airplane);
                        console.log(mapVectorSource.getFeaturesAtCoordinate([el[5], el[6]]));

                        // airplane._icao24 = el[0];
                        // airplane._callsign = el[1];
                        airplane.setStyle(new Style({
                            image: new Icon({
                                src: images.airplane,
                                rotation: degrees_to_radians(el[10]),
                            })
                        }))
                        // let lon = 
                        // let lat = el[6]
                        mapVectorSource.addFeature(airplane)
                        debugger
                    }
                    else { //update coordinates:
                        if (mapVectorSource.getFeatureById(parseInt(el[0]))) {
                            console.log(`airplane: ${el[0]} updated`);
                            mapVectorSource.getFeatureById(parseInt(el[0])).getGeometry().setCoordinates([el[5], el[6]]);
                        }
                    }
                })
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

setInterval(requestForIsraelAirplanes, 5000);

// requestForIsraelAirplanes();