import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload a document to Supabase Storage bucket
 */
export async function uploadDocumentToSupabase(
  file: File,
  bucket: string = 'documents'
): Promise<{ publicUrl: string | null; error: Error | null }> {
  if (!supabase) {
    // Graceful fallback if Supabase URL is not yet configured
    const localUrl = URL.createObjectURL(file);
    return { publicUrl: localUrl, error: null };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `scholar_documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn('[Supabase Storage] Upload error:', uploadError.message);
      return { publicUrl: URL.createObjectURL(file), error: uploadError };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { publicUrl: data.publicUrl, error: null };
  } catch (err: any) {
    return { publicUrl: URL.createObjectURL(file), error: err };
  }
}
