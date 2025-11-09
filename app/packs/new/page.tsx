'use client';

import { useState } from 'react';
import { createPack } from './actions';
import Link from 'next/link';

export default function NewPackPage() {
  const [seedUrl, setSeedUrl] = useState('');
  const [seedText, setSeedText] = useState('');
  const [angle, setAngle] = useState('');
  const [mustInclude, setMustInclude] = useState('');
  const [offLimits, setOffLimits] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [region, setRegion] = useState('');
  const [website, setWebsite] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [voice, setVoice] = useState<'professional' | 'friendly' | 'witty' | 'authoritative'>('professional');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [slug, setSlug] = useState('');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setResult(null);

    const payload = {
      seedUrl: seedUrl || undefined,
      seedText: seedText || undefined,
      angle: angle || undefined,
      mustInclude: mustInclude || undefined,
      offLimits: offLimits || undefined,
      business: { businessName, region, website, valueProp, voice },
      offer: { ctaText, ctaUrl },
      keywords,
      timezone,
      slug
    };

    try {
      const res = await createPack(payload);
      setResult(res);
    } catch (error) {
      setResult({ success: false, error: String(error) });
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/packs" className="text-blue-600 hover:underline">← Back to Packs</Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Create New Content Pack</h1>
          <p className="text-gray-600 mb-8">
            Generate a complete 5-day content pack: 1 blog + posts for FB, IG, LinkedIn, GBP, YouTube
          </p>

          <form onSubmit={onSubmit} className="space-y-8">
            {/* Seed Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">🌱 Seed Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Seed URL (optional)</label>
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="https://example.com/article"
                    value={seedUrl}
                    onChange={e => setSeedUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Paste a URL to an article, blog post, or video</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">OR Paste Raw Text/Transcript</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"
                    rows={6}
                    placeholder="Paste article text or video transcript here..."
                    value={seedText}
                    onChange={e => setSeedText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content Angle</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="e.g., Localize to Phoenix, Create checklist, Myth-busting guide"
                    value={angle}
                    onChange={e => setAngle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Must Include (optional)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Specific facts, quotes..."
                      value={mustInclude}
                      onChange={e => setMustInclude(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Off-Limits (optional)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Topics to avoid..."
                      value={offLimits}
                      onChange={e => setOffLimits(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Business Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">🏢 Business Info</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Acme Corp"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary City/Region *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Phoenix, AZ"
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Website URL *</label>
                  <input
                    type="url"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="https://example.com"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Value Proposition (1 sentence) *</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="We help local businesses grow with proven digital strategies."
                    value={valueProp}
                    onChange={e => setValueProp(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brand Voice *</label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    value={voice}
                    onChange={e => setVoice(e.target.value as any)}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="witty">Witty</option>
                    <option value="authoritative">Authoritative</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Offer & Keywords Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">🎯 Offer & Keywords</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Text *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="Get Your Free Consultation"
                      value={ctaText}
                      onChange={e => setCtaText(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA URL *</label>
                    <input
                      type="url"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="https://example.com/contact"
                      value={ctaUrl}
                      onChange={e => setCtaUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Keywords/Hashtags (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="digital marketing, SEO, local business, Phoenix"
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Scheduling Section */}
            <section className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4">📅 Scheduling</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="America/Los_Angeles"
                      value={timezone}
                      onChange={e => setTimezone(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">IANA timezone format</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weekly Slug *</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      placeholder="week-45-ai-in-hvac"
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Used for URLs and file paths</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pending}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? 'Generating...' : 'Generate Pack'}
              </button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-8 border-t pt-8">
              {result.success ? (
                result.mode === 'written' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Success!</h3>
                    <p className="text-green-800 mb-4">{result.message}</p>
                    <p className="text-sm text-green-700 mb-4">
                      Files written to your local filesystem. Commit and push to deploy.
                    </p>
                    <div className="grid gap-2">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        → View Blog Post
                      </Link>
                      <Link
                        href={`/images/${slug}/blog/hero.png`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        → View Blog Hero Image
                      </Link>
                      <p className="text-sm text-green-700 mt-2">
                        📸 Images generated and saved to /public/images/{slug}/
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">📦 Bundle Ready</h3>
                    <p className="text-amber-800 mb-4">{result.message}</p>
                    <p className="text-sm text-amber-700 mb-4">
                      Your environment doesn't support filesystem writes (Vercel). Copy these files manually:
                    </p>
                    
                    {/* Generated Images */}
                    {result.images && result.images.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-amber-900 mb-3">🖼️ Generated Images ({result.images.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {result.images.map((img: any, idx: number) => (
                            <div key={idx} className="bg-white border rounded p-2">
                              <img 
                                src={img.url} 
                                alt={`Generated image ${idx + 1}`}
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                              <p className="text-xs font-mono truncate text-gray-600">{img.path.split('/').pop()}</p>
                              <a 
                                href={img.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Download →
                              </a>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-amber-600 mt-3">
                          💡 Download each image and save to the path shown. Right-click → Save As...
                        </p>
                      </div>
                    )}
                    
                    {/* Text Files */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <h4 className="font-semibold text-amber-900 mb-2">📝 Text Files</h4>
                      {result.files?.map((file: any) => (
                        <details key={file.path} className="bg-white border rounded p-3">
                          <summary className="cursor-pointer font-mono text-sm font-semibold">
                            {file.path}
                          </summary>
                          <pre className="mt-3 bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                            {file.content}
                          </pre>
                        </details>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">❌ Error</h3>
                  <p className="text-red-800">{result.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

