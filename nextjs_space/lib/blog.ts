// Build-time readers for blog content (used by the static blog pages).
// Reads the same public/blog-content/ JSON files the engine writes.

import fs from 'fs'
import path from 'path'
import type { BlogIndex, BlogIndexEntry, BlogPost } from './blog-types'

const CONTENT_DIR = path.join(process.cwd(), 'public', 'blog-content')

export function getBlogIndex(): BlogIndex {
  try {
    return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'index.json'), 'utf-8')) as BlogIndex
  } catch {
    return { updatedAt: '', posts: [] }
  }
}

export function getPublishedPosts(): BlogIndexEntry[] {
  return getBlogIndex()
    .posts.filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPost(slug: string): BlogPost | null {
  try {
    const post = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'posts', `${slug}.json`), 'utf-8')) as BlogPost
    return post.status === 'published' ? post : null
  } catch {
    return null
  }
}
