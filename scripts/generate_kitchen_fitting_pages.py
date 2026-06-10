#!/usr/bin/env python3
"""
generate_kitchen_fitting_pages.py — Generates 11 new kitchen-fitting location pages.

Cities:
  watford, bushey, rickmansworth, st-albans, hemel-hempstead,
  borehamwood, harrow, croxley-green, luton, bedford
+ bathroom-fitting-bedford (the missing one)

Uses the same template/pattern as the existing generated pages.
"""

import os
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
NEXTJS_APP = ROOT / "nextjs_space" / "app"

PAGES = [
    # (slug, service_label, city_label, hero_img, proximity_blurb, is_kitchen)
    ("kitchen-fitting-watford",         "Kitchen Fitting", "Watford",         "/images/02_kitchen_marble.jpg",        "BMB Renovation — Based right here in Watford. Professional kitchen fitting on your doorstep.", True),
    ("kitchen-fitting-bushey",          "Kitchen Fitting", "Bushey",          "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving Bushey and the surrounding area.", True),
    ("kitchen-fitting-rickmansworth",   "Kitchen Fitting", "Rickmansworth",   "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving Rickmansworth and the surrounding area.", True),
    ("kitchen-fitting-st-albans",       "Kitchen Fitting", "St Albans",       "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving St Albans and Hertfordshire.", True),
    ("kitchen-fitting-hemel-hempstead", "Kitchen Fitting", "Hemel Hempstead", "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving Hemel Hempstead and the surrounding area.", True),
    ("kitchen-fitting-borehamwood",     "Kitchen Fitting", "Borehamwood",     "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving Borehamwood and the surrounding area.", True),
    ("kitchen-fitting-harrow",          "Kitchen Fitting", "Harrow",          "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving Harrow and North London.", True),
    ("kitchen-fitting-croxley-green",   "Kitchen Fitting", "Croxley Green",   "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving Croxley Green and the surrounding area.", True),
    ("kitchen-fitting-luton",           "Kitchen Fitting", "Luton",           "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving Luton and the surrounding area.", True),
    ("kitchen-fitting-bedford",         "Kitchen Fitting", "Bedford",         "/images/02_kitchen_marble.jpg",        "BMB Renovation — Watford-based kitchen fitters serving Bedford and the surrounding area.", True),
    ("bathroom-fitting-bedford",        "Bathroom Fitting","Bedford",         "/images/03_luxury_bathroom.jpg",       "BMB Renovation — Watford-based bathroom fitters serving Bedford and the surrounding area.", False),
]

