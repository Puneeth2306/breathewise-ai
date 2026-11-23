export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  hasChildren: boolean;
  hasElderly: boolean;
  hasAsthmaOrRespiratory: boolean;
  commuteType: 'metro' | 'bus' | 'car' | 'two-wheeler' | 'bicycle' | 'walking' | 'carpool' | 'remote';
  commuteDistanceKm: number;
  exerciseTime: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'indoor-only' | 'none';
  cookingFuel: 'lpg' | 'induction' | 'piped-gas' | 'wood-biomass';
  hasAirPurifier: boolean;
  purifierType?: 'hepa-true' | 'basic-filter' | 'none';
  ventilationQuality: 'street-facing' | 'courtyard' | 'high-rise' | 'closed-ac';
  createdAt: string;
}

export interface FamilyVulnerabilityProfile {
  infantsOrChildren: boolean;
  elderlyMembers: boolean;
  pregnantMembers: boolean;
  preExistingConditions: string[];
}
