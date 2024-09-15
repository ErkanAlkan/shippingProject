//carbonRoutes.ts

import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

async function calculateVesselStats(shipName: string, page: number, pageSize: number) {
  try {
    const vessel = await prisma.vessel.findFirst({
      where: { name: shipName },
      include: {
        vesselVariables: {
          skip: (page - 1) * pageSize,
          take: pageSize,
        },
      },
    });

    if (!vessel) {
      throw new Error("Vessel not found");
    }

    if (vessel.vesselVariables.length < 2) {
      return {
        vesselName: vessel.name,
        totalFuelUsage: "0.00",
        averageSpeed: "0.00",
        totalTime: "0.00",
        averageDraftLevel: "0.00",
        message: "Not enough data found to process the calculations",
      };
    }

    // // Perform calculations: total fuel usage, average speed, average draft level
    // const totalFuelUsage = vessel.vesselVariables.reduce(
    //   (acc, curr) => acc + parseFloat(curr.total_fuel_usage.toString()),
    //   0
    // );
    // const averageSpeed =
    //   vessel.vesselVariables.reduce((acc, curr) => acc + parseFloat(curr.current_vessel_speed.toString()), 0) /
    //   vessel.vesselVariables.length;
    // const averageDraftLevel =
    //   vessel.vesselVariables.reduce((acc, curr) => acc + parseFloat(curr.current_draft_level.toString()), 0) /
    //   vessel.vesselVariables.length;

    // return {
    //   vesselName: vessel.name,
    //   totalFuelUsage: totalFuelUsage.toFixed(2),
    //   averageSpeed: averageSpeed.toFixed(2),
    //   averageDraftLevel: averageDraftLevel.toFixed(2),
    //   page: page,
    //   pageSize: pageSize,
    //   totalVariables: vessel.vesselVariables.length,
    // };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function calculateTimeDifference(
  inputType: number,
  totalDistance: number,
  departureDate: Date | null,
  arrivalDate: Date | null
) {
  let averageSpeed;
  if (inputType === 2) {
    if (departureDate === null || arrivalDate === null) {
      throw new Error("Both departureDate and arrivalDate must be provided for inputType 2.");
    }

    const requiredTimeInMilliseconds = arrivalDate.getTime() - departureDate.getTime();
    const requiredTimeInMinutes = requiredTimeInMilliseconds / (1000 * 60);
    const requiredTimeInHours = requiredTimeInMinutes / 60;
    const totalTime = requiredTimeInHours / 24;

    averageSpeed = totalDistance / requiredTimeInHours;
    return { departureDate, arrivalDate, totalTime, averageSpeed };
  }
}

function calculateTime(
  inputType: number,
  averageSpeed: number,
  totalDistance: number,
  departureDate: Date | null,
  arrivalDate: Date | null
) {
  const totalTime = totalDistance / averageSpeed;

  if (inputType === 1 && departureDate !== null && arrivalDate === null) {
    let arrivalDateInMilliseconds = departureDate.getTime() + totalTime * 60 * 60 * 1000;
    arrivalDate = new Date(arrivalDateInMilliseconds);

    console.log("arrivalDate: ", arrivalDate);
  } else if (inputType === 1 && departureDate === null && arrivalDate !== null) {
    let departureDateInMilliseconds = arrivalDate.getTime() - totalTime * 60 * 60 * 1000;
    departureDate = new Date(departureDateInMilliseconds);
  }

  return { departureDate, arrivalDate, totalTime, averageSpeed };
}

function calculateSpeed(
  inputType: number,
  totalTime: number,
  totalDistance: number,
  departureDate: Date | null,
  arrivalDate: Date | null
) {
  const averageSpeed = totalDistance / (totalTime * 60);

  if (inputType === 0 && departureDate !== null && arrivalDate === null) {
    let arrivalDateInMilliseconds = departureDate.getTime() + totalTime * 24 * 60 * 1000;
    arrivalDate = new Date(arrivalDateInMilliseconds);

    console.log("arrivalDate: ", arrivalDate);
  } else if (inputType === 0 && departureDate === null && arrivalDate !== null) {
    let departureDateInMilliseconds = arrivalDate.getTime() - totalTime * 24 * 60 * 1000;
    departureDate = new Date(departureDateInMilliseconds);
  }

  return { departureDate, arrivalDate, totalTime, averageSpeed };
}

router.post("/get-route", async (req, res) => {
  
});
