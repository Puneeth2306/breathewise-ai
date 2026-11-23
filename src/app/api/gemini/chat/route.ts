import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const safeContext = {
      city: context?.city || 'Bengaluru',
      usAqi: typeof context?.usAqi === 'number' ? context.usAqi : 75,
      category: context?.category || 'Moderate',
      pm25: typeof context?.pm25 === 'number' ? context.pm25 : 25,
      pm10: typeof context?.pm10 === 'number' ? context.pm10 : 45,
      no2: context?.no2,
      o3: context?.o3,
      userProfile: context?.userProfile,
    };

    const response = await generateChatResponse(message, safeContext, history || []);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in Gemini chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response', message: error.message },
      { status: 500 }
    );
  }
}

