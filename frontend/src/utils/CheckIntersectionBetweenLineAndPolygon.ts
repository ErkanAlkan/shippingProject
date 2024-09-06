import * as turf from '@turf/turf';

export const checkIntersectionBetweenLineAndPolygon = (routeData: any, forecastConeData: any) => {
  console.log("checkIntersectionBetweenLineAndPolygon ~ forecastConeData:", forecastConeData);
  console.log("checkIntersectionBetweenLineAndPolygon ~ routeData:", routeData);

  const forecastPolygon = turf.polygon(forecastConeData);

  const routeLine = turf.lineString(routeData);

  return turf.booleanIntersects(routeLine, forecastPolygon);
};