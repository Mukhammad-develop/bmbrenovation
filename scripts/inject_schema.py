#!/usr/bin/env python3
"""
inject_schema.py — Injects LocalBusiness + FAQPage JSON-LD schema
into all 29 existing location page.tsx files.

Strategy:
  - Reads each page.tsx
  - Extracts the slug from the directory name
  - Extracts the existing title and description from the metadata block
  - Generates a tailored JSON-LD script
  - Inserts it as a <script dangerouslySetInnerHTML> tag at the TOP of the
    JSX return statement (before the <style> tag)
"""

import os
import re
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
NEXTJS_APP = ROOT / "nextjs_space" / "app"

# All 29 existing location page slugs
LOCATION_SLUGS = [
    "bathroom-fitting-borehamwood",
    "bathroom-fitting-bushey",
    "bathroom-fitting-croxley-green",
    "bathroom-fitting-harrow",
    "bathroom-fitting-hemel-hempstead",
    "bathroom-fitting-luton",
    "bathroom-fitting-rickmansworth",
    "bathroom-fitting-st-albans",
    "bathroom-fitting-watford",
    "bathroom-renovation-bedford",
    "bathroom-renovation-borehamwood",
    "bathroom-renovation-bushey",
    "bathroom-renovation-croxley-green",
    "bathroom-renovation-harrow",
    "bathroom-renovation-hemel-hempstead",
    "bathroom-renovation-luton",
    "bathroom-renovation-rickmansworth",
    "bathroom-renovation-st-albans",
    "bathroom-renovation-watford",
    "kitchen-renovation-bedford",
    "kitchen-renovation-borehamwood",
    "kitchen-renovation-bushey",
    "kitchen-renovation-croxley-green",
    "kitchen-renovation-harrow",
    "kitchen-renovation-hemel-hempstead",
    "kitchen-renovation-luton",
    "kitchen-renovation-rickmansworth",
    "kitchen-renovation-st-albans",
    "kitchen-renovation-watford",
]

def parse_service_and_city(slug: str) -> tuple[str, str]:
    """Return (service_label, city_label) from a slug like kitchen-renovation-watford."""
    parts = slug.split("-")
    service_words = []
    i = 0
    while i < len(parts) and parts[i] in ("kitchen", "bathroom", "renovation", "fitting"):
        service_words.append(parts[i].capitalize())
        i += 1
    area_words = parts[i:]
    service = " ".join(service_words)
    city = " ".join(w.capitalize() for w in area_words)
    return service, city

def get_faqs(service: str, city: str) -> list[dict]:
    """Generate 4 FAQs relevant to the service and city."""
    service_lower = service.lower()
    is_kitchen = "kitchen" in service_lower
    is_fitting = "fitting" in service_lower

    if is_kitchen:
        service_noun = "kitchen renovation" if not is_fitting else "kitchen fitting"
        faqs = [
            {
                "q": f"How much does a {service_noun} in {city} cost?",
                "a": f"The cost of a {service_noun} in {city} varies depending on the size, specification and materials chosen. BMB Renovation provides a free, no-obligation written quote after a home visit. Call +44 7775 758 717 to arrange yours."
            },
            {
                "q": f"How long does a {service_noun} take in {city}?",
                "a": f"A typical {service_noun} in {city} takes between 1 and 3 weeks depending on the scope of work. We agree a clear programme with you before any work begins and keep to it."
            },
            {
                "q": f"Does BMB Renovation cover {city}?",
                "a": f"Yes — BMB Renovation is based in Watford, WD24 5AN, and regularly carries out {service_noun} projects in {city} and the surrounding area. We offer a free home visit and written quote."
            },
            {
                "q": f"Do you supply the kitchen units as well as fitting them?",
                "a": "We can supply and fit, or fit only if you have already purchased your units. Either way, the installation is carried out to the same high standard and backed by our workmanship guarantee."
            },
        ]
    else:
        service_noun = "bathroom renovation" if not is_fitting else "bathroom fitting"
        faqs = [
            {
                "q": f"How much does a {service_noun} in {city} cost?",
                "a": f"The cost of a {service_noun} in {city} depends on the size of the room, the suite and materials chosen, and the scope of work required. BMB Renovation offers a free, no-obligation written quote — call +44 7775 758 717 to arrange a home visit."
            },
            {
                "q": f"How long does a {service_noun} in {city} take?",
                "a": f"Most {service_noun} projects in {city} are completed within 1 to 2 weeks. Larger or more complex projects may take longer. We agree a clear timetable with you before work starts."
            },
            {
                "q": f"Does BMB Renovation cover {city}?",
                "a": f"Yes — BMB Renovation is based in Watford (WD24 5AN) and regularly carries out {service_noun} projects across {city} and the surrounding area. We offer a free home visit and written quote at no charge."
            },
            {
                "q": "Do you handle all the trades — plumbing, tiling and electrics?",
                "a": "Yes. Our in-house team covers every trade involved in a bathroom project: plumbing, tiling, waterproofing, flooring, lighting and decorating. You deal with one team throughout and there are no subcontractors."
            },
        ]
    return faqs

