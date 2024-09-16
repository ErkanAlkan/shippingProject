//carbonRoutes.ts

import express from "express";
import {
  calculateWettedHullExponent,
  calculateSpeedExponent,
  powerRequired,
  powerRequiredModified,
  carbonEmission,
  findClosestSpeeds,
  vesselStats,
  calculateSpeed,
  calculateTime,
  calculateTimeDifference,
  emissionFactors,
  VesselVariable,
} from "./Calculations/Calculations";
import { table } from "console";
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
    console.log("router.post ~ vesselLength:", vesselLength);
    console.log("router.post ~ vesselLength:", typeof vesselLength);
    const vesselWidth = stats.beam_of_vessel;
    const maxDraftLevel = stats.max_draft_level;
    let wettedHullExponent;
    let speedExponent;

    let tableContent1;
    let tableContent2;

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
    }
    console.log("router.post ~ tableContent1:", tableContent1);
    const clientSpeed = tableContent1?.averageSpeed;

    const { totalLadenAndBalast, ballastCount, ladenCount } = countLadenOrBallast(stats);

    const calculateEmissionsAndPower = (
      vesselVariables: VesselVariable[],
      clientSpeed: number,
      state: "Laden" | "Ballast",
      draftLevel: number,
      vesselLength: number,
      vesselWidth: number,
      maxDraftLevel: number,
      stats: any
    ) => {
      const { closest, secondClosest } = findClosestSpeeds(vesselVariables, clientSpeed, state);

      const closestSpeed = closest?.speed?.current_vessel_speed ?? null;
      const closestFuelUsage1 = closest?.fuel_usage_main_1 ?? null;
      console.log("router.post ~ closestFuelUsage1First:", closestFuelUsage1);
      console.log("router.post ~ closestFuelUsage1First:", typeof closestFuelUsage1);
      let closestFuelUsage1Type = closest?.fuel_usage_main_1_type ?? null;
      const closestFuelUsage2 = closest?.fuel_usage_main_2 ?? null;

      let closestFuelUsage2Type = closest?.fuel_usage_main_2_type ?? null;

      const secondClosestSpeed = secondClosest?.speed?.current_vessel_speed ?? null;
      const secondClosestFuelUsage1 = secondClosest?.fuel_usage_main_1 ?? null;
      let secondClosestFuelUsage1Type = secondClosest?.fuel_usage_main_1_type ?? null;
      const secondClosestFuelUsage2 = secondClosest?.fuel_usage_main_2 ?? null;
      let secondClosestFuelUsage2Type = secondClosest?.fuel_usage_main_2_type ?? null;

      const wettedHullExponent = calculateWettedHullExponent(vesselLength, vesselWidth, draftLevel, maxDraftLevel);

      if (
        closestSpeed !== null &&
        closestFuelUsage1 !== null &&
        secondClosestSpeed !== null &&
        secondClosestFuelUsage1 !== null
      ) {
        const speedExponent = calculateSpeedExponent(
          closestSpeed as number,
          secondClosestSpeed as number,
          closestFuelUsage1 as number,
          secondClosestFuelUsage1 as number
        );

        let lightShipWeight;
        const maxVesselWeight = stats.tonnage_per_centimeter * stats.max_draft_level * 100;

        if (stats.light_ship_weight) {
          lightShipWeight = stats.light_ship_weight;
        } else if (stats.tonnage_per_centimeter && stats.max_draft_level && stats.deadweight) {
          lightShipWeight = maxVesselWeight - stats.deadweight;
        }

        const currentVesselWeight = stats.tonnage_per_centimeter * draftLevel * 100;
        const mainCalculatedPower = powerRequiredModified(
          closestSpeed,
          closestFuelUsage1,
          clientSpeed,
          maxVesselWeight,
          currentVesselWeight,
          wettedHullExponent,
          speedExponent
        );

        let calculatedPower = mainCalculatedPower * totalTime;
        let calculatedEmission = 0;
        let secondaryPower = 0;

        if (closestFuelUsage1Type) {
          closestFuelUsage1Type = closestFuelUsage1Type.toLowerCase();
          calculatedEmission = carbonEmission(closestFuelUsage1Type, calculatedPower);
          console.log("router.post ~ calculatedEmission:", calculatedEmission);
        }

        if (closestFuelUsage2 && closestFuelUsage2Type) {
          secondaryPower += Number(closestFuelUsage2 * totalTime);
          closestFuelUsage2Type = closestFuelUsage2Type.toLowerCase();
          const secondaryFuelEmission = carbonEmission(closestFuelUsage2Type, closestFuelUsage2);
          console.log("router.post ~ secondaryFuelEmission:", secondaryFuelEmission);
          calculatedEmission += secondaryFuelEmission;
        }
        return {
          calculatedPower: Math.round(calculatedPower * 100) / 100,
          calculatedEmission: Math.round(calculatedEmission * 100) / 100,
          secondaryPower: Math.round(secondaryPower * 100) / 100,
        };
      }

      return {
        calculatedPower: 0,
        calculatedEmission: 0,
        secondaryPower: 0,
      };
    };

    if (totalLadenAndBalast > 1) {
      const draftPerCent = (draftLevel / maxDraftLevel) * 100;

      if (draftPerCent >= 75 && ladenCount > 1 && clientSpeed) {
        tableContent2 = calculateEmissionsAndPower(
          stats.vesselVariables,
          clientSpeed,
          "Laden",
          draftLevel,
          vesselLength,
          vesselWidth,
          maxDraftLevel,
          stats
        );
      } else if (draftPerCent < 75 && ballastCount > 1 && clientSpeed) {
        tableContent2 = calculateEmissionsAndPower(
          stats.vesselVariables,
          clientSpeed,
          "Ballast",
          draftLevel,
          vesselLength,
          vesselWidth,
          maxDraftLevel,
          stats
        );
      } else if (ladenCount > 1 && clientSpeed) {
        tableContent2 = calculateEmissionsAndPower(
          stats.vesselVariables,
          clientSpeed,
          "Laden",
          draftLevel,
          vesselLength,
          vesselWidth,
          maxDraftLevel,
          stats
        );
      } else if (ballastCount > 1 && clientSpeed) {
        tableContent2 = calculateEmissionsAndPower(
          stats.vesselVariables,
          clientSpeed,
          "Ballast",
          draftLevel,
          vesselLength,
          vesselWidth,
          maxDraftLevel,
          stats
        );
      }
    }
    const combinedContent = {
      ...tableContent1,
      ...tableContent2,
    };
    const result = {
      message: "Data processed successfully",
      combinedContent,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error processing the request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