STYLES = """\n    /* ── RESET & BASE ── */\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n    html { scroll-behavior: smooth; }\n    body {\n      font-family: 'DM Sans', system-ui, sans-serif;\n      color: #141414;\n      background: #fff;\n      -webkit-font-smoothing: antialiased;\n    }\n    img { max-width: 100%; display: block; }\n    a { text-decoration: none; color: inherit; }\n    :root {\n      --gold: #C8A97E; --gold-dark: #B8996E; --gold-light: rgba(200,169,126,0.12);\n      --dark: #0a0a0a; --gray-950: #0a0a0a; --gray-900: #111827; --gray-700: #374151;\n      --gray-600: #4B5563; --gray-500: #6B7280; --gray-400: #9CA3AF;\n      --gray-200: #E5E7EB; --gray-100: #F3F4F6; --gray-50: #F9FAFB;\n      --shadow-sm: 0 1px 2px 0 rgb(0 0 0/0.04),0 1px 3px 0 rgb(0 0 0/0.08);\n      --shadow-md: 0 4px 6px -1px rgb(0 0 0/0.06),0 2px 4px -2px rgb(0 0 0/0.06);\n      --shadow-lg: 0 10px 15px -3px rgb(0 0 0/0.08),0 4px 6px -4px rgb(0 0 0/0.06);\n      --shadow-xl: 0 20px 25px -5px rgb(0 0 0/0.1),0 8px 10px -6px rgb(0 0 0/0.06);\n    }\n    .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }\n    h1,h2,h3,h4 { font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.025em; line-height: 1.15; }\n    h1 { font-size: clamp(2.2rem, 5vw, 3.75rem); font-weight: 800; }\n    h2 { font-size: clamp(1.75rem, 3.5vw, 2.5rem); font-weight: 700; }\n    h3 { font-size: 1.25rem; font-weight: 700; }\n    h4 { font-size: 1rem; font-weight: 600; }\n    p  { line-height: 1.7; color: var(--gray-600); }\n    .container { max-width: 1200px; margin: 0 auto; padding: 0 1.25rem; }\n    @media(min-width:640px){ .container { padding: 0 1.5rem; } }\n    .section { padding: 5rem 0; }\n    @media(min-width:768px){ .section { padding: 7rem 0; } }\n    .section-label { display: inline-block; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.75rem; }\n    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2rem; border-radius: 9999px; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9375rem; cursor: pointer; border: none; transition: all 0.2s ease; white-space: nowrap; }\n    .btn-gold { background: var(--gold); color: #fff; box-shadow: 0 4px 16px rgba(200,169,126,0.35); }\n    .btn-gold:hover { background: var(--gold-dark); transform: translateY(-1px); }\n    .btn-ghost { background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); color: #fff; border: 1.5px solid rgba(255,255,255,0.25); }\n    .btn-ghost:hover { background: rgba(255,255,255,0.2); }\n    .btn-lg { padding: 1rem 2.25rem; font-size: 1rem; }\n    #site-header { position: fixed; top: 0; left: 0; right: 0; z-index: 999; background: #fff; box-shadow: 0 1px 0 rgba(0,0,0,0.08); }\n    .header-inner { display: flex; align-items: center; justify-content: space-between; height: 80px; }\n    .logo { display: flex; align-items: center; }\n    .logo-bmb { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.5rem; font-weight: 900; letter-spacing: -0.02em; color: #111827; text-transform: uppercase; }\n    .header-nav { display: none; gap: 0.25rem; }\n    @media(min-width:1024px){ .header-nav { display: flex; } }\n    .nav-link { padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; color: #374151; transition: all 0.2s; }\n    .nav-link:hover { color: var(--gold); background: var(--gray-100); }\n    .header-cta { display: flex; align-items: center; gap: 0.75rem; }\n    .header-call { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 700; background: #111827; color: #fff; transition: all 0.2s; }\n    .header-call:hover { opacity: 0.9; transform: translateY(-1px); }\n    .hamburger { display: flex; flex-direction: column; justify-content: center; gap: 5px; width: 40px; height: 40px; border: none; background: transparent; cursor: pointer; border-radius: 8px; padding: 8px; }\n    .hamburger span { display: block; height: 2px; width: 24px; border-radius: 2px; background: #111827; transition: all 0.3s; }\n    @media(min-width:1024px){ .hamburger { display: none; } }\n    #mobile-menu { display: none; background: #fff; border-top: 1px solid var(--gray-100); box-shadow: 0 8px 32px rgba(0,0,0,0.12); padding: 1.5rem; }\n    #mobile-menu.open { display: block; }\n    .mobile-nav-link { display: block; padding: 0.75rem 1rem; font-size: 1rem; font-weight: 500; color: var(--gray-700); border-radius: 0.5rem; transition: all 0.2s; }\n    .mobile-nav-link:hover { color: var(--gold); background: var(--gold-light); }\n    .mobile-cta { display: block; margin-top: 1rem; padding: 0.875rem; text-align: center; background: var(--gray-900); color: #fff; border-radius: 0.75rem; font-weight: 700; }\n    #proximity-banner { background: var(--gold-light); border-bottom: 1px solid rgba(200,169,126,0.2); padding: 0.625rem 0; position: relative; z-index: 998; margin-top: 80px; }\n    .proximity-inner { display: flex; align-items: center; justify-content: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.8125rem; font-weight: 500; color: var(--gray-700); text-align: center; }\n    .proximity-inner a { color: var(--gold); font-weight: 700; }\n    #hero { position: relative; min-height: 92vh; display: flex; align-items: center; overflow: hidden; }\n    .hero-bg { position: absolute; inset: 0; }\n    .hero-bg img { width: 100%; height: 100%; object-fit: cover; }\n    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.25) 100%); }\n    .hero-content { position: relative; z-index: 2; width: 100%; padding-top: 2rem; }\n    .hero-grid { display: grid; gap: 2.5rem; align-items: center; max-width: 760px; margin: 0 auto; text-align: center; }\n    .hero-eyebrow { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 9999px; background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); font-size: 0.8125rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 1.25rem; margin-left: auto; margin-right: auto; }\n    .hero-eyebrow-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }\n    .hero-h1 { color: #fff; margin-bottom: 1.25rem; text-align: center; }\n    .hero-h1 span { color: var(--gold); }\n    .hero-sub { font-size: 1.0625rem; color: rgba(255,255,255,0.78); margin-bottom: 2rem; max-width: 520px; text-align: center; margin-left: auto; margin-right: auto; }\n    .hero-btns { display: flex; flex-wrap: wrap; gap: 0.875rem; margin-bottom: 1.5rem; justify-content: center; }\n    .trust-badges { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }\n    .badge { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.875rem; border-radius: 9999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(6px); font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.85); }\n    .badge-check { color: var(--gold); }\n    .reassurance-text { font-size: 0.8125rem; color: rgba(255,255,255,0.65); margin-top: 0.625rem; font-style: italic; text-align: center; }\n    .stats-bar { background: var(--gray-950); padding: 2.5rem 0; }\n    .stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 2rem; }\n    @media(min-width:768px){ .stats-grid { grid-template-columns: repeat(4,1fr); } }\n    .stat-item { text-align: center; }\n    .stat-number { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 2.25rem; font-weight: 800; color: var(--gold); line-height: 1; }\n    .stat-label { font-size: 0.8125rem; color: #9CA3AF; margin-top: 0.375rem; }\n    .section-header { text-align: center; margin-bottom: 3.5rem; }\n    .section-header h2 { color: var(--gray-900); margin-top: 0.5rem; }\n    .section-header p { max-width: 560px; margin: 1rem auto 0; }\n    .includes-grid { display: grid; gap: 0.75rem; }\n    @media(min-width:640px){ .includes-grid { grid-template-columns: repeat(2,1fr); } }\n    @media(min-width:1024px){ .includes-grid { grid-template-columns: repeat(3,1fr); } }\n    .include-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1.125rem 1.25rem; border-radius: 0.875rem; background: #fff; border: 1.5px solid var(--gray-100); box-shadow: var(--shadow-sm); transition: border-color 0.2s; }\n    .include-item:hover { border-color: var(--gold); }\n    .include-check { width: 22px; height: 22px; border-radius: 50%; background: var(--gold); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.6875rem; font-weight: 700; flex-shrink: 0; margin-top: 1px; }\n    .include-item p { font-size: 0.9375rem; color: var(--gray-700); font-weight: 500; margin: 0; }\n    .why-grid { display: grid; gap: 1.5rem; }\n    @media(min-width:640px){ .why-grid { grid-template-columns: repeat(2,1fr); } }\n    @media(min-width:1024px){ .why-grid { grid-template-columns: repeat(4,1fr); } }\n    .why-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.75rem; transition: background 0.2s; }\n    .why-card:hover { background: rgba(255,255,255,0.1); }\n    .why-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(200,169,126,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.375rem; margin-bottom: 1.125rem; }\n    .why-card h3 { color: #fff; font-size: 1.0625rem; margin-bottom: 0.5rem; }\n    .why-card p { color: #9CA3AF; font-size: 0.875rem; }\n    .faq-list { display: flex; flex-direction: column; gap: 0.75rem; }\n    .faq-item { border: 1.5px solid var(--gray-100); border-radius: 0.875rem; overflow: hidden; background: #fff; }\n    .faq-question { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; background: transparent; border: none; cursor: pointer; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9375rem; font-weight: 700; color: var(--gray-900); transition: color 0.2s; }\n    .faq-question:hover { color: var(--gold); }\n    .faq-icon { width: 28px; height: 28px; border-radius: 50%; background: var(--gray-100); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.125rem; font-weight: 300; color: var(--gray-600); transition: background 0.2s, transform 0.2s; }\n    .faq-item.open .faq-icon { background: var(--gold); color: #fff; transform: rotate(45deg); }\n    .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s; padding: 0 1.5rem; }\n    .faq-item.open .faq-answer { max-height: 300px; padding-bottom: 1.25rem; }\n    .faq-answer p { font-size: 0.9rem; color: var(--gray-600); margin: 0; }\n    #quote-form { scroll-margin-top: 90px; }\n    .qc-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: start; }\n    @media(min-width:1024px){ .qc-grid { grid-template-columns: 1fr 1fr; gap: 4rem; } }\n    .qc-form-card { background: #fff; border-radius: 1.25rem; padding: 2.25rem; box-shadow: var(--shadow-xl); border: 1.5px solid var(--gray-100); }\n    .quote-card-heading { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--gray-900); margin-bottom: 0.375rem; }\n    .quote-card-sub { font-size: 0.8125rem; color: var(--gray-500); margin-bottom: 1.5rem; }\n    .form-row { display: grid; gap: 1rem; }\n    @media(min-width:480px){ .form-row-2 { grid-template-columns: 1fr 1fr; } }\n    .form-group { display: flex; flex-direction: column; gap: 0.375rem; }\n    .form-label { font-size: 0.8125rem; font-weight: 600; color: var(--gray-700); }\n    .form-input, .form-select, .form-textarea { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--gray-200); border-radius: 0.625rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: var(--gray-900); background: #fff; transition: border-color 0.2s; appearance: none; }\n    .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(200,169,126,0.15); }\n    .form-textarea { resize: vertical; min-height: 90px; }\n    .form-submit { width: 100%; padding: 0.9375rem; background: var(--gold); color: #fff; border: none; border-radius: 9999px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(200,169,126,0.35); margin-top: 0.5rem; }\n    .form-submit:hover { background: var(--gold-dark); transform: translateY(-1px); }\n    .form-note { font-size: 0.75rem; color: var(--gray-400); text-align: center; margin-top: 0.625rem; }\n    .form-note strong { color: var(--gray-500); }\n    .qc-info-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.75rem; display: block; }\n    .qc-info-heading { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: var(--gray-900); letter-spacing: -0.025em; line-height: 1.2; margin-bottom: 1rem; }\n    .qc-info-para { font-size: 0.9375rem; color: var(--gray-600); line-height: 1.7; margin-bottom: 2rem; }\n    .qc-contact-item { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.375rem; }\n    .qc-contact-icon { width: 44px; height: 44px; border-radius: 0.75rem; background: var(--gold-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.125rem; }\n    .qc-contact-label { font-size: 0.75rem; font-weight: 700; color: var(--gray-900); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.2rem; }\n    .qc-contact-value { font-size: 0.9375rem; color: var(--gray-600); line-height: 1.5; }\n    .qc-contact-value a { color: var(--gray-600); transition: color 0.2s; }\n    .qc-contact-value a:hover { color: var(--gold); }\n    footer { background: var(--gray-950); color: #fff; }\n    .footer-grid { display: grid; gap: 2.5rem; grid-template-columns: 1fr; padding: 4rem 0 2rem; }\n    @media(min-width:640px){ .footer-grid { grid-template-columns: repeat(2,1fr); } }\n    @media(min-width:1024px){ .footer-grid { grid-template-columns: 1.5fr 1fr 1fr 1.5fr; } }\n    .footer-brand p { color: #9CA3AF; font-size: 0.875rem; line-height: 1.7; margin: 1rem 0 1.5rem; }\n    .footer-col h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.9375rem; font-weight: 700; color: #fff; margin-bottom: 1.25rem; }\n    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }\n    .footer-col ul li a { font-size: 0.875rem; color: #9CA3AF; transition: color 0.2s; }\n    .footer-col ul li a:hover { color: var(--gold); }\n    .footer-contact-item { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; }\n    .footer-contact-icon { color: var(--gold); flex-shrink: 0; margin-top: 2px; font-size: 0.9rem; }\n    .footer-contact-text { font-size: 0.875rem; color: #9CA3AF; line-height: 1.5; }\n    .footer-contact-text a { color: #9CA3AF; transition: color 0.2s; }\n    .footer-contact-text a:hover { color: var(--gold); }\n    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding: 1.75rem 0; display: flex; flex-direction: column; gap: 1rem; align-items: center; }\n    @media(min-width:640px){ .footer-bottom { flex-direction: row; justify-content: space-between; } }\n    .footer-bottom p { font-size: 0.8125rem; color: #6B7280; }\n    .bg-light { background: var(--gray-50); }\n    .bg-dark { background: var(--gray-950); }\n    .text-center { text-align: center; }\n    .mt-5 { margin-top: 2.5rem; }\n    .mt-1 { margin-top: 0.5rem; }\n    .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }\n    .reveal.visible { opacity: 1; transform: translateY(0); }\n    .reveal-delay-1 { transition-delay: 0.1s; }\n    .reveal-delay-2 { transition-delay: 0.2s; }\n    .reveal-delay-3 { transition-delay: 0.3s; }\n    #sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; z-index: 998; display: grid; grid-template-columns: 1fr 1fr; box-shadow: 0 -4px 16px rgba(0,0,0,0.15); }\n    @media(min-width:1024px){ #sticky-cta { display: none; } }\n    .sticky-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.9375rem; font-weight: 700; border: none; cursor: pointer; }\n    .sticky-quote { background: var(--gold); color: #fff; }\n    .sticky-call { background: var(--gray-900); color: #fff; }\n  """

