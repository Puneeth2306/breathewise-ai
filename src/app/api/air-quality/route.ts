import { NextRequest, NextResponse } from 'next/server';
import { fetchAirQualityData } from '@/lib/air-quality';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');
    const city = searchParams.get('city') || 'Bengaluru';
    const region = searchParams.get('region') || 'Karnataka';
    const country = searchParams.get('country') || 'India';

    const lat = latStr ? parseFloat(latStr) : 12.9716;
    const lon = lonStr ? parseFloat(lonStr) : 77.5946;

    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ error: 'Invalid coordinates provided' }, { status: 400 });
    }

    const data = await fetchAirQualityData(lat, lon, { city, region, country, latitude: lat, longitude: lon });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in air-quality route:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve air quality data', details: error.message },
      { status: 500 }
    );
  }
}

