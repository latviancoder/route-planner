import React, { useEffect } from 'react';
import { useAppContext } from '../../App';
import * as Styles from './waypointList.styles';

// Suuper basic Sortable component I've built several months ago
// https://github.com/latviancoder/hooks-by-example/tree/master/src/components/sortable
import Sortable, { useSortableElement, useSortableContext } from '../../misc/Sortable';

function WaypointsListSortable() {
  const [state, dispatch] = useAppContext();
  const { isDragging, oldIndex, newIndex } = useSortableContext();

  useEffect(() => {
    // When dragging has ended and had results
    if (isDragging === false && oldIndex !== newIndex && newIndex !== undefined) {
      dispatch({ type: 'REARRANGE_WAYPOINTS', payload: { oldIndex, newIndex } })
    }
  }, [isDragging]);

  return <>
    {state.waypoints.map((waypoint, index) => (
      <Waypoint
        key={waypoint.id}
        index={index}
        {...waypoint}
      />
    ))}
  </>;
}

function Waypoint({ id, index }) {
  const [_, dispatch] = useAppContext();

  return <Styles.Waypoint {...useSortableElement()}>
    Waypoint {index + 1}
    <i
      className="fa fa-trash-o"
      onClick={(e) => {
        e.stopPropagation();
        dispatch({ type: 'REMOVE_WAYPOINT', payload: id })
      }}
    />
  </Styles.Waypoint>;
}

export default function WaypointsList() {
  return <Sortable>
    <WaypointsListSortable/>
  </Sortable>;
}