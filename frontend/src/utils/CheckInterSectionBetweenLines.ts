import * as turf from '@turf/turf';

export const checkIntersectionBetweenLines = (
  routeData: [number, number][], 
  trackedData: [number, number][]
) => {
  const trackedLine = turf.lineString(trackedData);
  const routeLine = turf.lineString(routeData);

  const intersection = turf.lineIntersect(routeLine, trackedLine);

  if (intersection.features.length > 0) {
    if (intersection.features.length === 1) {
      return intersection.features[0].geometry.coordinates as [number, number];
    }

    const lineOrArea = turf.lineString(intersection.features.map(f => f.geometry.coordinates));
    const centroid = turf.centroid(lineOrArea);
    return centroid.geometry.coordinates as [number, number];
  }

  return null;
};
