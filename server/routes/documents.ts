import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// POST /api/documents/upload
router.post('/upload', async (req: Request, res: Response) => {
  try {
    const { fileName, fileType, base64Data } = req.body;

    if (!base64Data) {
      return res.status(400).json({ error: 'base64Data is required' });
    }

    if (!supabase) {
      return res.json({
        fileUrl: `https://storage.googleapis.com/adivasetu-mock-vault/${fileName || 'document.pdf'}`,
        fileName,
        storageProvider: 'local-fallback',
      });
    }

    const buffer = Buffer.from(base64Data.replace(/^data:.*?;base64,/, ''), 'base64');
    const fileExt = fileName?.split('.').pop() || 'pdf';
    const filePath = `uploads/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: fileType || 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { data } = supabase.storage.from('documents').getPublicUrl(filePath);

    res.json({
      fileUrl: data.publicUrl,
      fileName,
      storageProvider: 'supabase',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
