import * as turf from "@turf/turf";

export const checkIntersectionBetweenLines = (routeData: any, trackedData: any) => {

  const routeLine = turf.lineString(routeData);

  const trackedLine = turf.lineString(trackedData);

  const intersects = turf.lineIntersect(routeLine, trackedLine);

  if (intersects.features.length > 0) {
    if (intersects.features.length === 1) {
      let theIntersection = intersects.features[0].geometry.coordinates;
      return [theIntersection[0], theIntersection[1]] as [number, number];
    }
    const lineOrArea = turf.lineString(intersects.features.map((f) => f.geometry.coordinates));
    const centroid = turf.centroid(lineOrArea);
    const theCoordinates = centroid.geometry.coordinates;
    return [theCoordinates[0], theCoordinates[1]] as [number, number];
  } else {
    console.log("no intersection between lines");
  }

  return null;
};