SCRIPT = """
  const header = document.getElementById('site-header');
  if (header) { header.classList.add('scrolled'); }
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
    });
  }
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i) { i.classList.remove('open'); });
      if (!isOpen) { item.classList.add('open'); }
    });
  });
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function(el) { revealObserver.observe(el); });
  ['main-quote-form'].forEach(function(id) {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      function val(n) { const el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; }
      const name = val('name'), phone = val('phone');
      if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
      const btn = form.querySelector('[type="submit"]');
      const orig = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
      const payload = JSON.stringify({
        access_key: 'b2398a20-017d-459d-a1bf-858b83488b97',
        subject: 'New Quote - BMB Renovation (' + window.location.pathname + ')',
        from_name: 'BMB Renovation Website',
        name: name, phone: phone,
        email: val('email') || '(not provided)',
        project: val('project') || '(not specified)',
        postcode: val('postcode') || '(not provided)',
        message: val('message') || '(no message)',
        page_url: window.location.href
      });
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: payload
      }).then(function(res) { return res.json(); }).then(function(data) {
        if (data && (data.success === 'true' || data.success === true)) {
          try {
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
              window.gtag('event', 'conversion', { 'send_to': 'AW-18105187591/0oU2CLXHoKgcEIf6nLlD' });
            }
          } catch(e) {}
          form.innerHTML = '<div style="text-align:center;padding:3rem 1rem;"><div style="font-size:3rem;margin-bottom:1rem;">&#x2705;</div><h3 style="font-family:\\'Plus Jakarta Sans\\',sans-serif;color:#111827;margin-bottom:0.75rem;">Thank You, ' + name + '!</h3><p style="color:#6B7280;font-size:0.9375rem;line-height:1.7;max-width:480px;margin:0 auto;">We have received your enquiry and will be in touch shortly.</p></div>';
        } else { throw new Error('failed'); }
      }).catch(function() {
        if (btn) { btn.disabled = false; btn.textContent = orig; }
        alert('Something went wrong. Please call us on +44 7775 758 717.');
      });
    });
  });
"""

