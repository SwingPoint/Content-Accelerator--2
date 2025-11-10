'use server';

import { exportToAirtable, exportToGoogleDocs, generateCSV, ExportData } from '@/lib/export-services';

export async function exportContentToAirtable(data: ExportData) {
  try {
    const result = await exportToAirtable(data);
    return result;
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function exportContentToGoogleDocs(data: ExportData) {
  try {
    const result = await exportToGoogleDocs(data);
    return result;
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function exportContentToCSV(data: ExportData) {
  try {
    const csv = generateCSV(data);
    return { success: true, csv };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

