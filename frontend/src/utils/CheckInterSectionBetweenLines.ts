import * as turf from '@turf/turf';

export const checkIntersectionBetweenLines = (routeData: any, trackedData: any) => {
  
    console.log("checkIntersectionBetweenLines ~ trackedData:", trackedData);
    console.log("checkIntersectionBetweenLines ~ routeData:", routeData);

  const trackedLine = turf.lineString(trackedData);

  const routeLine = turf.lineString(routeData);

  return turf.booleanIntersects(routeLine, trackedLine);
};