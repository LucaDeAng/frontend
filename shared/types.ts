// Types for articles
export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  author: string;
  category: string;
  image?: string;
  tags: string[];
}

export interface Article {
  slug: string;
  meta: ArticleMeta;
  content: string;
}

// Types for playground
export interface PlaygroundRequest {
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface PlaygroundResponse {
  text: string;
  model: string;
  generationTime: string;
}

// Types for newsletter
export interface NewsletterSubscription {
  email: string;
}
