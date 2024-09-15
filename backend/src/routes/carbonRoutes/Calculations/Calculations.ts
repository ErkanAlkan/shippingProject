// calculations.ts
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
  return pRef * Math.pow(wNew / wRef, wettedHullExponent) * Math.pow(vNew / vRef, speedExponent);
};

export const carbonEmission = (fuelType: string, fuelRequired: number): number => {
  // CO2 emission factors in kg CO2 per tonne of fuel
  const emissionFactors: Record<string, number> = {
    'diesel': 3206,               // kg CO2 per tonne of diesel
    'heavy_fuel_oil': 3114,       // kg CO2 per tonne of heavy fuel oil
    'lng': 2750,                  // kg CO2 per tonne of LNG
    'marine_gas_oil': 3206,       // kg CO2 per tonne of marine gas oil
    'methanol': 1375,             // kg CO2 per tonne of methanol
    'hydrogen': 0,                // kg CO2 per tonne of hydrogen (assuming green hydrogen)
    'vlsfo_380_cst': 3114,        // kg CO2 per tonne of VLSFO 380 CST
    'lsmgo': 3206,                // kg CO2 per tonne of LSMGO
    // Add more fuels as needed
  };

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



