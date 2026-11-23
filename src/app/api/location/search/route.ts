import { NextRequest, NextResponse } from 'next/server';
import { searchCities } from '@/lib/air-quality';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results = await searchCities(query);
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error searching cities:', error);
    return NextResponse.json({ results: [] });
  }
}

