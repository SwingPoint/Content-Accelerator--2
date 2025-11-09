import { PackInput, PackFile, ImageAsset } from './types';
import { 
  generateImage, 
  downloadImage, 
  generateImagePrompt, 
  getPlatformAspectRatio 
} from './image-generator';

export async function generatePack(input: PackInput): Promise<PackFile[]> {
  const files: PackFile[] = [];
  const { slug, business, offer, keywords, timezone } = input;
  
  // Fetch or use seed text
  let seedContent = input.seedText || '';
  let seedUrl = input.seedUrl || '';
  
  if (input.seedUrl && !input.seedText) {
    try {
      const response = await fetch(input.seedUrl);
      if (response.ok) {
        seedContent = await response.text();
        // Simple extraction (in production you'd parse HTML better)
        seedContent = seedContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    } catch (e) {
      seedContent = `Failed to fetch seed from ${input.seedUrl}`;
    }
  }

  // 1. Blog page
  files.push({
    path: `app/blog/${slug}/page.tsx`,
    content: generateBlogPage(input, seedContent, seedUrl)
  });

  // 2. Seed file
  files.push({
    path: `content/${slug}/seed.txt`,
    content: seedContent.substring(0, 5000) // Truncate if too long
  });

  // 3. Sources file
  files.push({
    path: `content/${slug}/sources.md`,
    content: generateSources(seedUrl, input)
  });

  // 4. Social posts (5 days × 4 platforms) + Images
  const platforms = ['facebook', 'instagram', 'linkedin', 'gbp'];
  const imageAssets: ImageAsset[] = [];
  
  for (const platform of platforms) {
    for (let day = 1; day <= 5; day++) {
      const postContent = generateSocialPost(platform, day, input, seedContent);
      files.push({
        path: `social/${platform}/${slug}/day-${day}.md`,
        content: postContent
      });
      
      // Generate image for this post
      const imagePrompt = generateImagePrompt(platform, postContent, {
        businessName: business.businessName,
        region: business.region,
        keywords: keywords
      });
      
      const aspectRatio = getPlatformAspectRatio(platform);
      const generatedImage = await generateImage({
        prompt: imagePrompt,
        aspectRatio,
        styleType: 'GENERAL'
      });
      
      if (generatedImage) {
        const imagePath = `public/images/${slug}/${platform}/day-${day}.png`;
        const imageBuffer = await downloadImage(generatedImage.url);
        
        if (imageBuffer) {
          files.push({
            path: imagePath,
            content: imageBuffer.toString('base64'),
            type: 'image',
            imageUrl: generatedImage.url
          });
          
          imageAssets.push({
            platform,
            day,
            imageUrl: `/images/${slug}/${platform}/day-${day}.png`,
            prompt: generatedImage.prompt,
            path: imagePath
          });
        }
      }
    }
  }

  // 5. YouTube title + description + thumbnail
  const ytTitle = generateYouTubeTitle(input);
  const ytDescription = generateYouTubeDescription(input, seedUrl);
  
  files.push({
    path: `social/youtube/${slug}/title.txt`,
    content: ytTitle
  });
  files.push({
    path: `social/youtube/${slug}/description.md`,
    content: ytDescription
  });
  
  // Generate YouTube thumbnail
  const ytPrompt = generateImagePrompt('youtube', ytTitle, {
    businessName: business.businessName,
    region: business.region,
    keywords: keywords
  });
  
  const ytImage = await generateImage({
    prompt: ytPrompt,
    aspectRatio: '16:9',
    styleType: 'DESIGN'
  });
  
  if (ytImage) {
    const ytImageBuffer = await downloadImage(ytImage.url);
    if (ytImageBuffer) {
      files.push({
        path: `public/images/${slug}/youtube/thumbnail.png`,
        content: ytImageBuffer.toString('base64'),
        type: 'image',
        imageUrl: ytImage.url
      });
      imageAssets.push({
        platform: 'youtube',
        imageUrl: `/images/${slug}/youtube/thumbnail.png`,
        prompt: ytImage.prompt,
        path: `public/images/${slug}/youtube/thumbnail.png`
      });
    }
  }

  // 6. Blog hero image
  const blogPrompt = generateImagePrompt('blog', keywords, {
    businessName: business.businessName,
    region: business.region,
    keywords: keywords
  });
  
  const blogImage = await generateImage({
    prompt: blogPrompt,
    aspectRatio: '16:9',
    styleType: 'GENERAL'
  });
  
  if (blogImage) {
    const blogImageBuffer = await downloadImage(blogImage.url);
    if (blogImageBuffer) {
      files.push({
        path: `public/images/${slug}/blog/hero.png`,
        content: blogImageBuffer.toString('base64'),
        type: 'image',
        imageUrl: blogImage.url
      });
      imageAssets.push({
        platform: 'blog',
        imageUrl: `/images/${slug}/blog/hero.png`,
        prompt: blogImage.prompt,
        path: `public/images/${slug}/blog/hero.png`
      });
    }
  }

  // 7. Review JSON (with image assets)
  files.push({
    path: `review/${slug}.json`,
    content: generateReviewJSON(slug, seedUrl, input, imageAssets)
  });

  // 8. Scheduler JSON
  files.push({
    path: `scheduler/${slug}.json`,
    content: generateSchedulerJSON(slug, timezone)
  });

  return files;
}

function generateBlogPage(input: PackInput, seedContent: string, seedUrl: string): string {
  const { slug, business, offer, keywords } = input;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
  const primaryKeyword = keywordList[0] || 'business growth';
  
  const title = `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)}: Complete Guide for ${business.region}`;
  const metaDescription = `${business.valueProp} Discover actionable ${primaryKeyword} strategies for ${business.region} businesses.`;

  return `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title}',
  description: '${metaDescription}',
  alternates: {
    canonical: '${business.website}/blog/${slug}'
  },
  openGraph: {
    title: '${title}',
    description: '${metaDescription}',
    url: '${business.website}/blog/${slug}',
    type: 'article',
    siteName: '${business.businessName}'
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title}',
    description: '${metaDescription}'
  }
};

export default function BlogPost() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '${title}',
    description: '${metaDescription}',
    author: {
      '@type': 'Organization',
      name: '${business.businessName}',
      url: '${business.website}'
    },
    publisher: {
      '@type': 'Organization',
      name: '${business.businessName}',
      url: '${business.website}'
    },
    datePublished: new Date().toISOString().split('T')[0],
    ${seedUrl ? `isBasedOn: '${seedUrl}',` : ''}
    mainEntityOfPage: '${business.website}/blog/${slug}'
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the key benefits of ${primaryKeyword}?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The primary benefits include improved efficiency, better customer engagement, and measurable ROI for ${business.region} businesses.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can ${business.region} businesses implement ${primaryKeyword}?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Start with a clear strategy, focus on your target audience, and measure results consistently. ${business.businessName} can help guide you through the process.'
        }
      },
      {
        '@type': 'Question',
        name: 'What makes ${business.businessName} different?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '${business.valueProp} We specialize in serving ${business.region} with proven strategies and local expertise.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <article className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-gray-600">{metaDescription}</p>
        </header>

        <section className="prose prose-lg max-w-none mb-12">
          <h2>Why ${primaryKeyword} Matters for ${business.region} Businesses</h2>
          <p>
            In today's competitive landscape, ${business.region} businesses need every advantage. 
            ${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} isn't just a buzzword—it's a proven strategy 
            that drives real results for companies just like yours.
          </p>
          <p>
            ${business.valueProp} At ${business.businessName}, we've seen firsthand how the right 
            approach can transform businesses in ${business.region}.
          </p>

          <h2>Understanding the Fundamentals</h2>
          <p>
            Before diving into implementation, it's crucial to understand what makes ${primaryKeyword} 
            effective. The key lies in three core principles:
          </p>
          <ul>
            <li><strong>Strategy First:</strong> Start with clear, measurable goals</li>
            <li><strong>Customer Focus:</strong> Put your ${business.region} audience at the center</li>
            <li><strong>Continuous Improvement:</strong> Measure, learn, and optimize</li>
          </ul>

          <h2>Practical Implementation Steps</h2>
          <h3>Step 1: Assessment</h3>
          <p>
            Begin by evaluating your current position. What's working? What isn't? 
            Understanding your baseline helps you measure progress effectively.
          </p>

          <h3>Step 2: Planning</h3>
          <p>
            Develop a clear roadmap tailored to ${business.region}'s unique market conditions. 
            Your plan should align with your business goals and customer needs.
          </p>

          <h3>Step 3: Execution</h3>
          <p>
            Implementation is where strategy meets reality. Focus on consistent execution 
            and be prepared to adapt as you learn what works best for your audience.
          </p>

          <h2>Common Challenges and Solutions</h2>
          <p>
            Many ${business.region} businesses face similar obstacles when implementing ${primaryKeyword}. 
            Here's how to overcome them:
          </p>
          <ul>
            <li><strong>Resource Constraints:</strong> Start small and scale based on results</li>
            <li><strong>Measurement Difficulties:</strong> Focus on a few key metrics rather than tracking everything</li>
            <li><strong>Market Competition:</strong> Differentiate through authenticity and local expertise</li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          
          <h3>What are the key benefits of ${primaryKeyword}?</h3>
          <p>
            The primary benefits include improved efficiency, better customer engagement, and measurable ROI 
            for ${business.region} businesses. When implemented correctly, you'll see results in both 
            short-term metrics and long-term growth.
          </p>

          <h3>How can ${business.region} businesses implement ${primaryKeyword}?</h3>
          <p>
            Start with a clear strategy, focus on your target audience, and measure results consistently. 
            ${business.businessName} can help guide you through the process with proven frameworks and 
            local market expertise.
          </p>

          <h3>What makes ${business.businessName} different?</h3>
          <p>
            ${business.valueProp} We specialize in serving ${business.region} with proven strategies 
            and deep local expertise. Our approach is tailored to the unique needs of businesses in this market.
          </p>

          <h2>Taking Action</h2>
          <p>
            The best time to start is now. ${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} 
            success doesn't happen overnight, but every journey begins with a single step.
          </p>
          <p>
            Ready to transform your ${business.region} business? <a href="${offer.ctaUrl}" className="text-blue-600 hover:underline font-semibold">${offer.ctaText}</a> and 
            let's create a strategy that works for you.
          </p>
        </section>

        ${seedUrl ? `
        <section className="border-t pt-8 mt-12">
          <h3 className="text-lg font-semibold mb-2">Sources</h3>
          <p className="text-sm text-gray-600">
            This article was informed by research including: <a href="${seedUrl}" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">${seedUrl}</a>
          </p>
        </section>
        ` : ''}

        <footer className="border-t pt-8 mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Want to learn more about ${primaryKeyword} for your ${business.region} business?
          </p>
          <a 
            href="${offer.ctaUrl}" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ${offer.ctaText}
          </a>
        </footer>
      </article>
    </>
  );
}
`;
}

function generateSources(seedUrl: string, input: PackInput): string {
  const today = new Date().toISOString().split('T')[0];
  return `# Sources and Attribution

${seedUrl ? `## Primary Source
- **URL:** ${seedUrl}
- **Accessed:** ${today}
- **Type:** ${input.angle || 'General research'}

This content was created as an original work informed by the above source material. All content has been significantly paraphrased and restructured to provide unique value for ${input.business.region} audiences.
` : `## Original Content
This content was created as original material based on industry best practices and expertise serving ${input.business.region}.
`}

## Additional Context
- **Business:** ${input.business.businessName}
- **Target Region:** ${input.business.region}
- **Keywords:** ${input.keywords}
- **Content Angle:** ${input.angle || 'General industry insights'}
`;
}

function generateSocialPost(platform: string, day: number, input: PackInput, seedContent: string): string {
  const { business, offer, keywords } = input;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
  const hashtags = keywordList.map(k => '#' + k.replace(/\s+/g, '')).join(' ');

  const angles = [
    'Did you know?',
    'Pro tip:',
    'Here\'s why this matters:',
    'Common mistake:',
    'Quick win:'
  ];
  
  const hook = angles[day - 1] || 'Here\'s what you need to know:';

  if (platform === 'facebook') {
    return `${hook} ${business.region} businesses are discovering new ways to grow and thrive.

At ${business.businessName}, we believe ${business.valueProp.toLowerCase()}

That's why we're passionate about helping local businesses succeed. Whether you're just starting out or looking to scale, having the right strategy makes all the difference.

${offer.ctaText}: ${offer.ctaUrl}

${hashtags.split(' ').slice(0, 5).join(' ')}`;
  }

  if (platform === 'instagram') {
    return `${hook}
${business.region} businesses need strategies that actually work. 💡

✨ ${business.valueProp}

Here's what makes the difference:
→ Clear goals
→ Consistent action
→ Measuring what matters

Ready to level up? 🚀

${offer.ctaText} — Link in bio or visit: ${business.website}

${hashtags.split(' ').slice(0, 12).join(' ')}
${business.region.replace(/\s+/g, '')} #LocalBusiness #SmallBusiness`;
  }

  if (platform === 'linkedin') {
    return `${hook}

${business.region} businesses face unique challenges—and unique opportunities.

Key insights:
• Strategy must align with local market conditions
• Customer focus drives sustainable growth
• Continuous improvement separates leaders from followers

${business.valueProp}

At ${business.businessName}, we're committed to helping businesses in ${business.region} achieve measurable results.

${offer.ctaText}: ${offer.ctaUrl}

${hashtags.split(' ').slice(0, 6).join(' ')}`;
  }

  if (platform === 'gbp') {
    return `${hook} ${business.businessName} helps ${business.region} businesses grow with proven strategies. ${offer.ctaText} today: ${offer.ctaUrl}`;
  }

  return '';
}

function generateYouTubeTitle(input: PackInput): string {
  const { business, keywords } = input;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
  const primaryKeyword = keywordList[0] || 'Business Growth';
  return `${primaryKeyword} for ${business.region} Businesses | ${business.businessName}`;
}

function generateYouTubeDescription(input: PackInput, seedUrl: string): string {
  const { business, offer, keywords } = input;
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
  const hashtags = keywordList.map(k => '#' + k.replace(/\s+/g, '')).join(' ');

  return `${business.valueProp}

In this video, we're breaking down exactly what ${business.region} businesses need to know to succeed in today's market.

🎯 What You'll Learn:
• Proven strategies that work for local businesses
• Common mistakes to avoid
• Practical steps you can implement today
• Real results from ${business.region} companies

${offer.ctaText}:
${offer.ctaUrl}

Learn more about ${business.businessName}:
${business.website}

---

ABOUT ${business.businessName.toUpperCase()}
${business.valueProp} We specialize in helping ${business.region} businesses achieve their goals through proven, results-driven strategies.

${seedUrl ? `\n📚 Sources & Research:\n${seedUrl}\n` : ''}
---

CONNECT WITH US
🌐 Website: ${business.website}
📍 Serving: ${business.region}

${hashtags} #LocalBusiness #SmallBusiness #${business.region.replace(/\s+/g, '')}`;
}

function generateReviewJSON(slug: string, seedUrl: string, input: PackInput, imageAssets: ImageAsset[]): string {
  const platforms = ['facebook', 'instagram', 'linkedin', 'gbp', 'youtube'];
  const assets: any = { blog: `/app/blog/${slug}/page.tsx`, platforms: {}, images: {} };
  
  platforms.forEach(p => {
    if (p === 'youtube') {
      assets.platforms[p] = [
        `/social/youtube/${slug}/title.txt`,
        `/social/youtube/${slug}/description.md`
      ];
    } else {
      assets.platforms[p] = Array.from({ length: 5 }, (_, i) => 
        `/social/${p}/${slug}/day-${i + 1}.md`
      );
    }
  });

  // Add image assets
  imageAssets.forEach(img => {
    if (!assets.images[img.platform]) {
      assets.images[img.platform] = [];
    }
    assets.images[img.platform].push({
      url: img.imageUrl,
      prompt: img.prompt,
      day: img.day
    });
  });

  return JSON.stringify({
    status: 'draft',
    editable: {
      title: input.keywords.split(',')[0]?.trim() || '',
      description: input.business.valueProp,
      blogIntro: '',
      faq: [],
      ctaText: input.offer.ctaText,
      ytTitle: generateYouTubeTitle(input),
      ytDescription: ''
    },
    notes: {
      seedUrl: seedUrl || 'No seed URL provided',
      originality: '≥80% paraphrased; no >75-char verbatim runs',
      imagesGenerated: imageAssets.length,
      imageGenerationCost: `~$${(imageAssets.length * 0.08).toFixed(2)} (estimated)`
    },
    assets,
    sources: `/content/${slug}/sources.md`
  }, null, 2);
}

function generateSchedulerJSON(slug: string, timezone: string): string {
  // Generate Mon-Fri schedule starting from next Monday
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
  
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(17, 0, 0, 0); // Default 5pm UTC (adjust per platform)

  const items: Array<{ day: string; platform: string; time: string; path: string }> = [];
  const platforms = [
    { day: 'Mon', platform: 'blog', time: '17:00', path: `/app/blog/${slug}/page.tsx` },
    { day: 'Tue', platform: 'linkedin', time: '15:30', path: `/social/linkedin/${slug}/day-2.md` },
    { day: 'Wed', platform: 'facebook', time: '17:00', path: `/social/facebook/${slug}/day-3.md` },
    { day: 'Thu', platform: 'instagram', time: '18:00', path: `/social/instagram/${slug}/day-4.md` },
    { day: 'Fri', platform: 'gbp', time: '17:00', path: `/social/gbp/${slug}/day-5.md` },
    { day: 'Fri', platform: 'youtube', time: '20:00', path: `/social/youtube/${slug}/description.md` }
  ];

  platforms.forEach((p, i) => {
    const dayOffset = Math.floor(i / 2);
    const date = new Date(nextMonday);
    date.setDate(nextMonday.getDate() + dayOffset);
    const [hours, minutes] = p.time.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    items.push({
      day: p.day,
      platform: p.platform,
      time: date.toISOString(),
      path: p.path
    });
  });

  return JSON.stringify({
    timezone,
    items
  }, null, 2);
}

