#!/usr/bin/env python3
"""
Generate Next.js landing pages from HTML files.

UX changes applied globally:
  1. Quote form removed from hero section, placed near bottom (#quote-form)
  2. Hero hero-grid becomes single-col (no right-panel form)
  3. All "Get a Free Quote" CTAs link to #quote-form
  4. "#contact-form" section renamed to id="quote-form"
  5. Hero and CTA sections get "No obligation, only friendly advice." reassurance
  6. Success/thank-you message removes the "Call us now" phone button
  7. Header always white/light background; logo + nav links black and visible

Strategy:
  - CSS → dangerouslySetInnerHTML (with targeted overrides appended)
  - Body HTML → post-processed then dangerouslySetInnerHTML
  - Scripts → with success message rewritten
"""

import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
LANDING_DIR = ROOT / "landing-files"
NEXTJS_APP = ROOT / "nextjs_space" / "app"

# ── CSS OVERRIDES ─────────────────────────────────────────────────────────────
# Appended to each page's existing <style> to enforce header + hero layout fixes

HEADER_STYLE_OVERRIDES = """
  /* ── HEADER OVERRIDE: always white bg, black text ── */
  #site-header {
    background: #fff !important;
    box-shadow: 0 1px 0 rgba(0,0,0,0.08) !important;
  }
  .logo-bmb {
    color: #111827 !important;
    font-weight: 800 !important;
  }
  .logo-reno {
    color: var(--gold) !important;
  }
  .nav-link {
    color: #374151 !important;
  }
  .nav-link:hover {
    color: var(--gold) !important;
    background: var(--gray-100) !important;
  }
  .header-call {
    display: flex !important;
    background: #111827 !important;
    color: #fff !important;
  }
  .header-call:hover { opacity: 0.9; }
  .hamburger span { background: #111827 !important; }

  /* ── HERO: single column (form removed from hero) ── */
  .hero-grid {
    grid-template-columns: 1fr !important;
    max-width: 680px;
  }
  /* hide old hero-form wrapper if it somehow remains */
  .hero-quote-panel { display: none !important; }

  /* ── REASSURANCE TEXT ── */
  .reassurance-text {
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.65);
    margin-top: 0.625rem;
    font-style: italic;
  }
  .reassurance-text-dark {
    font-size: 0.8125rem;
    color: var(--gray-500);
    margin-top: 0.625rem;
    font-style: italic;
    text-align: center;
  }

  /* ── QUOTE FORM SECTION (bottom of page) ── */
  #quote-form {
    scroll-margin-top: 90px;
  }
  .quote-section-wrap {
    background: var(--gray-50);
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    border: 1.5px solid var(--gray-100);
    max-width: 720px;
    margin: 0 auto;
  }
  .quote-section-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.625rem;
    font-weight: 800;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
  }
  .quote-section-sub {
    font-size: 0.9375rem;
    color: var(--gray-500);
    margin-bottom: 2rem;
  }
"""

# ── QUOTE FORM SECTION (replaces old hero form + bolts on near bottom) ────────
# {service_label} and {city_label} are replaced per-page