def get_includes(is_kitchen: bool) -> list[str]:
    if is_kitchen:
        return [
            "New kitchen unit installation — base, wall and tall units",
            "Worktop fitting — laminate, quartz, granite and solid wood",
            "Sink and tap fitting — undermount, inset and Belfast styles",
            "All plumbing connections — supply and waste",
            "Kitchen tiling — wall tiles and splashbacks",
            "Kitchen flooring — tiles, LVT and engineered wood",
            "Appliance integration — ovens, hobs, dishwashers and fridges",
            "Extractor fan and lighting installation",
            "Soft-close hinges, handles and finishing hardware",
        ]
    else:
        return [
            "Shower fitting — enclosure, tray and screen installation",
            "Bath fitting — freestanding, panel or shower bath",
            "Toilet fitting — close-coupled, wall-hung or back-to-wall",
            "Basin and sink fitting — pedestal, countertop or inset",
            "All plumbing connections — water supply, waste and drainage",
            "Wall and floor tiling — preparation, waterproofing and grouting",
            "Bathroom flooring — tiles, LVT or vinyl",
            "Lighting and extractor fan fitting",
            "Vanity unit and bathroom furniture installation",
        ]

def get_faqs(service: str, city: str, is_kitchen: bool) -> list[dict]:
    sn = "kitchen fitting" if is_kitchen else "bathroom fitting"
    return [
        {
            "q": f"How much does {sn} in {city} cost?",
            "a": f"The cost of {sn} in {city} depends on the size of the room, the units or suite selected, and the scope of work. BMB Renovation provides a free, no-obligation written quote after a home visit. Call +44 7775 758 717 to arrange yours."
        },
        {
            "q": f"How long does {sn} take in {city}?",
            "a": f"Most {sn} projects in {city} are completed within 1 to 2 weeks, depending on the specification. We agree a clear programme with you before any work begins and keep to it."
        },
        {
            "q": f"Does BMB Renovation cover {city}?",
            "a": f"Yes — BMB Renovation is based in Watford, WD24 5AN, and regularly carries out {sn} projects across {city} and the surrounding area. We offer a free home visit and written quote."
        },
        {
            "q": "Do you handle all trades — plumbing, tiling and electrics?",
            "a": "Yes. Our in-house team covers every trade: plumbing, tiling, carpentry, lighting, flooring and decoration. No subcontractors — one consistent standard of quality throughout."
        },
    ]

