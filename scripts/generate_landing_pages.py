#!/usr/bin/env python3
"""
Generate Next.js landing pages from HTML files.
Strategy: 
  - CSS → dedicated [slug].css file loaded in the page
  - Body HTML → dangerouslySetInnerHTML (safe, no JSX parsing issues)
  - Scripts → separate <script dangerouslySetInnerHTML> 
  - Static export compatible (force-static)
"""

import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
LANDING_DIR = ROOT / "landing-files"
NEXTJS_APP = ROOT / "nextjs_space" / "app"

# ── Helpers ──────────────────────────────────────────────────────────────────

def slugify(filename: str) -> str:
    return filename.replace(".html", "")

def extract_body_content(html: str) -> str:
    """Extract everything between <body> and </body>."""
    m = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return html

def extract_meta(html: str) -> dict:
    title_m = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    desc_m  = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
    return {
        "title": title_m.group(1).strip() if title_m else "",
        "description": desc_m.group(1).strip() if desc_m else "",
    }

def extract_styles(html: str) -> str:
    """Extract content of the <style> block."""
    m = re.search(r'<style>(.*?)</style>', html, re.DOTALL | re.IGNORECASE)
    if m:
        return m.group(1)
    return ""

def extract_scripts(html: str) -> str:
    """Extract inline <script> content (not external src=) from the page."""
    scripts = re.findall(r'<script(?![^>]*\bsrc\b)[^>]*>(.*?)</script>', html, re.DOTALL | re.IGNORECASE)
    return "\n\n".join(s.strip() for s in scripts if s.strip())

def fix_image_paths(content: str) -> str:
    """Fix: nextjs_space/public/images/ → /images/"""
    content = re.sub(r'(?:src|href)="nextjs_space/public/images/', 'src="/images/', content)
    return content

def fix_image_names(content: str, slug: str) -> str:
    """Map specific image filenames to existing ones."""
    slug_lower = slug.lower()
    if 'kitchen' in slug_lower:
        hero = '/images/02_kitchen_marble.jpg'
        secondary = '/images/13_modern_kitchen_bright.jpg'
    elif 'bathroom' in slug_lower:
        hero = '/images/03_luxury_bathroom.jpg'
        secondary = '/images/12_bathroom_before_after.jpg'
    else:
        hero = '/images/01_hero_luxury_interior.jpg'
        secondary = '/images/04_living_room_open_plan.jpg'

    # Replace any reference to kitchen_modern or similar non-existent images
    content = re.sub(r'/images/\d+_kitchen_modern\.jpg', hero, content)
    content = re.sub(r'/images/\d+_luxury_bathroom\.jpg', hero, content)
    content = re.sub(r'/images/\d+_bathroom_after\.jpg', secondary, content)
    content = re.sub(r'/images/\d+_kitchen_after\.jpg', secondary, content)
    return content

def clean_body(body: str, slug: str) -> str:
    """Minimal cleanup of the body HTML for embedding."""
    body = fix_image_paths(body)
    body = fix_image_names(body, slug)
    # Remove any stray <html> <head> <body> tags
    body = re.sub(r'</?(?:html|head|body)[^>]*>', '', body, flags=re.IGNORECASE)
    # Collapse excessive blank lines
    body = re.sub(r'\n{3,}', '\n\n', body)
    return body.strip()

def py_escape(s: str) -> str:
    """Escape a string for safe embedding in Python triple-quoted strings."""
    return s.replace('\\', '\\\\').replace('"""', '\\"\\"\\"')

def generate_page_tsx(slug: str, html_content: str) -> str:
    """Generate a complete TSX file for one landing page."""
    meta = extract_meta(html_content)
    styles = extract_styles(html_content)
    body = extract_body_content(html_content)
    scripts = extract_scripts(html_content)

    body = clean_body(body, slug)

    # Determine image for OG
    slug_lower = slug.lower()
    if 'kitchen' in slug_lower:
        hero_img = '/images/02_kitchen_marble.jpg'
    elif 'bathroom' in slug_lower:
        hero_img = '/images/03_luxury_bathroom.jpg'
    else:
        hero_img = '/images/01_hero_luxury_interior.jpg'

    # Safely escape strings for embedding in TSX string literals
    title = meta["title"].replace("'", "\\'").replace('"', '\\"')
    description = meta["description"].replace("'", "\\'").replace('"', '\\"')

    # We'll write CSS to a CSS file and import it
    # We'll embed body as a JS string using JSON encoding to be 100% safe
    body_json = json.dumps(body)        # produces a safe JSON-encoded JS string
    styles_json = json.dumps(styles)    # same for styles
    scripts_json = json.dumps(scripts)  # same for scripts

    tsx = f'''import type {{ Metadata }} from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {{
  title: {json.dumps(title)},
  description: {json.dumps(description)},
  alternates: {{
    canonical: 'https://bmbrenovation.co.uk/{slug}',
  }},
  openGraph: {{
    title: {json.dumps(title)},
    description: {json.dumps(description)},
    images: ['{hero_img}'],
  }},
}}

const pageStyles: string = {styles_json}

const pageBody: string = {body_json}

const pageScripts: string = {scripts_json}

export default function LandingPage() {{
  return (
    <>
      <style dangerouslySetInnerHTML={{{{ __html: pageStyles }}}} />
      <div dangerouslySetInnerHTML={{{{ __html: pageBody }}}} />
      {{pageScripts && (
        <script dangerouslySetInnerHTML={{{{ __html: pageScripts }}}} />
      )}}
    </>
  )
}}
'''
    return tsx

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    html_files = sorted(LANDING_DIR.glob("*.html"))
    print(f"Found {len(html_files)} landing files")

    created = []
    failed = []

    for html_file in html_files:
        slug = slugify(html_file.name)
        out_dir = NEXTJS_APP / slug
        out_file = out_dir / "page.tsx"

        try:
            html_content = html_file.read_text(encoding="utf-8")
            tsx_content = generate_page_tsx(slug, html_content)

            out_dir.mkdir(parents=True, exist_ok=True)
            out_file.write_text(tsx_content, encoding="utf-8")

            created.append(slug)
            print(f"  ✓ Created: /{slug}")
        except Exception as e:
            failed.append((slug, str(e)))
            print(f"  ✗ Failed:  /{slug} — {e}")

    print(f"\n{'─'*50}")
    print(f"Created: {len(created)} pages")
    print(f"Failed:  {len(failed)} pages")
    if failed:
        for slug, err in failed:
            print(f"  - {slug}: {err}")

    # Write sitemap data for landing pages
    sitemap_data = {
        "landing_pages": [f"/{slug}" for slug in created]
    }
    sitemap_path = ROOT / "nextjs_space" / "landing-pages-list.json"
    sitemap_path.write_text(json.dumps(sitemap_data, indent=2))
    print(f"\nWrote landing pages list to: nextjs_space/landing-pages-list.json")
    print(f"Example URLs:")
    for slug in created[:5]:
        print(f"  https://bmbrenovation.co.uk/{slug}")

if __name__ == "__main__":
    main()
