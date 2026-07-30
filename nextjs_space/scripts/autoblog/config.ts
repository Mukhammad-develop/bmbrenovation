// Loads scripts/autoblog/config.json — the single place controlling the engine.

import fs from 'fs'
import path from 'path'
import type { KeywordSeeds } from './keywords'

export interface AutoBlogConfig {
  siteUrl: string
  model: string
  temperature: number
  postsPerRun: number
  autoPublish: boolean
  daemonIntervalHours: number
  minWords: number
  maxWords: number
  seedBatchSize: number
  company: {
    name: string
    phone: string
    phoneHref: string
    email: string
    address: string
    areas: string[]
    services: string[]
  }
  approvedFacts: string[]
  servicePageTypes: string[]
  locationSlugs: string[]
  keywordSeeds: KeywordSeeds
  cta: {
    heading: string
    text: string
    buttonText: string
    href: string
  }
}

export function loadConfig(): AutoBlogConfig {
  const file = path.join(__dirname, 'config.json')
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as AutoBlogConfig
}

// All internal pages a post may link to (40 landing pages + core pages).
export function buildLinkPool(config: AutoBlogConfig): { path: string; label: string }[] {
  const links: { path: string; label: string }[] = [
    { path: '/services', label: 'our renovation services' },
    { path: '/portfolio', label: 'our recent projects' },
    { path: '/contact', label: 'get a free quote' },
    { path: '/about', label: 'about BMB Renovation' },
  ]
  for (const type of config.servicePageTypes) {
    for (const loc of config.locationSlugs) {
      const label = `${type.replace(/-/g, ' ')} ${loc.replace(/-/g, ' ')}`
      links.push({ path: `/${type}-${loc}`, label })
    }
  }
  return links
}
