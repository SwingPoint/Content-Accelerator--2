import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPostAI } from '@/lib/ai-content-generator';
import { PackInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { businessName, region, keywords, valueProp, voice } = await request.json();
    
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
    
    // Create mock PackInput
    const input: PackInput = {
      slug: 'test-blog',
      business: {
        businessName: businessName || 'Test Business',
        region: region || 'Los Angeles, CA',
        website: 'https://testbusiness.com',
        valueProp: valueProp || 'We help businesses succeed',
        voice: voice || 'Friendly'
      },
      offer: {
        ctaText: 'Get Started Today',
        ctaUrl: 'https://testbusiness.com/contact'
      },
      keywords: keywords || 'business, marketing, success',
      timezone: 'America/Los_Angeles',
      angle: 'Comprehensive guide',
      seedUrl: '',
      seedText: ''
    };
    
    const blog = await generateBlogPostAI(input, '');
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    if (blog) {
      return NextResponse.json({
        success: true,
        blog,
        logs: logs.join('\n')
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Blog generation returned null - check OpenAI API key',
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

