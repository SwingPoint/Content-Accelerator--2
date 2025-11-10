# Export Setup Guide

Your Content Accelerator now supports exporting approved content to **Airtable**, **Google Docs**, or **CSV** format.

## 🚀 Quick Start

After generating a content pack, you'll see export buttons at the bottom of the review page:
- **📊 Airtable** - Export to an Airtable base
- **📄 Google Docs** - Create a formatted Google Doc
- **📑 CSV** - Download as a CSV file (no setup required)

---

## 📊 Airtable Setup

### 1. Create an Airtable Base
1. Go to https://airtable.com
2. Create a new base or use an existing one
3. Create a table with these fields (or let the API create them):
   - `Business Name` (Single line text)
   - `Blog Post` (Long text)
   - `Social Posts` (Long text)
   - `Image URLs` (Long text)
   - `Created At` (Date)
   - `Status` (Single select: Draft, Approved, Published)

### 2. Get Your API Key
1. Go to https://airtable.com/create/tokens
2. Click "Create new token"
3. Give it a name: "Content Accelerator"
4. Add scopes:
   - `data.records:read`
   - `data.records:write`
5. Add access to your base
6. Click "Create token" and copy it

### 3. Get Your Base ID
1. Go to https://airtable.com/api
2. Select your base
3. Copy the Base ID from the URL: `https://airtable.com/{BASE_ID}/api/docs`

### 4. Add to Vercel
```bash
vercel env add AIRTABLE_API_KEY
# Paste your API key

vercel env add AIRTABLE_BASE_ID
# Paste your Base ID

vercel env add AIRTABLE_TABLE_ID
# Enter your table name (e.g., "Content Packs")
```

Then redeploy:
```bash
vercel --prod
```

---

## 📄 Google Docs Setup

### 1. Enable Google Docs API
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable **Google Docs API**
4. Enable **Google Drive API**

### 2. Create Service Account
1. Go to **IAM & Admin > Service Accounts**
2. Click "Create Service Account"
3. Name it "Content Accelerator"
4. Click "Create and Continue"
5. Grant role: **Editor**
6. Click "Done"

### 3. Create API Key
1. Click on your service account
2. Go to **Keys** tab
3. Click "Add Key > Create new key"
4. Choose **JSON**
5. Download the key file

### 4. Get Access Token (OAuth 2.0)

**Option A: Using a Service Account (Recommended)**
```javascript
// This requires setting up a service account and using the JSON key file
// The service will handle token generation automatically
```

**Option B: Using OAuth 2.0 (For user-owned docs)**
1. Go to https://developers.google.com/oauthplayground
2. Select **Google Docs API v1**
3. Select scopes:
   - `https://www.googleapis.com/auth/documents`
   - `https://www.googleapis.com/auth/drive.file`
4. Click "Authorize APIs"
5. Exchange authorization code for tokens
6. Copy the **Access Token**

### 5. Add to Vercel
```bash
vercel env add GOOGLE_DOCS_API_KEY
# Paste your access token or service account key

vercel env add GOOGLE_DRIVE_FOLDER_ID
# (Optional) Paste folder ID where docs should be saved
```

Then redeploy:
```bash
vercel --prod
```

---

## 📑 CSV Export

**No setup required!** CSV export works out of the box.

The CSV includes:
- Type (Blog/Social)
- Platform (Facebook, Instagram, etc.)
- Day (1-5)
- Content text
- Image URLs

Perfect for importing into spreadsheets or other tools.

---

## 🧪 Testing

After adding environment variables:

1. Generate a content pack
2. Review the content
3. Click an export button
4. Check for success messages
5. View exported content in Airtable/Google Docs

---

## 🔧 Troubleshooting

### Airtable Export Fails
- ❌ **API Key invalid**: Regenerate your Airtable token
- ❌ **Base ID wrong**: Double-check the Base ID from the API docs
- ❌ **Permission denied**: Ensure your token has write access to the base

### Google Docs Export Fails
- ❌ **API not enabled**: Enable Google Docs API in Cloud Console
- ❌ **Token expired**: OAuth tokens expire; use service accounts for long-term access
- ❌ **Permission denied**: Ensure your service account has proper roles

### CSV Export Always Works
- ✅ No configuration needed
- ✅ Downloads directly to your browser

---

## 💡 Tips

1. **Use CSV for quick exports** - No setup, works immediately
2. **Use Airtable for collaboration** - Great for teams reviewing content
3. **Use Google Docs for editing** - Easy to share and edit before posting

---

## 🔒 Security Notes

- Never commit `.env.local` files to Git
- Store API keys in Vercel environment variables only
- Use service accounts for Google APIs (more secure than OAuth tokens)
- Regenerate API keys if they're ever exposed

