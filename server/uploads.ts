import path from 'path';
import fs from 'fs';

let uploadsDir: string = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(process.cwd(), 'public', 'uploads');

export function getUploadsDir(): string {
  return uploadsDir;
}

export function ensureUploadsDir(): void {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`✅ Directory uploads creata: ${uploadsDir}`);
    }
  } catch (err: any) {
    console.warn('⚠️ Impossibile creare la directory uploads:', err);
    const fallbackDir = '/tmp/uploads';
    if (uploadsDir !== fallbackDir) {
      try {
        fs.mkdirSync(fallbackDir, { recursive: true });
        uploadsDir = fallbackDir;
        console.log(`📂 Directory uploads fallback: ${uploadsDir}`);
      } catch (fallbackErr) {
        console.error('❌ Impossibile creare directory di fallback per uploads:', fallbackErr);
      }
    }
  }
}