def get_why_cards(city: str) -> list[dict]:
    return [
        {"icon": "📍", "title": f"Local to {city}", "desc": f"Based in Watford (WD24), we work throughout {city} regularly. Quick site visits, prompt quotes, easy to reach."},
        {"icon": "🔧", "title": "Fitting Specialists", "desc": "We fit correctly — not just quickly. Proper waterproofing, level setting, sealed joints and aligned fittings every time."},
        {"icon": "🔨", "title": "All Trades In-House", "desc": "Plumbing, tiling, carpentry and electrics — all handled by our own team. No subcontractors, no gaps in accountability."},
        {"icon": "💬", "title": "Clear Written Quotes", "desc": "Every project starts with an itemised written quote. No hidden extras, no surprises once work begins."},
        {"icon": "🏆", "title": "15+ Years Experience", "desc": f"Over fifteen years fitting and renovating properties across {city}, Watford and Hertfordshire."},
        {"icon": "✨", "title": "Premium Finish", "desc": "Straight lines, sealed joints, aligned fittings. We check every detail before we consider a job complete."},
        {"icon": "📋", "title": "Free Home Visit", "desc": f"We come to your {city} property, assess the space and give you a written quote — free, with no commitment required."},
        {"icon": "🛁", "title": "Supply or Fit Only", "desc": "Already have your units or suite? We will fit them. Need us to source as well? We can handle that too."},
    ]

