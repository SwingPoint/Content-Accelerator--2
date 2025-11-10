// Image generation service using Pexels API (free stock photos)

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: 'ASPECT_1_1' | 'ASPECT_16_9' | 'ASPECT_4_3' | 'ASPECT_3_4' | 'ASPECT_9_16';
  model?: 'V_3' | 'V_3_TURBO';
  styleType?: 'AUTO' | 'GENERAL' | 'REALISTIC' | 'DESIGN' | 'RENDER_3D' | 'ANIME';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  resolution: string;
}

const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'FALLBACK_TO_PLACEHOLDER';

export async function generateImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage | null> {
  // Pexels API - free, high-quality stock photos
  
  console.log('[IMAGE GEN] Fetching stock photo for:', options.prompt.substring(0, 100));

  try {
    // Extract keywords from prompt for search
    const keywords = extractKeywords(options.prompt);
    
    // Map aspect ratios to orientations
    const orientationMap: Record<string, 'landscape' | 'portrait' | 'square'> = {
      'ASPECT_1_1': 'square',
      'ASPECT_16_9': 'landscape',
      'ASPECT_4_3': 'landscape',
      'ASPECT_3_4': 'portrait',
      'ASPECT_9_16': 'portrait',
    };
    
    const orientation = orientationMap[options.aspectRatio || 'ASPECT_1_1'];

    // Try Pexels API first (if key is available)
    if (PEXELS_API_KEY && PEXELS_API_KEY !== 'FALLBACK_TO_PLACEHOLDER') {
      const params = new URLSearchParams({
        query: keywords,
        orientation: orientation,
        per_page: '1',
        page: '1'
      });

      const response = await fetch(`${PEXELS_API_URL}?${params}`, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      });

      console.log('[IMAGE GEN] Pexels API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        
        if (data.photos && data.photos.length > 0) {
          const photo = data.photos[0];
          const imageUrl = photo.src.large2x || photo.src.large;
          console.log('[IMAGE GEN] Successfully fetched from Pexels:', imageUrl);
          
          return {
            url: imageUrl,
            prompt: keywords,
            resolution: `${photo.width}x${photo.height}`,
          };
        }
      }
    }

    // Fallback to Picsum (Lorem Picsum - no API key needed)
    console.log('[IMAGE GEN] Using Picsum fallback');
    return getPicsumImage(options.aspectRatio || 'ASPECT_1_1', keywords);
    
  } catch (error) {
    console.error('[IMAGE GEN] Image fetch failed with error:', error);
    return getPicsumImage(options.aspectRatio || 'ASPECT_1_1', options.prompt);
  }
}

// Extract keywords from AI prompt for Unsplash search
function extractKeywords(prompt: string): string {
  // Remove common words and extract main keywords
  const stopWords = ['professional', 'business', 'image', 'for', 'company', 'theme', 'style', 'modern', 'clean', 'related', 'to'];
  const words = prompt.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Take top 3 most relevant words
  return words.slice(0, 3).join(' ') || 'business professional';
}

// Fallback to Lorem Picsum (free, no API key)
function getPicsumImage(aspectRatio: string, keywords: string): GeneratedImage {
  const sizeMap: Record<string, { width: number; height: number }> = {
    'ASPECT_1_1': { width: 1080, height: 1080 },
    'ASPECT_16_9': { width: 1920, height: 1080 },
    'ASPECT_4_3': { width: 1600, height: 1200 },
    'ASPECT_3_4': { width: 1200, height: 1600 },
    'ASPECT_9_16': { width: 1080, height: 1920 },
  };
  
  const size = sizeMap[aspectRatio] || { width: 1080, height: 1080 };
  
  // Use Lorem Picsum for random photos (no key required)
  // Add a seed based on keywords for consistency
  const seed = keywords.replace(/\s+/g, '-').toLowerCase();
  const url = `https://picsum.photos/seed/${seed}/${size.width}/${size.height}`;
  
  return {
    url,
    prompt: keywords,
    resolution: `${size.width}x${size.height}`,
  };
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
export function getPlatformAspectRatio(platform: string): 'ASPECT_1_1' | 'ASPECT_16_9' | 'ASPECT_4_3' | 'ASPECT_3_4' | 'ASPECT_9_16' {
  const ratios: Record<string, 'ASPECT_1_1' | 'ASPECT_16_9' | 'ASPECT_4_3' | 'ASPECT_3_4' | 'ASPECT_9_16'> = {
    facebook: 'ASPECT_16_9',
    instagram: 'ASPECT_1_1',
    linkedin: 'ASPECT_16_9',
    gbp: 'ASPECT_4_3',
    youtube: 'ASPECT_16_9',
    blog: 'ASPECT_16_9',
  };
  return ratios[platform] || 'ASPECT_1_1';
}

