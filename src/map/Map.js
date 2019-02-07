import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { difference } from 'lodash';
import { useAppContext } from '../App';

export default function Map() {
  const [isMarkerDragging, setMarkerDragging] = useState(false);

  const mapRef = useRef();
  const markersRef = useRef({});
  const pathRef = useRef();
  const prevWaypoints = useRef();

  const [state, dispatch] = useAppContext();

  // Initialize map and empty polyline on mount
  useEffect(function onMount() {
    mapRef.current = L
      .map('map', {
        zoomControl: false,
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        ]
      })
      .setView([51.505, -0.09], 8);

    pathRef.current = L.polyline([], { weight: 5 }).addTo(mapRef.current);

    // Cleanup on potential onmount
    return () => {
      mapRef.current && mapRef.current.remove();
    }
  }, []);

  useEffect(function onWaypointsChange() {
    // This is executed only when waypoints are added/removed, not updated
    if (!prevWaypoints.current || state.waypoints.length !== prevWaypoints.current.length) {
      addOrRemoveMarkersFromMap();
      updateMarkersIconIndexes();
    }

    // Update marker icon indexes when waypoints are rearranged
    if (prevWaypoints.current && state.waypoints.length === prevWaypoints.current.length) {
      for (let i = 0; i < state.waypoints.length - 1; i++) {
        if (state.waypoints[i].id !== prevWaypoints.current[i].id) {
          updateMarkersIconIndexes();
          break;
        }
      }
    }

    // Always update path
    updatePath();

    // Save waypoints for later comparison
    prevWaypoints.current = state.waypoints;
  }, [state.waypoints]);

  // Part of workaround for https://github.com/Leaflet/Leaflet/issues/6112
  useEffect(function onMarkerDragging() {
    mapRef.current.on('click', e => {
      if (!isMarkerDragging) {
        dispatch({ type: 'ADD_WAYPOINT', payload: e.latlng });
      }
    });
    return () => mapRef.current.off('click');
  }, [isMarkerDragging]);

  // One solution would probably be to completely remove all markers from the map whenever they change and create new ones
  // This one is probably harder to maintain, but is more performant and theoretically more bulletproof
  function addOrRemoveMarkersFromMap() {
    if (!prevWaypoints.current || state.waypoints.length > prevWaypoints.current.length) {
      const addedWaypoint = difference(state.waypoints, prevWaypoints.current)[0];

      // Add new marker when waypoint is added, attach drag event to it
      if (addedWaypoint) {
        createWaypointMarker(addedWaypoint);
      }
    } else if (state.waypoints.length < prevWaypoints.current.length) {
      const removedWaypoint = difference(prevWaypoints.current, state.waypoints)[0];

      // Remove existing marker from map when waypoint is removed
      getWaypointMarker(removedWaypoint).remove();
      delete markersRef.current[removedWaypoint.id];
    }
  }

  function createWaypointMarker(waypoint) {
    const marker = L
      .marker(waypoint.latlng, { draggable: true })
      .addTo(mapRef.current)
      .on('dragstart', () => setMarkerDragging(true))
      .on('drag', e => {
        dispatch({
          type: 'UPDATE_WAYPOINT_LATLNG',
          payload: { id: waypoint.id, latlng: e.target._latlng }
        });
      })
      // Hacky workaround for this bug: https://github.com/Leaflet/Leaflet/issues/6112
      // Komoot suffers from the same problem. If you drag marker really fast - click event is registered
      .on('dragend', () => setTimeout(() => setMarkerDragging(false)));

    markersRef.current[waypoint.id] = marker;
  }

  function updateMarkersIconIndexes() {
    for (const [index, waypoint] of Object.entries(state.waypoints)) {
      getWaypointMarker(waypoint).setIcon(new L.DivIcon({
        iconSize: 25,
        className: 'marker-icon',
        html: (Number(index) + 1)
      }));
    }
  }

  function updatePath() {
    pathRef.current.setLatLngs(state.waypoints.map(e => e.latlng));
  }

  function getWaypointMarker(waypoint) {
    return markersRef.current[waypoint.id];
  }

  return <div id="map" style={{ flex: 1 }}/>;
};