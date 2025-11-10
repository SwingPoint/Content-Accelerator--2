'use client';

import { useState } from 'react';

export default function TestImagePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [prompt, setPrompt] = useState('business professional meeting');

  const testImage = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Image Generation Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <label className="block mb-2 font-semibold">Test Prompt:</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            placeholder="Enter keywords..."
          />
          
          <button
            onClick={testImage}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '⏳ Testing...' : '🧪 Test Image Generation'}
          </button>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Result:</h2>
            
            {result.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
                <strong className="text-red-800">Error:</strong>
                <pre className="text-sm mt-2 text-red-700">{result.error}</pre>
              </div>
            )}
            
            {result.success && result.image && (
              <div>
                <div className="mb-4">
                  <strong>✅ Success!</strong>
                  <p className="text-sm text-gray-600 mt-1">Keywords: {result.image.prompt}</p>
                  <p className="text-sm text-gray-600">Resolution: {result.image.resolution}</p>
                </div>
                
                <img
                  src={result.image.url}
                  alt="Test"
                  className="w-full rounded shadow-lg mb-4"
                />
                
                <a
                  href={result.image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {result.image.url}
                </a>
              </div>
            )}
            
            {result.logs && (
              <details className="mt-4">
                <summary className="cursor-pointer font-semibold">View Logs</summary>
                <pre className="bg-gray-100 p-3 rounded text-xs mt-2 overflow-x-auto">
                  {result.logs}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

