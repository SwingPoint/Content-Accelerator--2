// Export services for Airtable and Google Docs

export interface ExportData {
  businessName: string;
  files: Array<{
    path: string;
    content: string;
  }>;
  images: Array<{
    url: string;
    path: string;
  }>;
}

// Airtable Export
export async function exportToAirtable(data: ExportData): Promise<{ success: boolean; error?: string; recordUrl?: string }> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID || 'Content Packs';

  if (!apiKey || !baseId) {
    return { 
      success: false, 
      error: 'Airtable credentials not configured. Add AIRTABLE_API_KEY and AIRTABLE_BASE_ID to environment variables.' 
    };
  }

  try {
    // Prepare content for Airtable
    const blogPost = data.files.find(f => f.path.includes('/blog/'));
    const socialPosts = data.files.filter(f => f.path.includes('/social/'));
    
    // Create record
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Business Name': data.businessName,
          'Blog Post': blogPost?.content || '',
          'Social Posts': socialPosts.map(p => p.content).join('\n\n---\n\n'),
          'Image URLs': data.images.map(img => img.url).join('\n'),
          'Created At': new Date().toISOString(),
          'Status': 'Draft'
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Airtable API error:', error);
      return { success: false, error: `Airtable API error: ${response.status}` };
    }

    const result = await response.json();
    const recordUrl = `https://airtable.com/${baseId}/${tableId}/${result.id}`;
    
    return { 
      success: true, 
      recordUrl 
    };
  } catch (error) {
    console.error('Airtable export failed:', error);
    return { success: false, error: String(error) };
  }
}

// Google Docs Export
export async function exportToGoogleDocs(data: ExportData): Promise<{ success: boolean; error?: string; docUrl?: string }> {
  const apiKey = process.env.GOOGLE_DOCS_API_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!apiKey) {
    return { 
      success: false, 
      error: 'Google Docs credentials not configured. Add GOOGLE_DOCS_API_KEY to environment variables.' 
    };
  }

  try {
    // Create a new Google Doc
    const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `${data.businessName} - Content Pack - ${new Date().toLocaleDateString()}`
      })
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('Google Docs API error:', error);
      return { success: false, error: `Google Docs API error: ${createResponse.status}` };
    }

    const doc = await createResponse.json();
    const docId = doc.documentId;

    // Prepare content
    const blogPost = data.files.find(f => f.path.includes('/blog/'));
    const socialPosts = data.files.filter(f => f.path.includes('/social/'));

    let content = `${data.businessName} - Content Pack\n`;
    content += `Generated: ${new Date().toLocaleString()}\n\n`;
    content += `═══════════════════════════════════════\n\n`;
    
    if (blogPost) {
      content += `📝 BLOG POST\n\n`;
      content += `${blogPost.content}\n\n`;
      content += `═══════════════════════════════════════\n\n`;
    }

    content += `📱 SOCIAL MEDIA POSTS\n\n`;
    socialPosts.forEach((post, idx) => {
      const fileName = post.path.split('/').pop() || '';
      const platform = post.path.includes('/facebook/') ? 'Facebook'
        : post.path.includes('/instagram/') ? 'Instagram'
        : post.path.includes('/linkedin/') ? 'LinkedIn'
        : post.path.includes('/gbp/') ? 'Google Business'
        : post.path.includes('/youtube/') ? 'YouTube'
        : 'Social';
      
      content += `${platform} - ${fileName}\n`;
      content += `${post.content}\n\n`;
      content += `───────────────────────────────────────\n\n`;
    });

    if (data.images.length > 0) {
      content += `\n🖼️ GENERATED IMAGES\n\n`;
      data.images.forEach((img, idx) => {
        content += `${idx + 1}. ${img.url}\n`;
      });
    }

    // Add content to the document
    await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: content
            }
          }
        ]
      })
    });

    // Move to folder if folderId is provided
    if (folderId) {
      await fetch(`https://www.googleapis.com/drive/v3/files/${docId}?addParents=${folderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
    }

    const docUrl = `https://docs.google.com/document/d/${docId}/edit`;
    
    return { 
      success: true, 
      docUrl 
    };
  } catch (error) {
    console.error('Google Docs export failed:', error);
    return { success: false, error: String(error) };
  }
}

// Simple CSV export (fallback)
export function generateCSV(data: ExportData): string {
  const rows = [
    ['Type', 'Platform', 'Day', 'Content', 'Image URL']
  ];

  // Add blog post
  const blogPost = data.files.find(f => f.path.includes('/blog/'));
  if (blogPost) {
    rows.push(['Blog', 'Website', '', blogPost.content.replace(/"/g, '""'), '']);
  }

  // Add social posts
  const socialPosts = data.files.filter(f => f.path.includes('/social/'));
  socialPosts.forEach(post => {
    const platform = post.path.includes('/facebook/') ? 'Facebook'
      : post.path.includes('/instagram/') ? 'Instagram'
      : post.path.includes('/linkedin/') ? 'LinkedIn'
      : post.path.includes('/gbp/') ? 'Google Business'
      : post.path.includes('/youtube/') ? 'YouTube'
      : 'Social';
    
    const dayMatch = post.path.match(/day-(\d+)/);
    const day = dayMatch ? dayMatch[1] : '';
    
    const image = data.images.find(img => 
      img.path.includes(`/${platform.toLowerCase()}/`) && img.path.includes(`day-${day}`)
    );

    rows.push([
      'Social',
      platform,
      day,
      post.content.replace(/"/g, '""'),
      image?.url || ''
    ]);
  });

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

