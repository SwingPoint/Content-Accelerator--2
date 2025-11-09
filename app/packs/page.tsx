import Link from 'next/link';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function getPacks() {
  try {
    // Scan for existing blog posts
    const blogDir = join(process.cwd(), 'app', 'blog');
    const entries = await readdir(blogDir, { withFileTypes: true });
    
    const packs = entries
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .sort()
      .reverse(); // Most recent first
    
    return packs;
  } catch (error) {
    // Directory doesn't exist yet
    return [];
  }
}

export default async function PacksPage() {
  const packs = await getPacks();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Content Packs</h1>
              <p className="text-gray-600">
                Transform one seed asset into complete 5-day content packs
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/packs/new/wizard"
              className="block bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide mb-1 opacity-90">
                    Recommended
                  </div>
                  <h3 className="text-2xl font-bold">✨ Wizard Mode</h3>
                </div>
                <div className="text-3xl">→</div>
              </div>
              <p className="text-blue-100 mb-2">
                Step-by-step guided creation with progress tracking
              </p>
              <div className="text-sm text-blue-200">
                • 10 simple questions • AI-powered • 22 images • Complete in 2 minutes
              </div>
            </Link>

            <Link
              href="/packs/new"
              className="block bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-gray-300 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Advanced
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">⚡ Quick Form</h3>
                </div>
                <div className="text-3xl">→</div>
              </div>
              <p className="text-gray-600 mb-2">
                All-in-one form for power users
              </p>
              <div className="text-sm text-gray-500">
                • Single page • All options • For experienced users
              </div>
            </Link>
          </div>
        </div>

        {packs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold mb-2">No packs yet</h2>
            <p className="text-gray-600 mb-6">
              Create your first content pack to get started
            </p>
            <Link
              href="/packs/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create First Pack
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packs.map(slug => (
              <div
                key={slug}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{slug}</h3>
                    <p className="text-sm text-gray-500">5-day content pack</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📝</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-24">Blog:</span>
                    <Link
                      href={`/blog/${slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      View post
                    </Link>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-24">Platforms:</span>
                    <span>FB, IG, LI, GBP, YT</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                  <Link
                    href={`/blog/${slug}`}
                    className="flex-1 text-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm font-medium transition"
                  >
                    View Blog
                  </Link>
                  <button className="flex-1 text-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm font-medium transition">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">📚 How It Works</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Click "New Pack" and fill in your business details and seed content</li>
            <li>System generates: 1 blog + 25 social posts + YouTube content</li>
            <li>Review generated content in <code className="bg-white px-1 rounded">/review/[slug].json</code></li>
            <li>Files are saved locally (dev) or provided as bundle (Vercel)</li>
            <li>Commit changes and deploy</li>
            <li>Schedule posts manually using <code className="bg-white px-1 rounded">/scheduler/[slug].json</code></li>
          </ol>
        </div>
      </div>
    </main>
  );
}

