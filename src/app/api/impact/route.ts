import { NextRequest, NextResponse } from 'next/server';
import { calculateAvoidedCO2, calculateEquivalencies } from '@/lib/impact-calculator';
import { LoggedImpactActivity } from '@/types/impact';

export const dynamic = 'force-dynamic';

// Seed community metrics
let communityTotalKg = 48950.4;
let communityTotalCleanKm = 328400.0;
let communityMembers = 14280;

export async function GET() {
  return NextResponse.json({
    community: {
      totalActivePledges: communityMembers,
      totalKgCo2Avoided: Math.round(communityTotalKg),
      totalCleanKmTraveled: Math.round(communityTotalCleanKm),
      topCities: [
        { city: 'Bengaluru', journeysLogged: 24500, co2SavedKg: 18400 },
        { city: 'New Delhi', journeysLogged: 19800, co2SavedKg: 14200 },
        { city: 'Mumbai', journeysLogged: 16200, co2SavedKg: 11900 },
        { city: 'London', journeysLogged: 8400, co2SavedKg: 4450 },
      ],
      activeCampaigns: [
        {
          id: 'bengaluru-metro-challenge',
          title: 'Namma Metro Commuter Pledge',
          description: 'Switch 3 private car trips per week to Bengaluru Namma Metro to relieve Outer Ring Road smog.',
          participants: 4120,
          badge: 'Urban Green Commuter',
        },
        {
          id: 'zero-open-burning',
          title: 'Zero Waste Burning Vigil',
          description: 'Report and eliminate neighborhood dry leaf and plastic burning in residential wards.',
          participants: 2890,
          badge: 'Clean Air Sentinel',
        },
        {
          id: 'school-clean-zone',
          title: 'Clean School Drop-Off Zones',
          description: 'Anti-idling campaign near elementary schools to protect developing lungs from diesel exhaust.',
          participants: 3670,
          badge: 'Child Health Guardian',
        },
      ],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityType, distanceKm, notes } = body;

    const dist = Number(distanceKm);
    if (!activityType || isNaN(dist) || dist <= 0) {
      return NextResponse.json({ error: 'Valid activityType and distanceKm required' }, { status: 400 });
    }

    const co2SavedKg = calculateAvoidedCO2(activityType, dist);
    const equivalencies = calculateEquivalencies(co2SavedKg);

    const activity: LoggedImpactActivity = {
      id: 'act_' + Date.now() + Math.random().toString(36).substring(2, 6),
      date: new Date().toISOString(),
      activityType,
      distanceKm: dist,
      co2SavedKg,
      baselineVehicle: 'petrol-car',
      notes: notes || '',
    };

    // Update community totals in-memory
    communityTotalKg += co2SavedKg;
    communityTotalCleanKm += dist;

    return NextResponse.json({
      activity,
      co2SavedKg,
      equivalencies,
      message: 'Emission-reducing activity logged successfully!',
    });
  } catch (error: any) {
    console.error('Error logging impact activity:', error);
    return NextResponse.json({ error: 'Failed to log impact activity' }, { status: 500 });
  }
}

