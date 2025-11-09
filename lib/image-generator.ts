// Image generation service using Ideogram.ai API

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4' | '9:16';
  model?: 'V_2' | 'V_2_TURBO';
  styleType?: 'AUTO' | 'GENERAL' | 'REALISTIC' | 'DESIGN' | 'RENDER_3D' | 'ANIME';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  resolution: string;
}

const IDEOGRAM_API_URL = 'https://api.ideogram.ai/generate';

export async function generateImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage | null> {
  const apiKey = process.env.IDEOGRAM_API_KEY;

  if (!apiKey) {
    console.error('[IMAGE GEN] IDEOGRAM_API_KEY not found. Skipping image generation.');
    return null;
  }

  console.log('[IMAGE GEN] Starting image generation with prompt:', options.prompt.substring(0, 100));

  try {
    const requestBody = {
      image_request: {
        prompt: options.prompt,
        aspect_ratio: options.aspectRatio || '1:1',
        model: options.model || 'V_2',
        magic_prompt_option: 'AUTO',
        style_type: options.styleType || 'AUTO',
      },
    };

    console.log('[IMAGE GEN] Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(IDEOGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[IMAGE GEN] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[IMAGE GEN] Ideogram API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log('[IMAGE GEN] Response data:', JSON.stringify(data, null, 2));
    
    if (data.data && data.data.length > 0) {
      const imageData = data.data[0];
      console.log('[IMAGE GEN] Successfully generated image:', imageData.url);
      return {
        url: imageData.url,
        prompt: imageData.prompt || options.prompt,
        resolution: imageData.resolution || 'unknown',
      };
    }

    console.error('[IMAGE GEN] No image data in response');
    return null;
  } catch (error) {
    console.error('[IMAGE GEN] Image generation failed with error:', error);
    return null;
  }
}

export async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Image download failed:', error);
    return null;
  }
}

// Generate platform-specific image prompts
export function generateImagePrompt(
  platform: string,
  postContent: string,
  business: { businessName: string; region: string; keywords: string }
): string {
  const keywords = business.keywords.split(',').slice(0, 3).join(', ');
  
  // Extract key concept from post (first sentence or key phrase)
  const concept = postContent
    .split('\n')[0]
    .replace(/[#@]/g, '')
    .substring(0, 100)
    .trim();

  const basePrompt = `Professional business image for ${business.region} company. Theme: ${concept}. Style: modern, clean, professional. Related to: ${keywords}`;

  const platformStyles: Record<string, string> = {
    facebook: `${basePrompt}. Social media friendly, engaging, warm colors.`,
    instagram: `${basePrompt}. Instagram-style, vibrant, eye-catching, aesthetic composition.`,
    linkedin: `${basePrompt}. Professional, corporate, business-focused, sophisticated.`,
    gbp: `${basePrompt}. Local business, inviting, trustworthy, community-focused.`,
    youtube: `${basePrompt}. Eye-catching thumbnail style, bold, attention-grabbing.`,
    blog: `${basePrompt}. Hero image style, wide composition, professional photography feel.`,
  };

  return platformStyles[platform] || basePrompt;
}

// Get platform-specific aspect ratios
export function getPlatformAspectRatio(platform: string): '1:1' | '16:9' | '4:3' | '3:4' | '9:16' {
  const ratios: Record<string, '1:1' | '16:9' | '4:3' | '3:4' | '9:16'> = {
    facebook: '16:9',
    instagram: '1:1',
    linkedin: '16:9',
    gbp: '4:3',
    youtube: '16:9',
    blog: '16:9',
  };
  return ratios[platform] || '1:1';
}

