# Content Accelerator 2.0

Transform a single seed (URL or text) into a complete 5-day content pack.

## 🎯 What It Does

Input: **One seed** (article URL, blog post, video transcript, or raw text)

Output:
- **1 SEO-optimized blog post** (SSR, Next.js App Router)
- **25 platform-native social posts** (5 days × 5 platforms)
  - Facebook
  - Instagram
  - LinkedIn
  - Google Business Profile
  - YouTube (title + description)
- **Monday–Friday schedule** (timezone-aware ISO timestamps)
- **Review JSON** (editable fields before posting)
- **Seed + Sources files** (for transparency and attribution)

## 🏗️ Architecture

**Deploy-safe design:**
- ✅ No database
- ✅ No OAuth
- ✅ No external SDKs
- ✅ No image generation libraries
- ✅ No Sharp (no native dependencies)
- ✅ Works locally (file writes) or Vercel (bundle export)

**Tech stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Server Actions

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Create Your First Pack

1. Click **"Create New Pack"**
2. Fill in:
   - **Seed**: URL or paste text
   - **Business info**: Name, region, website, value prop
   - **Offer**: CTA text + URL
   - **Keywords**: Comma-separated
   - **Timezone**: IANA format (e.g., `America/Los_Angeles`)
   - **Slug**: URL-friendly identifier (e.g., `week-45-ai-tips`)
3. Click **"Generate Pack"**
4. Review generated files in:
   - `/app/blog/[slug]/page.tsx` - Blog post
   - `/social/{platform}/[slug]/day-{1-5}.md` - Social posts
   - `/review/[slug].json` - Editable review file
   - `/scheduler/[slug].json` - Posting schedule

### Local vs. Vercel

**Local/Self-hosted:**
- Files are written directly to filesystem
- Commit and push to deploy

**Vercel:**
- Filesystem is read-only
- System returns a "bundle" with all file contents
- Copy-paste files into your repo manually
- Commit and deploy

## 📂 File Structure

```
/app
  /blog
    /[slug]
      page.tsx          # Generated blog post (SSR)
  /packs
    page.tsx            # List all packs
    /new
      page.tsx          # Form to create new pack
      actions.ts        # Server action for generation
  page.tsx              # Homepage
  layout.tsx            # Root layout
  globals.css           # Global styles
  robots.ts             # SEO: robots.txt
  sitemap.ts            # SEO: sitemap.xml

/lib
  generator.ts          # Core content generation logic
  types.ts              # TypeScript types

/content
  /[slug]
    seed.txt            # Original seed content
    sources.md          # Attribution and sources

/social
  /facebook/[slug]
    day-1.md ... day-5.md
  /instagram/[slug]
    day-1.md ... day-5.md
  /linkedin/[slug]
    day-1.md ... day-5.md
  /gbp/[slug]
    day-1.md ... day-5.md
  /youtube/[slug]
    title.txt
    description.md

/review
  /[slug].json          # Edit before posting

/scheduler
  /[slug].json          # Mon-Fri schedule
```

## 📝 Content Rules

### Blog Post (SEO/AIO/GEO)
- SSR with visible HTML
- One `<h1>`, logical `<h2>`/`<h3>` structure
- Internal links to CTA URL
- Metadata: title, description, canonical, OG, Twitter
- JSON-LD: `Article` + `FAQPage` (3-5 Q&As)
- Sources section with attribution
- Localized naturally (city/region)

### Social Posts (Platform-Native)
- **Facebook**: 1-2 paragraphs + 3-5 hashtags
- **Instagram**: Scannable caption, line breaks, 8-15 hashtags
- **LinkedIn**: Value paragraph + 3-5 bullets + 3-6 hashtags
- **GBP**: 100-300 chars, crisp CTA
- **YouTube**: Title ≤70 chars + description (hook, CTA, tags)

### Originality
- ≥80% paraphrased
- No >75-char verbatim runs from seed
- Fresh outline (don't mirror seed structure)
- Cite canonical URL in Sources

## 📅 Scheduling

Default posting windows (local time):
- **LinkedIn**: 07:30–09:30 or 12:00–13:00
- **Facebook**: 09:00–11:00 or 13:00–15:00
- **Instagram**: 09:00–10:00 or 11:00–13:00
- **GBP**: 09:00–12:00
- **YouTube**: 12:00–15:00

Mon–Fri distribution with timezone-aware ISO timestamps in `/scheduler/[slug].json`.

**No autoposting** - Review first, then schedule manually.

## 🔍 SEO Features

- `robots.ts` - Allows Googlebot, AI crawlers
- `sitemap.ts` - Includes all blog routes
- Metadata on every page
- JSON-LD structured data
- Canonical URLs
- Social sharing tags (OG, Twitter)

## 🛠️ Customization

### Change Content Generation Logic

Edit `/lib/generator.ts`:
- `generateBlogPage()` - Blog post structure
- `generateSocialPost()` - Platform-specific posts
- `generateYouTubeTitle()` / `generateYouTubeDescription()`

### Adjust Scheduling

Edit `/lib/generator.ts` → `generateSchedulerJSON()`

### Modify Form Fields

Edit `/app/packs/new/page.tsx`

## 📦 Deployment

### Vercel

```bash
npm run build
```

Deploy to Vercel:
- Zero config needed
- Environment variables:
  - `NEXT_PUBLIC_SITE_URL` (optional, for sitemap/robots)

### Self-Hosted

```bash
npm run build
npm run start
```

Or use Docker, PM2, etc.

## ✅ Final Checklist

- [x] Blog SSR page builds (TSX, metadata, JSON-LD)
- [x] Five daily posts for FB, IG, LinkedIn, GBP + YouTube
- [x] Schedule JSON (Mon–Fri, timezone-correct ISO)
- [x] Review JSON with editable fields
- [x] Seed text and sources saved
- [x] robots + sitemap present
- [x] No extra dependencies, DB, or auth
- [x] Works on Vercel and locally

## 📄 License

MIT

## 🤝 Contributing

This is a single-user system designed for simplicity. Fork and customize for your needs!

---

**Built with ❤️ using Next.js 14, TypeScript, and zero complexity.**