def build_page_html(slug: str, service: str, city: str, hero_img: str, proximity_blurb: str, is_kitchen: bool) -> str:
    includes = get_includes(is_kitchen)
    faqs = get_faqs(service, city, is_kitchen)
    why_cards = get_why_cards(city)
    
    service_lower = service.lower()
    
    includes_html = "\n".join(
        f'      <div class="include-item reveal{"" if i == 0 else f" reveal-delay-{min(i,3)}"}">'
        f'<div class="include-check">&#10003;</div>'
        f'<p>{item}</p></div>'
        for i, item in enumerate(includes)
    )
    
    why_html = "\n".join(
        f'      <div class="why-card reveal{f" reveal-delay-{min(i,3)}" if i > 0 else ""}">'
        f'<div class="why-icon">{card["icon"]}</div>'
        f'<h3>{card["title"]}</h3><p>{card["desc"]}</p></div>'
        for i, card in enumerate(why_cards)
    )
    
    faq_html = "\n".join(
        f'    <div class="faq-item">'
        f'<button class="faq-question" aria-expanded="false">{faq["q"]}'
        f'<span class="faq-icon">+</span></button>'
        f'<div class="faq-answer"><p>{faq["a"]}</p></div></div>'
        for faq in faqs
    )
    
    project_options = (
        '<option value="">Select project type</option>'
        '<option>Full Kitchen Renovation</option>'
        '<option>Kitchen Fitting Only</option>'
        '<option>Worktop Replacement</option>'
        '<option>Kitchen Tiling / Splashback</option>'
        '<option>Other</option>'
    ) if is_kitchen else (
        '<option value="">Select project type</option>'
        '<option>Full Bathroom Renovation</option>'
        '<option>Bathroom Fitting / Suite Installation</option>'
        '<option>Shower Installation</option>'
        '<option>Bathroom Tiling</option>'
        '<option>Other</option>'
    )
    
    return f"""<div id="proximity-banner">
  <div class="container">
    <div class="proximity-inner">
      <span>{"🍳" if is_kitchen else "🛁"} {proximity_blurb}</span>
      <a href="#quote-form">Get a Free Quote &rarr;</a>
    </div>
  </div>
</div>

<header id="site-header">
  <div class="container">
    <div class="header-inner">
      <a href="/" class="logo" aria-label="BMB Renovation Home">
        <span class="logo-bmb">BMBRENOVATION</span>
      </a>
      <nav class="header-nav" aria-label="Main navigation">
        <a href="/" class="nav-link">Home</a>
        <a href="/about" class="nav-link">About</a>
        <a href="/services" class="nav-link">Services</a>
        <a href="/portfolio" class="nav-link">Portfolio</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>
      <div class="header-cta">
        <a href="tel:+447775758717" class="header-call">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          Call Now
        </a>
        <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </div>
</header>

<div id="mobile-menu" role="navigation" aria-label="Mobile menu">
  <a href="/" class="mobile-nav-link">Home</a>
  <a href="/about" class="mobile-nav-link">About</a>
  <a href="/services" class="mobile-nav-link">Services</a>
  <a href="/portfolio" class="mobile-nav-link">Portfolio</a>
  <a href="/contact" class="mobile-nav-link">Contact</a>
  <a href="tel:+447775758717" class="mobile-cta">&#128222; Call +44 7775 758 717</a>
</div>

<section id="hero" aria-label="Hero section">
  <div class="hero-bg">
    <img src="{hero_img}" alt="{service} in {city} by BMB Renovation" loading="eager" fetchpriority="high" />
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-content" style="padding: 2rem 0 4rem;">
    <div class="container">
      <div class="hero-grid">
        <div>
          <div class="hero-eyebrow">
            <div class="hero-eyebrow-dot"></div>
            {service} Specialists &middot; Based in Watford
          </div>
          <h1 class="hero-h1">
            Expert {service}<br />in <span>{city}</span>
          </h1>
          <p class="hero-sub">
            BMB Renovation is your local {service_lower} team — based in Watford, serving {city}. We handle the complete installation from start to finish: every fitting, every connection, every finishing detail. One team, one quote, no loose ends.
          </p>
          <div class="hero-btns">
            <a href="#quote-form" class="btn btn-gold btn-lg">Get a Free Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="tel:+447775758717" class="btn btn-ghost btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              +44 7775 758 717
            </a>
          </div>
          <p class="reassurance-text">No obligation, only friendly advice.</p>
          <div class="trust-badges">
            <span class="badge"><span class="badge-check">&#10003;</span> Watford Based</span>
            <span class="badge"><span class="badge-check">&#10003;</span> Free No-Obligation Quote</span>
            <span class="badge"><span class="badge-check">&#10003;</span> {service} Specialists</span>
            <span class="badge"><span class="badge-check">&#10003;</span> All Trades In-House</span>
            <span class="badge"><span class="badge-check">&#10003;</span> 15+ Years Experience</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="stats-bar" aria-label="Company statistics">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-item reveal"><div class="stat-number">15+</div><p class="stat-label">Years Experience</p></div>
      <div class="stat-item reveal reveal-delay-1"><div class="stat-number">2K+</div><p class="stat-label">Projects Completed</p></div>
      <div class="stat-item reveal reveal-delay-2"><div class="stat-number">3K+</div><p class="stat-label">Happy Customers</p></div>
      <div class="stat-item reveal reveal-delay-3"><div class="stat-number">5&#9733;</div><p class="stat-label">Customer Rating</p></div>
    </div>
  </div>
</div>

<section class="section" aria-labelledby="includes-heading">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">What&apos;s Included</span>
      <h2 id="includes-heading">Everything in Our {service} Service in {city}</h2>
      <p>Our {service_lower} service covers every element of the job — from removing the old {"kitchen" if is_kitchen else "suite"} to handing over a fully fitted, ready-to-use {"kitchen" if is_kitchen else "bathroom"}. One team, one quote, no loose ends.</p>
    </div>
    <div class="includes-grid">
{includes_html}
    </div>
    <div class="text-center mt-5 reveal">
      <a href="#quote-form" class="btn btn-gold">Get a Free {service} Quote in {city}</a>
    </div>
  </div>
</section>

<section class="section bg-dark" aria-labelledby="why-heading">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label" style="color:var(--gold)">Why Choose Us</span>
      <h2 id="why-heading" style="color:#fff">Why {city} Homeowners Choose BMB Renovation</h2>
      <p style="color:#9CA3AF">We live and work locally. When you choose BMB Renovation, you are working with a team whose reputation depends on the quality of every job — not a national firm that has moved on when problems appear.</p>
    </div>
    <div class="why-grid">
{why_html}
    </div>
    <div class="text-center mt-5 reveal">
      <a href="#quote-form" class="btn btn-gold btn-lg">Start with a Free Consultation</a>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="faq-heading">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Common Questions</span>
      <h2 id="faq-heading">{service} in {city} — Frequently Asked Questions</h2>
    </div>
    <div class="faq-list" style="max-width:780px;margin:0 auto;">
{faq_html}
    </div>
  </div>
</section>

<section class="section" id="quote-form" aria-labelledby="qf-heading">
  <div class="container">
    <div class="qc-grid">
      <div class="qc-form-card reveal">
        <p class="quote-card-heading">Get Your Free Quote</p>
        <p class="quote-card-sub">No obligation &middot; Free site visit &middot; Clear written quote</p>
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
              <select class="form-select" id="qf-project" name="project">{project_options}</select>
            </div>
            <div class="form-group">
              <label class="form-label" for="qf-postcode">Location / Postcode</label>
              <input class="form-input" id="qf-postcode" name="postcode" type="text" placeholder="e.g. WD17 2AB" />
            </div>
          </div>
          <div class="form-row mt-1">
            <div class="form-group">
              <label class="form-label" for="qf-message">Tell Us About Your Project</label>
              <textarea class="form-textarea" id="qf-message" name="message" placeholder="Describe your {service_lower} project — size, specification, any specific requirements..."></textarea>
            </div>
          </div>
          <button type="submit" class="form-submit">Request Free Quote &rarr;</button>
          <p class="form-note"><strong>No obligation, only friendly advice.</strong><br />Your details are safe with us.</p>
        </form>
      </div>
      <div class="reveal">
        <span class="qc-info-label">Get in Touch</span>
        <h2 class="qc-info-heading" id="qf-heading">Get a Free {service} Quote in {city}</h2>
        <p class="qc-info-para">We are based in Watford and serve {city} regularly. Tell us about your project and we will arrange a free visit, take a look, and give you a clear, honest, no-obligation written quote.</p>
        <div class="qc-contact-item">
          <div class="qc-contact-icon">&#128222;</div>
          <div>
            <div class="qc-contact-label">Phone</div>
            <div class="qc-contact-value"><a href="tel:+447775758717">+44 7775 758 717</a></div>
          </div>
        </div>
        <div class="qc-contact-item">
          <div class="qc-contact-icon">&#9993;</div>
          <div>
            <div class="qc-contact-label">Email</div>
            <div class="qc-contact-value"><a href="mailto:info@bmbrenovation.co.uk">info@bmbrenovation.co.uk</a></div>
          </div>
        </div>
        <div class="qc-contact-item">
          <div class="qc-contact-icon">&#128336;</div>
          <div>
            <div class="qc-contact-label">Working Hours</div>
            <div class="qc-contact-value">Monday &ndash; Friday: 8am &ndash; 6pm<br />Saturday: 9am &ndash; 4pm</div>
          </div>
        </div>
        <div class="qc-contact-item">
          <div class="qc-contact-icon">&#128205;</div>
          <div>
            <div class="qc-contact-label">Based In</div>
            <div class="qc-contact-value">157 Judge Street, Watford, WD24 5AN<br />Serving {city} &amp; surrounding areas</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <span style="font-family:'Plus Jakarta Sans',sans-serif;font-size:1.25rem;font-weight:900;color:#fff;letter-spacing:-0.02em;">BMBRENOVATION</span>
        <p>Premium home, kitchen &amp; bathroom renovation services across Watford, London &amp; Hertfordshire. 15+ years of trusted craftsmanship.</p>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul>
          <li><a href="/services">All Services</a></li>
          <li><a href="/kitchen-renovation-watford">Kitchen Renovation</a></li>
          <li><a href="/bathroom-renovation-watford">Bathroom Renovation</a></li>
          <li><a href="/bathroom-fitting-watford">Bathroom Fitting</a></li>
          <li><a href="/kitchen-fitting-watford">Kitchen Fitting</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/about">About Us</a></li>
          <li><a href="/portfolio">Portfolio</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact Us</h4>
        <div class="footer-contact-item">
          <span class="footer-contact-icon">&#128222;</span>
          <div class="footer-contact-text"><a href="tel:+447775758717">+44 7775 758 717</a></div>
        </div>
        <div class="footer-contact-item">
          <span class="footer-contact-icon">&#9993;</span>
          <div class="footer-contact-text"><a href="mailto:info@bmbrenovation.co.uk">info@bmbrenovation.co.uk</a></div>
        </div>
        <div class="footer-contact-item">
          <span class="footer-contact-icon">&#128205;</span>
          <div class="footer-contact-text">157 Judge Street, Watford, WD24 5AN</div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{}}</p>
    </div>
  </div>
</footer>

<div id="sticky-cta">
  <a href="#quote-form" class="sticky-btn sticky-quote">Get a Free Quote</a>
  <a href="tel:+447775758717" class="sticky-btn sticky-call">&#128222; Call Now</a>
</div>"""