QUOTE_FORM_SECTION = """
<!-- ═══════════════════════════════════════════════
     QUOTE FORM SECTION  (moved from hero to bottom)
════════════════════════════════════════════════ -->
<section class="section" id="quote-form" aria-labelledby="quote-form-heading">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Free Quote</span>
      <h2 id="quote-form-heading">Get a Free Quote for {service_label} in {city_label}</h2>
      <p>No obligation, only friendly advice. Tell us about your project and we will come back to you promptly with a clear, written quote.</p>
    </div>
    <div class="quote-section-wrap reveal">
      <form id="main-quote-form" novalidate>
        <div class="form-row form-row-2">
          <div class="form-group">
            <label class="form-label" for="qf-name">Your Name *</label>
            <input class="form-input" id="qf-name" name="name" type="text" placeholder="John Smith" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="qf-phone">Phone Number *</label>
            <input class="form-input" id="qf-phone" name="phone" type="tel" placeholder="+44 7XXX XXX XXX" required />
          </div>
        </div>
        <div class="form-row mt-1">
          <div class="form-group">
            <label class="form-label" for="qf-email">Email Address</label>
            <input class="form-input" id="qf-email" name="email" type="email" placeholder="john@example.com" />
          </div>
        </div>
        <div class="form-row form-row-2 mt-1">
          <div class="form-group">
            <label class="form-label" for="qf-project">Project Type</label>
            <select class="form-select" id="qf-project" name="project">
              <option value="">Select project type</option>
              {project_options}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="qf-postcode">Location / Postcode</label>
            <input class="form-input" id="qf-postcode" name="postcode" type="text" placeholder="e.g. WD17 2AB" />
          </div>
        </div>
        <div class="form-row mt-1">
          <div class="form-group">
            <label class="form-label" for="qf-message">Tell Us About Your Project</label>
            <textarea class="form-textarea" id="qf-message" name="message" placeholder="Describe your project — size, style, any specific requirements..."></textarea>
          </div>
        </div>
        <div class="form-row mt-1">
          <div class="form-group">
            <label class="form-label" for="qf-time">Preferred Contact Time</label>
            <select class="form-select" id="qf-time" name="contact_time">
              <option value="">Any time</option>
              <option>Morning (8am–12pm)</option>
              <option>Afternoon (12pm–5pm)</option>
              <option>Evening (after 5pm)</option>
            </select>
          </div>
        </div>
        <button type="submit" class="form-submit">Request Free Quote →</button>
        <p class="form-note"><strong>No obligation, only friendly advice.</strong><br />Your details are safe with us. We will only contact you about your renovation enquiry.</p>
      </form>
    </div>
  </div>
</section>
"""

# ── JAVASCRIPT (clean, updated success message) ───────────────────────────────

CLEAN_SCRIPT = """
  // ── Header: always scrolled/white style ──
  const header = document.getElementById('site-header');
  if (header) {
    header.classList.add('scrolled');
    window.addEventListener('scroll', () => {
      header.classList.add('scrolled');
    }, { passive: true });
  }

  // ── Hamburger ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
    });
  }

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ── Form submission ──
  // Handle all quote forms: main-quote-form, hero-form, contact-quote-form
  ['main-quote-form', 'hero-form', 'contact-quote-form'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = (form.querySelector('[name="name"]') || {}).value || '';
      const phone = (form.querySelector('[name="phone"]') || {}).value || '';
      if (!name.trim() || !phone.trim()) {
        alert('Please enter your name and phone number.');
        return;
      }
      const serviceText = form.closest('section') && form.closest('section').querySelector('h2')
        ? form.closest('section').querySelector('h2').textContent.replace('Get a Free Quote for ', '')
        : 'your renovation project';
      form.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
          <div style="font-size:3rem;margin-bottom:1rem;">✅</div>
          <h3 style="font-family:'Plus Jakarta Sans',sans-serif;color:#111827;margin-bottom:0.75rem;">Thank You, ${name.trim()}!</h3>
          <p style="color:#6B7280;font-size:0.9375rem;line-height:1.7;max-width:480px;margin:0 auto;">
            We have received your enquiry and will be in touch shortly to discuss ${serviceText}.
          </p>
          <p style="color:#9CA3AF;font-size:0.875rem;margin-top:1.25rem;font-style:italic;">
            You can get in touch yourself anytime before our team calls you back.
          </p>
        </div>`;
    });
  });
"""

# ── Helpers ──────────────────────────────────────────────────────────────────

def slugify(filename: str) -> str:
    return filename.replace(".html", "")

def extract_meta(html: str) -> dict:
    title_m = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    desc_m  = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE)
    return {
        "title": title_m.group(1).strip() if title_m else "",
        "description": desc_m.group(1).strip() if desc_m else "",
    }

