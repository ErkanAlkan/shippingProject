import express from "express";
import { getOriginDestination } from "./controllers/originDestinationController";
import { getConnectorConnector } from "./controllers/connectorConnectorController";
import { getOriginConnector } from "./controllers/originConnectorController";

const router = express.Router();

interface Point {
  longitude: string;
  latitude: string;
  cumulative_dist?: string;
  path_len: string;
  point_type: string;
  move_time: number;
  destination: string;
  partial_dist: string;
  origin: string;
}

const reverseLegWithPartialDistShift = (legData: Point[]): Point[] => {
  if (legData.length === 0) return [];

  const reversedLeg = [...legData].reverse();

  if (reversedLeg.length <= 1) return reversedLeg;

  const lastPartialDist = reversedLeg[0]?.partial_dist ?? "0";

  const adjustedLeg = reversedLeg.map((point, index) => {
    if (index === 0) {
      return {
        ...point,
        partial_dist: lastPartialDist,
      };
    }
    return {
      ...point,
      partial_dist: reversedLeg[index - 1]?.partial_dist ?? "0",
    };
  });

  const swappedLeg = adjustedLeg.map((point, index) => {
    if (index === 0) {
      return {
        ...point,
        origin: point.destination,
        destination: point.origin,
      };
    }
    return {
      ...point,
      origin: point.destination,
      destination: point.origin,
    };
  });

  return swappedLeg.slice(1);
};

const formatPointData = (point: any): Point => ({
  longitude: point.longitude ? point.longitude.toString() : "",
  latitude: point.latitude ? point.latitude.toString() : "",
  cumulative_dist: point.cumulative_dist ? point.cumulative_dist.toString() : "0",
  path_len: point.path_len ? point.path_len.toString() : "0",
  point_type: point.point_type ?? "p",
  move_time: point.move_time ?? 0,
  destination: point.destination ?? "",
  partial_dist: point.partial_dist ? point.partial_dist.toString() : "0",
  origin: point.origin ?? "",
});

const accumulateDistance = (legData: any[], startingCumulativeDist = 0): Point[] => {
  let cumulativeDist = startingCumulativeDist;

  return legData
    .map((point, index) => {
      const formattedPoint = formatPointData(point);
      const partialDist = parseFloat(formattedPoint.partial_dist);

      if (
        index > 0 &&
        formattedPoint.latitude === legData[index - 1]?.latitude &&
        formattedPoint.longitude === legData[index - 1]?.longitude
      ) {
        return null;
      }

      cumulativeDist += partialDist;
      formattedPoint.cumulative_dist = cumulativeDist.toFixed(2);

      return formattedPoint;
    })
    .filter((point) => point !== null) as Point[];
};

router.post("/get-route", async (req, res) => {
  const { origin, destination, middlePoints = [] } = req.body;

  try {
    let routeData: Point[] = [];

    if (middlePoints.length === 0) {
      let route = await getOriginDestination(origin, destination);
      routeData = accumulateDistance(route);
    } else if (middlePoints.length === 1) {
      let firstLeg = (await getOriginConnector(origin, middlePoints[0])).map(formatPointData);
      let secondLeg = (await getOriginConnector(destination, middlePoints[0])).map(formatPointData);

      let reversedSecondLeg = reverseLegWithPartialDistShift(secondLeg);

      const firstLegAccumulated = accumulateDistance(firstLeg);
      const cumulativeDist =
        firstLegAccumulated.length > 0
          ? Number(firstLegAccumulated[firstLegAccumulated.length - 1]?.cumulative_dist ?? 0)
          : 0;

      routeData = [...firstLegAccumulated, ...accumulateDistance(reversedSecondLeg, cumulativeDist)];
    } else if (middlePoints.length === 2) {
      let firstLeg = (await getOriginConnector(origin, middlePoints[0])).map(formatPointData);
      let secondLeg = (await getConnectorConnector(middlePoints[0], middlePoints[1])).map(formatPointData);

      if (secondLeg.length === 0) {
        secondLeg = (await getConnectorConnector(middlePoints[1], middlePoints[0])).map(formatPointData);
        if (secondLeg.length > 0) {
          secondLeg.reverse();
        }
      }

      let thirdLeg = (await getOriginConnector(destination, middlePoints[1])).map(formatPointData);

      let reversedThirdLeg = reverseLegWithPartialDistShift(thirdLeg);

      const firstLegAccumulated = accumulateDistance(firstLeg);
      const cumulativeDistFirstLeg =
        firstLegAccumulated.length > 0
          ? Number(firstLegAccumulated[firstLegAccumulated.length - 1]?.cumulative_dist ?? 0)
          : 0;

      const secondLegAccumulated = accumulateDistance(secondLeg, cumulativeDistFirstLeg);
      const cumulativeDistSecondLeg =
        secondLegAccumulated.length > 0
          ? Number(secondLegAccumulated[secondLegAccumulated.length - 1]?.cumulative_dist ?? 0)
          : cumulativeDistFirstLeg;

      const thirdLegAccumulated = accumulateDistance(reversedThirdLeg, cumulativeDistSecondLeg);

      routeData = [...firstLegAccumulated, ...secondLegAccumulated, ...thirdLegAccumulated];
    }

    console.log("Final route data with cumulative distances:", JSON.stringify(routeData, null, 2));

    res.json(routeData);
  } catch (error) {
    console.error("Error fetching route data:", error);
    res.status(500).json({ error: "An error occurred while fetching the route data." });
  }
});

export default router;
