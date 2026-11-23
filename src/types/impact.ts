export interface LoggedImpactActivity {
  id: string;
  date: string;
  activityType: 'metro' | 'bus' | 'carpool' | 'bicycle' | 'walking' | 'work-from-home';
  distanceKm: number;
  co2SavedKg: number;
  baselineVehicle: 'petrol-car';
  notes?: string;
}

export interface ImpactSummary {
  totalCo2SavedKg: number;
  totalDistanceCleanKm: number;
  activitiesCount: number;
  treeEquivalents: number;
  weeklyTrend: { date: string; co2SavedKg: number }[];
  byActivity: { [key: string]: number };
}

export interface CommunityMetric {
  totalActivePledges: number;
  totalKgCo2Avoided: number;
  totalCleanKmTraveled: number;
  topCities: { city: string; journeysLogged: number; co2SavedKg: number }[];
  activeCampaigns: {
    id: string;
    title: string;
    description: string;
    participants: number;
    badge: string;
  }[];
}
