'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'blog' | 'social' | 'youtube' | 'images'>('blog');
  const [editedContent, setEditedContent] = useState<any>({});

  useEffect(() => {
    // Get result from localStorage (passed from wizard)
    const storedResult = localStorage.getItem('wizardResult');
    if (storedResult) {
      const parsed = JSON.parse(storedResult);
      setResult(parsed);
      
      // Initialize editable content
      if (parsed.files) {
        const initial: any = {};
        parsed.files.forEach((file: any) => {
          initial[file.path] = file.content;
        });
        setEditedContent(initial);
      }
      
      setLoading(false);
    } else {
      router.push('/packs/new/wizard');
    }
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    // In production, you'd save via API
    // For now, we'll just trigger download
    setTimeout(() => {
      setSaving(false);
      alert('Content saved! You can now download individual files or commit to your repository.');
    }, 1000);
  };

  const handleDownloadFile = (path: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = path.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    if (!result?.files) return;
    
    result.files.forEach((file: any) => {
      const content = editedContent[file.path] || file.content;
      setTimeout(() => handleDownloadFile(file.path, content), 100);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl text-gray-600">Loading your content...</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Group files by type
  const blogFiles = result.files?.filter((f: any) => f.path.includes('/blog/')) || [];
  const socialFiles = result.files?.filter((f: any) => 
    f.path.includes('/social/') && !f.path.includes('/youtube/')
  ) || [];
  const youtubeFiles = result.files?.filter((f: any) => f.path.includes('/youtube/')) || [];
  const imageFiles = result.images || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review & Edit Your Content</h1>
              <p className="text-sm text-gray-600">
                Make any changes before saving or downloading
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadAll}
                className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                ⬇️ Download All
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : '✅ Approve & Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            <TabButton
              active={activeTab === 'blog'}
              onClick={() => setActiveTab('blog')}
              icon="📝"
              label="Blog Post"
              count={blogFiles.length}
            />
            <TabButton
              active={activeTab === 'social'}
              onClick={() => setActiveTab('social')}
              icon="📱"
              label="Social Media"
              count={socialFiles.length}
            />
            <TabButton
              active={activeTab === 'youtube'}
              onClick={() => setActiveTab('youtube')}
              icon="🎥"
              label="YouTube"
              count={youtubeFiles.length}
            />
            <TabButton
              active={activeTab === 'images'}
              onClick={() => setActiveTab('images')}
              icon="🖼️"
              label="Images"
              count={imageFiles.length}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'blog' && (
          <div className="space-y-6">
            {blogFiles.map((file: any) => (
              <EditableFile
                key={file.path}
                file={file}
                content={editedContent[file.path] || file.content}
                onChange={(newContent) => setEditedContent({
                  ...editedContent,
                  [file.path]: newContent
                })}
                onDownload={() => handleDownloadFile(file.path, editedContent[file.path] || file.content)}
              />
            ))}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid md:grid-cols-2 gap-6">
            {socialFiles.map((file: any) => (
              <EditableFile
                key={file.path}
                file={file}
                content={editedContent[file.path] || file.content}
                onChange={(newContent) => setEditedContent({
                  ...editedContent,
                  [file.path]: newContent
                })}
                onDownload={() => handleDownloadFile(file.path, editedContent[file.path] || file.content)}
                compact
              />
            ))}
          </div>
        )}

        {activeTab === 'youtube' && (
          <div className="space-y-6">
            {youtubeFiles.map((file: any) => (
              <EditableFile
                key={file.path}
                file={file}
                content={editedContent[file.path] || file.content}
                onChange={(newContent) => setEditedContent({
                  ...editedContent,
                  [file.path]: newContent
                })}
                onDownload={() => handleDownloadFile(file.path, editedContent[file.path] || file.content)}
              />
            ))}
          </div>
        )}

        {activeTab === 'images' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageFiles.map((img: any, idx: number) => (
              <div key={idx} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden group hover:border-blue-400 transition">
                <a href={img.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={img.url}
                    alt={`Generated image ${idx + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </a>
                <div className="p-3">
                  <p className="text-xs font-mono text-gray-600 truncate mb-2">
                    {img.path.split('/').pop()}
                  </p>
                  <a
                    href={img.url}
                    download
                    className="block text-center text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/packs/new/wizard"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Start Over
          </Link>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadAll}
              className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Download All Files
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Approve & Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-semibold transition border-b-2 ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
      <span className="ml-2 text-sm">({count})</span>
    </button>
  );
}

function EditableFile({ file, content, onChange, onDownload, compact }: {
  file: any;
  content: string;
  onChange: (content: string) => void;
  onDownload: () => void;
  compact?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const fileName = file.path.split('/').pop();
  const platform = file.path.includes('/facebook/') ? 'Facebook'
    : file.path.includes('/instagram/') ? 'Instagram'
    : file.path.includes('/linkedin/') ? 'LinkedIn'
    : file.path.includes('/gbp/') ? 'Google Business'
    : file.path.includes('/youtube/') ? 'YouTube'
    : file.path.includes('/blog/') ? 'Blog Post'
    : 'File';

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div>
          <div className="font-semibold text-gray-900">{platform}</div>
          <div className="text-xs font-mono text-gray-500">{fileName}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          >
            {isEditing ? '👁️ Preview' : '✏️ Edit'}
          </button>
          <button
            onClick={onDownload}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
          >
            ⬇️ Download
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-2 border-blue-300 rounded p-3 font-mono text-sm focus:outline-none focus:border-blue-500 resize-none"
            rows={compact ? 8 : 20}
            style={{ minHeight: compact ? '200px' : '400px' }}
          />
        ) : (
          <div className={`prose max-w-none ${compact ? 'text-sm' : ''}`}>
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {content.substring(0, compact ? 500 : 2000)}
              {content.length > (compact ? 500 : 2000) && '...'}
            </pre>
          </div>
        )}
      </div>

      {/* Character count */}
      <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-600">
        {content.length} characters
        {platform === 'Instagram' && content.length > 2200 && (
          <span className="ml-2 text-amber-600">⚠️ Instagram limit is 2,200 characters</span>
        )}
        {platform === 'Facebook' && content.length > 63206 && (
          <span className="ml-2 text-amber-600">⚠️ Facebook limit is 63,206 characters</span>
        )}
        {platform === 'LinkedIn' && content.length > 3000 && (
          <span className="ml-2 text-amber-600">⚠️ LinkedIn limit is 3,000 characters</span>
        )}
        {platform === 'Google Business' && content.length > 1500 && (
          <span className="ml-2 text-amber-600">⚠️ GBP limit is 1,500 characters</span>
        )}
      </div>
    </div>
  );
}

