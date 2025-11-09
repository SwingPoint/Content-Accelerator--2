# 📁 Content Accelerator 2.0 - Project Structure

```
Content-Accelerator--2/
│
├── 📱 app/                          # Next.js App Router
│   ├── blog/                        # Generated blog posts
│   │   ├── .gitkeep
│   │   └── [slug]/                  # Dynamic routes (created on generation)
│   │       └── page.tsx             # SSR blog post with SEO
│   │
│   ├── packs/                       # Pack management UI
│   │   ├── page.tsx                 # List all packs
│   │   └── new/                     # Create new pack
│   │       ├── page.tsx             # Form UI
│   │       └── actions.ts           # Server action (generates files)
│   │
│   ├── page.tsx                     # Homepage
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global styles + prose
│   ├── robots.ts                    # SEO: robots.txt
│   └── sitemap.ts                   # SEO: dynamic sitemap
│
├── 🔧 lib/                          # Core logic
│   ├── generator.ts                 # Content generation engine
│   │   ├── generatePack()           # Main orchestrator
│   │   ├── generateBlogPage()       # Blog TSX with metadata
│   │   ├── generateSocialPost()     # Platform-specific posts
│   │   ├── generateYouTubeTitle()   # YT optimization
│   │   ├── generateSchedulerJSON()  # Mon-Fri schedule
│   │   └── generateReviewJSON()     # Editable review file
│   │
│   └── types.ts                     # TypeScript interfaces
│       ├── PackInput                # User input schema
│       ├── GeneratedPack            # Output schema
│       └── PackFile                 # File structure
│
├── 📝 content/                      # Seed & attribution
│   ├── .gitkeep
│   └── [slug]/                      # Generated per pack
│       ├── seed.txt                 # Original seed content
│       └── sources.md               # Attribution & citations
│
├── 📱 social/                       # Platform-native posts
│   ├── .gitkeep
│   ├── facebook/[slug]/
│   │   └── day-1.md ... day-5.md    # 1-2 para + hashtags
│   ├── instagram/[slug]/
│   │   └── day-1.md ... day-5.md    # Scannable + 8-15 hashtags
│   ├── linkedin/[slug]/
│   │   └── day-1.md ... day-5.md    # Value + bullets + hashtags
│   ├── gbp/[slug]/
│   │   └── day-1.md ... day-5.md    # 100-300 chars
│   └── youtube/[slug]/
│       ├── title.txt                # ≤70 chars
│       └── description.md           # Hook + CTA + tags
│
├── 📋 review/                       # Human review files
│   ├── .gitkeep
│   └── [slug].json                  # Editable fields + asset map
│       ├── status: "draft"
│       ├── editable: {...}
│       ├── notes: {...}
│       └── assets: {...}
│
├── 📅 scheduler/                    # Posting schedule
│   ├── .gitkeep
│   └── [slug].json                  # Mon-Fri ISO timestamps
│       ├── timezone
│       └── items: [{day, platform, time, path}]
│
├── ⚙️ Config Files
│   ├── package.json                 # Dependencies (Next, React, TS, Tailwind)
│   ├── tsconfig.json                # TypeScript config
│   ├── next.config.js               # Next.js config (standalone)
│   ├── tailwind.config.ts           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   └── .gitignore                   # Git ignore rules
│
└── 📚 Documentation
    ├── README.md                    # Complete documentation
    ├── SETUP.md                     # Quick setup guide
    ├── INSTALL.md                   # Step-by-step installation
    ├── CHECKLIST.md                 # Feature verification
    └── PROJECT-STRUCTURE.md         # This file
```

## 🔄 Data Flow

```
User Input (Form)
    ↓
Server Action (/app/packs/new/actions.ts)
    ↓
Generator (/lib/generator.ts)
    ↓
├─→ generateBlogPage()          → app/blog/[slug]/page.tsx
├─→ generateSocialPost() × 25   → social/{platform}/[slug]/day-{1-5}.md
├─→ generateYouTubeTitle()      → social/youtube/[slug]/title.txt
├─→ generateYouTubeDescription() → social/youtube/[slug]/description.md
├─→ generateReviewJSON()        → review/[slug].json
├─→ generateSchedulerJSON()     → scheduler/[slug].json
└─→ generateSources()           → content/[slug]/sources.md
    ↓
File Write Attempt
    ├─→ Success (Local/Self-hosted)
    │   └─→ Files written to filesystem
    └─→ Fail (Vercel)
        └─→ Bundle returned to UI (copy-paste)
```

