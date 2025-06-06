import path from 'path';
import fs from 'fs';

let uploadsDir: string | undefined;

export function getUploadsDir(): string {
  if (!uploadsDir) {
    ensureUploadsDir();
  }
  return uploadsDir!;
}

export function ensureUploadsDir(): void {
  if (uploadsDir) return;

  const localDir = path.join(process.cwd(), 'public', 'uploads');
  const fallbackDir = '/tmp/uploads';

  // Prefer explicit env var, otherwise use public/uploads in development only.
  const preferredDir = process.env.UPLOADS_DIR ||
    (process.env.NODE_ENV === 'development' ? localDir : fallbackDir);

  try {
    fs.mkdirSync(preferredDir, { recursive: true });
    uploadsDir = preferredDir;
    console.log(`✅ Directory uploads creata: ${uploadsDir}`);
    return;
  } catch (err) {
    console.warn(`⚠️ Impossibile creare la directory uploads in ${preferredDir}:`, err);
  }

  if (preferredDir !== fallbackDir) {
    try {
      fs.mkdirSync(fallbackDir, { recursive: true });
      uploadsDir = fallbackDir;
      console.log(`📂 Directory uploads fallback: ${uploadsDir}`);
    } catch (fallbackErr) {
      console.error('❌ Impossibile creare directory di fallback per uploads:', fallbackErr);
      uploadsDir = fallbackDir;
    }
  } else {
    uploadsDir = preferredDir;
  }
}
