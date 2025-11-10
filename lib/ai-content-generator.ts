// AI Content Generation using OpenAI GPT-4

import { PackInput } from './types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface AIGenerationResult {
  content: string;
  tokensUsed: number;
  cost: number;
}

export async function generateAIContent(
  prompt: string,
  systemPrompt: string,
  model: string = 'gpt-4'
): Promise<AIGenerationResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OPENAI_API_KEY not found. Falling back to templates.');
    return null;
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000, // Increased to allow for 1000-1200 word blogs
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;
    
    // Cost calculation (GPT-4: $0.03/1K input, $0.06/1K output)
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;
    const cost = (inputTokens / 1000 * 0.03) + (outputTokens / 1000 * 0.06);

    return {
      content,
      tokensUsed,
      cost,
    };
  } catch (error) {
    console.error('AI content generation failed:', error);
    return null;
  }
}

export async function generateBlogPostAI(
  input: PackInput,
  seedContent: string
): Promise<AIGenerationResult | null> {
  const { business, offer, keywords, angle } = input;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
  const primaryKeyword = keywordList[0] || 'business growth';

  const systemPrompt = `You are an expert SEO content writer and local search specialist with 10+ years of experience. 
Your writing style is ${business.voice}.
You create comprehensive, SEO-optimized blog posts that rank on page 1 of Google for local search queries.
You understand E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) principles and semantic SEO.
Always include proper HTML structure with h2/h3 headings, paragraphs, and lists.`;

  const prompt = `You MUST write a COMPREHENSIVE, SEO-optimized blog post of EXACTLY 1000-1200 words for ${business.businessName}, a business serving ${business.region}.

**CRITICAL REQUIREMENT - READ CAREFULLY:**
- MINIMUM 1000 words, MAXIMUM 1200 words
- This is NOT optional - the article WILL BE REJECTED if under 1000 words
- Write in FULL detail with substantial, in-depth content
- Each section needs 3-5 FULL paragraphs (not short ones)
- DO NOT summarize - expand every point thoroughly
- Count your words as you write to ensure you hit 1000+ words

**Business Info:**
- Business Name: ${business.businessName}
- Value Proposition: ${business.valueProp}
- Target Region: ${business.region}
- Brand Voice: ${business.voice}
- Website: ${business.website}

**Primary SEO Target:**
- Main Keyword: "${primaryKeyword}" (use 5-7 times naturally)
- Secondary Keywords: ${keywordList.slice(1, 4).join(', ')} (use 2-3 times each)
- Long-tail variations: "${primaryKeyword} in ${business.region}", "${primaryKeyword} near me", "best ${primaryKeyword} ${business.region}"
- Content Angle: ${angle || 'Comprehensive guide with actionable advice'}

**Local SEO (GEO) Requirements:**
- Mention "${business.region}" 8-12 times naturally throughout
- Include nearby cities/neighborhoods if relevant
- Reference local landmarks, events, or context where appropriate
- Use phrases like "local businesses in ${business.region}", "${business.region} area", "serving ${business.region}"
- Include "near me" variations naturally

**Source Material:**
${seedContent ? `Base this content on the following source material (paraphrase heavily, add unique insights and local context):\n\n${seedContent.substring(0, 3000)}` : 'Create original, valuable content based on industry best practices and local market insights.'}

**Required Structure (1000-1200 words total):**

1. **Introduction (150-200 words)**
   - Hook with a local statistic or question
   - Introduce the topic and its relevance to ${business.region}
   - Include primary keyword in first 100 words
   - Briefly preview what readers will learn

2. **Main Content Sections (600-800 words across 4-6 sections)**
   Each section should have:
   - <h2> heading with keyword variations
   - 3-5 paragraphs of detailed, actionable content
   - <h3> subheadings where appropriate
   - Bullet points or numbered lists for readability
   - Real examples specific to ${business.region}
   - Statistics or data points when relevant

3. **FAQ Section (150-200 words)**
   - 3-5 common questions with <h3> tags
   - Each answer should be 2-3 sentences
   - Include long-tail keywords naturally
   - Questions should be what people actually search for

4. **Conclusion with CTA (100-150 words)**
   - Summarize key takeaways
   - Emphasize local benefits
   - Strong call-to-action: ${offer.ctaText}
   - Reinforce expertise serving ${business.region}

**Advanced SEO Requirements:**
✅ Use primary keyword in first paragraph
✅ Include variations in h2/h3 headings (don't repeat exact phrase)
✅ Write in active voice, short sentences (15-20 words average)
✅ Include transition words (However, Therefore, Additionally, etc.)
✅ Add semantic keywords (related concepts, synonyms)
✅ Use schema-friendly FAQ format
✅ Include numbers and data where possible
✅ Make it scannable: short paragraphs (2-4 sentences), bullet points
✅ Natural language - conversational yet authoritative

**Local SEO Elements:**
✅ Geographic keywords in subheadings
✅ Local statistics or case studies
✅ Nearby city/neighborhood mentions
✅ "Near me" optimization phrases
✅ Service area references
✅ Community-focused language

**What to AVOID:**
❌ Keyword stuffing
❌ Generic advice that could apply anywhere
❌ Overly promotional language
❌ Short paragraphs with no substance
❌ Duplicate content from source material
❌ Vague claims without specifics

**Output Format:**
Return ONLY the blog content in clean, semantic HTML format:
- Use <h2> for main sections
- Use <h3> for subsections and FAQs
- Use <p> for paragraphs
- Use <ul>/<ol> and <li> for lists
- Use <strong> for emphasis (sparingly)
- Do NOT include <html>, <head>, <body>, or <h1> tags
- Start directly with content

**REMINDER: This MUST be 1000-1200 words. Write substantial, detailed content.**`;

  return await generateAIContent(prompt, systemPrompt, 'gpt-4o-mini');
}