def extract_styles(html: str) -> str:
    m = re.search(r'<style>(.*?)</style>', html, re.DOTALL | re.IGNORECASE)
    return m.group(1) if m else ""

def extract_body_content(html: str) -> str:
    m = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    content = m.group(1).strip() if m else html
    # Remove all <script>...</script> blocks from body — we use CLEAN_SCRIPT instead
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
    # Remove HTML comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    return content

def fix_image_paths(content: str) -> str:
    content = re.sub(r'(?:src|href)="nextjs_space/public/images/', 'src="/images/', content)
    return content

def fix_image_names(content: str, slug: str) -> str:
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
    content = re.sub(r'/images/\d+_kitchen_modern\.jpg', hero, content)
    content = re.sub(r'/images/\d+_luxury_bathroom\.jpg', hero, content)
    content = re.sub(r'/images/\d+_bathroom_after\.jpg', secondary, content)
    return content

def parse_service_and_city(slug: str) -> tuple[str, str]:
    """Return (service_label, city_label) from slug like kitchen-renovation-watford."""
    parts = slug.split("-")
    # Find where the area starts: after known service words
    service_words = []
    area_words = []
    i = 0
    while i < len(parts) and parts[i] in ("kitchen", "bathroom", "renovation", "fitting"):
        service_words.append(parts[i].capitalize())
        i += 1
    area_words = parts[i:]
    service = " ".join(service_words)
    city = " ".join(w.capitalize() for w in area_words)
    return service, city

def project_options_for_service(slug: str) -> str:
    slug_lower = slug.lower()
    if 'kitchen' in slug_lower:
        return """<option>Full Kitchen Renovation</option>
              <option>Kitchen Fitting</option>
              <option>Worktop Replacement</option>
              <option>Kitchen Tiling / Splashback</option>
              <option>Other</option>"""
    elif 'bathroom' in slug_lower:
        return """<option>Full Bathroom Renovation</option>
              <option>Bathroom Fitting / Suite Installation</option>
              <option>Shower Installation</option>
              <option>Bathroom Tiling</option>
              <option>Other</option>"""
    else:
        return """<option>Full Renovation</option>
              <option>Fitting / Installation</option>
              <option>Other</option>"""

def remove_hero_form(body: str) -> str:
    """
    Remove the quote form card from inside the hero section.
    The hero section contains a hero-grid with two children:
      - left: headline/CTA
      - right: <div id="quote-form"><div class="quote-card">...</div></div>
    We remove the right panel (quote-card div inside #quote-form inside hero).
    We also simplify the hero-grid to be single column.
    """
    # Strategy: find the hero section, and within it remove the right-column quote card div.
    # The pattern is:  <div id="quote-form"> ... </div>  inside the hero section.
    # We use a targeted regex to remove it from the hero context.

    # Find the hero section bounds
    hero_start = body.find('<section id="hero"')
    if hero_start == -1:
        hero_start = body.find("<section id='hero'")
    if hero_start == -1:
        return body

    hero_end = body.find('</section>', hero_start) + len('</section>')
    hero_html = body[hero_start:hero_end]

    # Remove <div id="quote-form">...</quote-card></div> from inside hero
    # This div wraps the entire quote card on the right side of the hero grid
    # Pattern: <div id="quote-form"> ... </div>  — find the matching closing tag
    qf_start = hero_html.find('<div id="quote-form">')
    if qf_start != -1:
        # Count nested divs to find matching </div>
        search_pos = qf_start + len('<div id="quote-form">')
        depth = 1
        while depth > 0 and search_pos < len(hero_html):
            next_open = hero_html.find('<div', search_pos)
            next_close = hero_html.find('</div>', search_pos)
            if next_close == -1:
                break
            if next_open != -1 and next_open < next_close:
                depth += 1
                search_pos = next_open + 4
            else:
                depth -= 1
                if depth == 0:
                    qf_end = next_close + len('</div>')
                else:
                    search_pos = next_close + len('</div>')
        if depth == 0:
            hero_html = hero_html[:qf_start] + hero_html[qf_end:]

    body = body[:hero_start] + hero_html + body[hero_end:]
    return body

