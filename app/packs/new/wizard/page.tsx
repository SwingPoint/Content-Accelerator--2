'use client';

import { useState } from 'react';
import { createPack } from '../actions';
import Link from 'next/link';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export default function WizardPage() {
  // Progress tracking
  const [step, setStep] = useState<WizardStep>(1);
  const totalSteps = 10;
  const progress = Math.round((step / totalSteps) * 100);

  // Form state
  const [slug, setSlug] = useState('');
  const [seedUrl, setSeedUrl] = useState('');
  const [seedText, setSeedText] = useState('');
  const [angle, setAngle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [region, setRegion] = useState('');
  const [website, setWebsite] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [voice, setVoice] = useState<'professional' | 'friendly' | 'witty' | 'authoritative'>('professional');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  
  // Generation state
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((step + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as WizardStep);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, canProceed: boolean) => {
    if (e.key === 'Enter' && canProceed && step < totalSteps) {
      handleNext();
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    
    const payload = {
      seedUrl: seedUrl || undefined,
      seedText: seedText || undefined,
      angle: angle || undefined,
      business: { businessName, region, website, valueProp, voice },
      offer: { ctaText, ctaUrl },
      keywords,
      timezone,
      slug
    };

    try {
      const res = await createPack(payload);
      setResult(res);
      setStep(11 as any); // Move to results step
    } catch (error) {
      setResult({ success: false, error: String(error) });
    } finally {
      setGenerating(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepContainer
            title="What is your business or brand name?"
            subtitle="This will be used throughout your content"
          >
            <input
              type="text"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              onKeyPress={e => handleKeyPress(e, businessName.length > 0)}
              placeholder="e.g., Phoenix Digital Marketing"
              className="w-full text-2xl border-b-2 border-gray-300 focus:border-blue-600 outline-none py-4 bg-transparent"
              autoFocus
            />
          </StepContainer>
        );

      case 2:
        return (
          <StepContainer
            title="Where is your business located?"
            subtitle="City, region, or area you serve"
          >
            <input
              type="text"
              value={region}
              onChange={e => setRegion(e.target.value)}
              onKeyPress={e => handleKeyPress(e, region.length > 0)}
              placeholder="e.g., Phoenix, AZ or Coachella Valley"
              className="w-full text-2xl border-b-2 border-gray-300 focus:border-blue-600 outline-none py-4 bg-transparent"
              autoFocus
            />
          </StepContainer>
        );

      case 3:
        return (
          <StepContainer
            title="What's your website URL?"
            subtitle="We'll include this in your content"
          >
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              onKeyPress={e => handleKeyPress(e, website.length > 0)}
              placeholder="https://yourwebsite.com"
              className="w-full text-2xl border-b-2 border-gray-300 focus:border-blue-600 outline-none py-4 bg-transparent"
              autoFocus
            />
          </StepContainer>
        );

      case 4:
        return (
          <StepContainer
            title="In one sentence, what makes your business special?"
            subtitle="Your unique value proposition"
          >
            <textarea
              value={valueProp}
              onChange={e => setValueProp(e.target.value)}
              placeholder="e.g., We help local businesses dominate their market with proven digital strategies"
              className="w-full text-xl border-b-2 border-gray-300 focus:border-blue-600 outline-none py-4 bg-transparent resize-none"
              rows={2}
              autoFocus
            />
          </StepContainer>
        );

      case 5:
        return (
          <StepContainer
            title="What's your brand voice?"
            subtitle="How should we write your content?"
          >
            <div className="space-y-3">
              {[
                { value: 'professional', label: 'Professional', desc: 'Formal, authoritative, business-focused' },
                { value: 'friendly', label: 'Friendly', desc: 'Warm, approachable, conversational' },
                { value: 'witty', label: 'Witty', desc: 'Clever, humorous, engaging' },
                { value: 'authoritative', label: 'Authoritative', desc: 'Expert, confident, thought-leadership' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setVoice(option.value as any);
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full text-left p-6 rounded-lg border-2 transition ${
                    voice === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-lg">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </StepContainer>
        );

      case 6:
        return (
          <StepContainer
            title="What's your seed content?"
            subtitle="Paste a URL or raw text to base your content on"
          >
            <input
              type="url"
              value={seedUrl}
              onChange={e => setSeedUrl(e.target.value)}
              placeholder="https://example.com/article (optional)"
              className="w-full text-lg border-b-2 border-gray-300 focus:border-blue-600 outline-none py-3 bg-transparent mb-4"
            />
            <div className="text-center text-gray-500 my-4">OR</div>
            <textarea
              value={seedText}
              onChange={e => setSeedText(e.target.value)}
              placeholder="Paste article text or transcript here..."
              className="w-full text-base border-2 border-gray-300 focus:border-blue-600 outline-none p-4 rounded-lg resize-none"
              rows={8}
            />
          </StepContainer>
        );

      case 7:
        return (
          <StepContainer
            title="What angle should we take?"
            subtitle="How should we approach this content? (optional)"
          >
            <input
              type="text"
              value={angle}
              onChange={e => setAngle(e.target.value)}
              onKeyPress={e => handleKeyPress(e, true)}
              placeholder="e.g., Myth-busting, How-to guide, Checklist"
              className="w-full text-2xl border-b-2 border-gray-300 focus:border-blue-600 outline-none py-4 bg-transparent"
              autoFocus
            />
          </StepContainer>
        );

      case 8:
        return (
          <StepContainer
            title="What should your call-to-action be?"
            subtitle="What do you want people to do?"
          >
            <input
              type="text"
              value={ctaText}
              onChange={e => setCtaText(e.target.value)}
              onKeyPress={e => handleKeyPress(e, ctaText.length > 0)}
              placeholder="e.g., Get Your Free Consultation"
              className="w-full text-xl border-b-2 border-gray-300 focus:border-blue-600 outline-none py-4 bg-transparent mb-6"
              autoFocus
            />
            <input
              type="url"
              value={ctaUrl}
              onChange={e => setCtaUrl(e.target.value)}
              placeholder="https://yourwebsite.com/contact"
              className="w-full text-lg border-b-2 border-gray-300 focus:border-blue-600 outline-none py-3 bg-transparent"
            />
          </StepContainer>
        );

      case 9:
        return (
          <StepContainer
            title="What keywords should we focus on?"
            subtitle="Separate with commas"
          >
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              onKeyPress={e => handleKeyPress(e, keywords.length > 0)}
              placeholder="SEO, digital marketing, Phoenix, local business"
              className="w-full text-xl border-b-2 border-gray-300 focus:border-blue-600 outline-none py-4 bg-transparent"
              autoFocus
            />
          </StepContainer>
        );

      case 10:
        return (
          <StepContainer
            title="Final details"
            subtitle="Pack identifier and timezone"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pack Slug (URL-friendly name)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="week-1-seo-tips"
                  className="w-full text-xl border-b-2 border-gray-300 focus:border-blue-600 outline-none py-3 bg-transparent"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full text-lg border-2 border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="America/Los_Angeles">Pacific Time (Los Angeles)</option>
                  <option value="America/Phoenix">Arizona Time (Phoenix)</option>
                  <option value="America/Denver">Mountain Time (Denver)</option>
                  <option value="America/Chicago">Central Time (Chicago)</option>
                  <option value="America/New_York">Eastern Time (New York)</option>
                </select>
              </div>
            </div>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  // Results view
  if (step === 11) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/packs" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back to Packs
          </Link>

          {result && result.success ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Pack Generated!</h1>
                <p className="text-lg text-gray-600">
                  Your complete 5-day content pack is ready
                </p>
              </div>

              {result.mode === 'written' ? (
                <div className="space-y-6">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Files Written Locally</h3>
                    <p className="text-green-800 mb-4">
                      All {result.paths?.length || 0} files have been written to your local filesystem.
                    </p>
                    <div className="grid gap-3">
                      <Link
                        href={`/blog/${slug}`}
                        className="block text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        View Blog Post →
                      </Link>
                      <Link
                        href="/packs"
                        className="block text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                      >
                        View All Packs
                      </Link>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl mb-2">📝</div>
                      <div className="font-semibold">1 Blog Post</div>
                      <div className="text-sm text-gray-600">SEO-optimized</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl mb-2">📱</div>
                      <div className="font-semibold">25 Social Posts</div>
                      <div className="text-sm text-gray-600">5 platforms × 5 days</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl mb-2">🖼️</div>
                      <div className="font-semibold">22 AI Images</div>
                      <div className="text-sm text-gray-600">Platform-optimized</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
                    <h3 className="font-semibold text-amber-900 mb-4">📦 Bundle Ready for Download</h3>
                    
                    {result.images && result.images.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-amber-900 mb-3">
                          🖼️ Generated Images ({result.images.length})
                        </h4>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                          {result.images.map((img: any, idx: number) => (
                            <a
                              key={idx}
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block group"
                            >
                              <img
                                src={img.url}
                                alt={`Image ${idx + 1}`}
                                className="w-full h-24 object-cover rounded border-2 border-gray-200 group-hover:border-blue-400 transition"
                              />
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {img.path.split('/').pop()}
                              </p>
                            </a>
                          ))}
                        </div>
                        <p className="text-sm text-amber-700 mt-4">
                          💡 Click each image to download
                        </p>
                      </div>
                    )}

                    <details className="mt-4">
                      <summary className="cursor-pointer font-semibold text-amber-900 hover:text-amber-700">
                        📝 Text Files ({result.files?.length || 0})
                      </summary>
                      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                        {result.files?.slice(0, 5).map((file: any, idx: number) => (
                          <div key={idx} className="text-sm font-mono text-gray-600 p-2 bg-white rounded">
                            {file.path}
                          </div>
                        ))}
                        {result.files?.length > 5 && (
                          <div className="text-sm text-gray-500">
                            + {result.files.length - 5} more files...
                          </div>
                        )}
                      </div>
                    </details>
                  </div>

                  <div className="grid gap-3">
                    <button
                      onClick={() => {
                        setStep(1);
                        setResult(null);
                      }}
                      className="block text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Create Another Pack
                    </button>
                    <Link
                      href="/packs"
                      className="block text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                    >
                      View All Packs
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-2xl font-bold text-red-900 mb-2">Generation Failed</h2>
                <p className="text-red-700 mb-6">{result?.error || 'Unknown error occurred'}</p>
                <button
                  onClick={() => {
                    setStep(1);
                    setResult(null);
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Wizard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/packs" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back to Packs
          </Link>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">AI Content Generator</h1>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Step {step} of {totalSteps}
              </div>
              <div className="text-2xl font-bold text-blue-600">{progress}%</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 min-h-[400px]">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-8 border-t">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-3 rounded-lg font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200"
            >
              Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!canProceedFromStep(step, {
                  businessName, region, website, valueProp, voice,
                  ctaText, ctaUrl, keywords, slug
                })}
                className="px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={generating || !slug || !keywords}
                className="px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 text-white hover:bg-green-700"
              >
                {generating ? 'Generating...' : 'Generate Pack 🚀'}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> to continue
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper component for step container
function StepContainer({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

// Validation helper
function canProceedFromStep(step: number, data: any): boolean {
  switch (step) {
    case 1: return data.businessName.length > 0;
    case 2: return data.region.length > 0;
    case 3: return data.website.length > 0;
    case 4: return data.valueProp.length > 0;
    case 5: return !!data.voice;
    case 6: return true; // Seed is optional
    case 7: return true; // Angle is optional
    case 8: return data.ctaText.length > 0 && data.ctaUrl.length > 0;
    case 9: return data.keywords.length > 0;
    case 10: return data.slug.length > 0;
    default: return true;
  }
}

