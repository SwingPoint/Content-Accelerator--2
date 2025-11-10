// Image generation service using Unsplash API (free stock photos)

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

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';

export async function generateImage(
  options: ImageGenerationOptions
): Promise<GeneratedImage | null> {
  // Unsplash API - free, high-quality stock photos
  // No API key required for basic usage (using public access)
  
  console.log('[IMAGE GEN] Fetching stock photo from Unsplash for:', options.prompt.substring(0, 100));

  try {
    // Extract keywords from prompt for Unsplash search
    const keywords = extractKeywords(options.prompt);
    
    // Map aspect ratios to Unsplash orientations
    const orientationMap: Record<string, 'landscape' | 'portrait' | 'squarish'> = {
      'ASPECT_1_1': 'squarish',
      'ASPECT_16_9': 'landscape',
      'ASPECT_4_3': 'landscape',
      'ASPECT_3_4': 'portrait',
      'ASPECT_9_16': 'portrait',
    };
    
    const orientation = orientationMap[options.aspectRatio || 'ASPECT_1_1'];

    // Unsplash API endpoint with parameters
    const params = new URLSearchParams({
      query: keywords,
      orientation: orientation,
      content_filter: 'high',
      count: '1'
    });

    // Using Unsplash source API (no key required for basic usage)
    // For production, should use official API with access key
    const response = await fetch(`${UNSPLASH_API_URL}?${params}`);

    console.log('[IMAGE GEN] Response status:', response.status);

    if (!response.ok) {
      console.error('[IMAGE GEN] Unsplash API error:', response.status);
      // Return placeholder if Unsplash fails
      return getPlaceholderImage(options.aspectRatio || 'ASPECT_1_1', keywords);
    }

    const data = await response.json();
    
    if (data && data.urls) {
      const imageUrl = data.urls.regular; // High quality image
      console.log('[IMAGE GEN] Successfully fetched image:', imageUrl);
      
      return {
        url: imageUrl,
        prompt: keywords,
        resolution: `${data.width}x${data.height}`,
      };
    }

    console.error('[IMAGE GEN] No image data in response');
    return getPlaceholderImage(options.aspectRatio || 'ASPECT_1_1', keywords);
  } catch (error) {
    console.error('[IMAGE GEN] Image fetch failed with error:', error);
    return getPlaceholderImage(options.aspectRatio || 'ASPECT_1_1', options.prompt);
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

// Fallback placeholder image
function getPlaceholderImage(aspectRatio: string, keywords: string): GeneratedImage {
  const sizeMap: Record<string, string> = {
    'ASPECT_1_1': '1080x1080',
    'ASPECT_16_9': '1920x1080',
    'ASPECT_4_3': '1600x1200',
    'ASPECT_3_4': '1200x1600',
    'ASPECT_9_16': '1080x1920',
  };
  
  const size = sizeMap[aspectRatio] || '1080x1080';
  const [width, height] = size.split('x');
  
  // Use placeholder.com as fallback
  return {
    url: `https://via.placeholder.com/${size}/0066CC/FFFFFF?text=${encodeURIComponent(keywords)}`,
    prompt: keywords,
    resolution: size,
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

