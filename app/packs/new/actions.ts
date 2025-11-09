'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { generatePack } from '@/lib/generator';
import { PackInput } from '@/lib/types';

export async function createPack(input: PackInput) {
  try {
    // Generate all files in memory
    const files = await generatePack(input);
    
    // Try to write files (works in dev/self-hosted, fails gracefully on Vercel)
    let writeSuccess = true;
    const writtenPaths: string[] = [];
    
    try {
      for (const file of files) {
        const fullPath = join(process.cwd(), file.path);
        const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
        
        // Create directory if needed
        await mkdir(dir, { recursive: true });
        
        // Write file (handle images vs text)
        if (file.type === 'image') {
          // Decode base64 and write as binary
          const buffer = Buffer.from(file.content, 'base64');
          await writeFile(fullPath, buffer);
        } else {
          // Write as text
          await writeFile(fullPath, file.content, 'utf-8');
        }
        
        writtenPaths.push(file.path);
      }
    } catch (writeError) {
      // Vercel filesystem is read-only, so this will fail
      writeSuccess = false;
      console.log('Filesystem write failed (expected on Vercel):', writeError);
    }
    
    if (writeSuccess) {
      return {
        success: true,
        mode: 'written',
        message: `Successfully created ${files.length} files locally.`,
        paths: writtenPaths
      };
    } else {
      // Return files for manual copy-paste
      // Separate text files and image URLs
      const textFiles = files.filter(f => f.type !== 'image');
      const imageFiles = files.filter(f => f.type === 'image');
      
      return {
        success: true,
        mode: 'bundle',
        message: 'Files generated. Copy these into your repository:',
        files: textFiles.map(f => ({ path: f.path, content: f.content })),
        images: imageFiles.map(f => ({ 
          path: f.path, 
          url: f.imageUrl,
          note: 'Download image from URL and save to path' 
        }))
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

