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
  for (let i = 0; i < swappedRouteData.length - 1; i++) {
    const p1 = swappedRouteData[i];
    const p2 = swappedRouteData[i + 1];

    const line = turf.lineString([p1, p2]);

    const intersects = turf.lineIntersect(line, forecastPolygon);

    if (intersects.features.length > 0) {

      if (intersects.features.length === 1) {
        let theIntersection = intersects.features[0].geometry.coordinates as [number, number];
        theIntersection = swapSingleCoordinate(theIntersection);
        return theIntersection;
      }

      const lineOrArea = turf.lineString(intersects.features.map((f) => f.geometry.coordinates));
      const centroid = turf.centroid(lineOrArea);
      let theCoordinates = centroid.geometry.coordinates as [number, number];
      theCoordinates = swapSingleCoordinate(theCoordinates);

      return theCoordinates;
    }else {
      console.log("no intersection between line and polygon");
    }
  }

  return null;
};
