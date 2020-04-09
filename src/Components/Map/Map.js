import React, {Component} from "react";
import mapboxgl from 'mapbox-gl';
import './Map.css';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import StepsCounter from "./StepsCounter/StepsCounter";


export default class Map extends Component {

    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
    }

    componentDidMount() {

        mapboxgl.accessToken = 'pk.eyJ1IjoidGltc29yb2tpbiIsImEiOiJjazhuM25ka3cwN3h6M2dwaWhvaHo3M2IxIn0.w-4ohye6olUU4eOGpeytaw';
        let map = new mapboxgl.Map({
            container: this.mapRef,
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


        // set the bounds of the map
        let bounds = [
            [27.369, 53.813],
            [27.745, 53.988]
        ];
        map.setMaxBounds(bounds);

        // an arbitrary start will always be the same
        // only the end or destination will change
        let startPosition;
        let endPosition;


        function getRoute(start, end) {
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
            console.log(start, end, url);


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
                            'line-color': '#4668F2',
                            'line-width': 5,
                            'line-opacity': 0.75
                        }
                    });

                }
            };
            req.send();
        }

        map.on('load', function () {

            geocoderEnd.on('result', function (ev) {
                let coord = ev.result.center;
                endPosition = coord;
                if (endPosition && startPosition) {
                    getRoute(startPosition, endPosition);
                } else {
                    getRoute(coord, coord);
                }
            });

            geocoderStart.on('result', function (ev) {
                let coord = ev.result.center;
                startPosition = coord;
                if (endPosition && startPosition) {
                    getRoute(startPosition, endPosition);
                } else {
                    getRoute(coord, coord);
                }
            });
        });
    }

    render() {
        return (
            <div className='main-container'>
                <div ref={(ref) => this.mapRef = ref} className='map'/>
                <div className="side-container">
                    <div className="form-container">
                        <StepsCounter>
                            <div className="input-container">
                                <div id={'geocoder-start'} className='geocoder'/>
                                <div id={'geocoder-end'} className='geocoder'/>
                            </div>
                        </StepsCounter>
                    </div>
                </div>
            </div>
        )
    }
}