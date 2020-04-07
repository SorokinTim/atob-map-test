import React, {Component} from "react";
import mapboxgl from 'mapbox-gl';
import './Map.css';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxLanguage from '@mapbox/mapbox-gl-language'



export default class Map extends Component {

    componentDidMount() {

        let MapboxLanguage = require('@mapbox/mapbox-gl-language');

        // -------------------------------------------------------------------------------------

        mapboxgl.accessToken = 'pk.eyJ1IjoidGltc29yb2tpbiIsImEiOiJjazhuM25ka3cwN3h6M2dwaWhvaHo3M2IxIn0.w-4ohye6olUU4eOGpeytaw';
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 10,
            center: [27.559, 53.902],
            attributionControl: false,
        });


        let geocoderEnd = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        });

        let geocoderStart = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        });

        document.getElementById('geocoder-end').appendChild(geocoderEnd.onAdd(map));
        document.getElementById('geocoder-start').appendChild(geocoderStart.onAdd(map));


        // -------------------------------------------------------------------------------------

        // set the bounds of the map
        let bounds = [
            [27.369, 53.813],
            [27.745, 53.988]
        ];
        map.setMaxBounds(bounds);

        // -------------------------------------------------------------------------------------

        // initialize the map canvas to interact with later
        let canvas = map.getCanvasContainer();

        // an arbitrary start will always be the same
        // only the end or destination will change
        let start = [27.457, 53.904];

        // create a function to make a directions request
        function getRoute(end) {
            // make directions request using cycling profile
            let url =
                'https://api.mapbox.com/directions/v5/mapbox/cycling/' +
                start[0] +
                ',' +
                start[1] +
                ';' +
                end[0] +
                ',' +
                end[1] +
                '?steps=true&geometries=geojson&access_token=' +
                mapboxgl.accessToken;

            // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onload = function () {
                let json = JSON.parse(req.response);
                let data = json.routes[0];
                let route = data.geometry.coordinates;
                let geojson = {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': route
                    }
                };
                // if the route already exists on the map, we'll reset it using setData
                if (map.getSource('route')) {
                    map.getSource('route').setData(geojson);
                }
                // otherwise, we'll make a new request
                else {
                    map.addLayer({
                        'id': 'route',
                        'type': 'line',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': geojson
                                }
                            }
                        },
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#be563e',
                            'line-width': 5,
                            'line-opacity': 0.75
                        }
                    });

                }
            };
            req.send();
        }

        map.on('load', function () {

            geocoderEnd.on('result', function(ev) {
                let coord = ev.result.center;
                getRoute(coord);
            });

            // make an initial directions request that
            // starts and ends at the same location
            getRoute(start);

            // Add destination to the map
            map.addLayer({
                'id': 'point',
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': start
                                }
                            }
                        ]
                    }
                },
                'paint': {
                    'circle-radius': 10,
                    'circle-color': '#be563e'
                }
            });

            // allow the user to click the map to change the destination
            map.on('click', function (e) {
                let coordsObj = e.lngLat;
                canvas.style.cursor = '';
                let coords = Object.keys(coordsObj).map(function (key) {
                    return coordsObj[key];
                });
                let end = {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coords
                            }
                        }
                    ]
                };
                if (map.getLayer('end')) {
                    map.getSource('end').setData(end);
                } else {
                    map.addLayer({
                        'id': 'end',
                        'type': 'circle',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                    {
                                        'type': 'Feature',
                                        'properties': {},
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': coords
                                        }
                                    }
                                ]
                            }
                        },
                        'paint': {
                            'circle-radius': 10,
                            'circle-color': '#be563e'
                        }
                    });
                }
                getRoute(coords);
            });
        });
    }

    render() {
        return (
            <div className='container'>
                <div id={'map'} className='map'/>
                <div>
                    <div id={'geocoder-start'} className='geocoder'/>
                    <div id={'geocoder-end'} className='geocoder'/>
                </div>
            </div>
        )
    }
}