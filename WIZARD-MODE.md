# ✨ Wizard Mode - Step-by-Step Content Creation

Inspired by [Synth by AICV](https://www.aicoachellavalley.com/synth), the Wizard Mode provides a guided, progressive disclosure interface for creating content packs.

## 🎯 What is Wizard Mode?

Wizard Mode breaks down the content pack creation process into **10 simple steps**, asking one question at a time with visual progress tracking. This makes the process feel easier and less overwhelming than a single long form.

### Benefits:
- ✅ **Less overwhelming** - One question at a time
- ✅ **Progress tracking** - Visual progress bar and percentage
- ✅ **Better UX** - Keyboard navigation (press Enter to continue)
- ✅ **Mobile friendly** - Works great on small screens
- ✅ **Guided experience** - Clear instructions at each step
- ✅ **Beautiful results** - Celebratory completion screen

---

## 🚀 How to Access

### From Homepage:
1. Visit the homepage
2. Click the large **"Launch Wizard"** button
3. Or click **"✨ Wizard Mode"** from the packs page

### Direct URL:
- **Wizard Mode:** `/packs/new/wizard`
- **Quick Form:** `/packs/new` (original all-in-one form)

---

## 📝 The 10 Steps

### Step 1: Business Name
**Question:** "What is your business or brand name?"
- Used throughout all generated content
- Example: "Phoenix Digital Marketing"

### Step 2: Location
**Question:** "Where is your business located?"
- City, region, or area you serve
- Example: "Phoenix, AZ" or "Coachella Valley"

### Step 3: Website
**Question:** "What's your website URL?"
- Included in all content and CTAs
- Example: "https://yourwebsite.com"

### Step 4: Value Proposition
**Question:** "In one sentence, what makes your business special?"
- Your unique selling proposition
- Example: "We help local businesses dominate their market with proven digital strategies"

### Step 5: Brand Voice
**Question:** "What's your brand voice?"
- **Professional** - Formal, authoritative, business-focused
- **Friendly** - Warm, approachable, conversational
- **Witty** - Clever, humorous, engaging
- **Authoritative** - Expert, confident, thought-leadership

### Step 6: Seed Content
**Question:** "What's your seed content?"
- Paste a URL to an article/blog/video
- OR paste raw text/transcript
- Optional but recommended for better AI output

### Step 7: Content Angle
**Question:** "What angle should we take?"
- How to approach the content
- Examples: "Myth-busting", "How-to guide", "Checklist"
- Optional

### Step 8: Call-to-Action
**Question:** "What should your call-to-action be?"
- CTA text: "Get Your Free Consultation"
- CTA URL: Link to your offer/contact page

### Step 9: Keywords
**Question:** "What keywords should we focus on?"
- Comma-separated list
- Example: "SEO, digital marketing, Phoenix, local business"

### Step 10: Final Details
**Question:** "Final details"
- **Pack slug**: URL-friendly identifier (e.g., "week-1-seo-tips")
- **Timezone**: Select from dropdown (America/Los_Angeles, etc.)

---

## 🎨 UI Features

### Progress Tracking
- **Progress bar** at the top
- **Percentage** displayed (e.g., "30%")
- **Step counter** (e.g., "Step 3 of 10")

### Navigation
- **Back button** - Return to previous step
- **Next button** - Advance to next step (disabled until required fields filled)
- **Keyboard navigation** - Press Enter to continue
- **Smart validation** - Can't proceed without required info

### Visual Design
- **Gradient backgrounds** - Modern, engaging
- **Large text inputs** - Easy to read and type
- **Button cards** - For multiple choice questions
- **Smooth transitions** - Animated progress bar

### Mobile Responsive
- Full-width on mobile
- Touch-friendly buttons
- Optimized for small screens

---

## 🎉 Results Screen

After generation completes, you see:

### Success View (Local/Self-hosted):
- ✅ Celebration emoji
- ✅ Success message
- ✅ Files written count
- ✅ Quick stats (1 blog, 25 posts, 22 images)
- ✅ Action buttons:
  - "View Blog Post" - Opens generated blog
  - "View All Packs" - Go to packs list

### Bundle View (Vercel):
- 📦 Bundle ready message
- 🖼️ **Image gallery** - Preview all generated images
  - Click to download each image
  - Organized by platform
  - Shows file names
- 📝 Text files list
  - Expandable details
  - Shows file paths
- ✅ Action buttons:
  - "Create Another Pack"
  - "View All Packs"

---

## 💡 UX Patterns Inspired by Synth

From [aicoachellavalley.com/synth](https://www.aicoachellavalley.com/synth):

1. **Progressive Disclosure** - One question at a time
2. **Progress Indication** - Clear visual feedback
3. **Keyboard Shortcuts** - Press Enter to continue
4. **Validation Feedback** - Disable Next until valid
5. **Modern Design** - Gradients, shadows, smooth animations
6. **Mobile-First** - Works great on all screen sizes
7. **Celebration** - Rewarding completion screen

---

## 🆚 Wizard vs. Quick Form

### Use Wizard Mode When:
- ✅ First time using the system
- ✅ Want guided experience
- ✅ Creating content on mobile
- ✅ Prefer step-by-step process
- ✅ Want to feel progress

### Use Quick Form When:
- ✅ Experienced user
- ✅ Want to see all options at once
- ✅ Need to go back and forth between fields
- ✅ Prefer traditional forms
- ✅ Creating multiple packs quickly

---

## 🔧 Technical Implementation

### File Location
`/app/packs/new/wizard/page.tsx`

### Key Features
- **Client component** (`'use client'`)
- **State management** - useState for all form fields
- **Step validation** - `canProceedFromStep()` helper
- **Keyboard handling** - Enter key navigation
- **Progress calculation** - Dynamic percentage
- **Responsive design** - Tailwind CSS

### Server Action
Uses the same `/app/packs/new/actions.ts` as the quick form:
- `createPack(input)` - Generates all files
- Returns `mode: 'written'` or `mode: 'bundle'`
- Includes images array for preview

---

## 📱 Mobile Experience

The wizard is **optimized for mobile**:

- ✅ Full-width inputs
- ✅ Large touch targets
- ✅ No horizontal scroll
- ✅ Readable text sizes
- ✅ Thumb-friendly buttons
- ✅ Smooth scrolling
- ✅ Progressive web app ready

---

## 🎓 Best Practices

### For Users:
1. **Answer honestly** - Better input = better AI output
2. **Use good seed content** - Substantial articles work best
3. **Be specific** - Detailed answers help AI
4. **Review before posting** - AI is good but not perfect
5. **Save your answers** - Reuse for similar packs

### For Developers:
1. **Add more steps** - Easily extend with new questions
2. **Customize validation** - Adjust `canProceedFromStep()`
3. **Theme colors** - Change gradients in Tailwind classes
4. **Add animations** - Use Framer Motion for smoother transitions
5. **Track analytics** - Monitor where users drop off

---

## 🚀 Future Enhancements

Potential improvements:

- **Save progress** - Resume later
- **Skip to step** - Jump to specific questions
- **Edit previous** - Quick edit without going back
- **Templates** - Pre-fill from previous packs
- **Tooltips** - Help text on hover
- **Examples** - Show example answers
- **A/B testing** - Test different question orders
- **Branching logic** - Different questions based on answers
- **Preview** - See content preview before generating

---

## 📊 Comparison to Synth

| Feature | Synth (AICV) | Content Accelerator Wizard |
|---------|--------------|----------------------------|
| Step-by-step | ✅ Yes | ✅ Yes |
| Progress bar | ✅ Yes | ✅ Yes |
| Keyboard navigation | ✅ Yes | ✅ Yes |
| Mobile friendly | ✅ Yes | ✅ Yes |
| Output | 5 pieces | **48 pieces** (blog + 25 posts + 22 images) |
| AI Model | Google Nano Banana | **OpenAI GPT-4 + Ideogram** |
| Cost per pack | Unknown | **~$1.81** |
| Image generation | ✅ Yes | ✅ Yes (22 images) |
| Platform-native | Unknown | ✅ Yes (FB, IG, LI, GBP, YT) |
| Seed-aware | Unknown | ✅ Yes |

---

## 🎯 Key Takeaways

1. **Better UX** - Wizard mode makes complex forms feel simple
2. **Progressive disclosure** - Show one thing at a time
3. **Visual feedback** - Progress bars and percentages
4. **Mobile-first** - Works great on all devices
5. **Celebration** - Reward completion with positive feedback

---

## 🔗 Resources

- **Synth by AICV**: https://www.aicoachellavalley.com/synth
- **Wizard pattern**: https://www.nngroup.com/articles/wizards/
- **Progressive disclosure**: https://www.nngroup.com/articles/progressive-disclosure/

---

**The Wizard Mode transforms content creation from a chore into an experience!** ✨

Try it now: `/packs/new/wizard`

