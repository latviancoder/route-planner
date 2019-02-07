export function immutablySwapItems(items, firstIndex, secondIndex) {
  const results = items.slice();
  const firstItem = items[firstIndex];
  results[firstIndex] = items[secondIndex];
  results[secondIndex] = firstItem;

  return results;
}

export function generateGpxFile(waypoints) {
  return `<?xml version='1.0' encoding='UTF-8'?>
    <gpx version="1.1" creator="https://www.komoot.de" xmlns="http://www.topografix.com/GPX/1/1"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
      <metadata>
          <name>test</name>
          <author>
              <link href="https://www.komoot.de">
                  <text>komoot</text>
                  <type>text/html</type>
              </link>
          </author>
      </metadata>
      <trk>
          <name>test</name>
          <trkseg>
            ${waypoints.map(waypoint => {
              return `<trkpt lat="${waypoint.latlng.lat}" lon="${waypoint.latlng.lat}">
                <time>${new Date().toISOString()}</time>
              </trkpt>`;
            }).join('')}
          </trkseg>
      </trk>
  </gpx>`;
}