export async function generateSocialPostAI(
  platform: string,
  day: number,
  input: PackInput,
  seedContent: string
): Promise<AIGenerationResult | null> {
  const { business, offer, keywords } = input;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);

  const platformGuidelines: Record<string, string> = {
    facebook: `
Platform: Facebook
Format: 1-2 short paragraphs, conversational and engaging
Length: 100-300 characters ideal
Hashtags: 3-5 relevant hashtags
Tone: Warm, friendly, community-focused
Include: Question or conversation starter
CTA: Soft, inviting`,
    
    instagram: `
Platform: Instagram
Format: Scannable caption with line breaks and emojis
Length: 150-300 characters (keep it punchy)
Hashtags: 8-15 highly relevant hashtags (group at end)
Tone: Visual, aesthetic, aspirational
Include: Hook in first line, value in middle, CTA at end
Emojis: Use strategically (2-4)`,
    
    linkedin: `
Platform: LinkedIn
Format: Professional value-focused post
Length: 200-400 characters
Structure: Hook → Value/Insight → 3-4 bullet points → CTA
Hashtags: 3-6 professional hashtags
Tone: Professional, authoritative, thought-leadership
Include: Data point or insight, clear business value`,
    
    gbp: `
Platform: Google Business Profile
Format: Ultra-concise business update
Length: 100-300 characters MAX
Tone: Direct, action-oriented, local
Include: One clear benefit + CTA
No hashtags needed`,
  };

  const systemPrompt = `You are a social media expert creating platform-native content for local businesses.
Your writing style is ${business.voice}.
You understand platform algorithms, engagement tactics, and what makes content shareable.`;

  const prompt = `Create a ${platform} post for ${business.businessName} serving ${business.region}.

**Business Context:**
- Value Proposition: ${business.valueProp}
- Region: ${business.region}
- Keywords: ${keywordList.join(', ')}
- CTA: ${offer.ctaText}
- CTA URL: ${offer.ctaUrl}

**Platform Guidelines:**
${platformGuidelines[platform]}

**Content Seed:**
${seedContent ? `Draw inspiration from (but don't copy directly):\n${seedContent.substring(0, 500)}` : `Create original content about ${keywordList[0]}`}

**This is Day ${day} of 5**, so vary the angle:
- Day 1: Problem/Pain point
- Day 2: Solution/How-to
- Day 3: Social proof/Result
- Day 4: Myth-busting/Common mistake
- Day 5: CTA-focused/Offer

**Output Format:**
Return ONLY the post text. Include hashtags where appropriate for the platform.
For Instagram, group hashtags at the end on separate lines.
Do NOT include any metadata, just the post content.`;

  return await generateAIContent(prompt, systemPrompt, 'gpt-4o-mini');
}

export async function generateYouTubeTitleAI(
  input: PackInput
): Promise<AIGenerationResult | null> {
  const { business, keywords } = input;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);

  const systemPrompt = `You are a YouTube SEO expert. You create click-worthy, search-optimized titles that balance keywords with curiosity.`;

  const prompt = `Create a YouTube video title for ${business.businessName} serving ${business.region}.

**Requirements:**
- Maximum 70 characters (strict limit)
- Include primary keyword: ${keywordList[0]}
- Mention ${business.region} if it fits naturally
- Make it clickable and engaging
- Format: [Main Benefit/Hook] | [Location Context if space]

**Examples of good structure:**
- "5 SEO Mistakes Phoenix Businesses Make (And How to Fix Them)"
- "Digital Marketing in Phoenix: Complete 2025 Guide"
- "Grow Your Phoenix Business Fast: Proven Local Strategies"

Output ONLY the title text, nothing else.`;

  return await generateAIContent(prompt, systemPrompt, 'gpt-4o-mini');
}

export async function generateYouTubeDescriptionAI(
  input: PackInput,
  seedContent: string
): Promise<AIGenerationResult | null> {
  const { business, offer, keywords } = input;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);

  const systemPrompt = `You are a YouTube content strategist. You write descriptions that boost SEO, provide value, and drive action.`;

  const prompt = `Create a YouTube video description for ${business.businessName} serving ${business.region}.

**Business Context:**
- Value Proposition: ${business.valueProp}
- Keywords: ${keywordList.join(', ')}
- CTA: ${offer.ctaText}
- Website: ${business.website}
- CTA URL: ${offer.ctaUrl}

**Content Theme:**
${seedContent ? `Based on: ${seedContent.substring(0, 500)}` : `Topic: ${keywordList[0]}`}

**Structure Required:**
1. Hook (2-3 lines): What this video covers and why it matters
2. What You'll Learn (3-5 bullet points)
3. About Section: Brief intro to ${business.businessName}
4. Links:
   - ${offer.ctaText}: ${offer.ctaUrl}
   - Website: ${business.website}
5. Hashtags: 5-10 relevant tags (${keywordList.map(k => '#' + k.replace(/\s+/g, '')).join(' ')})

**SEO Guidelines:**
- Front-load important keywords
- Make first 2-3 lines compelling (visible before "show more")
- Natural keyword integration
- Include location mentions

Output the complete description ready to paste into YouTube.`;

  return await generateAIContent(prompt, systemPrompt, 'gpt-4o-mini');
}

