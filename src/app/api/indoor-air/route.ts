import { NextRequest, NextResponse } from 'next/server';
import { isGeminiConfigured } from '@/lib/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomType, roomAreaSqFt, ventilationType, cookingFuel, hasPurifier, purifierType, outdoorAqi, city } = body;

    const area = Number(roomAreaSqFt) || 200;
    const ceilingHeightFt = 9;
    const roomVolumeCuFt = area * ceilingHeightFt;
    // CADR rule of thumb: CADR in CFM should be at least 2/3 of room area in sq ft
    const recommendedCadrCfm = Math.round(area * 0.67);
    const recommendedCadrM3H = Math.round(recommendedCadrCfm * 1.7);

    // Smart window opening calculation based on typical diurnal curve
    const windowAdvice = outdoorAqi > 150
      ? 'Keep windows closed all day; open only for 10 minutes at 2:00 PM if CO2 levels exceed 1,000 ppm.'
      : 'Open windows for 20-30 minutes between 1:30 PM and 3:30 PM when outdoor particulate levels are lowest.';

    // Generate AI recommendations
    let aiAdvice = await generateIndoorAirRecommendations({
      roomType: roomType || 'Bedroom',
      roomAreaSqFt: area,
      ventilationType: ventilationType || 'street-facing',
      cookingFuel: cookingFuel || 'lpg',
      hasPurifier: Boolean(hasPurifier),
      purifierType: purifierType || 'hepa-true',
      outdoorAqi: outdoorAqi || 85,
      city: city || 'Bengaluru',
      recommendedCadrCfm,
    });

    return NextResponse.json({
      roomVolumeCuFt,
      recommendedCadrCfm,
      recommendedCadrM3H,
      windowAdvice,
      aiAdvice,
      filtersRecommended: ['True HEPA H13 (99.97% efficiency at 0.3 µm)', 'Activated Carbon Layer (for VOCs & Cooking Odors)'],
      plantFactCheck: 'Potted plants absorb trace VOCs but have near-zero measurable effect on reducing airborne PM2.5 or PM10 particulate levels. Mechanical HEPA filtration remains the gold standard.',
    });
  } catch (error: any) {
    console.error('Error in indoor-air API:', error);
    return NextResponse.json(
      { error: 'Failed to assess indoor air quality' },
      { status: 500 }
    );
  }
}

async function generateIndoorAirRecommendations(params: any): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (isGeminiConfigured && apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Provide an expert indoor air quality assessment for a ${params.roomType} (${params.roomAreaSqFt} sq ft).
Environment:
- City: ${params.city} (Outdoor AQI: ${params.outdoorAqi})
- Ventilation: ${params.ventilationType}
- Cooking fuel: ${params.cookingFuel}
- Air Purifier present: ${params.hasPurifier ? `Yes (${params.purifierType})` : 'No'}
- Required CADR: ${params.recommendedCadrCfm} CFM

Provide:
1. Room-specific air pollution vulnerabilities (e.g. dust mites, cooking aerosols, outdoor infiltration).
2. Ventilation and window protocol.
3. Air purifier runtime, placement, and filter maintenance guidance.
4. Clarify scientifically why house plants alone cannot replace HEPA filters for fine dust.
Keep it concise, practical, and formatted in clean markdown.
`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.warn('Gemini indoor air advice fallback:', e);
    }
  }

  return `
### 🌬️ Indoor Air Optimization Plan for ${params.roomType} (${params.roomAreaSqFt} sq ft)

**1. Filtration & Purifier Sizing:**
* For this room volume, your purifier requires a minimum Clean Air Delivery Rate (CADR) of **${params.recommendedCadrCfm} CFM (${Math.round(params.recommendedCadrCfm * 1.7)} m³/h)** to achieve 4 to 5 Air Changes per Hour (ACH).
* Place the purifier at least **1.5 feet away from walls** and unobstructed by furniture or heavy drapes to maintain optimal laminar airflow.

**2. Infiltration & Window Strategy:**
* Because outdoor AQI in ${params.city} is currently **${params.outdoorAqi}**, keep street-facing windows tightly latched during morning rush hours (7:00 AM – 10:00 AM).
* Ventilate for **15–20 minutes around 2:00 PM**, when thermal atmospheric convection has diluted ground-level vehicle exhaust.

**3. Cooking & Dust Suppression:**
* Always engage your kitchen exhaust hood for 3 minutes *before* igniting the stove and leave it running for 5 minutes after cooking to capture ultra-fine aerosolized oil droplets.
* Clean surfaces with a damp microfiber cloth instead of dry sweeping, which merely resuspends settled PM10 back into your breathing zone.

> **Scientific Fact:** While houseplants add biophilic beauty, NASA clean-air studies demonstrate they cannot circulate or filter ambient fine particulates (PM2.5). True HEPA mechanical filtration is strictly necessary for particulate defense.
`;
}
