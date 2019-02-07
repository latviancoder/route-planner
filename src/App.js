import React, { createContext, useContext, useReducer } from 'react';
import uniqid from 'uniqid';

import Map from './map/Map';
import Sidebar from './sidebar/Sidebar';
import { immutablySwapItems } from './misc/helpers';
import * as Styles from './app.styles';

const AppContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

const initialState = {
  waypoints: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_WAYPOINT':
      return {
        ...state,
        waypoints: [
          ...state.waypoints,
          {
            id: uniqid(),
            latlng: action.payload
          }
        ]
      };
    case 'UPDATE_WAYPOINT_LATLNG':
      return {
        ...state,
        waypoints: state.waypoints.map(waypoint => {
          if (waypoint.id !== action.payload.id) {
            return waypoint;
          } else {
            return {
              ...waypoint,
              latlng: action.payload.latlng
            }
          }
        })
      };
    case 'REMOVE_WAYPOINT':
      return {
        ...state,
        waypoints: state.waypoints.filter(w => w.id !== action.payload)
      };
    case 'REARRANGE_WAYPOINTS':
      const { oldIndex, newIndex } = action.payload;

      return {
        ...state,
        waypoints: immutablySwapItems(state.waypoints, oldIndex, newIndex)
      };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // https://reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down
  return <AppContext.Provider value={[state, dispatch]}>
    <Styles.Global/>
    <Styles.Container>
      <Sidebar/>
      <Map/>
    </Styles.Container>
  </AppContext.Provider>;
}