def build_schema_json(slug: str, title: str, description: str) -> str:
    """Build the JSON-LD schema string for a location page."""
    service, city = parse_service_and_city(slug)
    canonical = f"https://bmbrenovation.co.uk/{slug}"
    faqs = get_faqs(service, city)

    schema = [
        {
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "BMB Renovation",
            "url": canonical,
            "logo": "https://bmbrenovation.co.uk/favicon.svg",
            "image": "https://bmbrenovation.co.uk/og-image.png",
            "description": description,
            "telephone": "+447775758717",
            "email": "info@bmbrenovation.co.uk",
            "priceRange": "££",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "157 Judge Street",
                "addressLocality": "Watford",
                "postalCode": "WD24 5AN",
                "addressRegion": "Hertfordshire",
                "addressCountry": "GB"
            },
            "areaServed": {
                "@type": "City",
                "name": city
            },
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
                    "opens": "08:00",
                    "closes": "18:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Saturday",
                    "opens": "09:00",
                    "closes": "16:00"
                }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": faq["q"],
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq["a"]
                    }
                }
                for faq in faqs
            ]
        }
    ]
    return json.dumps(schema, ensure_ascii=False, indent=None)

def extract_title_and_desc(tsx_content: str) -> tuple[str, str]:
    """Extract title and description from the metadata block."""
    title_m = re.search(r'title:\s*"([^"]*)"', tsx_content)
    desc_m = re.search(r'description:\s*"([^"]*)"', tsx_content)
    title = title_m.group(1) if title_m else "BMB Renovation | Home Renovation Services"
    description = desc_m.group(1) if desc_m else "BMB Renovation offers premium home renovation services in Watford and London."
    return title, description

def inject_schema_into_tsx(tsx_content: str, schema_json: str) -> str:
    """
    Inject schema as a <script> tag right inside the return (
      <>  block, before <style>.
    The return block looks like:
      return (
        <>
          <style dangerouslySetInnerHTML=...
    We insert the JSON-LD script before the <style> line.
    """
    # Escape the schema JSON for embedding in a JS template literal / JSX
    # We use dangerouslySetInnerHTML with a JSON.stringify approach
    escaped_json = schema_json.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    
    schema_tag = (
        f'      <script\n'
        f'        type="application/ld+json"\n'
        f'        dangerouslySetInnerHTML={{{{ __html: {repr(schema_json)} }}}}\n'
        f'      />\n'
    )

    # Find the return ( <> block and insert after <>
    pattern = r'(  return \(\n    <>\n)'
    replacement = r'\1' + schema_tag
    new_content = re.sub(pattern, replacement, tsx_content, count=1)
    
    if new_content == tsx_content:
        # Fallback: try inserting before <style dangerouslySetInnerHTML
        style_marker = '      <style dangerouslySetInnerHTML'
        if style_marker in tsx_content:
            idx = tsx_content.index(style_marker)
            new_content = tsx_content[:idx] + schema_tag + tsx_content[idx:]
        else:
            print(f"  WARNING: Could not find injection point, schema not injected")
            return tsx_content
    
    return new_content

def process_page(slug: str) -> bool:
    page_file = NEXTJS_APP / slug / "page.tsx"
    if not page_file.exists():
        print(f"  SKIP (not found): {slug}")
        return False

    tsx_content = page_file.read_text(encoding="utf-8")
    
    # Skip if schema already injected
    if "application/ld+json" in tsx_content:
        print(f"  SKIP (schema exists): {slug}")
        return False

    title, description = extract_title_and_desc(tsx_content)
    schema_json = build_schema_json(slug, title, description)
    new_content = inject_schema_into_tsx(tsx_content, schema_json)

    page_file.write_text(new_content, encoding="utf-8")
    print(f"  ✓ {slug}")
    return True

def main():
    print(f"Injecting JSON-LD schema into {len(LOCATION_SLUGS)} location pages...\n")
    success = 0
    for slug in LOCATION_SLUGS:
        if process_page(slug):
            success += 1
    print(f"\n{'─'*50}")
    print(f"✅ Schema injected: {success}/{len(LOCATION_SLUGS)} pages")

if __name__ == "__main__":
    main()
