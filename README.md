# BMB Renovation — Website

A modern, premium marketing website for **BMB Renovation** — a London & Watford based home renovation company.

This is a redesign/upgrade proposal built on top of the content from [bmbrenovation.co.uk](https://www.bmbrenovation.co.uk).

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (subtle fade-in reveals)
- **Icons:** Lucide React
- **Fonts:** DM Sans, Plus Jakarta Sans (Google Fonts)
- **Language:** TypeScript

## 🎨 Design

- Black, white & warm gold (`#C8A97E`) color palette
- Premium, editorial feel with generous whitespace
- Soft fade-in scroll animations (no jarring slides)
- Fully responsive (mobile-first)

## 📄 Pages

- **Home** — Hero with parallax, stats counter, featured services, capabilities, testimonials
- **About** — Company story, core values, stats
- **Services** — 10 service categories with detailed descriptions
- **Portfolio** — Filterable gallery with lightbox
- **Contact** — Contact form + business info

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn (or npm)

### Install & Run

```bash
cd nextjs_space
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
cd nextjs_space
yarn build
yarn start
```

---

## 📁 Project Structure

```
bmbrenovation/
└── nextjs_space/
    ├── app/                    # Next.js App Router pages
    │   ├── _components/        # Home page client
    │   ├── about/
    │   ├── services/
    │   ├── portfolio/
    │   ├── contact/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/             # Reusable components
    │   ├── header.tsx
    │   ├── footer.tsx
    │   ├── animated-section.tsx
    │   ├── counter.tsx
    │   └── ui/                 # shadcn/ui components
    ├── lib/                    # Utilities
    ├── public/                 # Static assets
    │   └── images/             # All renovation photos
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json
```

---

## 📞 Contact Info on Site

All content (services, phone numbers, addresses, etc.) is sourced from the original [bmbrenovation.co.uk](https://www.bmbrenovation.co.uk).

---

## 📝 License

Proprietary — © BMB Renovation. All rights reserved.
