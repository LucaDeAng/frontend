import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Send, Users, Mail, Calendar, TrendingUp, Eye, RotateCcw, Save, Edit, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

interface Campaign {
  id: number;
  subject: string;
  content: string;
  htmlContent?: string;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  recipientsCount: number;
  sentCount: number;
  openCount: number;
  clickCount: number;
  sentAt?: string;
  createdAt: string;
}

interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  htmlContent: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  createdAt: string;
}

interface Stats {
  totalSubscribers: number;
  totalCampaigns: number;
  sentCampaigns: number;
}

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSubscribers: 0, totalCampaigns: 0, sentCampaigns: 0 });
  const [loading, setLoading] = useState(true);
  const [newCampaign, setNewCampaign] = useState({ subject: '', content: '', htmlContent: '' });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sendingCampaign, setSendingCampaign] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showTemplateCustomizer, setShowTemplateCustomizer] = useState(false);
  const [customizingTemplate, setCustomizingTemplate] = useState<any>(null);
  const [templateColors, setTemplateColors] = useState({
    primary: '#2563eb',
    secondary: '#3b82f6',
    background: '#ffffff',
    text: '#000000'
  });
  const { toast } = useToast();

  // Template predefiniti ottimizzati per evitare spam
  const emailTemplates = [
    {
      id: 'professional',
      name: '🏢 Professional Business',
      description: 'Template professionale con ottimo deliverability',
      content: `Ciao {{name}},

Ti scrivo da AI Hub per condividere con te gli aggiornamenti più rilevanti nel mondo dell'intelligenza artificiale.

📈 QUESTO MESE IN AI:
• Nuove applicazioni business delle tecnologie generative
• Case study pratici di implementazione AI
• Strumenti testati e consigliati dalla nostra community

💡 INSIGHT DELLA SETTIMANA:
L'implementazione di chatbot intelligenti ha permesso a diverse aziende di ridurre i tempi di risposta del 60% mantenendo alta la qualità del servizio.

🔗 RISORSA UTILE:
Abbiamo preparato una guida pratica su come scegliere la soluzione AI più adatta al tuo business.

→ Leggi la guida completa: https://lucadeangelis.com

Continua a seguirci per rimanere aggiornato sulle innovazioni che possono trasformare il tuo lavoro.

Cordiali saluti,
Luca De Angelis
AI Consultant & Developer`,
      htmlContent: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter AI Hub</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; }
        .logo { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 10px; font-family: 'Monaco', monospace; }
        .tagline { color: #e2e8f0; font-size: 14px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 16px; color: #374151; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #2563eb; font-size: 18px; font-weight: 600; margin-bottom: 15px; }
        .bullet-point { margin-bottom: 8px; color: #4b5563; line-height: 1.5; }
        .insight-box { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0; }
        .cta-button { display: inline-block; background: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background: #1f2937; padding: 30px; text-align: center; color: #9ca3af; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #374151; }
        .unsubscribe { font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{'>'}_  Luca De Angelis</div>
            <div class="tagline">AI Consultant & Developer</div>
        </div>
        
        <div class="content">
            <div class="greeting">Ciao,</div>
            <p>Ti scrivo da AI Hub per condividere con te gli aggiornamenti più rilevanti nel mondo dell'intelligenza artificiale.</p>
            
            <div class="section">
                <div class="section-title">📈 QUESTO MESE IN AI:</div>
                <div class="bullet-point">• Nuove applicazioni business delle tecnologie generative</div>
                <div class="bullet-point">• Case study pratici di implementazione AI</div>
                <div class="bullet-point">• Strumenti testati e consigliati dalla nostra community</div>
            </div>
            
            <div class="insight-box">
                <div class="section-title" style="margin-top: 0;">💡 INSIGHT DELLA SETTIMANA:</div>
                <p style="margin-bottom: 0;">L'implementazione di chatbot intelligenti ha permesso a diverse aziende di ridurre i tempi di risposta del 60% mantenendo alta la qualità del servizio.</p>
            </div>
            
            <div class="section">
                <div class="section-title">🔗 RISORSA UTILE:</div>
                <p>Abbiamo preparato una guida pratica su come scegliere la soluzione AI più adatta al tuo business.</p>
                <a href="https://lucadeangelis.com" class="cta-button">Leggi la guida completa →</a>
            </div>
            
            <p>Continua a seguirci per rimanere aggiornato sulle innovazioni che possono trasformare il tuo lavoro.</p>
            
            <div class="signature">
                <strong>Cordiali saluti,</strong><br>
                <strong>Luca De Angelis</strong><br>
                AI Consultant & Developer
            </div>
        </div>
        
        <div class="footer">
            <p>Hai ricevuto questa email perché sei iscritto alla newsletter di AI Hub</p>
            <p class="unsubscribe">
                <a href="#" style="color: #60a5fa;">Gestisci preferenze</a> | 
                <a href="#" style="color: #60a5fa;">Annulla iscrizione</a>
            </p>
        </div>
    </div>
</body>
</html>`
    },
    {
      id: 'minimal-clean',
      name: '✨ Minimal Professional',
      description: 'Design pulito e minimale con alta deliverability',
      content: `Newsletter AI Hub - {{date}}

Caro lettore,

Condivido con te 3 aggiornamenti chiave nel mondo AI:

1. TREND DEL MESE
Crescita del 40% nell'adozione di AI generativa nelle PMI italiane

2. CASO PRATICO
Come una startup ha automatizzato il customer service risparmiando 15 ore/settimana

3. STRUMENTO CONSIGLIATO
Claude 3.5 Sonnet ora supporta analisi avanzata di documenti e immagini

Link utili:
→ Articolo completo: https://lucadeangelis.com/blog
→ Consulenza gratuita: https://lucadeangelis.com/contact

Grazie per essere parte della nostra community!

Luca De Angelis
lucadeangelis.com`,
      htmlContent: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter AI Hub</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff; color: #000000; }
        .container { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 40px; }
        .logo { font-size: 20px; font-weight: 700; color: #2563eb; margin-bottom: 5px; font-family: 'Monaco', monospace; }
        .date { font-size: 14px; color: #6b7280; }
        .greeting { font-size: 16px; margin-bottom: 30px; }
        .item { margin-bottom: 25px; }
        .item-number { color: #2563eb; font-weight: 700; }
        .item-title { font-weight: 600; margin-bottom: 5px; }
        .item-description { color: #374151; line-height: 1.5; }
        .links-section { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .links-title { font-weight: 600; margin-bottom: 10px; color: #2563eb; }
        .link { display: block; color: #2563eb; text-decoration: none; margin-bottom: 5px; }
        .signature { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .signature-name { font-weight: 600; }
        .signature-website { color: #2563eb; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{'>'}_  AI Hub</div>
            <div class="date">Newsletter - {{date}}</div>
        </div>
        
        <div class="greeting">Caro lettore,</div>
        <p>Condivido con te 3 aggiornamenti chiave nel mondo AI:</p>
        
        <div class="item">
            <div class="item-number">1. TREND DEL MESE</div>
            <div class="item-description">Crescita del 40% nell'adozione di AI generativa nelle PMI italiane</div>
        </div>
        
        <div class="item">
            <div class="item-number">2. CASO PRATICO</div>
            <div class="item-description">Come una startup ha automatizzato il customer service risparmiando 15 ore/settimana</div>
        </div>
        
        <div class="item">
            <div class="item-number">3. STRUMENTO CONSIGLIATO</div>
            <div class="item-description">Claude 3.5 Sonnet ora supporta analisi avanzata di documenti e immagini</div>
        </div>
        
        <div class="links-section">
            <div class="links-title">Link utili:</div>
            <a href="https://lucadeangelis.com/blog" class="link">→ Articolo completo</a>
            <a href="https://lucadeangelis.com/contact" class="link">→ Consulenza gratuita</a>
        </div>
        
        <p>Grazie per essere parte della nostra community!</p>
        
        <div class="signature">
            <div class="signature-name">Luca De Angelis</div>
            <div class="signature-website">lucadeangelis.com</div>
        </div>
    </div>
</body>
</html>`
    },
    {
      id: 'branded-announcement',
      name: '📢 Branded Announcement',
      description: 'Template per annunci importanti con branding completo',
      content: `🎯 IMPORTANTE: Nuova Risorsa AI Disponibile

Ciao {{name}},

Ho creato qualcosa di speciale per te.

COSA È CAMBIATO:
Dopo mesi di test e feedback dalla community, ho lanciato il nuovo AI Toolkit - una collezione di prompt, workflow e best practices per implementare l'AI nel business.

COSA INCLUDE:
✓ 50+ prompt testati per diverse industry
✓ Template per automazioni con Claude e ChatGPT  
✓ Checklist per progetti AI aziendali
✓ Video tutorial step-by-step

PERCHÉ È IMPORTANTE:
Le aziende che implementano correttamente l'AI vedono incrementi di produttività del 25-40%. Questo toolkit ti permette di arrivarci più velocemente.

COME ACCEDERE:
Disponibile esclusivamente per gli iscritti alla newsletter fino al [data].

👉 Scarica il toolkit: https://lucadeangelis.com/ai-toolkit

Domande? Rispondi direttamente a questa email.

A presto,
Luca De Angelis
Founder, AI Hub`,
      htmlContent: `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Importante Annuncio - AI Hub</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f1f5f9; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; }
        .announcement-badge { color: #ffffff; font-size: 24px; font-weight: 800; margin-bottom: 10px; }
        .logo { color: #ffffff; font-size: 16px; font-family: 'Monaco', monospace; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 16px; color: #374151; margin-bottom: 20px; }
        .highlight-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
        .highlight-text { color: #92400e; font-weight: 700; font-size: 18px; margin: 0; }
        .section { margin-bottom: 25px; }
        .section-title { color: #dc2626; font-size: 16px; font-weight: 700; margin-bottom: 10px; }
        .section-content { color: #4b5563; line-height: 1.6; }
        .checklist-item { display: flex; align-items: flex-start; margin-bottom: 8px; }
        .checkmark { color: #16a34a; margin-right: 8px; font-weight: bold; }
        .cta-section { background: #2563eb; color: #ffffff; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; }
        .cta-title { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .cta-button { display: inline-block; background: #ffffff; color: #2563eb; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; margin-top: 15px; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .footer { background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="announcement-badge">🎯 IMPORTANTE ANNUNCIO</div>
            <div class="logo">{'>'}_  AI Hub - Luca De Angelis</div>
        </div>
        
        <div class="content">
            <div class="greeting">Ciao,</div>
            
            <div class="highlight-box">
                <p class="highlight-text">Ho creato qualcosa di speciale per te.</p>
            </div>
            
            <div class="section">
                <div class="section-title">COSA È CAMBIATO:</div>
                <div class="section-content">
                    Dopo mesi di test e feedback dalla community, ho lanciato il nuovo AI Toolkit - una collezione di prompt, workflow e best practices per implementare l'AI nel business.
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">COSA INCLUDE:</div>
                <div class="section-content">
                    <div class="checklist-item">
                        <span class="checkmark">✓</span>
                        <span>50+ prompt testati per diverse industry</span>
                    </div>
                    <div class="checklist-item">
                        <span class="checkmark">✓</span>
                        <span>Template per automazioni con Claude e ChatGPT</span>
                    </div>
                    <div class="checklist-item">
                        <span class="checkmark">✓</span>
                        <span>Checklist per progetti AI aziendali</span>
                    </div>
                    <div class="checklist-item">
                        <span class="checkmark">✓</span>
                        <span>Video tutorial step-by-step</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">PERCHÉ È IMPORTANTE:</div>
                <div class="section-content">
                    Le aziende che implementano correttamente l'AI vedono incrementi di produttività del 25-40%. Questo toolkit ti permette di arrivarci più velocemente.
                </div>
            </div>
            
            <div class="cta-section">
                <div class="cta-title">Disponibile esclusivamente per gli iscritti</div>
                <a href="https://lucadeangelis.com/ai-toolkit" class="cta-button">👉 Scarica il Toolkit Ora</a>
            </div>
            
            <p>Domande? Rispondi direttamente a questa email.</p>
            
            <div class="signature">
                <strong>A presto,</strong><br>
                <strong>Luca De Angelis</strong><br>
                Founder, AI Hub
            </div>
        </div>
        
        <div class="footer">
            <p>Ricevi questa email perché sei iscritto ad AI Hub</p>
            <p><a href="#" style="color: #60a5fa;">Annulla iscrizione</a></p>
        </div>
    </div>
</body>
</html>`
    }
  ];

  // Funzioni per gestire i template personalizzati
  const saveCustomTemplate = async (templateData: Omit<CustomTemplate, 'id' | 'createdAt'>) => {
    const customTemplate: CustomTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedTemplates = [...customTemplates, customTemplate];
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('customNewsletterTemplates', JSON.stringify(updatedTemplates));
    
    toast({
      title: "Template salvato",
      description: `Template "${customTemplate.name}" salvato con successo!`,
    });
  };

  const loadCustomTemplates = () => {
    const saved = localStorage.getItem('customNewsletterTemplates');
    if (saved) {
      setCustomTemplates(JSON.parse(saved));
    }
  };

  const deleteCustomTemplate = (templateId: string) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('customNewsletterTemplates', JSON.stringify(updatedTemplates));
    
    toast({
      title: "Template eliminato",
      description: "Template personalizzato eliminato con successo",
    });
  };

  // Funzione per sostituire i placeholder nei template
  const processTemplateContent = (content: string, htmlContent: string) => {
    const currentDate = new Date().toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Sostituzioni comuni
    const replacements = {
      '{{name}}': 'lettore', // o nome specifico se disponibile
      '{{date}}': currentDate,
      'GenAI4Business': 'AI Hub',
      'genai4business.com': 'lucadeangelis.com',
      'GenAI4Business Newsletter': 'AI Hub Newsletter',
      'Il team GenAI4Business': 'Luca De Angelis - AI Hub'
    };

    let processedContent = content;
    let processedHtml = htmlContent;

    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), replacement);
      processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), replacement);
    });

    return { processedContent, processedHtml };
  };

  const applyTemplate = (template: any) => {
    const { processedContent, processedHtml } = processTemplateContent(
      template.content, 
      template.htmlContent
    );

    setNewCampaign({
      ...newCampaign,
      content: processedContent,
      htmlContent: processedHtml
    });
    setSelectedTemplate(template.id);
    toast({
      title: "Template applicato",
      description: `Template "${template.name}" applicato con successo!`,
    });
  };

  const startTemplateCustomization = (template: any) => {
    setCustomizingTemplate(template);
    setTemplateColors({
      primary: '#2563eb',
      secondary: '#3b82f6', 
      background: '#ffffff',
      text: '#000000'
    });
    setShowTemplateCustomizer(true);
  };

  const applyCustomizedTemplate = () => {
    if (!customizingTemplate) return;
    
    // Processa i placeholder prima di personalizzare i colori
    const { processedContent, processedHtml } = processTemplateContent(
      customizingTemplate.content,
      customizingTemplate.htmlContent
    );
    
    // Sostituisce i colori nel template HTML
    let customizedHtml = processedHtml;
    customizedHtml = customizedHtml.replace(/#2563eb/g, templateColors.primary);
    customizedHtml = customizedHtml.replace(/#3b82f6/g, templateColors.secondary);
    customizedHtml = customizedHtml.replace(/#ffffff/g, templateColors.background);
    customizedHtml = customizedHtml.replace(/#000000/g, templateColors.text);
    
    setNewCampaign({
      ...newCampaign,
      content: processedContent,
      htmlContent: customizedHtml
    });
    
    setShowTemplateCustomizer(false);
    setSelectedTemplate(customizingTemplate.id + '_custom');
    
    toast({
      title: "Template personalizzato applicato",
      description: "I tuoi colori sono stati applicati al template!",
    });
  };

  const generatePreviewHtml = () => {
    const { processedContent, processedHtml } = processTemplateContent(
      newCampaign.content,
      newCampaign.htmlContent || newCampaign.content.replace(/\n/g, '<br>')
    );
    
    const finalHtml = processedHtml || processedContent.replace(/\n/g, '<br>');
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Preview Newsletter</title>
</head>
<body style="margin: 0; padding: 20px; background: #f3f4f6; font-family: Arial, sans-serif;">
  ${finalHtml}
</body>
</html>`;
  };

  useEffect(() => {
    // Controlla se l'utente è autenticato
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    setIsAuthenticated(!!token);
    loadData();
    loadCustomTemplates();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    
    try {
      setLoading(true);
      
      if (token) {
        // Se autenticato, usa le API admin complete
        
        // Carica statistiche
        try {
          const statsRes = await fetch('/api/admin/newsletter/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        } catch (e) {
          console.log('Stats non disponibili, uso fallback');
        }

        // Carica iscritti
        try {
          const subscribersRes = await fetch('/api/admin/newsletter/subscribers', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (subscribersRes.ok) {
            const subscribersData = await subscribersRes.json();
            setSubscribers(subscribersData);
          }
        } catch (e) {
          console.log('Uso API pubblica per iscritti');
          await loadPublicData();
        }

        // Carica campagne
        try {
          const campaignsRes = await fetch('/api/admin/newsletter/campaigns', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (campaignsRes.ok) {
            const campaignsData = await campaignsRes.json();
            setCampaigns(campaignsData);
          }
        } catch (e) {
          console.log('Campagne non disponibili');
          setCampaigns([]);
        }
        
      } else {
        // Se non autenticato, usa solo i dati pubblici
        await loadPublicData();
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati della newsletter",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPublicData = async () => {
    // Usa l'API pubblica per gli iscritti
    const subscribersRes = await fetch('/api/newsletter-subscribers');
    if (subscribersRes.ok) {
      const emails = await subscribersRes.json();
      const subscribersData = emails.map((email: string, index: number) => ({
        id: index + 1,
        email: email,
        createdAt: new Date().toISOString()
      }));
      setSubscribers(subscribersData);
      
      setStats({
        totalSubscribers: emails.length,
        totalCampaigns: 0,
        sentCampaigns: 0
      });
    }
    setCampaigns([]);
  };

  const deleteSubscriber = async (id: number, email: string) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Accesso richiesto",
        description: "Effettua il login come admin per cancellare gli iscritti.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSubscribers(subscribers.filter(s => s.id !== id));
        toast({
          title: "Successo",
          description: "Iscritto rimosso con successo",
        });
      } else {
        throw new Error('Errore nella cancellazione');
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile rimuovere l'iscritto",
        variant: "destructive",
      });
    }
  };

  const createCampaign = async () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Accesso richiesto",
        description: "Effettua il login come admin per creare campagne.",
        variant: "destructive",
      });
      return;
    }

    if (!newCampaign.subject.trim()) {
      toast({
        title: "Subject mancante",
        description: "Inserisci un subject per la campagna.",
        variant: "destructive",
      });
      return;
    }

    if (!newCampaign.content.trim() && !newCampaign.htmlContent.trim()) {
      toast({
        title: "Contenuto mancante",
        description: "Inserisci il contenuto della newsletter (text o HTML).",
        variant: "destructive",
      });
      return;
    }

    try {
      // Processa i placeholder prima di inviare
      const { processedContent, processedHtml } = processTemplateContent(
        newCampaign.content,
        newCampaign.htmlContent
      );

      const campaignData = {
        subject: newCampaign.subject,
        content: processedContent,
        htmlContent: processedHtml
      };

      const response = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
      });

      if (response.ok) {
        const campaign = await response.json();
        setCampaigns([campaign, ...campaigns]);
        setNewCampaign({ subject: '', content: '', htmlContent: '' });
        setShowCreateDialog(false);
        setSelectedTemplate('');
        toast({
          title: "Successo",
          description: "Campagna creata con successo",
        });
        // Ricarica i dati per aggiornare le statistiche
        await loadData();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore nella creazione');
      }
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Impossibile creare la campagna",
        variant: "destructive",
      });
    }
  };

  const sendCampaign = async (campaignId: number) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Accesso richiesto",
        description: "Effettua il login come admin per inviare campagne.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingCampaign(campaignId);
      
      // Timeout più lungo per l'invio
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondi timeout

      const response = await fetch(`/api/admin/newsletter/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        await loadData(); // Ricarica i dati
        
        if (result.demo) {
          toast({
            title: "Modalità Demo",
            description: `Campagna inviata in modalità demo a ${result.sentCount} iscritti (SMTP non configurato)`,
            variant: "default"
          });
        } else {
          toast({
            title: "Successo",
            description: `Campagna inviata con successo a ${result.sentCount} iscritti`,
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore nell\'invio');
      }
    } catch (error: any) {
      console.error('Errore invio campagna:', error);
      
      if (error.name === 'AbortError') {
        toast({
          title: "Timeout",
          description: "L'invio sta richiedendo più tempo del previsto. Controlla i log del server per verificare lo stato.",
          variant: "default",
        });
      } else {
        toast({
          title: "Errore",
          description: error.message || "Impossibile inviare la campagna",
          variant: "destructive",
        });
      }
    } finally {
      setSendingCampaign(null);
    }
  };

  const resendCampaign = async (campaignId: number) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Accesso richiesto",
        description: "Effettua il login come admin per reinviare campagne.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingCampaign(campaignId);
      
      // Prima resettiamo lo stato a draft
      const resetResponse = await fetch(`/api/admin/newsletter/campaigns/${campaignId}/reset`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!resetResponse.ok) {
        throw new Error('Errore nel reset della campagna');
      }

      // Poi la inviamo di nuovo con timeout più lungo
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondi timeout

      const response = await fetch(`/api/admin/newsletter/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        await loadData(); // Ricarica i dati
        
        if (result.demo) {
          toast({
            title: "Campagna Reinviata",
            description: `Campagna reinviata in modalità demo a ${result.sentCount} iscritti`,
            variant: "default"
          });
        } else {
          toast({
            title: "Successo",
            description: `Campagna reinviata con successo a ${result.sentCount} iscritti`,
          });
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore nel reinvio');
      }
    } catch (error: any) {
      console.error('Errore reinvio campagna:', error);
      
      if (error.name === 'AbortError') {
        toast({
          title: "Timeout",
          description: "L'invio sta richiedendo più tempo del previsto. Controlla i log del server per verificare lo stato.",
          variant: "default",
        });
      } else {
        toast({
          title: "Errore",
          description: error.message || "Impossibile reinviare la campagna",
          variant: "destructive",
        });
      }
    } finally {
      setSendingCampaign(null);
    }
  };

  const viewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Management</h1>
          <p className="text-muted-foreground">Manage subscribers and email campaigns</p>
        </div>
      </div>

      {/* Banner di autenticazione */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Accesso limitato</h3>
              <p className="text-sm text-yellow-700">
                Stai visualizzando i dati in modalità sola lettura. Effettua il login come admin per accedere a tutte le funzionalità.
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/admin/login'}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              size="sm"
            >
              Login Admin
            </Button>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-800">Accesso completo</h3>
              <p className="text-sm text-green-700">
                Sei autenticato come admin. Puoi gestire iscritti, creare e inviare campagne.
              </p>
            </div>
            <Button 
              onClick={() => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                loadData();
              }}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
              <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Mail className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
              <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sent Campaigns</p>
              <p className="text-2xl font-bold">{stats.sentCampaigns}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="create">Create Campaign</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers ({subscribers.length})</CardTitle>
              <CardDescription>Manage your newsletter subscribers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscribers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No subscribers yet</p>
                ) : (
                  subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Subscribed: {new Date(subscriber.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSubscriber(subscriber.id, subscriber.email)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>View and manage your email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No campaigns created yet</p>
                ) : (
                  campaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{campaign.subject}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={campaign.status === 'sent' ? 'primary' : campaign.status === 'failed' ? 'accent' : 'outline'}>
                            {campaign.status}
                          </Badge>
                          
                          {/* Pulsante per visualizzare il contenuto */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewCampaign(campaign)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          {/* Pulsante per inviare (solo se draft) */}
                          {campaign.status === 'draft' && (
                            <Button
                              size="sm"
                              onClick={() => sendCampaign(campaign.id)}
                              disabled={sendingCampaign === campaign.id}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              {sendingCampaign === campaign.id ? 'Sending...' : 'Send'}
                            </Button>
                          )}

                          {/* Pulsante per reinviare (se sent o failed) */}
                          {(campaign.status === 'sent' || campaign.status === 'failed') && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => resendCampaign(campaign.id)}
                              disabled={sendingCampaign === campaign.id}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              {sendingCampaign === campaign.id ? 'Resending...' : 'Resend'}
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 truncate">{campaign.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                        {campaign.status === 'sent' && (
                          <>
                            <span>Sent to: {campaign.sentCount} subscribers</span>
                            {campaign.sentAt && (
                              <span>Sent on: {new Date(campaign.sentAt).toLocaleDateString()}</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>Create and send a new email campaign to your subscribers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Template Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">📋 Template Anti-Spam (Raccomandati)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {emailTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => applyTemplate(template)}
                            className="h-6 px-2 text-xs"
                          >
                            Usa
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startTemplateCustomization(template)}
                            className="h-6 px-2 text-xs"
                          >
                            <Palette className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {template.content.substring(0, 60)}...
                      </p>
                      <div className="mt-2 flex gap-1">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">✓ Anti-spam</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">🎨 Responsive</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Templates Section */}
                {customTemplates.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">💾 I Tuoi Template Personalizzati</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {customTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="border rounded-lg p-4 border-purple-200 bg-purple-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm text-purple-900">{template.name}</h3>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => applyTemplate(template)}
                                className="h-6 px-2 text-xs"
                              >
                                Usa
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteCustomTemplate(template.id)}
                                className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-purple-700 mb-2">{template.description}</p>
                          <div className="flex gap-1 mt-2">
                            <div 
                              className="w-4 h-4 rounded border" 
                              style={{ backgroundColor: template.colors.primary }}
                              title="Colore primario"
                            />
                            <div 
                              className="w-4 h-4 rounded border" 
                              style={{ backgroundColor: template.colors.secondary }}
                              title="Colore secondario"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTemplate && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✅ Template applicato! Puoi modificare il contenuto sotto.
                    </p>
                  </div>
                )}
              </div>

              {/* Campaign Subject */}
              <div>
                <label className="text-sm font-medium">📧 Subject Line</label>
                <Input
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  placeholder="es. 🚀 Newsletter AI Hub - Aggiornamenti di [mese]"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Evita parole spam come "GRATIS", "URGENTE", troppi punti esclamativi
                </p>
              </div>
              
              {/* Content Tabs */}
              <div>
                <label className="text-sm font-medium mb-3 block">✍️ Email Content</label>
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">📝 Text Content</TabsTrigger>
                    <TabsTrigger value="html">🎨 HTML Content</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="mt-4">
                    <Textarea
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                      placeholder="Scrivi qui il contenuto della tua newsletter...

Buone pratiche per evitare spam:
• Usa un rapporto testo/link equilibrato (90% testo, 10% link)
• Includi il tuo nome e informazioni di contatto
• Evita troppi caratteri speciali e maiuscole
• Mantieni un tono professionale ma personale"
                      rows={12}
                      className="font-mono"
                    />
                    <div className="mt-2 text-xs text-gray-500 bg-blue-50 p-3 rounded">
                      <strong>📊 Score Anti-Spam:</strong> {newCampaign.content.length > 200 ? '✅ Buono' : '⚠️ Troppo corto'}
                      <br />
                      <strong>Caratteri:</strong> {newCampaign.content.length} (min. 200 raccomandati)
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="html" className="mt-4">
                    <Textarea
                      value={newCampaign.htmlContent}
                      onChange={(e) => setNewCampaign({ ...newCampaign, htmlContent: e.target.value })}
                      placeholder="Template HTML ottimizzato per deliverability..."
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <div className="mt-2 text-xs text-gray-500 bg-green-50 p-3 rounded">
                      <strong>✅ I nostri template includono:</strong>
                      <br />• DOCTYPE e meta viewport per mobile
                      <br />• Stili inline per massima compatibilità
                      <br />• Struttura table-based per client email legacy
                      <br />• Link di disiscrizione conforme GDPR
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={createCampaign} 
                  disabled={loading || !newCampaign.subject.trim() || (!newCampaign.content.trim() && !newCampaign.htmlContent.trim())} 
                  className="flex-1"
                >
                  {loading ? 'Creating...' : '📤 Create Campaign'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreview(true)}
                  disabled={!newCampaign.content.trim() && !newCampaign.htmlContent.trim()}
                  className="flex-1"
                >
                  👀 Preview Email
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (newCampaign.subject.trim() && (newCampaign.content.trim() || newCampaign.htmlContent.trim())) {
                      // Mostra dialog per salvare come template personalizzato
                      const templateName = prompt('Nome del template personalizzato:');
                      const templateDescription = prompt('Descrizione del template:');
                      
                      if (templateName && templateDescription) {
                        saveCustomTemplate({
                          name: templateName,
                          description: templateDescription,
                          content: newCampaign.content,
                          htmlContent: newCampaign.htmlContent,
                          colors: templateColors
                        });
                      }
                    } else {
                      toast({
                        title: "Contenuto mancante",
                        description: "Completa subject e contenuto prima di salvare come template",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="flex-1"
                >
                  💾 Salva Template
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewCampaign({ subject: '', content: '', htmlContent: '' });
                    setSelectedTemplate('');
                  }}
                  className="flex-1"
                >
                  🗑️ Clear All
                </Button>
              </div>

              {/* Debug Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                  Debug: subject={newCampaign.subject.length}chars, content={newCampaign.content.length}chars, html={newCampaign.htmlContent.length}chars, loading={loading.toString()}
                  <br />
                  Button enabled: {(!loading && newCampaign.subject.trim() && (newCampaign.content.trim() || newCampaign.htmlContent.trim())).toString()}
                </div>
              )}

              {/* Validation Messages */}
              {!newCampaign.subject.trim() && (
                <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3">
                  ⚠️ Inserisci un subject per la campagna
                </div>
              )}
              {newCampaign.subject.trim() && !newCampaign.content.trim() && !newCampaign.htmlContent.trim() && (
                <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3">
                  ⚠️ Inserisci il contenuto della newsletter (text o HTML)
                </div>
              )}

              {/* Best Practices Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Best Practices Anti-Spam:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <strong>✅ Da fare:</strong>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Usa il nome del mittente reale</li>
                      <li>• Includi indirizzo fisico</li>
                      <li>• Mantieni rapporto 60:40 testo/immagini</li>
                      <li>• Testa su Outlook, Gmail, Apple Mail</li>
                      <li>• Link di disiscrizione visibile</li>
                    </ul>
                  </div>
                  <div>
                    <strong>❌ Da evitare:</strong>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• TUTTO IN MAIUSCOLO</li>
                      <li>• Troppi punti esclamativi!!!</li>
                      <li>• Parole come "gratis", "offerta limitata"</li>
                      <li>• Solo immagini senza testo</li>
                      <li>• Link accorciati (bit.ly, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal per visualizzare il contenuto della campagna */}
      <Dialog open={showCampaignModal} onOpenChange={setShowCampaignModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.subject}</DialogTitle>
            <DialogDescription>
              Campaign details and content preview
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-4">
              {/* Informazioni campagna */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedCampaign.status === 'sent' ? 'primary' : selectedCampaign.status === 'failed' ? 'accent' : 'outline'}>
                      {selectedCampaign.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(selectedCampaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {selectedCampaign.status === 'sent' && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Sent to</Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedCampaign.sentCount} subscribers
                      </p>
                    </div>
                    {selectedCampaign.sentAt && (
                      <div>
                        <Label className="text-sm font-medium">Sent on</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(selectedCampaign.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Contenuto campagna */}
              <div>
                <Label className="text-sm font-medium">Subject</Label>
                <Input
                  value={selectedCampaign.subject}
                  readOnly
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Content</Label>
                <Textarea
                  value={selectedCampaign.content}
                  readOnly
                  rows={8}
                  className="mt-1"
                />
              </div>

              {selectedCampaign.htmlContent && selectedCampaign.htmlContent !== selectedCampaign.content && (
                <div>
                  <Label className="text-sm font-medium">HTML Content</Label>
                  <Textarea
                    value={selectedCampaign.htmlContent}
                    readOnly
                    rows={6}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCampaignModal(false)}
            >
              Close
            </Button>
            
            {selectedCampaign && (
              <>
                {selectedCampaign.status === 'draft' && (
                  <Button
                    onClick={() => {
                      setShowCampaignModal(false);
                      sendCampaign(selectedCampaign.id);
                    }}
                    disabled={sendingCampaign === selectedCampaign.id}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Campaign
                  </Button>
                )}
                
                {(selectedCampaign.status === 'sent' || selectedCampaign.status === 'failed') && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowCampaignModal(false);
                      resendCampaign(selectedCampaign.id);
                    }}
                    disabled={sendingCampaign === selectedCampaign.id}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Resend Campaign
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal di anteprima email */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>📧 Preview Newsletter</DialogTitle>
            <DialogDescription>
              Ecco come apparirà la tua newsletter agli iscritti
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <iframe
              srcDoc={generatePreviewHtml()}
              className="w-full h-full border rounded-lg"
              title="Email Preview"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Chiudi
            </Button>
            <Button 
              onClick={() => {
                setShowPreview(false);
                createCampaign();
              }}
              disabled={!newCampaign.subject || !newCampaign.content}
            >
              📤 Crea e Salva Campagna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Template Customizer */}
      <Dialog open={showTemplateCustomizer} onOpenChange={setShowTemplateCustomizer}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>🎨 Personalizza Template</DialogTitle>
            <DialogDescription>
              Modifica i colori del template "{customizingTemplate?.name}" per adattarlo al tuo brand
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">🎯 Colore Primario</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={templateColors.primary}
                    onChange={(e) => setTemplateColors({...templateColors, primary: e.target.value})}
                    className="w-12 h-8 rounded border cursor-pointer"
                    title="Seleziona colore primario"
                    aria-label="Colore primario"
                  />
                  <Input
                    value={templateColors.primary}
                    onChange={(e) => setTemplateColors({...templateColors, primary: e.target.value})}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Usato per headers, bottoni, link</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">🎨 Colore Secondario</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={templateColors.secondary}
                    onChange={(e) => setTemplateColors({...templateColors, secondary: e.target.value})}
                    className="w-12 h-8 rounded border cursor-pointer"
                    title="Seleziona colore secondario"
                    aria-label="Colore secondario"
                  />
                  <Input
                    value={templateColors.secondary}
                    onChange={(e) => setTemplateColors({...templateColors, secondary: e.target.value})}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Gradienti e accenti</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">📄 Sfondo</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={templateColors.background}
                    onChange={(e) => setTemplateColors({...templateColors, background: e.target.value})}
                    className="w-12 h-8 rounded border cursor-pointer"
                    title="Seleziona colore di sfondo"
                    aria-label="Colore di sfondo"
                  />
                  <Input
                    value={templateColors.background}
                    onChange={(e) => setTemplateColors({...templateColors, background: e.target.value})}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Colore di sfondo principale</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">📝 Testo</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={templateColors.text}
                    onChange={(e) => setTemplateColors({...templateColors, text: e.target.value})}
                    className="w-12 h-8 rounded border cursor-pointer"
                    title="Seleziona colore del testo"
                    aria-label="Colore del testo"
                  />
                  <Input
                    value={templateColors.text}
                    onChange={(e) => setTemplateColors({...templateColors, text: e.target.value})}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Colore del testo principale</p>
              </div>
            </div>

            {/* Preset Color Schemes */}
            <div>
              <Label className="text-sm font-medium mb-3 block">🎨 Schemi Colori Predefiniti</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* AI Hub Default */}
                <div 
                  className="p-3 border rounded cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setTemplateColors({
                    primary: '#2563eb',
                    secondary: '#3b82f6',
                    background: '#ffffff',
                    text: '#000000'
                  })}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#2563eb'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#3b82f6'}}></div>
                    <div className="w-4 h-4 rounded border" style={{backgroundColor: '#ffffff'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#000000'}}></div>
                  </div>
                  <p className="text-xs font-medium">AI Hub</p>
                </div>

                {/* Corporate Blue */}
                <div 
                  className="p-3 border rounded cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setTemplateColors({
                    primary: '#1e40af',
                    secondary: '#3b82f6',
                    background: '#f8fafc',
                    text: '#1e293b'
                  })}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#1e40af'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#3b82f6'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#f8fafc'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#1e293b'}}></div>
                  </div>
                  <p className="text-xs font-medium">Corporate</p>
                </div>

                {/* Tech Green */}
                <div 
                  className="p-3 border rounded cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setTemplateColors({
                    primary: '#059669',
                    secondary: '#10b981',
                    background: '#ffffff',
                    text: '#065f46'
                  })}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#059669'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#10b981'}}></div>
                    <div className="w-4 h-4 rounded border" style={{backgroundColor: '#ffffff'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#065f46'}}></div>
                  </div>
                  <p className="text-xs font-medium">Tech</p>
                </div>

                {/* Purple Elegant */}
                <div 
                  className="p-3 border rounded cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setTemplateColors({
                    primary: '#7c3aed',
                    secondary: '#a855f7',
                    background: '#faf5ff',
                    text: '#581c87'
                  })}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#7c3aed'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#a855f7'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#faf5ff'}}></div>
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#581c87'}}></div>
                  </div>
                  <p className="text-xs font-medium">Elegant</p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium mb-2 block">👀 Anteprima Colori</Label>
              <div className="bg-white rounded border p-3 space-y-2">
                <div 
                  className="text-white px-3 py-2 rounded text-sm font-medium"
                  style={{backgroundColor: templateColors.primary}}
                >
                  Header con colore primario
                </div>
                <div 
                  className="px-3 py-1 rounded text-sm"
                  style={{
                    backgroundColor: templateColors.secondary + '20',
                    color: templateColors.secondary,
                    border: `1px solid ${templateColors.secondary}40`
                  }}
                >
                  Sezione con colore secondario
                </div>
                <div style={{color: templateColors.text}}>
                  Testo normale con il colore del testo principale
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-sm text-amber-800">
                <strong>💡 Suggerimenti:</strong>
                <br />• Mantieni un buon contrasto tra testo e sfondo
                <br />• Usa colori coerenti con il tuo brand
                <br />• Testa sempre su diversi client email
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowTemplateCustomizer(false)}>
              Annulla
            </Button>
            <Button onClick={applyCustomizedTemplate}>
              ✅ Applica Colori Personalizzati
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 