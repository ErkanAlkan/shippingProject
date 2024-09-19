// calculations.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface VesselVariable {
  id: string;
  current_vessel_speed: number;
  current_draft_level: number | null;
  imo: number;
  fuel_usage_main_1: number;
  fuel_usage_main_1_type: string;
  fuel_usage_main_2: number | null; // This can be null, so make sure to handle it correctly.
  fuel_usage_main_2_type: string | null;
  hotel_load: number | null;
  hotel_load_type: string | null;
  laden_or_ballast: "Laden" | "Ballast" | null;
}
// Function to calculate the wetted hull area exponent
// L = Length of ship
// B = Beam of ship(width)
// D1 = Draft level 1
// D2 = Draft level 2
export const calculateWettedHullExponent = (L: number, B: number, D1: number, D2: number): number => {
  if (L <= 0 || B <= 0 || D1 <= 0 || D2 <= 0) {
    throw new Error("All inputs must be positive numbers greater than zero.");
  }

  const S1: number = 2 * (L * D1) + 2 * (B * D1) + L * B;
  const S2: number = 2 * (L * D2) + 2 * (B * D2) + L * B;

  const V1: number = L * B * D1;
  const V2: number = L * B * D2;

  const n: number = Math.log(S2 / S1) / Math.log(V2 / V1);

  // Apply empirical adjustment
  const adjustedN: number = Math.min(Math.max(n, 0.65), 0.85);

  return n;
};

// Function to calculate the speed exponent
export const calculateSpeedExponent = (V1: number, V2: number, P1: number, P2: number): number => {
  console.log("calculateSpeedExponent ~ P2:", P2);
  console.log("calculateSpeedExponent ~ P1:", P1);
  console.log("calculateSpeedExponent ~ V2:", V2);
  console.log("calculateSpeedExponent ~ V1:", V1);
  if (V1 <= 0 || V2 <= 0 || P1 <= 0 || P2 <= 0) {
    throw new Error("All inputs must be positive numbers greater than zero.");
  }

  const n: number = Math.log(P2 / P1) / Math.log(V2 / V1);
  console.log("calculateSpeedExponent ~ n:", n);
  return n;
};

// Function to calculate power required using two data points. This returns pNew
export const powerRequired = (
  vRef: number, // reference speed
  pRef: number, // reference power
  vNew: number, // new speed
  speedExponent: number // speed exponent
): number => {
  return pRef * Math.pow(vNew / vRef, speedExponent);
};

// Function to calculate power required using the modified formula. This returns pNew
export const powerRequiredModified = (
  vRef: number, // reference speed
  pRef: number, // reference power
  vNew: number, // new speed
  wRef: number, // reference weight/displacement
  wNew: number, // new weight/displacement
  wettedHullExponent: number, // wetted hull area exponent
  speedExponent: number // speed exponent
): number => {
  console.log("speedExponent:", speedExponent);
  console.log("wettedHullExponent:", wettedHullExponent);
  console.log("wNew:", wNew);
  console.log("wRef:", wRef);
  console.log("vNew:", vNew);
  console.log("pRef:", pRef);
  console.log("vRef:", vRef);
  return pRef * Math.pow(wNew / wRef, wettedHullExponent) * Math.pow(vNew / vRef, speedExponent);
};

// Carbon emission calculation function using the exported emission factors
export const carbonEmission = (fuelType: string, fuelRequired: number): number => {
  const normalizedFuelType = fuelType.toLowerCase();
  const co2EmissionFactor = emissionFactors[normalizedFuelType];

  if (co2EmissionFactor === undefined) {
    throw new Error(`Invalid fuel type: ${fuelType}. Please provide a valid fuel type.`);
  }

  const co2EmissionsInKg = fuelRequired * co2EmissionFactor;

  const co2EmissionsInTonnes = co2EmissionsInKg / 1000;

  return co2EmissionsInTonnes; // in tonnes of CO2
};

