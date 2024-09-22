//carbonRoutes.ts

import express from "express";
import {
  vesselStats,
  calculateSpeed,
  calculateTime,
  calculateTimeDifference,
  VesselVariable,
  getEmissionsAndPowerForSpeed,
} from "./Calculations/Calculations";
const router = express.Router();

const app = express();
app.use(express.json());

interface Vessel {
  id: string;
  imo: number;
  name: string;
  design_speed: number | null;
  max_draft_level: number;
  light_ship_weight: number | null;
  deadweight: number;
  hotel_load: number;
  hotel_load_type: string;
  tonnage_per_centimeter: number;
  length_of_vessel: number;
  beam_of_vessel: number;
  vesselVariables: VesselVariable[];
}

function countLadenOrBallast(vessel: Vessel): {
  totalLadenAndBalast: number;
  ladenCount: number;
  ballastCount: number;
} {
  if (!vessel || !vessel.vesselVariables) {
    return { totalLadenAndBalast: 0, ladenCount: 0, ballastCount: 0 };
  }

  let totalLadenAndBalast = 0;
  let ladenCount = 0;
  let ballastCount = 0;

  vessel.vesselVariables.forEach((item: VesselVariable) => {
    if (item.laden_or_ballast !== null && item.laden_or_ballast !== undefined) {
      totalLadenAndBalast++;
      if (item.laden_or_ballast === "Laden") {
        ladenCount++;
      } else if (item.laden_or_ballast === "Ballast") {
        ballastCount++;
      }
    }
  });

  return { totalLadenAndBalast, ladenCount, ballastCount };
}

router.post("/calculate-stats", async (req, res) => {
  try {
    let { inputType, arrivalDate, departureDate, averageSpeed, totalTime, vessel, totalDistance, draftLevel } =
      req.body;

    const stats = await vesselStats(vessel, 1, 10);
    const vesselLength = stats.length_of_vessel;
    const vesselWidth = stats.beam_of_vessel;
    const maxDraftLevel = stats.max_draft_level;

    let tableContent1;

    if (inputType === 0) {
      tableContent1 = calculateSpeed(totalTime, totalDistance, departureDate, arrivalDate);
    } else if (inputType === 1) {
      tableContent1 = calculateTime(averageSpeed, totalDistance, departureDate, arrivalDate);
    } else if (inputType === 2) {
      tableContent1 = calculateTimeDifference(totalDistance, departureDate, arrivalDate);
    }

    if (tableContent1) {
      tableContent1.totalTime = Math.round(tableContent1.totalTime * 10) / 10;
      tableContent1.averageSpeed = Math.round(tableContent1.averageSpeed * 100) / 100;
      tableContent1.totalDistance = Math.round(tableContent1.totalDistance);
      totalTime = tableContent1.totalTime;
      const clientSpeed = tableContent1?.averageSpeed;
      arrivalDate = null;
      departureDate = null;

      const { totalLadenAndBalast, ballastCount, ladenCount } = countLadenOrBallast(stats);

      const tableContent2 = getEmissionsAndPowerForSpeed(
        stats,
        clientSpeed,
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        totalLadenAndBalast,
        ladenCount,
        ballastCount,
        totalTime
      );

      const speedPlus1 = tableContent1?.averageSpeed + 1;
      const speedPlus2 = tableContent1?.averageSpeed + 2;
      const speedMinus1 = tableContent1?.averageSpeed - 1;
      const speedMinus2 = tableContent1?.averageSpeed - 2;

      let tableContent1SpeedPlus1 = calculateTime(speedPlus1, totalDistance, departureDate, arrivalDate);
      tableContent1SpeedPlus1.totalTime = Math.round(tableContent1SpeedPlus1.totalTime * 10) / 10;
      tableContent1SpeedPlus1.averageSpeed = Math.round(tableContent1SpeedPlus1.averageSpeed * 100) / 100;
      tableContent1SpeedPlus1.totalDistance = Math.round(tableContent1SpeedPlus1.totalDistance);

      let tableContent1SpeedPlus2 = calculateTime(speedPlus2, totalDistance, departureDate, arrivalDate);
      tableContent1SpeedPlus2.totalTime = Math.round(tableContent1SpeedPlus2.totalTime * 10) / 10;
      tableContent1SpeedPlus2.averageSpeed = Math.round(tableContent1SpeedPlus2.averageSpeed * 100) / 100;
      tableContent1SpeedPlus2.totalDistance = Math.round(tableContent1SpeedPlus2.totalDistance);

      let tableContent1SpeedMinus1 = calculateTime(speedMinus1, totalDistance, departureDate, arrivalDate);
      tableContent1SpeedMinus1.totalTime = Math.round(tableContent1SpeedMinus1.totalTime * 10) / 10;
      tableContent1SpeedMinus1.averageSpeed = Math.round(tableContent1SpeedMinus1.averageSpeed * 100) / 100;
      tableContent1SpeedMinus1.totalDistance = Math.round(tableContent1SpeedMinus1.totalDistance);

      let tableContent1SpeedMinus2 = calculateTime(speedMinus2, totalDistance, departureDate, arrivalDate);
      tableContent1SpeedMinus2.totalTime = Math.round(tableContent1SpeedMinus2.totalTime * 10) / 10;
      tableContent1SpeedMinus2.averageSpeed = Math.round(tableContent1SpeedMinus2.averageSpeed * 100) / 100;
      tableContent1SpeedMinus2.totalDistance = Math.round(tableContent1SpeedMinus2.totalDistance);

      totalTime = tableContent1SpeedPlus1.totalTime;
      const tableContent2SpeedPlus1 = getEmissionsAndPowerForSpeed(
        stats,
        speedPlus1,
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        totalLadenAndBalast,
        ladenCount,
        ballastCount,
        totalTime
      );
      totalTime = tableContent1SpeedPlus2.totalTime;
      const tableContent2SpeedPlus2 = getEmissionsAndPowerForSpeed(
        stats,
        speedPlus2,
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        totalLadenAndBalast,
        ladenCount,
        ballastCount,
        totalTime
      );
      totalTime = tableContent1SpeedMinus1.totalTime;
      const tableContent2SpeedMinus1 = getEmissionsAndPowerForSpeed(
        stats,
        speedMinus1,
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        totalLadenAndBalast,
        ladenCount,
        ballastCount,
        totalTime
      );

      totalTime = tableContent1SpeedMinus2.totalTime;
      const tableContent2SpeedMinus2 = getEmissionsAndPowerForSpeed(
        stats,
        speedMinus2,
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        totalLadenAndBalast,
        ladenCount,
        ballastCount,
        totalTime
      );

      const combinedContent = [
        {
          speed: speedMinus2,
          ...tableContent1SpeedMinus2,
          ...tableContent2SpeedMinus2,
        },
          
        {
          speed: speedMinus1,
          ...tableContent1SpeedMinus1,
          ...tableContent2SpeedMinus1,
        },
          
        {
          speed: tableContent1.averageSpeed,
          ...tableContent1,
          ...tableContent2,
        },
          
        {
          speed: speedPlus1,
          ...tableContent1SpeedPlus1,
          ...tableContent2SpeedPlus1,
        },
          
        {
          speed: speedPlus2,
          ...tableContent1SpeedPlus2,
          ...tableContent2SpeedPlus2,
        },
          
      ];
      const result = {
        message: "Data processed successfully",
        combinedContent,
      };

      return res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
