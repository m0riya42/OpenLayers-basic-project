// import { isoCountries, degrees_to_radians } from './utils'

const generateRandomLocation = () => {
    const randNum = (min, max) => {
        return min + Math.random() * (max + 1 - min);
    };

    return Object.values({
        lon: randNum(34.57149, 35.57212),
        lat: randNum(29.55805, 33.207033)
        // lon: randNum(-180, 180),
        // lat: randNum(-90, 90)
    })
}


function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}


//Convert country to code and to Flag:
// console.log(isoCountries['israel']);
// const flagSrc = "http://purecatamphetamine.github.io/country-flag-icons/3x2/#isoCountry#.svg"



var gpxFormat = new ol.format.GPX();
var gpxFeatures;
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    debugger
    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        console.log("files[i]", files[i]);
        var reader = new FileReader();
        reader.readAsText(files[i], "UTF-8");
        reader.onload = function (evt) {
            console.log(evt.target.result);
            gpxFeatures = gpxFormat.readFeatures(evt.target.result, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            gpxLayer.getSource().addFeatures(gpxFeatures);
            console.log("gpxFeatures", gpxFeatures)
        }
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}


// var defaultStyle = {
//     'Point': new ol.style.Style({
//         image: new ol.style.Circle({
//             fill: new ol.style.Fill({
//                 color: 'rgba(255,255,0,0.5)'
//             }),
//             radius: 5,
//             stroke: new ol.style.Stroke({
//                 color: '#ff0',
//                 width: 1
//             })
//         })
//     }),
//     'LineString': new ol.style.Style({
//         stroke: new ol.style.Stroke({
//             color: '#f00',
//             width: 3
//         })
//     }),
//     'Polygon': new ol.style.Style({
//         fill: new ol.style.Fill({
//             color: 'rgba(0,255,255,0.5)'
//         }),
//         stroke: new ol.style.Stroke({
//             color: '#0ff',
//             width: 1
//         })
//     }),
//     'MultiPoint': new ol.style.Style({
//         image: new ol.style.Circle({
//             fill: new ol.style.Fill({
//                 color: 'rgba(255,0,255,0.5)'
//             }),
//             radius: 5,
//             stroke: new ol.style.Stroke({
//                 color: '#f0f',
//                 width: 1
//             })
//         })
//     }),
//     'MultiLineString': new ol.style.Style({
//         stroke: new ol.style.Stroke({
//             color: '#0f0',
//             width: 3
//         })
//     }),
//     'MultiPolygon': new ol.style.Style({
//         fill: new ol.style.Fill({
//             color: 'rgba(0,0,255,0.5)'
//         }),
//         stroke: new ol.style.Stroke({
//             color: '#00f',
//             width: 1
//         })
//     })
// };

var style = {
    'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,0,0.4)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
                color: '#ff0',
                width: 1
            })
        })
    })],
    'LineString': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
        })
    })],
    'MultiLineString': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#0f0',
            width: 3
        })
    })]
};
var styleFunction = function (feature, resolution) {
    var featureStyleFunction = feature.getStyleFunction();
    if (featureStyleFunction) {
        return featureStyleFunction.call(feature, resolution);
    } else {
        return defaultStyle[feature.getGeometry().getType()];
    }
};

var gpxLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        // url: './20210222011116-27005-data.gpx',
        url: 'https://openlayers.org/en/v4.6.5/examples/data/gpx/fells_loop.gpx',
        format: new ol.format.GPX()
    }),
    // style: styleFunction
    style: function (feature, resolution) {
        return style[feature.getGeometry().getType()];
    }
});

debugger
console.log(gpxLayer);

// var vector = new ol.layer.Vector({
//     source: new ol.source.Vector({
//       url: 'data/gpx/fells_loop.gpx',
//       format: new ol.format.GPX()
//     }),
//     style: function(feature, resolution) {
//       return style[feature.getGeometry().getType()];
//     }
//   });

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
            source: new ol.source.OSM() //original map
            // source: new ol.source.XYZ({
            //     attributions: attributions,
            //     url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=' + key,
            //     tileSize: 512,
            // }),
        }), mapVectorLayer, gpxLayer],
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
        // data/kml/2012_Earthquakes_Mag5.kml
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
// mapVectorSource.addFeature(startMarker);



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
                    // if (el[2] === "Israel" && !mapVectorSource.getFeatureById(parseInt(el[0]))) {//} && flagOneAirplane) {
                    if (!mapVectorSource.getFeatureById(el[0])) {
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

// setInterval(requestForIsraelAirplanes, 10000);

// requestForIsraelAirplanes();
///////////////////////////////////////////////////////////////////////////
var displayFeatureInfo = function (pixel) {
    var features = [];
    map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        features.push(feature);
        feature && console.log("value: ", feature.value)
    });
    if (features.length > 0) {
        var info = [];
        var i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
            info.push(features[i].get('desc'));
        }
        // document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
        map.getTarget().style.cursor = 'pointer';
    } else {
        // document.getElementById('info').innerHTML = '&nbsp;';
        map.getTarget().style.cursor = '';
    }
};

map.on('pointermove', function (evt) {
    if (evt.dragging) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
    displayFeatureInfo(evt.pixel);
});



const heatmapLayer = new ol.source.Vector({});
const createListOfPoints = () => {
    // let listOfPoints;


    for (let i = 0; i < 15; i++) {
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(generateRandomLocation()),
        })
        i ? feature.value = i : feature.value = null;
        // console.log(feature.)
        heatmapLayer.addFeature(feature)
        // listOfPoints.push()
    }
}



const vectorHeatMap = new ol.layer.Heatmap({
    // source: new ol.source.Vector({
    //     url: 'https://openlayers.org/en/v4.6.5/examples/data/kml/2012_Earthquakes_Mag5.kml',
    //     format: new ol.format.KML({
    //         extractStyles: false,
    //     }),
    // }),
    source: heatmapLayer,
    blur: 15,
    radius: 25,
    weight: function (feature) {
        // console.log(feature.value)
        // return feature.value * 0.1;
        console.log(feature.value ?? 15)
        return feature.value ?? 1;
    }
});

map.addLayer(vectorHeatMap);
//   const raster = new TileLayer({
//     source: new Stamen({
//       layer: 'toner',
//     }),
//   });


createListOfPoints()