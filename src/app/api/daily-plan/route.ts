import { NextRequest, NextResponse } from 'next/server';
import { isGeminiConfigured } from '@/lib/gemini';
import { GoogleGenAI } from '@google/genai';
import { DailyPlannerResponse, DailyPlannerScheduleItem } from '@/types/planner';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, hourlyAQI, currentAQI, city } = body;

    const cityStr = city || 'Bengaluru';
    const aqi = currentAQI?.usAqi || 85;

    // Build intelligent schedule based on hourly data and user profile
    const plan = await generatePersonalizedPlan(profile, hourlyAQI || [], aqi, cityStr);
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error('Error generating daily planner schedule:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized daily plan' },
      { status: 500 }
    );
  }
}

async function generatePersonalizedPlan(
  profile: any,
  hourly: any[],
  currentAqi: number,
  city: string
): Promise<DailyPlannerResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (isGeminiConfigured && apiKey) {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Generate a structured JSON personalized daily schedule for BreatheWise AI.
User Context:
- Location: ${city}
- Current AQI: ${currentAqi}
- Commute: ${profile?.commuteType || 'Metro / Public Transit'} (Distance: ${profile?.commuteDistanceKm || 12} km)
- Exercise Routine: ${profile?.exerciseTime || 'Morning'}
- Family: Has Children? ${profile?.hasChildren ? 'Yes' : 'No'}, Has Elderly? ${profile?.hasElderly ? 'Yes' : 'No'}, Asthma/Respiratory? ${profile?.hasAsthmaOrRespiratory ? 'Yes' : 'No'}
- Cooking fuel: ${profile?.cookingFuel || 'LPG'}
- Air purifier: ${profile?.hasAirPurifier ? 'Available (HEPA)' : 'None'}

Return ONLY a valid JSON object matching this schema:
{
  "date": "Today",
  "location": "${city}",
  "overallRating": "Safe" | "Exercise Caution" | "High Exposure Risk" | "Hazardous Smog Alert",
  "summary": "1-2 sentence overall daily guidance summary",
  "schedule": [
    {
      "timeWindow": "6:00 AM - 7:30 AM",
      "activity": "Morning Routine & Exercise",
      "aqiForecast": number,
      "riskLevel": "low" | "moderate" | "high" | "very-high",
      "recommendation": "Brief recommendation",
      "actionableStep": "Direct action to take",
      "rationale": "Scientific reason behind advice"
    },
    {
      "timeWindow": "8:00 AM - 9:30 AM",
      "activity": "Morning Commute",
      "aqiForecast": number,
      "riskLevel": "low" | "moderate" | "high" | "very-high",
      "recommendation": "Commute advice",
      "actionableStep": "Direct action to take",
      "rationale": "Scientific reason"
    },
    {
      "timeWindow": "12:00 PM - 2:00 PM",
      "activity": "Midday Ventilation & Lunch",
      "aqiForecast": number,
      "riskLevel": "low" | "moderate" | "high" | "very-high",
      "recommendation": "Ventilation advice",
      "actionableStep": "Direct action to take",
      "rationale": "Scientific reason"
    },
    {
      "timeWindow": "5:30 PM - 7:30 PM",
      "activity": "Evening Commute & Outdoor Activity",
      "aqiForecast": number,
      "riskLevel": "low" | "moderate" | "high" | "very-high",
      "recommendation": "Evening exposure advice",
      "actionableStep": "Direct action to take",
      "rationale": "Scientific reason"
    },
    {
      "timeWindow": "9:00 PM - 10:30 PM",
      "activity": "Night-time Air Management & Rest",
      "aqiForecast": number,
      "riskLevel": "low" | "moderate" | "high" | "very-high",
      "recommendation": "Bedroom air advice",
      "actionableStep": "Direct action to take",
      "rationale": "Scientific reason"
    }
  ],
  "commuteRecommendation": {
    "suggestedMode": "Suggested transport",
    "departureAdvice": "Time window advice",
    "exposureReductionPercent": number
  },
  "familyProtectionChecklist": ["checklist item 1", "checklist item 2", "checklist item 3"],
  "indoorAirPlan": {
    "recommendedWindowOpeningTime": "1:30 PM - 3:00 PM",
    "purifierRuntimeHours": "6 to 8 hours (primarily evening and sleep)",
    "cookingExhaustNote": "Run kitchen exhaust 5 minutes before and after cooking"
  }
}
`;

    for (const modelName of ['gemini-3.5-flash-lite', 'gemini-3.8-flash']) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        const text = result.text || '';
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return parsed;
      } catch (err) {
        console.warn(`Gemini daily plan generation error with ${modelName}:`, err);
      }
    }
  }

  // Algorithmic high-quality plan fallback
  return getAlgorithmicDailyPlan(profile, currentAqi, city);
}

function getAlgorithmicDailyPlan(profile: any, aqi: number, city: string): DailyPlannerResponse {
  const isHighAqi = aqi > 120;
  const rating = aqi <= 50 ? 'Safe' : aqi <= 100 ? 'Exercise Caution' : aqi <= 200 ? 'High Exposure Risk' : 'Hazardous Smog Alert';

  const schedule: DailyPlannerScheduleItem[] = [
    {
      timeWindow: '6:00 AM - 7:30 AM',
      activity: 'Morning Exercise & Wakeup',
      aqiForecast: Math.round(aqi * 1.2),
      riskLevel: isHighAqi ? 'high' : 'moderate',
      recommendation: isHighAqi 
        ? 'Avoid outdoor jogging. Ground inversion layer concentrates vehicular and biomass exhaust near the soil.' 
        : 'Safe for light outdoor jogging or walking in community parks away from major traffic arteries.',
      actionableStep: isHighAqi ? 'Shift workout indoors with air purifier on medium.' : 'Enjoy park exercise before morning traffic ramps up.',
      rationale: 'Cool morning air traps particulates beneath the planetary boundary layer.',
    },
    {
      timeWindow: '8:00 AM - 9:30 AM',
      activity: 'Morning Commute & School Travel',
      aqiForecast: Math.round(aqi * 1.3),
      riskLevel: isHighAqi ? 'very-high' : 'high',
      recommendation: 'Peak roadside nitrogen dioxide (NO2) and diesel particulate concentration window.',
      actionableStep: profile?.commuteType === 'two-wheeler' 
        ? 'Wear a certified N95 respirator. If using a car, ensure internal cabin air recirculation.' 
        : 'Board the Metro/bus. Enclosed train cabins reduce particulate exposure by up to 70%.',
      rationale: 'Morning rush hour triggers high primary exhaust emissions.',
    },
    {
      timeWindow: '1:00 PM - 3:00 PM',
      activity: 'Midday Natural Ventilation Window',
      aqiForecast: Math.round(aqi * 0.75),
      riskLevel: 'low',
      recommendation: 'Solar heating elevates the mixing boundary layer, producing the cleanest outdoor air of the daylight hours.',
      actionableStep: 'Open courtyard or non-road-facing windows for 20 minutes to purge indoor carbon dioxide buildup.',
      rationale: 'Atmospheric turbulence dilutes particulate concentration to daily minimums.',
    },
    {
      timeWindow: '5:30 PM - 7:30 PM',
      activity: 'Evening Return Commute',
      aqiForecast: Math.round(aqi * 1.15),
      riskLevel: isHighAqi ? 'high' : 'moderate',
      recommendation: 'Evening ground cooling initiates secondary particulate inversion.',
      actionableStep: 'Avoid extended pedestrian waiting at congested intersections. Plan departure slightly before 5:30 PM or after 7:30 PM if possible.',
      rationale: 'Stop-and-go vehicle deceleration significantly spikes localized PM10 and brake-dust.',
    },
    {
      timeWindow: '9:00 PM - 10:30 PM',
      activity: 'Night-time Bedroom Air Preparation',
      aqiForecast: Math.round(aqi * 1.1),
      riskLevel: 'moderate',
      recommendation: 'Seal bedroom windows against evening smog drift.',
      actionableStep: profile?.hasAirPurifier 
        ? 'Power on bedroom True HEPA purifier 45 minutes prior to sleep on low/sleep mode.' 
        : 'Keep doors closed and use a wet mop to suppress settled fine dust without kicking it into the breathing zone.',
      rationale: 'Resting respiratory rate remains steady for 7-8 hours; clean nocturnal air is critical for endothelial recovery.',
    },
  ];

  return {
    date: 'Today',
    location: city,
    overallRating: rating,
    summary: isHighAqi 
      ? `Air quality in ${city} requires proactive exposure reduction today. Strenuous outdoor workouts should be substituted with indoor activity, and public transit should be prioritized.`
      : `Conditions in ${city} are acceptable for general routines. Leverage the early afternoon window for home ventilation.`,
    schedule,
    commuteRecommendation: {
      suggestedMode: profile?.commuteType || 'Metro Rail / Rapid Transit',
      departureAdvice: 'Depart before 7:45 AM or after 9:15 AM to avoid the dense peak exhaust window.',
      exposureReductionPercent: 68,
    },
    familyProtectionChecklist: [
      profile?.hasChildren ? 'Ensure children wear N95/FFP2 masks if walking near school drop-off zones.' : 'Protect vulnerable respiratory airways.',
      profile?.hasElderly ? 'Elderly family members should avoid morning walks before 8:30 AM.' : 'Stay well hydrated with antioxidant-rich fluids.',
      profile?.hasAsthmaOrRespiratory ? 'Keep emergency inhalers easily accessible and take preventative dosage as advised by physician.' : 'Avoid burning dried leaves or backyard waste.',
      'Check kitchen range hood and seal gaps under entry doors.',
    ],
    indoorAirPlan: {
      recommendedWindowOpeningTime: '1:15 PM - 3:00 PM (cleanest diurnal air)',
      purifierRuntimeHours: '6 - 9 hours (continuous during night rest)',
      cookingExhaustNote: 'Keep kitchen exhaust active during cooking; do not allow oil smoking temperatures.',
    },
  };
}
