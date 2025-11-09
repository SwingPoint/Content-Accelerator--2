# 🚀 Installation Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Step-by-Step Installation

### 1. Clone Repository (if not already done)

```bash
git clone https://github.com/SwingPoint/Content-Accelerator--2.git
cd Content-Accelerator--2
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- PostCSS & Autoprefixer

**Total install size:** ~200MB (all dependencies)

### 3. Run Development Server

```bash
npm run dev
```

You should see:
```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Ready in X.Xs
```

### 4. Open Browser

Navigate to: **http://localhost:3000**

You should see the Content Accelerator homepage!

### 5. Create Your First Pack

1. Click **"Create New Pack"**
2. Fill in the form (example below)
3. Click **"Generate Pack"**

#### Example Test Pack

```
Slug: test-week-1
Seed URL: (leave blank for test)
Seed Text: "Digital marketing is essential for modern businesses..."
Angle: Localize to Phoenix

Business Name: Test Agency
Region: Phoenix, AZ
Website: https://testagency.com
Value Prop: We help businesses grow online
Voice: Professional

CTA Text: Get Started Today
CTA URL: https://testagency.com/contact
Keywords: digital marketing, SEO, Phoenix
Timezone: America/Phoenix
```

### 6. Verify Files Generated

Check these directories:
```bash
ls app/blog/test-week-1/
ls social/facebook/test-week-1/
ls review/test-week-1.json
ls scheduler/test-week-1.json
```

### 7. View Generated Blog

Navigate to: **http://localhost:3000/blog/test-week-1**

## Production Build

### Test Production Build Locally

```bash
npm run build
npm run start
```

Navigate to: **http://localhost:3000**

### Deploy to Vercel

#### Option A: Via Vercel Dashboard
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy (zero config needed)

#### Option B: Via CLI
```bash
npm i -g vercel
vercel login
vercel
```

#### Environment Variables (Optional)
In Vercel dashboard, add:
- `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`

## Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules .next
npm install
npm run dev
```

### TypeScript errors

```bash
npm run build
```
Fix any errors shown, then retry.

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

Or kill the existing process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Vercel Deployment Issues

**File writes fail on Vercel** (expected):
- System will show "bundle mode"
- Copy-paste files manually from UI
- Commit to git
- Vercel auto-deploys

## File Permissions (Self-Hosted)

Ensure write permissions for:
```bash
chmod -R 755 app/blog/
chmod -R 755 content/
chmod -R 755 social/
chmod -R 755 review/
chmod -R 755 scheduler/
```

## What's Next?

1. **Customize generator logic**: Edit `/lib/generator.ts`
2. **Adjust blog styling**: Modify `/app/globals.css`
3. **Change form fields**: Edit `/app/packs/new/page.tsx`
4. **Update scheduling**: Modify `generateSchedulerJSON()` in `/lib/generator.ts`

## Support

- Check `README.md` for full documentation
- Check `SETUP.md` for examples
- Check `CHECKLIST.md` for feature verification

---

**Installation complete!** 🎉

Start creating content packs and dominating your market!

