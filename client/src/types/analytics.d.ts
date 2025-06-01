// Google Analytics gtag declarations
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        page_title?: string;
        page_location?: string;
        page_path?: string;
        custom_map?: Record<string, string>;
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }
}

// Microsoft Clarity declarations
declare global {
  interface Window {
    clarity: (command: string, ...args: any[]) => void;
  }
}

export {}; 