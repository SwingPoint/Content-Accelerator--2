'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { exportContentToAirtable, exportContentToGoogleDocs, exportContentToCSV } from './actions';

function ReviewContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [exporting, setExporting] = useState<'airtable' | 'gdocs' | 'csv' | null>(null);
  const [businessName, setBusinessName] = useState('Content Pack');

  useEffect(() => {
    const storedResult = localStorage.getItem('wizardResult');
    if (storedResult) {
      const parsed = JSON.parse(storedResult);
      setResult(parsed);
      // Try to extract business name from files
      const reviewFile = parsed.files?.find((f: any) => f.path.includes('/review/'));
      if (reviewFile) {
        try {
          const reviewData = JSON.parse(reviewFile.content);
          setBusinessName(reviewData.business?.businessName || 'Content Pack');
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
    } else {
      router.push('/packs/new/wizard');
    }
  }, [router]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show a brief success message
    const msg = document.createElement('div');
    msg.textContent = '✓ Copied to clipboard!';
    msg.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    document.body.appendChild(msg);
    setTimeout(() => document.body.removeChild(msg), 2000);
  };

  const handleDownloadAll = () => {
    if (!result?.files) return;
    
    result.files.forEach((file: any, idx: number) => {
      setTimeout(() => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.path.split('/').pop() || 'file.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, idx * 100);
    });

    result.images?.forEach((img: any, idx: number) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = img.url;
        a.download = img.path.split('/').pop() || 'image.png';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, (result.files.length + idx) * 100);
    });
  };

  const handleExportToAirtable = async () => {
    setExporting('airtable');
    const exportData = {
      businessName,
      files: result.files || [],
      images: result.images || []
    };
    
    const response = await exportContentToAirtable(exportData);
    setExporting(null);
    
    if (response.success && response.recordUrl) {
      alert(`✅ Content exported to Airtable!\n\nView record: ${response.recordUrl}`);
      window.open(response.recordUrl, '_blank');
    } else {
      alert(`❌ Export failed: ${response.error}`);
    }
  };

  const handleExportToGoogleDocs = async () => {
    setExporting('gdocs');
    const exportData = {
      businessName,
      files: result.files || [],
      images: result.images || []
    };
    
    const response = await exportContentToGoogleDocs(exportData);
    setExporting(null);
    
    if (response.success && response.docUrl) {
      alert(`✅ Content exported to Google Docs!\n\nView document: ${response.docUrl}`);
      window.open(response.docUrl, '_blank');
    } else {
      alert(`❌ Export failed: ${response.error}`);
    }
  };

  const handleExportToCSV = async () => {
    setExporting('csv');
    const exportData = {
      businessName,
      files: result.files || [],
      images: result.images || []
    };
    
    const response = await exportContentToCSV(exportData);
    setExporting(null);
    
    if (response.success && response.csv) {
      const blob = new Blob([response.csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${businessName.replace(/\s+/g, '-')}-content-pack.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('✅ CSV downloaded successfully!');
    } else {
      alert(`❌ Export failed: ${response.error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <div className="text-xl text-gray-600">Loading your content...</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Get blog file (use the text version, not the TSX file)
  const blogFile = result.files?.find((f: any) => f.path.includes('blog-post.txt'));

  // Get social files organized by platform and day
  const socialPosts = ['facebook', 'instagram', 'linkedin', 'gbp', 'youtube'].flatMap(platform => {
    const posts = [];
    for (let day = 1; day <= 5; day++) {
      const file = result.files?.find((f: any) => 
        f.path.startsWith(`social/${platform}/`) && f.path.includes(`day-${day}`)
      );
      const image = result.images?.find((img: any) => 
        img.path.includes(`/${platform}/`) && img.path.includes(`day-${day}`)
      );
      if (file) {
        posts.push({ file, image, day, platform });
      }
    }
    return posts;
  });

  // Blog hero images
  const blogHeroImages = result.images?.filter((img: any) => 
    img.path.includes('/blog-hero/')
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                ✓ Generation Complete
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Your Content is Ready</h1>
              <p className="text-gray-600 mt-1">
                {socialPosts.length + (blogFile ? 1 : 0)} pieces of optimized content + {result.images?.length || 0} images generated
              </p>
            </div>
            <Link href="/packs/new/wizard" className="text-blue-600 hover:underline font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 pb-24 space-y-12">
        
        {/* Blog Post Section */}
        {blogFile && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-3xl">📝</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">Blog Post (1000-1200 words)</h2>
                <p className="text-sm text-gray-600">SEO-optimized article • File: blog-post.txt</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{blogFile.content.split(/\s+/).length} words</div>
                <div className="text-xs text-gray-500">Plain Text Format</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-900">📄 blog-post.txt</span>
                  <span className="text-xs text-blue-700">This is your blog content (not JSON!)</span>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {blogFile.content.substring(0, 1000)}...
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCopyText(blogFile.content)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    📋 Copy Full Blog Post ({blogFile.content.split(/\s+/).length} words)
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([blogFile.content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'blog-post.txt';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                  >
                    ⬇️ Download blog-post.txt
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Hero Images */}
        {blogHeroImages.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-lg">
                <span className="text-3xl">🖼️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Blog Header Image</h2>
                <p className="text-sm text-gray-600">Hero image for your blog post</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {blogHeroImages.map((img: any, idx: number) => (
                <ImageCard key={idx} image={img} />
              ))}
            </div>
          </section>
        )}

        {/* Social Media Posts */}
        {socialPosts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-3xl">📱</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Social Media Posts</h2>
                <p className="text-sm text-gray-600">Platform-optimized posts with images</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialPosts.map((post, idx) => (
                <SocialCard
                  key={idx}
                  platform={post.platform}
                  day={post.day}
                  content={post.file.content}
                  image={post.image}
                  onCopyText={() => handleCopyText(post.file.content)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Next Steps */}
        <section className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Download</strong> each image using the big green Download button</li>
            <li>• <strong>Open in Tab</strong> to view full-size in your browser</li>
            <li>• <strong>Copy Link</strong> to share direct URLs to images</li>
            <li>• <strong>Copy Text</strong> for the social media post</li>
            <li>• <strong>Customize</strong> content before posting to match your brand</li>
            <li>• <strong>Upload</strong> to Instagram, LinkedIn, or your platform of choice</li>
          </ul>
          <p className="mt-4 text-xs text-gray-600 bg-yellow-50 border border-yellow-200 p-3 rounded">
            <strong>Want automated posting?</strong> Instagram automation requires Meta Business verification and API approval (typically 2-4 weeks). Contact us for custom automation solutions.
          </p>
        </section>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t fixed bottom-0 left-0 right-0 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/packs/new/wizard"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Start Over
            </Link>
            <button
              onClick={handleDownloadAll}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-md"
            >
              📥 Download All
            </button>
          </div>
          
          {/* Export Options */}
          <div className="flex items-center gap-3 pt-2 border-t">
            <span className="text-sm text-gray-600 font-medium">Export to:</span>
            <button
              onClick={handleExportToAirtable}
              disabled={exporting === 'airtable'}
              className="px-4 py-2 text-sm border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === 'airtable' ? '⏳ Exporting...' : '📊 Airtable'}
            </button>
            <button
              onClick={handleExportToGoogleDocs}
              disabled={exporting === 'gdocs'}
              className="px-4 py-2 text-sm border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === 'gdocs' ? '⏳ Exporting...' : '📄 Google Docs'}
            </button>
            <button
              onClick={handleExportToCSV}
              disabled={exporting === 'csv'}
              className="px-4 py-2 text-sm border-2 border-gray-600 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === 'csv' ? '⏳ Exporting...' : '📑 CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Social Card Component (matches Synth style)
function SocialCard({ platform, day, content, image, onCopyText }: {
  platform: string;
  day: number;
  content: string;
  image: any;
  onCopyText: () => void;
}) {
  const platformNames: any = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    gbp: 'Google Business Profile',
    youtube: 'YouTube'
  };

  const platformIcons: any = {
    facebook: '📘',
    instagram: '📷',
    linkedin: '💼',
    gbp: '🗺️',
    youtube: '🎥'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      {/* Image */}
      {image && (
        <a href={image.url} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={image.url}
            alt={`${platformNames[platform]} Day ${day}`}
            className="w-full h-72 object-cover"
          />
        </a>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{platformIcons[platform]}</span>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{platformNames[platform]}</h3>
            <p className="text-xs text-gray-500">Day {day} • Ready to post</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Caption</h4>
          <p className="text-sm text-gray-800 leading-relaxed line-clamp-4">
            {content.length > 200 ? content.substring(0, 200) + '...' : content}
          </p>
        </div>

        {/* View Enhanced Prompt (collapsed by default) */}
        <details className="mb-4">
          <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
            ▶ View Enhanced Prompt
          </summary>
          <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        </details>

        <div className="flex gap-2">
          <button
            onClick={onCopyText}
            className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition"
          >
            📋 Copy Caption
          </button>
          {image && (
            <a
              href={image.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition text-center"
            >
              📥 Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Image Card Component (for blog hero images)
function ImageCard({ image }: { image: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      <a href={image.url} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={image.url}
          alt="Blog header image"
          className="w-full h-56 object-cover"
        />
      </a>
      <div className="p-4">
        <p className="text-xs text-gray-600 mb-3 truncate font-mono">
          {image.path.split('/').pop()}
        </p>
        <a
          href={image.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-sm bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          📥 Download
        </a>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
