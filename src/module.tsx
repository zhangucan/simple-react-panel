import React, { PureComponent } from 'react';
import { PanelProps, PanelPlugin } from '@grafana/ui';
import { StaticMap } from 'react-map-gl';
import DeckGL, { LightingEffect, HexagonLayer } from 'deck.gl';
import { PhongMaterial, AmbientLight } from 'luma.gl';
import { PointLight, OrthographicView } from '@deck.gl/core';
export interface Props extends PanelProps {
  radius?: number;
  upperPercentile?: number;
  coverage?: number;
  mapStyle?: string;
  onHover?: Function;
}
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiemhhbmd1Y2FuIiwiYSI6ImNqZ2t4d2hybTFoczEzM3BxZHNiZmx5ODEifQ.cRxbqbN3MrW454UdMfoc6w';
// const DATA_URL =
//   'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000],
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight1, pointLight2 });

const material = new PhongMaterial({
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
});

const INITIAL_VIEW_STATE = {
  longitude: 104.50704956054688,
  latitude: 28.168500900268555,
  zoom: 12,
  minZoom: 5,
  maxZoom: 20,
  pitch: 40.5,
  bearing: -27.396674584323023,
};

const colorRange = [[1, 152, 189], [73, 227, 206], [216, 254, 181], [254, 237, 177], [254, 173, 84], [209, 55, 78]];

const elevationScale = { min: 1, max: 50 };
export class MyPanel extends PureComponent<Props> {
  state = {
    elevationScale: elevationScale.min,
  };
  startAnimationTimer: any;
  intervalTimer: any;

  componentDidMount() {
    this._animate();
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.data && this.props.data) {
      this._animate();
    }
  }

  componentWillUnmount() {
    this._stopAnimate();
  }

  _onViewStateChange({ viewState }: { viewState: any }) {
    this.setState({ viewState });
  }

  _animate() {
    this._stopAnimate();

    // wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
  }
  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
  }

  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateHeight() {
    if (this.state.elevationScale === elevationScale.max) {
      this._stopAnimate();
    } else {
      this.setState({ elevationScale: this.state.elevationScale + 1 });
    }
  }

  _renderLayers() {
    const { radius = 50, upperPercentile = 100, coverage = 0.7 } = this.props;
    const data = this.props.data;
    const coordinate = [];
    for (const item of data.series) {
      if (item.rows[0]) {
        const row = item.rows[0];
        if (row[0]) {
          const gson = JSON.parse(row[0]);
          if (gson.wgs84Lng && gson.wgs84Lat) {
            coordinate.push([Number(gson.wgs84Lng), Number(gson.wgs84Lat)]);
          }
        }
      }
    }
    console.log(coordinate);
    return [
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data: coordinate,
        elevationRange: [0, 3000],
        elevationScale: this.state.elevationScale,
        extruded: true,
        getPosition: (d: any) => d,
        onHover: this.props.onHover,
        opacity: 1,
        pickable: Boolean(this.props.onHover),
        radius,
        upperPercentile,
        material,
      }),
    ];
  }

  render() {
    const { mapStyle = 'mapbox://styles/mapbox/navigation-guidance-night-v2' } = this.props;
    console.log('this.props', this.props);
    return (
      <DeckGL
        viewState={{
          target: [0, 0, 0],
          rotationX: 0,
          rotationOrbit: 0,
        }}
        views={[new OrthographicView()]}
        layers={this._renderLayers()}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <StaticMap width="100%" height="100%" reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} mapboxApiAccessToken={MAPBOX_TOKEN} />
      </DeckGL>
    );
  }
}

export const plugin = new PanelPlugin(MyPanel);
