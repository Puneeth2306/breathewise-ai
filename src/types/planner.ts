export interface DailyPlannerScheduleItem {
  timeWindow: string; // e.g. "6:00 AM - 7:30 AM"
  activity: string; // e.g. "Morning Exercise / Jogging"
  aqiForecast: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  recommendation: string;
  actionableStep: string;
  rationale: string;
  ventilationAdvice?: string;
}

export interface DailyPlannerResponse {
  date: string;
  location: string;
  overallRating: 'Safe' | 'Exercise Caution' | 'High Exposure Risk' | 'Hazardous Smog Alert';
  summary: string;
  schedule: DailyPlannerScheduleItem[];
  commuteRecommendation: {
    suggestedMode: string;
    departureAdvice: string;
    exposureReductionPercent: number;
  };
  familyProtectionChecklist: string[];
  indoorAirPlan: {
    recommendedWindowOpeningTime: string;
    purifierRuntimeHours: string;
    cookingExhaustNote: string;
  };
}
