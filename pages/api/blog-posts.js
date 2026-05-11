import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req, res) {
  const blogDir = path.join(process.cwd(), 'content/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

  const posts = files.map(filename => {
    const filePath = path.join(blogDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');

    let frontmatter = {};
    let content = raw;

    // Try to parse YAML front matter (--- delimited)
    try {
      const parsed = matter(raw);
      frontmatter = parsed.data;
      content = parsed.content;
    } catch {
      frontmatter = {};
      content = raw;
    }

    // If no title in front matter, extract from first h1
    if (!frontmatter.title) {
      const titleMatch = raw.match(/^#\s+(.+)/m);
      frontmatter.title = titleMatch ? titleMatch[1].trim() : filename.replace('.md', '');
    }
    if (!frontmatter.date) frontmatter.date = '';
    if (!frontmatter.tags) frontmatter.tags = [];

    // slug from filename (strip date prefix and .md)
    const slug = filename
      .replace(/\.md$/, '')
      .replace(/^\d{4}-\d{2}-\d{2}-/, '')
      .replace(/[_\s]+/g, '-');

    // Extract excerpt (first paragraph after title/front matter, excluding blockquote)
    const excerptMatch = content
      .replace(/^#\s.+$/m, '')           // remove h1
      .replace(/^>.*$/m, '')             // remove blockquotes
      .match(/([^#\n>]{30,}?)(?:\.|。|\n\n)/);

    const excerpt = excerptMatch
      ? excerptMatch[1].trim().replace(/^##?\s*/, '').slice(0, 150)
      : '';

    return {
      slug,
      title: frontmatter.title || filename.replace('.md', ''),
      date: frontmatter.date || '',
      tags: frontmatter.tags || [],
      keywords: frontmatter.keywords || '',
      excerpt,
      content,  // raw markdown
    };
  });

  // Sort by date descending (files without date go last)
  posts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  // If a slug query param is provided, return single post
  const { slug } = req.query;
  if (slug) {
    const post = posts.find(p => p.slug === slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    return res.status(200).json(post);
  }

  res.status(200).json(posts);
}
