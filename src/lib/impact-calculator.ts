/**
 * Standard transport and lifestyle CO2 emission factors (IPCC / DEFRA / GHG Protocol)
 * Baseline comparison: Single-occupant private petrol car = ~170 grams CO2 / km
 */

export const EMISSION_FACTORS = {
  petrolCarGramsPerKm: 170, // Average passenger petrol car
  dieselCarGramsPerKm: 175,
  motorcycleGramsPerKm: 103, // Two-wheeler
  electricCarGramsPerKm: 48, // Grid lifecycle
  metroTrainGramsPerKm: 28, // Per passenger-km (rapid transit)
  electricBusGramsPerKm: 45, // Per passenger-km
  dieselBusGramsPerKm: 68, // Per passenger-km (average urban occupancy)
  carpool2PersonsGramsPerKm: 85, // Shared 50%
  carpool3PersonsGramsPerKm: 56, // Shared 66%
  bicycleGramsPerKm: 0,
  walkingGramsPerKm: 0,
  wfhAvoidedKmPerDay: 24, // Average urban roundtrip avoided
};

/**
 * Calculates estimated CO2 emissions avoided compared to single-occupant petrol car.
 * Returns kilograms of CO2 avoided.
 */
export function calculateAvoidedCO2(
  mode: 'metro' | 'bus' | 'carpool' | 'bicycle' | 'walking' | 'work-from-home',
  distanceKm: number
): number {
  const baselineEmissionsGrams = distanceKm * EMISSION_FACTORS.petrolCarGramsPerKm;
  let actualEmissionsGrams = 0;

  switch (mode) {
    case 'metro':
      actualEmissionsGrams = distanceKm * EMISSION_FACTORS.metroTrainGramsPerKm;
      break;
    case 'bus':
      actualEmissionsGrams = distanceKm * EMISSION_FACTORS.dieselBusGramsPerKm;
      break;
    case 'carpool':
      actualEmissionsGrams = distanceKm * EMISSION_FACTORS.carpool2PersonsGramsPerKm;
      break;
    case 'bicycle':
    case 'walking':
    case 'work-from-home':
      actualEmissionsGrams = 0;
      break;
    default:
      actualEmissionsGrams = baselineEmissionsGrams;
  }

  const savedGrams = Math.max(0, baselineEmissionsGrams - actualEmissionsGrams);
  return Number((savedGrams / 1000).toFixed(2)); // Return in kilograms
}

/**
 * Calculates equivalence metrics:
 * - 1 mature urban tree absorbs approximately ~21 kg of CO2 per year (~0.057 kg/day)
 * - Car km equivalent
 */
export function calculateEquivalencies(totalCo2Kg: number) {
  const treeDays = (totalCo2Kg / 0.057);
  const treesYearEquiv = (totalCo2Kg / 21);
  const carKmSaved = (totalCo2Kg / (EMISSION_FACTORS.petrolCarGramsPerKm / 1000));
  
  return {
    treeDays: Math.round(treeDays),
    treesYearEquiv: Number(treesYearEquiv.toFixed(2)),
    carKmSaved: Math.round(carKmSaved),
  };
}
