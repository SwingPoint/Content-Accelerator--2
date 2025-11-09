# 🎨 Image Generation with Ideogram.ai

The Content Accelerator now includes **automatic AI image generation** powered by Ideogram.ai for every content pack!

## 📸 What Gets Generated

For each content pack, the system automatically generates:

- **Blog hero image** (16:9, 1920x1080) - Professional hero for blog posts
- **20 social media images** - Platform-specific images for all posts:
  - 5 Facebook images (16:9)
  - 5 Instagram images (1:1 square)
  - 5 LinkedIn images (16:9)
  - 5 Google Business Profile images (4:3)
- **1 YouTube thumbnail** (16:9, 1280x720) - Eye-catching thumbnail
- **Total: ~22 images per pack**

## 🔑 Setup

### 1. Get Your Ideogram API Key

1. Go to [ideogram.ai](https://ideogram.ai)
2. Sign up for an account
3. Navigate to API settings
4. Copy your API key

### 2. Add to Environment Variables

Create a `.env.local` file in your project root:

```bash
IDEOGRAM_API_KEY=your_api_key_here
```

**For Vercel deployment:**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add: `IDEOGRAM_API_KEY` = `your_api_key_here`
4. Redeploy

## 💰 Cost

Ideogram.ai pricing (as of implementation):
- **~$0.08 per image** (V_2 model)
- **~$1.76 per pack** (22 images)

The system shows estimated costs in the review JSON after generation.

## 🎨 How It Works

### 1. Intelligent Prompt Generation

The system analyzes each post and generates contextual image prompts:

```typescript
// Example prompt for LinkedIn post
"Professional business image for Phoenix, AZ company. 
Theme: SEO strategies that work. 
Style: modern, clean, professional, corporate, business-focused, sophisticated. 
Related to: SEO, digital marketing, Phoenix"
```

### 2. Platform-Specific Styling

Different platforms get optimized images:
- **Facebook**: Social media friendly, engaging, warm colors
- **Instagram**: Vibrant, eye-catching, aesthetic composition
- **LinkedIn**: Professional, corporate, business-focused
- **GBP**: Local business, inviting, trustworthy
- **YouTube**: Eye-catching thumbnail style, bold
- **Blog**: Hero image style, wide composition

### 3. Correct Aspect Ratios

Each platform gets the right dimensions:
- Facebook/LinkedIn/YouTube/Blog: 16:9
- Instagram: 1:1 (square)
- GBP: 4:3

## 📂 File Structure

Generated images are saved to:

```
public/images/[slug]/
├── blog/
│   └── hero.png
├── facebook/
│   ├── day-1.png
│   ├── day-2.png
│   ├── day-3.png
│   ├── day-4.png
│   └── day-5.png
├── instagram/
│   └── day-1.png ... day-5.png
├── linkedin/
│   └── day-1.png ... day-5.png
├── gbp/
│   └── day-1.png ... day-5.png
└── youtube/
    └── thumbnail.png
```

## 🖼️ Using Generated Images

### Local Development

Images are automatically saved to `/public/images/[slug]/`. Access them at:

```
http://localhost:3000/images/[slug]/facebook/day-1.png
```

### On Vercel (Read-Only Filesystem)

1. System generates images and shows preview URLs
2. Click "Download →" on each image
3. Save to the correct path manually
4. Commit to your repo
5. Deploy

## 🎯 Review JSON Includes Images

The `review/[slug].json` file now includes image metadata:

```json
{
  "status": "draft",
  "assets": {
    "images": {
      "facebook": [
        {
          "url": "/images/week-1-seo/facebook/day-1.png",
          "prompt": "Professional business image...",
          "day": 1
        }
      ],
      "instagram": [...],
      "linkedin": [...],
      "gbp": [...],
      "youtube": [...]
    }
  },
  "notes": {
    "imagesGenerated": 22,
    "imageGenerationCost": "~$1.76 (estimated)"
  }
}
```

## ⚙️ Configuration

### Change Image Style

Edit `/lib/image-generator.ts`:

```typescript
const ytImage = await generateImage({
  prompt: ytPrompt,
  aspectRatio: '16:9',
  styleType: 'DESIGN' // Options: AUTO, GENERAL, REALISTIC, DESIGN, RENDER_3D, ANIME
});
```

### Custom Prompts

Modify `generateImagePrompt()` function in `/lib/image-generator.ts` to customize how prompts are generated for each platform.

### Disable Image Generation

Remove or comment out the image generation code in `/lib/generator.ts`, or set an empty `IDEOGRAM_API_KEY`.

## 🚨 Error Handling

If image generation fails:
- **System continues gracefully** - Text content is still generated
- **Logs warning** - Check console for details
- **No images in output** - Pack is still valid without images

## 🔍 Troubleshooting

### Images Not Generating

1. **Check API key**: Verify `IDEOGRAM_API_KEY` in `.env.local`
2. **Check API quota**: You may have hit rate limits
3. **Check console**: Look for error messages
4. **Test API**: Use Ideogram dashboard to verify key works

### API Rate Limits

If you hit rate limits:
- Wait a few minutes
- Check your Ideogram plan
- Reduce concurrent generations
- Contact Ideogram support

### Poor Image Quality

Adjust prompts in `/lib/image-generator.ts`:
- Add more specific keywords
- Change `styleType` parameter
- Modify platform-specific prompt templates

## 📊 Analytics

Track your usage in the Ideogram dashboard:
- Total images generated
- Cost per month
- API usage patterns

## 🎓 Best Practices

1. **Review prompts** - Check generated prompts in review JSON
2. **Test different styles** - Experiment with styleType options
3. **Monitor costs** - Keep track of monthly image generation
4. **Quality check** - Review images before posting
5. **Brand consistency** - Customize prompts for your brand voice

## 🆙 Future Enhancements

Potential improvements:
- Upload custom brand assets for consistent styling
- Image templates with overlays
- Batch regeneration of specific images
- A/B testing different image styles
- Custom image dimensions per platform

---

**Cost-saving tip:** On local development, images are cached. You can reuse them across similar packs to save on API costs.

**Pro tip:** Save your favorite prompts and tweak them in `/lib/image-generator.ts` for consistent brand imagery!

