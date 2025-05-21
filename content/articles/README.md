# How to Add New Articles

This folder contains all the articles for the website in Markdown format. To add a new article, follow these steps:

## Article Creation Process

1. Create a new `.md` file in this directory with a descriptive filename (use kebab-case like `my-new-article.md`)

2. Add the required frontmatter at the top of your file:
   ```
   ---
   title: "Your Article Title Here"
   date: "YYYY-MM-DD"
   summary: "A compelling brief summary of your article (1-2 sentences)"
   author: "Your Name"
   category: "Category Name"
   image: "https://link-to-your-header-image.jpg"
   ---
   ```

3. Write your article content below the frontmatter using Markdown syntax:
   - Use `#` for main heading (should match the title)
   - Use `##` for section headings
   - Use `###` for subsection headings
   - Use `**text**` for bold text
   - Use `*text*` for italic text
   - Use `[link text](https://url.com)` for links
   - Use `- item` for bullet lists
   - Use `1. item` for numbered lists

4. Save the file and the article will automatically appear on the site

## Best Practices

- Use high-quality, engaging images (800x500px works well for header images)
- Keep paragraphs relatively short for better readability
- Include subheadings to break up long sections of text
- Add relevant links where appropriate
- Consider adding a concluding section to summarize key points
- Proofread thoroughly before publishing

## Example Article Structure

```md
---
title: "How to Master Prompt Engineering"
date: "2025-05-20"
summary: "Learn essential techniques for crafting effective prompts that yield consistent, high-quality results from AI models."
author: "Luca De Angelis"
category: "AI Techniques"
image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80"
---

# How to Master Prompt Engineering

Introduction paragraph that explains what prompt engineering is and why it matters...

## Understanding AI Language Models

Details about how language models work and why prompt structure matters...

## Key Principles of Effective Prompts

### Clarity and Specificity
Information about being clear in prompts...

### Context Provision
How to provide meaningful context...

## Advanced Techniques

Details about more sophisticated approaches...

## Common Mistakes to Avoid

List of pitfalls and how to prevent them...

## Conclusion

Summary of key takeaways and next steps...
```

The website will automatically handle the article display, formatting, and integration into the articles listing.