def fix_all_cta_links(body: str) -> str:
    """Make all CTA quote links point to #quote-form consistently."""
    # Replace #contact-form with #quote-form everywhere (except section id attr)
    body = re.sub(r'href="#contact-form"', 'href="#quote-form"', body)
    # Also fix any href="#hero-form" or "#quote" that leads to the old hero form
    body = re.sub(r'href="#hero-form"', 'href="#quote-form"', body)
    # Fix the id of the contact section near bottom to quote-form
    body = re.sub(
        r'<section class="section bg-light" id="contact-form"',
        '<section class="section bg-light" id="quote-form-bottom"',
        body
    )
    return body

def add_reassurance_to_hero(body: str) -> str:
    """Add 'No obligation, only friendly advice.' after hero CTA buttons."""
    # Find the hero-btns div closing tag and insert reassurance after it
    hero_btns_end = body.find('</div>', body.find('class="hero-btns"'))
    if hero_btns_end != -1:
        reassurance = '\n          <p class="reassurance-text">No obligation, only friendly advice.</p>'
        insert_pos = hero_btns_end + len('</div>')
        body = body[:insert_pos] + reassurance + body[insert_pos:]
    return body

def add_reassurance_to_cta_strips(body: str) -> str:
    """Add reassurance text after .cta-strip-btns divs."""
    reassurance = '\n        <p class="reassurance-text-dark">No obligation, only friendly advice.</p>'
    # After each cta-strip-btns closing div
    body = re.sub(
        r'(class="cta-strip-btns"[^>]*>.*?</div>)',
        lambda m: m.group(0) + reassurance,
        body,
        flags=re.DOTALL
    )
    return body

def add_reassurance_to_final_cta(body: str) -> str:
    """Add reassurance after .final-cta-btns."""
    reassurance = '\n        <p class="final-trust-line">No obligation — <span>only friendly advice</span>.</p>'
    body = re.sub(
        r'(class="final-cta-btns"[^>]*>.*?</div>)',
        lambda m: m.group(0) + reassurance,
        body,
        flags=re.DOTALL
    )
    return body

def fix_contact_section(body: str) -> str:
    """
    The old #contact-form section has its own inner form (id="contact-quote-form").
    We keep the contact info part but REMOVE the inner quote form (since we now
    have our standalone #quote-form section above the footer).
    We also remove the old contact-form section's redundant form card.
    """
    # Find the #quote-form-bottom section (renamed from #contact-form)
    section_start = body.find('id="quote-form-bottom"')
    if section_start == -1:
        return body

    # Find the section tag start
    sec_tag_start = body.rfind('<section', 0, section_start)
    sec_tag_end = body.find('</section>', sec_tag_start) + len('</section>')
    section_html = body[sec_tag_start:sec_tag_end]

    # Remove the inner form card (class="quote-card") from this section
    # Keep the contact-info column only
    # Find and remove the form column: <div> ... <form id="contact-quote-form"> ... </form> ... </div>
    form_start = section_html.find('<form id="contact-quote-form"')
    if form_start != -1:
        # Find the enclosing div that wraps the form
        form_wrap_start = section_html.rfind('<div', 0, form_start)
        # Find matching closing div
        search_pos = form_wrap_start + 4
        depth = 1
        while depth > 0 and search_pos < len(section_html):
            next_open = section_html.find('<div', search_pos)
            next_close = section_html.find('</div>', search_pos)
            if next_close == -1:
                break
            if next_open != -1 and next_open < next_close:
                depth += 1
                search_pos = next_open + 4
            else:
                depth -= 1
                if depth == 0:
                    form_wrap_end = next_close + len('</div>')
                else:
                    search_pos = next_close + len('</div>')
        if depth == 0:
            section_html = section_html[:form_wrap_start] + section_html[form_wrap_end:]

    body = body[:sec_tag_start] + section_html + body[sec_tag_end:]
    return body

