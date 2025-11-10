import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/image-generator';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    
    // Capture logs
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    console.error = (...args) => {
      logs.push('ERROR: ' + args.join(' '));
      originalError(...args);
    };
    
    const image = await generateImage({
      prompt: prompt || 'business professional',
      aspectRatio: 'ASPECT_16_9',
      styleType: 'GENERAL'
    });
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    if (image) {
      return NextResponse.json({
        success: true,
        image,
        logs: logs.join('\n')
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Image generation returned null',
        logs: logs.join('\n')
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

