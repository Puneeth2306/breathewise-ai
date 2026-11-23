export interface AQIReading {
  usAqi: number;
  category: AQICategory;
  severityLevel: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  color: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  no2: number; // µg/m³
  o3: number; // µg/m³
  co: number; // µg/m³
  so2?: number; // µg/m³
  timestamp: string;
  isForecast?: boolean;
}

export type AQICategory = 
  | 'Good'
  | 'Moderate'
  | 'Unhealthy for Sensitive Groups'
  | 'Unhealthy'
  | 'Very Unhealthy'
  | 'Hazardous';

export interface IndianAQICategory {
  category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  color: string;
  range: string;
  description: string;
}

export interface LocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isCustom?: boolean;
}

export interface HourlyAQIPoint {
  time: string;
  formattedTime: string;
  usAqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  isForecast: boolean;
}

export interface AirQualityResponse {
  location: LocationData;
  current: AQICategoryDetails;
  hourly: HourlyAQIPoint[];
  dailySummary: {
    cleanestTimeWindow: string;
    worstTimeWindow: string;
    dominantPollutant: string;
    outdoorRiskSummary: string;
  };
  cpcbEquivalent: IndianAQICategory;
  sourceAttribution: string;
  modelTimestamp: string;
}

export interface AQICategoryDetails {
  usAqi: number;
  category: AQICategory;
  severityLevel: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  color: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  headline: string;
  healthImplications: string;
  sensitiveGroupsGuidance: string;
  generalPublicGuidance: string;
  pollutants: {
    pm25: { value: number; unit: string; whoLimit: number; status: string };
    pm10: { value: number; unit: string; whoLimit: number; status: string };
    no2: { value: number; unit: string; whoLimit: number; status: string };
    o3: { value: number; unit: string; whoLimit: number; status: string };
    co: { value: number; unit: string; whoLimit: number; status: string };
    so2?: { value: number; unit: string; whoLimit: number; status: string };
  };
  timestamp: string;
}
