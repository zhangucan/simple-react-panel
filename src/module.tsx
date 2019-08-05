import React, { PureComponent } from 'react';
import { PanelProps, PanelPlugin } from '@grafana/ui';
import MapGL from 'react-map-gl';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiemhhbmd1Y2FuIiwiYSI6ImNqZ2t4d2hybTFoczEzM3BxZHNiZmx5ODEifQ.cRxbqbN3MrW454UdMfoc6w';
export class MyPanel extends PureComponent<PanelProps> {
  state = {
    viewport: {
      latitude: 37.805,
      longitude: -122.447,
      zoom: 15.5,
      bearing: 0,
      pitch: 0,
    },
  };

  render() {
    return (
      <MapGL
        {...this.state.viewport}
        width="100%"
        height="100%"
        onViewportChange={viewport => this.setState({ viewport })}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      ></MapGL>
    );
  }
}

export const plugin = new PanelPlugin(MyPanel);