export const vesselStats = async (shipName: string, page: number, pageSize: number): Promise<any> => {
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

    return vessel;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const calculateTimeDifference = (
  totalDistance: number,
  departureDate: Date | string,
  arrivalDate: Date | string
): {
  departureDate: Date;
  arrivalDate: Date;
  totalTime: number;
  averageSpeed: number;
  totalDistance: number;
} => {
  let averageSpeed;

  if (typeof departureDate === "string") {
    departureDate = new Date(departureDate);
  }

  if (typeof arrivalDate === "string") {
    arrivalDate = new Date(arrivalDate);
  }

  const requiredTimeInMilliseconds = arrivalDate.getTime() - departureDate.getTime();
  const requiredTimeInMinutes = requiredTimeInMilliseconds / (1000 * 60);
  const requiredTimeInHours = requiredTimeInMinutes / 60;
  const totalTime = requiredTimeInHours / 24;

  averageSpeed = totalDistance / requiredTimeInHours;
  return { departureDate, arrivalDate, totalTime, averageSpeed, totalDistance };
};

export const calculateTime = (
  averageSpeed: number,
  totalDistance: number,
  departureDate: Date | string | null,
  arrivalDate: Date | string | null
): {
  departureDate: Date | null;
  arrivalDate: Date | null;
  totalTime: number;
  averageSpeed: number;
  totalDistance: number;
} => {
  const totalTime = totalDistance / averageSpeed / 24; // in days

  if (typeof departureDate === "string") {
    departureDate = new Date(departureDate);
  }

  if (typeof arrivalDate === "string") {
    arrivalDate = new Date(arrivalDate);
  }

  if (departureDate !== null && arrivalDate === null) {
    const arrivalDateInMilliseconds = departureDate.getTime() + totalTime * 60 * 60 * 1000 * 24;
    arrivalDate = new Date(arrivalDateInMilliseconds);
  } else if (departureDate === null && arrivalDate !== null) {
    const departureDateInMilliseconds = arrivalDate.getTime() - totalTime * 60 * 60 * 1000 * 24;
    departureDate = new Date(departureDateInMilliseconds);
  }

  return { departureDate, arrivalDate, totalTime, averageSpeed, totalDistance };
};

export const calculateSpeed = (
  totalTime: number,
  totalDistance: number,
  departureDate: Date | string | null,
  arrivalDate: Date | string | null
): {
  departureDate: Date | null;
  arrivalDate: Date | null;
  totalTime: number;
  averageSpeed: number;
  totalDistance: number;
} => {
  const averageSpeed = totalDistance / (totalTime * 60);

  if (typeof departureDate === "string") {
    departureDate = new Date(departureDate);
  }

  if (typeof arrivalDate === "string") {
    arrivalDate = new Date(arrivalDate);
  }

  if (departureDate !== null && arrivalDate === null) {
    const arrivalDateInMilliseconds = departureDate.getTime() + totalTime * 24 * 60 * 1000;
    arrivalDate = new Date(arrivalDateInMilliseconds);
  } else if (departureDate === null && arrivalDate !== null) {
    const departureDateInMilliseconds = arrivalDate.getTime() - totalTime * 24 * 60 * 1000;
    departureDate = new Date(departureDateInMilliseconds);
  }

  return { departureDate, arrivalDate, totalTime, averageSpeed, totalDistance };
};

// Function to find the closest speed based on 'Laden' or 'Ballast' state
interface ClosestSpeedResult {
  closest: {
    speed: VesselVariable | null;
    fuel_usage_main_1: number | null;
    fuel_usage_main_1_type: string | null;
    fuel_usage_main_2: number | null;
    fuel_usage_main_2_type: string | null;
  } | null;
  secondClosest: {
    speed: VesselVariable | null;
    fuel_usage_main_1: number | null;
    fuel_usage_main_1_type: string | null;
    fuel_usage_main_2: number | null;
    fuel_usage_main_2_type: string | null;
  } | null;
}

export const findClosestSpeeds = (
  vesselVariables: VesselVariable[],
  clientSpeed: number,
  state: "Laden" | "Ballast"
): ClosestSpeedResult => {
  const filteredVariables = vesselVariables.filter((variable) => variable.laden_or_ballast === state);

  if (filteredVariables.length === 0) {
    return {
      closest: null,
      secondClosest: null,
    };
  }

  const sortedVariables = filteredVariables.sort((a, b) => {
    const diffA = Math.abs(clientSpeed - a.current_vessel_speed);
    const diffB = Math.abs(clientSpeed - b.current_vessel_speed);
    return diffA - diffB;
  });

  const closest = sortedVariables[0];
  const secondClosest = sortedVariables.length > 1 ? sortedVariables[1] : undefined;

  return {
    closest: {
      speed: closest ?? null,
      fuel_usage_main_1: closest ? closest.fuel_usage_main_1 : null,
      fuel_usage_main_1_type: closest ? closest.fuel_usage_main_1_type : null,
      fuel_usage_main_2: closest ? closest.fuel_usage_main_2 : null,
      fuel_usage_main_2_type: closest ? closest.fuel_usage_main_2_type : null,
    },
    secondClosest: secondClosest
      ? {
          speed: secondClosest ?? null,
          fuel_usage_main_1: secondClosest.fuel_usage_main_1 ?? null,
          fuel_usage_main_1_type: secondClosest.fuel_usage_main_1_type ?? null,
          fuel_usage_main_2: secondClosest.fuel_usage_main_2 ?? null,
          fuel_usage_main_2_type: secondClosest.fuel_usage_main_2_type ?? null,
        }
      : null,
  };
};

export const getEmissionsAndPowerForSpeed = (
  stats: any,
  clientSpeed: number,
  draftLevel: number,
  vesselLength: number,
  vesselWidth: number,
  maxDraftLevel: number,
  totalLadenAndBalast: number,
  ladenCount: number,
  ballastCount: number,
  totalTime: any
) => {
  if (totalLadenAndBalast > 1) {
    const draftPerCent = (draftLevel / maxDraftLevel) * 100;

    if (draftPerCent >= 75 && ladenCount > 1) {
      return calculateEmissionsAndPower(
        stats.vesselVariables,
        clientSpeed,
        "Laden",
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        stats,
        totalTime
      );
    } else if (draftPerCent < 75 && ballastCount > 1) {
      return calculateEmissionsAndPower(
        stats.vesselVariables,
        clientSpeed,
        "Ballast",
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        stats,
        totalTime
      );
    } else if (ladenCount > 1) {
      return calculateEmissionsAndPower(
        stats.vesselVariables,
        clientSpeed,
        "Laden",
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        stats,
        totalTime
      );
    } else if (ballastCount > 1) {
      return calculateEmissionsAndPower(
        stats.vesselVariables,
        clientSpeed,
        "Ballast",
        draftLevel,
        vesselLength,
        vesselWidth,
        maxDraftLevel,
        stats,
        totalTime
      );
    }
  }

  return null;
};

export const calculateEmissionsAndPower = (
  vesselVariables: VesselVariable[],
  clientSpeed: number,
  state: "Laden" | "Ballast",
  draftLevel: number,
  vesselLength: number,
  vesselWidth: number,
  maxDraftLevel: number,
  stats: any,
  totalTime: any
) => {
  const { closest, secondClosest } = findClosestSpeeds(vesselVariables, clientSpeed, state);

  const closestSpeed = closest?.speed?.current_vessel_speed ?? null;
  const closestFuelUsage1 = closest?.fuel_usage_main_1 ?? null;
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
    let referenceWeight: number;
    const maxVesselWeight = stats.tonnage_per_centimeter * stats.max_draft_level * 100;
    const ballastWeight = maxVesselWeight / 2;

    if (state === "Laden") {
      referenceWeight = maxVesselWeight;
    } else {
      referenceWeight = ballastWeight;
    }

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
      referenceWeight,
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
    }

    if (closestFuelUsage2 && closestFuelUsage2Type) {
      secondaryPower += Number(closestFuelUsage2 * totalTime);
      closestFuelUsage2Type = closestFuelUsage2Type.toLowerCase();
      const secondaryFuelEmission = carbonEmission(closestFuelUsage2Type, closestFuelUsage2);
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

export const emissionFactors: Record<string, number> = {
  diesel: 3206, // kg CO2 per tonne of diesel
  heavy_fuel_oil: 3114, // kg CO2 per tonne of heavy fuel oil
  lng: 2750, // kg CO2 per tonne of LNG
  marine_gas_oil: 3206, // kg CO2 per tonne of marine gas oil
  methanol: 1375, // kg CO2 per tonne of methanol
  hydrogen: 0, // kg CO2 per tonne of hydrogen (assuming green hydrogen)
  vlsfo_380_cst: 3114, // kg CO2 per tonne of VLSFO 380 CST
  vlsfo_380: 3114,
  vlshfo_380: 3114,
  lsmgo: 3206,
  lsifo_380: 3151, // kg CO2 per tonne of LSMGO
};