def build_schema_json(slug: str, title: str, description: str, city: str, is_kitchen: bool) -> list:
    faqs = get_faqs("Kitchen Fitting" if is_kitchen else "Bathroom Fitting", city, is_kitchen)
    service_noun = "Kitchen Fitting" if is_kitchen else "Bathroom Fitting"
    return [
        {
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "BMB Renovation",
            "url": f"https://bmbrenovation.co.uk/{slug}",
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
            "areaServed": {"@type": "City", "name": city},
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
            ],
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "58"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
                for f in faqs
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://bmbrenovation.co.uk/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Areas Served",
                    "item": "https://bmbrenovation.co.uk/locations"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": f"{service_noun} {city}",
                    "item": f"https://bmbrenovation.co.uk/{slug}"
                }
            ]
        }
    ]

def generate_page_tsx(slug: str, service: str, city: str, hero_img: str, proximity_blurb: str, is_kitchen: bool) -> str:
    title = f"{service} {city} | Free Quote | BMB Renovation"
    description = f"Expert {service.lower()} in {city}. BMB Renovation — based in Watford, serving {city}. Free no-obligation quote. All trades in-house: plumbing, tiling, flooring. Call +44 7775 758 717."
    
    schema_data = build_schema_json(slug, title, description, city, is_kitchen)
    schema_json_str = json.dumps(schema_data, ensure_ascii=False)
    
    body_html = build_page_html(slug, service, city, hero_img, proximity_blurb, is_kitchen)
    # Fix the copyright year footer placeholder
    body_html = body_html.replace('<p>&copy; {{}}</p>', '<p>&copy; 2025 BMB Renovation. All rights reserved.</p>')
    
    body_json = json.dumps(body_html)
    styles_json = json.dumps(STYLES)
    scripts_json = json.dumps(SCRIPT)
    schema_repr = repr(schema_json_str)

    tsx = f'''import type {{ Metadata }} from 'next'
import LandingScript from '../_components/LandingScript'

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
  twitter: {{
    card: 'summary_large_image',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{{{ __html: {schema_repr} }}}}
      />
      <style dangerouslySetInnerHTML={{{{ __html: pageStyles }}}} />
      <div dangerouslySetInnerHTML={{{{ __html: pageBody }}}} />
      <LandingScript code={{pageScripts}} />
    </>
  )
}}
'''
    return tsx

def main():
    print(f"Generating {len(PAGES)} new location pages...\n")
    created = 0
    for slug, service, city, hero_img, proximity_blurb, is_kitchen in PAGES:
        out_dir = NEXTJS_APP / slug
        out_file = out_dir / "page.tsx"
        if out_file.exists():
            print(f"  SKIP (exists): {slug}")
            continue
        try:
            tsx = generate_page_tsx(slug, service, city, hero_img, proximity_blurb, is_kitchen)
            out_dir.mkdir(parents=True, exist_ok=True)
            out_file.write_text(tsx, encoding="utf-8")
            print(f"  ✓ {slug}")
            created += 1
        except Exception as e:
            print(f"  ✗ {slug} — {e}")
            import traceback
            traceback.print_exc()
    print(f"\n{'─'*50}")
    print(f"✅ Created: {created}/{len(PAGES)} pages")

if __name__ == "__main__":
    main()