## 🎨 UI Flow

```
/ (Homepage)
    ├─→ /packs (List View)
    │   ├─→ /packs/new (Create Form)
    │   │   └─→ Submit → Server Action → Files Generated
    │   └─→ View existing packs
    └─→ /blog/[slug] (Generated Blog Posts)
```

## 📦 Generated Pack Structure

When you create a pack with slug `week-1-seo`, you get:

```
app/blog/week-1-seo/page.tsx                # Blog post (SSR)

content/week-1-seo/
├── seed.txt                                # Original seed
└── sources.md                              # Attribution

social/
├── facebook/week-1-seo/
│   ├── day-1.md
│   ├── day-2.md
│   ├── day-3.md
│   ├── day-4.md
│   └── day-5.md
├── instagram/week-1-seo/
│   ├── day-1.md ... day-5.md
├── linkedin/week-1-seo/
│   ├── day-1.md ... day-5.md
├── gbp/week-1-seo/
│   ├── day-1.md ... day-5.md
└── youtube/week-1-seo/
    ├── title.txt
    └── description.md

review/week-1-seo.json                      # Editable review
scheduler/week-1-seo.json                   # Mon-Fri schedule
```

**Total files per pack:** 28 files

## 🔑 Key Features by File

| File | Purpose | Key Features |
|------|---------|--------------|
| `app/blog/[slug]/page.tsx` | SSR Blog | Metadata, JSON-LD (Article + FAQ), SEO tags, Sources |
| `app/packs/new/page.tsx` | Form UI | Input validation, pending state, result display |
| `app/packs/new/actions.ts` | Generation | File writes (local) or bundle export (Vercel) |
| `lib/generator.ts` | Content Engine | Platform-native posts, SEO optimization, scheduling |
| `review/[slug].json` | Human Review | Editable fields, asset map, status tracking |
| `scheduler/[slug].json` | Schedule Plan | Mon-Fri, timezone-aware, platform-specific times |
| `app/robots.ts` | SEO Crawler | Allow AI bots, Googlebot, Bingbot |
| `app/sitemap.ts` | SEO Index | Dynamic blog routes, lastmod dates |

## 📊 Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 14 | App Router, SSR, Server Actions |
| Language | TypeScript 5 | Type safety, better DX |
| Styling | Tailwind CSS 3 | Utility-first CSS |
| Rendering | React 18 | Server + Client Components |
| Build | Next.js | Zero-config builds |
| Deployment | Vercel / Self-hosted | Flexible hosting |

## 🚫 What's NOT Included (by design)

- ❌ Database (file-based content)
- ❌ Authentication (single-user system)
- ❌ OAuth integrations
- ❌ Image generation (Sharp, Canvas)
- ❌ External APIs (except seed URL fetch)
- ❌ Autoposting (review-first workflow)
- ❌ CMS (direct file editing)
- ❌ User management
- ❌ Payment processing
- ❌ Analytics tracking

## 📈 Scalability Notes

**Single User:**
- Perfect for 1 business, 1 brand, 1 content creator

**Multiple Packs:**
- Create unlimited packs (limited by filesystem only)
- Each pack is independent
- No database means no scaling issues

**Performance:**
- Static generation where possible
- SSR for blog posts (SEO benefit)
- Minimal JavaScript bundle
- Fast page loads

**Maintenance:**
- Zero dependencies to update (except Next.js/React)
- No database migrations
- No schema changes
- Files = source of truth

---

**Next Steps:**
1. Run `npm install`
2. Run `npm run dev`
3. Open `http://localhost:3000`
4. Create your first pack!

See `INSTALL.md` for detailed instructions.

