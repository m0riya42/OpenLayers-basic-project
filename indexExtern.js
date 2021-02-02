// import { isoCountries, degrees_to_radians } from './utils'


function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}


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

const mapVectorSource = new ol.source.Vector({
    features: []
})
const mapVectorLayer = new ol.layer.Vector({
    source: mapVectorSource,
});
const map = new ol.Map({
    target: document.getElementById('map'),
    view: new ol.View({
        // center: center,
        center: [35.217018, 31.771959],
        projection: 'EPSG:4326',
        zoom: 5,
        minZoom: 1,
        maxZoom: 20,
    }),
    layers: [
        new ol.layer.Tile({
            // source: new OSM() //original map
            source: new ol.source.XYZ({
                attributions: attributions,
                url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=' + key,
                tileSize: 512,
            }),
        }), mapVectorLayer],
});


/****************************************/
/*         Israel Start Icon            */
/****************************************/


const startMarker = new ol.Feature({
    geometry: new ol.geom.Point([35.217018, 31.771959]),
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
        fill: new ol.style.Fill({ color: '#f3f3f3' }),
        stroke: new ol.style.Stroke({
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
        var vectorContext = ol.render.getVectorContext(event);
        var frameState = event.frameState;
        var flashGeom = feature.getGeometry().clone();
        var elapsed = frameState.time - start;
        var elapsedRatio = elapsed / duration;
        // radius will be 5 at start and 30 at end.
        var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
        var opacity = ol.easing.easeOut(1 - elapsedRatio);

        var style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: radius,
                stroke: new ol.style.Stroke({
                    color: 'rgba(243, 243, 243, ' + opacity + ')',
                    width: 0.25 + opacity,
                }),
            }),
        });

        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom);
        if (elapsed > duration) {
            ol.Observable.unByKey(listenerKey);
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


function createAirplaneIcon(el) {

    let airplane = new ol.Feature({
        geometry: new ol.geom.Point([el[5], el[6]]),
        _icao24: el[0],
        _callsign: el[1],
        // id: el[0]
    })
    airplane.setId(parseInt(el[0]));
    console.log(airplane);
    console.log(mapVectorSource.getFeaturesAtCoordinate([el[5], el[6]]));

    // airplane._icao24 = el[0];
    // airplane._callsign = el[1];
    setAirplaneAngle({ newRotation: el[10], airplane });
    // let lon = 
    // let lat = el[6]
    mapVectorSource.addFeature(airplane)
}

function setAirplaneAngle({ newRotation, airplane }) {
    let rotation = degrees_to_radians(newRotation);

    if (!airplane.getStyle() || airplane.getStyle().getImage().getRotation() !== rotation) {
        airplane.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                // src: images.airplane,
                src: "./images/airplane.png",
                rotation: rotation,
            })
        }))
    } else {
        console.log("same rotation");
    }
}

function requestForIsraelAirplanes() {
    // let a = new Date(2021, 02, 02, 21, 15, 30).getTime()
    let a = new Date().getTime();
    let searchA = Math.floor(a / 1000 + 900 + 330 * 60)
    console.log(searchA);
    console.log(a);
    let requestURL = 'https://opensky-network.org/api/states/all?time=' + searchA;
    let request = new XMLHttpRequest();

    // let flagOneAirplane = true;
    request.open('GET', requestURL, true);
    request.responseType = 'json';
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                // console.log(request.response)
                request.response.states.forEach((el) => {
                    if (el[2] === "Israel" && !mapVectorSource.getFeatureById(parseInt(el[0]))) {//} && flagOneAirplane) {
                        // if (!mapVectorSource.getFeatureById(el[0])) {
                        console.log(el);


                        // flagOneAirplane = false;
                        createAirplaneIcon(el);

                        // debugger
                    }
                    else { //update coordinates:
                        if (mapVectorSource.getFeatureById(parseInt(el[0]))) {
                            console.log(`airplane: ${el[0]} updated`);
                            // mapVectorSource.getFeatureById(parseInt(el[0])).getGeometry().setCoordinates([el[5], el[6]]);
                            let airplane = mapVectorSource.getFeatureById(parseInt(el[0]));
                            debugger
                            airplane.getGeometry().setCoordinates([el[5], el[6]]);
                            setAirplaneAngle({ newRotation: el[10], airplane });
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

setInterval(requestForIsraelAirplanes, 10000);

// requestForIsraelAirplanes();