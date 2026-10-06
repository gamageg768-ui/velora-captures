import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Post = {
  slug: string
  title: string
  date: string        // "YYYY-MM-DD"
  excerpt: string
  tags: string[]
  readingTime: number // minutes, approximate
  content: string     // raw MDX string
}

const POSTS_DIR = path.join(process.cwd(), 'content/journal')

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'))

  const posts: Post[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const filePath = path.join(POSTS_DIR, filename)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    const wordCount = content.trim().split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const date = typeof data.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.date)
      ? data.date
      : ''

    return {
      slug,
      title: data.title ?? slug,
      date,
      excerpt: data.excerpt ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readingTime,
      content,
    }
  })

  // Sort by date descending (empty dates sort last)
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const wordCount = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingTime,
    content,
  }
}
