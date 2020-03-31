import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { fetch } from 'whatwg-fetch';
import './Map.css';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regions: null
    };
  }

  fetchData() {
    let url;
    if (this.props.date)
      url = `https://coronavirus-italia-api.now.sh/api/stats/regional/${this.props.date}`;
    else
      url = `https://coronavirus-italia-api.now.sh/api/stats/regional/recent`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          regions: {
            type: 'FeatureCollection',
            features: data.regional_stats.map(region => ({
              type: 'feature',
              properties: {
                region: region.denominazione_regione,
                description: `<br/><h5>${region.denominazione_regione}</h5><h6>Total Cases: ${region.totale_positivi}</h6> <h6>Deceased: ${region.deceduti}</h6> <h6>Recovered: ${region.dimessi_guariti}</h6>`,
                cases: region.totale_attualmente_positivi * 1,
                deceased: region.deceduti * 1,
                recovered: region.dimessi_guariti * 1
              },
              geometry: {
                type: 'Point',
                coordinates: [region.long * 1, region.lat * 1]
              }
            }))
          }
        });
      })
      .then(() => {
        this.setMap();
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  setMap() {
    const regions = this.state.regions;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [12.48, 41.9],
      zoom: 5.3
    });

    map.on('load', function() {
      // Add a GeoJSON source containing place coordinates and information.
      map.addSource('regions', {
        type: 'geojson',
        data: regions
      });

      map.addLayer(
        {
          id: 'regions-heat',
          type: 'heatmap',
          source: 'regions',
          maxzoom: 15,
          paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
              property: 'cases',
              type: 'exponential',
              stops: [
                [1, 0],
                [62, 1]
              ]
            },
            // increase intensity as zoom level increases
            // 'heatmap-intensity': 15,
            'heatmap-intensity': {
              stops: [
                [11, 15],
                [15, 20]
              ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(236,222,239,0)',
              0.2,
              'rgb(208,209,230)',
              0.4,
              'rgb(166,189,219)',
              0.6,
              'rgb(103,169,207)',
              0.8,
              'rgb(28,144,153)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
              stops: [
                [1, 11],
                [11, 15],
                [15, 20]
              ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
              default: 1,
              stops: [
                [14, 1],
                [15, 0]
              ]
            }
          }
        },
        'waterway-label'
      );

      map.addLayer(
        {
          id: 'regions-point',
          type: 'circle',
          source: 'regions',
          minzoom: 14,
          paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
              property: 'cases',
              type: 'exponential',
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50]
              ]
            },
            'circle-color': {
              property: 'dbh',
              type: 'exponential',
              stops: [
                [0, 'rgba(236,222,239,0)'],
                [10, 'rgb(236,222,239)'],
                [20, 'rgb(208,209,230)'],
                [30, 'rgb(166,189,219)'],
                [40, 'rgb(103,169,207)'],
                [50, 'rgb(28,144,153)'],
                [60, 'rgb(1,108,89)']
              ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': {
              stops: [
                [14, 0],
                [15, 1]
              ]
            }
          }
        },
        'waterway-label'
      );

      map.addLayer({
        id: 'region-labels',
        type: 'symbol',
        source: 'regions',
        layout: {
          'text-field': ['get', 'region']
        },
        paint: {
          'text-color': '#fff'
        },
        interactive: true
      });
    });

    map.on('click', 'region-labels', function(e) {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) this.fetchData();
  }

  render() {
    return (
      <React.Fragment>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
      </React.Fragment>
    );
  }
}
