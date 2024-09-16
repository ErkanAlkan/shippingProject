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
  console.log("calculateWettedHullExponent ~ n:", n);

  // Apply empirical adjustment, assuming a more realistic ship-like hull form
  const adjustedN: number = Math.min(Math.max(n, 0.65), 0.85);
  console.log("calculateWettedHullExponent ~ adjustedN:", adjustedN);

  return adjustedN;
};

// Function to calculate the speed exponent
export const calculateSpeedExponent = (V1: number, V2: number, P1: number, P2: number): number => {
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

export const emissionFactors: Record<string, number> = {
  diesel: 3206, // kg CO2 per tonne of diesel
  heavy_fuel_oil: 3114, // kg CO2 per tonne of heavy fuel oil
  lng: 2750, // kg CO2 per tonne of LNG
  marine_gas_oil: 3206, // kg CO2 per tonne of marine gas oil
  methanol: 1375, // kg CO2 per tonne of methanol
  hydrogen: 0, // kg CO2 per tonne of hydrogen (assuming green hydrogen)
  vlsfo_380_cst: 3114, // kg CO2 per tonne of VLSFO 380 CST
  lsmgo: 3206,
  lsifo_380: 3151, // kg CO2 per tonne of LSMGO
  // Add more fuels as needed
};

// Carbon emission calculation function using the exported emission factors
export const carbonEmission = (fuelType: string, fuelRequired: number): number => {
  // Normalize fuel type and get CO2 emission factor
  const normalizedFuelType = fuelType.toLowerCase();
  const co2EmissionFactor = emissionFactors[normalizedFuelType];

  // Ensure the fuel type exists and is valid
  if (co2EmissionFactor === undefined) {
    throw new Error(`Invalid fuel type: ${fuelType}. Please provide a valid fuel type.`);
  }

  // Calculate CO2 emissions (in kg)
  const co2EmissionsInKg = fuelRequired * co2EmissionFactor;

  // Convert CO2 emissions to tonnes (1 tonne = 1000 kg)
  const co2EmissionsInTonnes = co2EmissionsInKg / 1000;

  console.log("carbonEmission ~ CO2 Emissions (tonnes):", co2EmissionsInTonnes);

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
    console.log("vesselStats ~ vessel:", vessel);

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

// Exporting calculateTimeDifference function
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

  // Convert departureDate and arrivalDate to Date if they are strings
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

// Exporting calculateTime function
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
  const totalTime = totalDistance / averageSpeed /24; // in days

  if (typeof departureDate === "string") {
    departureDate = new Date(departureDate);
  }

  if (typeof arrivalDate === "string") {
    arrivalDate = new Date(arrivalDate);
  }

  if (departureDate !== null && arrivalDate === null) {
    const arrivalDateInMilliseconds = departureDate.getTime() + totalTime * 60 * 60 * 1000 *24;
    arrivalDate = new Date(arrivalDateInMilliseconds);
  } else if (departureDate === null && arrivalDate !== null) {
    const departureDateInMilliseconds = arrivalDate.getTime() - totalTime * 60 * 60 * 1000 *24;
    departureDate = new Date(departureDateInMilliseconds);
  }

  return { departureDate, arrivalDate, totalTime, averageSpeed, totalDistance };
};

// Exporting calculateSpeed function
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
  state: 'Laden' | 'Ballast'
): ClosestSpeedResult => {
  // Step 1: Filter vesselVariables where laden_or_ballast matches the desired state
  const filteredVariables = vesselVariables.filter(
    (variable) => variable.laden_or_ballast === state
  );

  // Step 2: If no entries matching the state are found, return null for both closest and second closest
  if (filteredVariables.length === 0) {
    return {
      closest: null,
      secondClosest: null
    };
  }

  // Step 3: Sort the filteredVariables by the absolute difference to clientSpeed
  const sortedVariables = filteredVariables.sort((a, b) => {
    const diffA = Math.abs(clientSpeed - a.current_vessel_speed);
    const diffB = Math.abs(clientSpeed - b.current_vessel_speed);
    return diffA - diffB; // Sort in ascending order of speed difference
  });

  // Step 4: Assign the closest and second closest (if it exists)
  const closest = sortedVariables[0];
  const secondClosest = sortedVariables.length > 1 ? sortedVariables[1] : undefined;

  // Step 5: Return the closest and second closest speeds along with their respective fuel usage data
  return {
    closest: {
      speed: closest ?? null,
      fuel_usage_main_1: closest ? closest.fuel_usage_main_1 : null,
      fuel_usage_main_1_type: closest ? closest.fuel_usage_main_1_type : null,
      fuel_usage_main_2: closest ? closest.fuel_usage_main_2 : null,
      fuel_usage_main_2_type: closest ? closest.fuel_usage_main_2_type : null
    },
    secondClosest: secondClosest
      ? {
          speed: secondClosest ?? null,
          fuel_usage_main_1: secondClosest.fuel_usage_main_1 ?? null,
          fuel_usage_main_1_type: secondClosest.fuel_usage_main_1_type ?? null,
          fuel_usage_main_2: secondClosest.fuel_usage_main_2 ?? null,
          fuel_usage_main_2_type: secondClosest.fuel_usage_main_2_type ?? null
        }
      : null
  };
};

