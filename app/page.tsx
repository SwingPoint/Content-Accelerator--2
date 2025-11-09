import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Content Accelerator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform a single seed (URL or text) into a complete 5-day content pack: 
            1 blog + 25 social posts + YouTube content
          </p>
        </div>

        <div className="mb-16">
          <Link
            href="/packs/new/wizard"
            className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl p-12 hover:shadow-3xl transition group mb-8"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-4xl font-bold mb-4">
                Start Creating Content in 2 Minutes
              </h2>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                Answer 10 simple questions and watch AI transform your seed content into 
                a complete 5-day content pack with blog, social posts, and images.
              </p>
              <div className="inline-flex items-center text-xl font-semibold bg-white text-blue-600 px-8 py-4 rounded-lg group-hover:scale-105 transition">
                Launch Wizard →
              </div>
              <div className="mt-6 flex justify-center gap-8 text-sm text-blue-200">
                <span>✓ 1 Blog Post</span>
                <span>✓ 25 Social Posts</span>
                <span>✓ 22 AI Images</span>
              </div>
            </div>
          </Link>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/packs/new"
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition group"
            >
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                Quick Form Mode
              </h3>
              <p className="text-gray-600 text-sm">
                All-in-one form for power users who want maximum control
              </p>
            </Link>

            <Link
              href="/packs"
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition group"
            >
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                View All Packs
              </h3>
              <p className="text-gray-600 text-sm">
                Browse and manage your existing content packs
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">What You Get</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📝</div>
              <h4 className="font-semibold mb-2">1 SEO Blog Post</h4>
              <p className="text-sm text-gray-600">
                SSR page with metadata, JSON-LD, FAQ schema, and sources
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold mb-2">25 Social Posts</h4>
              <p className="text-sm text-gray-600">
                5 days × 5 platforms: Facebook, Instagram, LinkedIn, GBP, YouTube
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📅</div>
              <h4 className="font-semibold mb-2">Scheduling Plan</h4>
              <p className="text-sm text-gray-600">
                Mon–Fri schedule with timezone-aware ISO timestamps
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-900 text-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">🚀 Deploy-Safe Architecture</h3>
          <ul className="space-y-2 text-blue-100">
            <li>✓ No database required</li>
            <li>✓ No OAuth complexity</li>
            <li>✓ No image generation dependencies</li>
            <li>✓ Works locally (file writes) or on Vercel (bundle export)</li>
            <li>✓ Review before posting (no autoposting)</li>
            <li>✓ SEO-ready with robots.txt and sitemap</li>
          </ul>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Built with Next.js 14 · App Router · TypeScript · Zero External Dependencies
          </p>
        </div>
      </div>
    </main>
  );
}

