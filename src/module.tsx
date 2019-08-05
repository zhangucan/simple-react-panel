import React, { PureComponent } from 'react';
import { PanelProps, PanelPlugin } from '@grafana/ui';
import MapGL from 'react-map-gl';
import DeckGL, { ArcLayer } from 'deck.gl';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiemhhbmd1Y2FuIiwiYSI6ImNqZ2t4d2hybTFoczEzM3BxZHNiZmx5ODEifQ.cRxbqbN3MrW454UdMfoc6w';
export class MyPanel extends PureComponent<PanelProps> {
  state = {
    viewport: {
      longitude: -122.45,
      latitude: 37.78,
      zoom: 11,
      bearing: 0,
      pitch: 30,
    },
  };

  _onViewportChange = (viewport: any) => {
    this.setState({ viewport });
  };

  render() {
    const { viewport } = this.state;
    console.log('panelData', this.props.data);
    return (
      <MapGL {...viewport} width="100%" height="100%" maxPitch={85} onViewportChange={this._onViewportChange} mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGL
          viewState={viewport}
          layers={[
            new ArcLayer({
              data: [
                {
                  sourcePosition: [-122.41669, 37.7853],
                  targetPosition: [-122.45669, 37.781],
                },
              ],
              strokeWidth: 4,
              getSourceColor: () => [0, 0, 255],
              getTargetColor: () => [0, 255, 0],
            }),
          ]}
        />
      </MapGL>
    );
  }
}

export const plugin = new PanelPlugin(MyPanel);
