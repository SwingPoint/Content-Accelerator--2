# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 3. Create Your First Content Pack

1. Navigate to **"Create New Pack"**
2. Fill in the form:

### Example Input

**Seed Content:**
- Seed URL: `https://example.com/article-about-seo`
- OR paste raw text/transcript
- Angle: "Localize to Phoenix, AZ"

**Business Info:**
- Business Name: `Digital Growth Agency`
- Primary City/Region: `Phoenix, AZ`
- Website: `https://digitalgrowth.com`
- Value Prop: `We help local businesses dominate their market with proven digital strategies.`
- Brand Voice: `Professional`

**Offer & Keywords:**
- CTA Text: `Get Your Free Marketing Audit`
- CTA URL: `https://digitalgrowth.com/contact`
- Keywords: `SEO, digital marketing, Phoenix, local business, online visibility`

**Scheduling:**
- Timezone: `America/Phoenix`
- Slug: `week-1-seo-basics`

3. Click **"Generate Pack"**

## 4. Review Generated Files

After generation, you'll find:

```
/app/blog/week-1-seo-basics/page.tsx
/content/week-1-seo-basics/seed.txt
/content/week-1-seo-basics/sources.md
/social/facebook/week-1-seo-basics/day-1.md ... day-5.md
/social/instagram/week-1-seo-basics/day-1.md ... day-5.md
/social/linkedin/week-1-seo-basics/day-1.md ... day-5.md
/social/gbp/week-1-seo-basics/day-1.md ... day-5.md
/social/youtube/week-1-seo-basics/title.txt
/social/youtube/week-1-seo-basics/description.md
/review/week-1-seo-basics.json
/scheduler/week-1-seo-basics.json
```

## 5. View Your Blog Post

Navigate to: `http://localhost:3000/blog/week-1-seo-basics`

## 6. Review & Edit

1. Open `/review/week-1-seo-basics.json`
2. Edit any fields that need adjustment
3. Review social posts for each platform
4. Check the schedule in `/scheduler/week-1-seo-basics.json`

## 7. Deploy

### Local/Self-Hosted
Files are written directly. Just commit and push.

### Vercel
1. If filesystem write fails, system returns a bundle
2. Copy-paste files from the UI into your repo
3. Commit changes
4. Push to deploy

## 8. Post Content

**No autoposting** - This system generates content for review.

Use the schedule in `/scheduler/[slug].json` to manually post:
- Blog goes live automatically (SSR)
- Social posts: schedule manually on each platform
- YouTube: upload video and use generated title/description

## Troubleshooting

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### No Packs Showing
The packs list page scans `/app/blog/` for directories. If you haven't generated any packs yet, create one first.

### Vercel Deployment
Make sure `NEXT_PUBLIC_SITE_URL` is set in your Vercel environment variables for proper sitemap/robots generation.

## Next Steps

- Create multiple packs for different weeks/topics
- Customize generator logic in `/lib/generator.ts`
- Adjust form fields in `/app/packs/new/page.tsx`
- Modify blog template styles in `/lib/generator.ts` → `generateBlogPage()`

---

**Need help?** Check the main [README.md](./README.md) for detailed documentation.

