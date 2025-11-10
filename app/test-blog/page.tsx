'use client';

import { useState } from 'react';

export default function TestBlogPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    businessName: 'Test Business Co',
    region: 'Los Angeles, CA',
    keywords: 'content marketing, digital marketing, SEO',
    valueProp: 'We help local businesses grow through effective marketing strategies',
    voice: 'Friendly',
  });

  const testBlog = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const wordCount = result?.blog?.content ? result.blog.content.split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🧪 Blog Generation Test</h1>
        <p className="text-gray-600 mb-6">Test SEO-optimized blog post generation (1000-1200 words)</p>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid gap-4 mb-4">
            <div>
              <label className="block mb-1 font-semibold text-sm">Business Name:</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold text-sm">Region/Location:</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold text-sm">Keywords (comma-separated):</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="content marketing, SEO, digital strategy"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold text-sm">Value Proposition:</label>
              <input
                type="text"
                value={formData.valueProp}
                onChange={(e) => setFormData({...formData, valueProp: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1 font-semibold text-sm">Brand Voice:</label>
              <select
                value={formData.voice}
                onChange={(e) => setFormData({...formData, voice: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Witty</option>
                <option>Authoritative</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={testBlog}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Generating Blog Post (30-60 seconds)...' : '🧪 Generate SEO Blog Post'}
          </button>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Result:</h2>
            
            {result.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
                <strong className="text-red-800">Error:</strong>
                <pre className="text-sm mt-2 text-red-700 whitespace-pre-wrap">{result.error}</pre>
              </div>
            )}
            
            {result.success && result.blog && (
              <div>
                <div className="bg-green-50 border border-green-200 p-4 rounded mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <strong className="text-green-800">✅ Blog Generated Successfully!</strong>
                    <span className="text-sm font-bold text-green-700">{wordCount} words</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>Primary Keyword: <strong>{formData.keywords.split(',')[0]}</strong></div>
                    <div>Target Region: <strong>{formData.region}</strong></div>
                    <div>Tokens Used: <strong>{result.blog.tokensUsed?.toLocaleString()}</strong></div>
                    <div>Cost: <strong>${result.blog.cost?.toFixed(4)}</strong></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Blog Content Preview:</h3>
                    <button
                      onClick={() => {
                        const blob = new Blob([result.blog.content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'test-blog-post.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      📥 Download
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {result.blog.content}
                    </pre>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.blog.content);
                      alert('Blog content copied to clipboard!');
                    }}
                    className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded font-semibold hover:bg-blue-50"
                  >
                    📋 Copy to Clipboard
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
            
            {result.logs && (
              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-sm text-gray-700">View Logs</summary>
                <pre className="bg-gray-100 p-3 rounded text-xs mt-2 overflow-x-auto">
                  {result.logs}
                </pre>
              </details>
            )}
          </div>
        )}
        
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">What This Tests:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ 1000-1200 word count</li>
            <li>✅ SEO optimization (keyword density, headings)</li>
            <li>✅ Local GEO targeting (region mentions)</li>
            <li>✅ Proper HTML structure (H2/H3 tags)</li>
            <li>✅ E-E-A-T principles</li>
            <li>✅ FAQ section included</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

