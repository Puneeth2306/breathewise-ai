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

    if (!context || typeof context.usAqi !== 'number') {
      return NextResponse.json(
        { error: 'Air quality context (usAqi, city, pm25, pm10) is required' },
        { status: 400 }
      );
    }

    const response = await generateChatResponse(message, context, history || []);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in Gemini chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response', message: error.message },
      { status: 500 }
    );
  }
}
