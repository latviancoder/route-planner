import React from 'react';
import WaypointsList from './waypointList/WaypointsList';
import { useAppContext } from '../App';
import { generateGpxFile } from '../misc/helpers';
import * as Styles from './sidebar.styles';

export default function Sidebar() {
  const [state] = useAppContext();

  function handleDownload() {
    const xmlString = generateGpxFile(state.waypoints);
    const pom = document.createElement('a');
    const blob = new Blob([xmlString], { type: 'text/plain' });
    pom.setAttribute('href', window.URL.createObjectURL(blob));
    pom.setAttribute('download', 'test.gpx');
    pom.click();
  }

  return <Styles.Container>
    <Styles.RouteBuilder>
      Route Builder
    </Styles.RouteBuilder>

    <WaypointsList/>

    {state.waypoints.length > 0 && (
      <Styles.DownloadButton onClick={handleDownload}>
        Download your route
      </Styles.DownloadButton>
    )}
  </Styles.Container>;
};