def insert_quote_form_before_footer(body: str, slug: str) -> str:
    """Insert the standalone quote form section just before the footer."""
    service, city = parse_service_and_city(slug)
    options = project_options_for_service(slug)
    form_section = QUOTE_FORM_SECTION\
        .replace("{service_label}", service)\
        .replace("{city_label}", city)\
        .replace("{project_options}", options)

    footer_start = body.find('<footer')
    if footer_start == -1:
        body += form_section
    else:
        body = body[:footer_start] + form_section + "\n" + body[footer_start:]
    return body

def clean_body(body: str, slug: str) -> str:
    body = fix_image_paths(body)
    body = fix_image_names(body, slug)
    # Remove stray html/head/body tags
    body = re.sub(r'</?(?:html|head|body)[^>]*>', '', body, flags=re.IGNORECASE)
    # Step 1: Remove hero quote form (right panel)
    body = remove_hero_form(body)
    # Step 2: Fix all CTA anchors
    body = fix_all_cta_links(body)
    # Step 3: Add reassurance text in hero
    body = add_reassurance_to_hero(body)
    # Step 4: Add reassurance in cta strips
    body = add_reassurance_to_cta_strips(body)
    # Step 5: Add reassurance to final CTA
    body = add_reassurance_to_final_cta(body)
    # Step 6: Clean the old contact section (remove duplicated form)
    body = fix_contact_section(body)
    # Step 7: Insert standalone quote form before footer
    body = insert_quote_form_before_footer(body, slug)
    # Collapse blank lines
    body = re.sub(r'\n{3,}', '\n\n', body)
    return body.strip()

def generate_page_tsx(slug: str, html_content: str) -> str:
    meta = extract_meta(html_content)
    styles = extract_styles(html_content) + "\n" + HEADER_STYLE_OVERRIDES
    body = extract_body_content(html_content)
    # Use our clean script instead of the original
    scripts = CLEAN_SCRIPT

    body = clean_body(body, slug)

    slug_lower = slug.lower()
    if 'kitchen' in slug_lower:
        hero_img = '/images/02_kitchen_marble.jpg'
    elif 'bathroom' in slug_lower:
        hero_img = '/images/03_luxury_bathroom.jpg'
    else:
        hero_img = '/images/01_hero_luxury_interior.jpg'

    title = meta["title"].replace("'", "\\'").replace('"', '\\"')
    description = meta["description"].replace("'", "\\'").replace('"', '\\"')

    body_json = json.dumps(body)
    styles_json = json.dumps(styles)
    scripts_json = json.dumps(scripts)

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
      <script dangerouslySetInnerHTML={{{{ __html: pageScripts }}}} />
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
            print(f"  ✓ {slug}")
        except Exception as e:
            failed.append((slug, str(e)))
            print(f"  ✗ {slug} — {e}")
            import traceback
            traceback.print_exc()

    print(f"\n{'─'*55}")
    print(f"✅ Created: {len(created)} pages")
    print(f"❌ Failed:  {len(failed)} pages")
    if failed:
        for slug, err in failed:
            print(f"   - {slug}: {err}")

    sitemap_data = {"landing_pages": [f"/{slug}" for slug in created]}
    sitemap_path = ROOT / "nextjs_space" / "landing-pages-list.json"
    sitemap_path.write_text(json.dumps(sitemap_data, indent=2))
    print(f"\nWrote landing-pages-list.json")
    print("\nChanges applied to ALL pages:")
    print("  ✓ Header always white bg, black logo + nav text")
    print("  ✓ Quote form removed from hero, placed near bottom in #quote-form section")
    print("  ✓ All CTAs link to #quote-form")
    print("  ✓ 'No obligation, only friendly advice.' added near all CTAs")
    print("  ✓ Post-submit thank-you message: no 'Call us now' button")

if __name__ == "__main__":
    main()
