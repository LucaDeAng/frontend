import * as React from 'react';
import PatternBG from '@/components/ui/PatternBG';
import { Logo } from '@/components/ui/logo';

interface NewsletterTemplateProps {
  title: string;
  content: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

const NewsletterTemplate: React.FC<NewsletterTemplateProps> = ({ title, content, ctaLabel, ctaUrl }) => (
  <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)', padding: 0, minHeight: 600, fontFamily: 'Inter, Arial, sans-serif' }}>
    <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '20%' }}>
      <PatternBG style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </div>
    <div style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(30,41,59,0.98)', borderRadius: 24, boxShadow: '0 8px 32px rgba(37,99,235,0.15)', padding: 40, position: 'relative', top: -80 }}>
      <Logo size="md" />
      <h1 style={{ color: '#2563eb', fontSize: 32, fontWeight: 800, margin: '32px 0 16px' }}>{title}</h1>
      <div style={{ color: '#f1f5f9', fontSize: 18, lineHeight: 1.6, marginBottom: 32 }} dangerouslySetInnerHTML={{ __html: content }} />
      {ctaLabel && ctaUrl && (
        <a href={ctaUrl} style={{ display: 'inline-block', background: '#2563eb', color: '#fff', borderRadius: 8, padding: '14px 32px', fontWeight: 700, textDecoration: 'none', fontSize: 18 }}>
          {ctaLabel}
        </a>
      )}
    </div>
    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginTop: 48 }}>
      Ricevi questa email perché sei iscritto a <b>AI Hub</b>.<br />
      <a href="#" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Disiscriviti</a>
    </div>
  </div>
);

export default NewsletterTemplate; 