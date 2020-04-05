import React, {Component} from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';


class App extends Component {




    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoidGltc29yb2tpbiIsImEiOiJjazhuM25ka3cwN3h6M2dwaWhvaHo3M2IxIn0.w-4ohye6olUU4eOGpeytaw';
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 10,
            center: [27.559, 53.902]
        });
    }

    render() {
        return (
            <div>
                <div id='map' style={{width: '30vw', height: '100vh', padding: 0, margin: 0}}/>
                <div className="form-container"/>
            </div>
        )
    }
}

export default App;
