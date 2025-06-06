import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import matter from 'gray-matter';
import { Article, ArticleMeta } from '@shared/types';

// Process markdown to HTML
export async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}

// Extract frontmatter from markdown and get HTML content
export function extractFrontmatter(markdown: string, slug: string): Article {
  const { data, content } = matter(markdown);
  
  const meta: ArticleMeta = {
    title: data.title || 'Untitled Article',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    summary: data.summary || '',
    author: data.author || 'AI Hub Team',
    category: data.category || 'Uncategorized',
    image: data.image,
    tags: Array.isArray(data.tags) ? data.tags : [],
    slug,
  };

  return { slug, meta, content };
}
