import * as turf from "@turf/turf";
import { LatLngTuple } from "leaflet";

export const checkIntersectionBetweenLineAndPolygon = (routeData: LatLngTuple[], forecastConeData: any) => {
  function swapCoordinates(data: [number, number][]): [number, number][] {
    return data.map((coordinate: [number, number]) => {
      const [lat, lon] = coordinate;
      return [lon, lat];
    });
  }

  function swapSingleCoordinate(coordinate: [number, number]): [number, number] {
    const [lat, lon] = coordinate;
    return [lon, lat];
  }

  const swappedRouteData = swapCoordinates(routeData as [number, number][]);
  const forecastPolygon = turf.polygon(forecastConeData);
  const routeLine = turf.lineString(swappedRouteData);
  const intersection = turf.lineIntersect(routeLine, forecastPolygon);

  if (intersection.features.length > 0) {
    if (intersection.features.length === 1) {
      let theIntersection = intersection.features[0].geometry.coordinates as [number, number];
      theIntersection = swapSingleCoordinate(theIntersection);
      return theIntersection;
    }

    const lineOrArea = turf.lineString(intersection.features.map((f) => f.geometry.coordinates));
    const centroid = turf.centroid(lineOrArea);
    let theCoordinates = centroid.geometry.coordinates as [number, number];
    theCoordinates = swapSingleCoordinate(theCoordinates);

    return theCoordinates;
  }

  return null;
};
