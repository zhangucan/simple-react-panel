import React, { PureComponent } from 'react';
import { PanelProps, PanelPlugin } from '@grafana/ui';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1Ijoiemhhbmd1Y2FuIiwiYSI6ImNqZ2t4d2hybTFoczEzM3BxZHNiZmx5ODEifQ.cRxbqbN3MrW454UdMfoc6w',
});

export class MyPanel extends PureComponent<PanelProps> {

  componentDidMount() {
    
  }
  render() {
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: '100vh',
          width: '100vw',
        }}
      >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
        </Layer>
      </Map>
    );
  }
}

export const plugin = new PanelPlugin(MyPanel);
