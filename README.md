# FashiOnia — E-Commerce Fashion Storefront

A responsive fashion e-commerce storefront built as a front-end demo project.

**Live demo:** https://fashionestaa.netlify.app/

> **Note:** This is a portfolio demo. There is no backend, payment processing, or real order handling — all product data is static and cart state lives in the browser.

---

## Features

- **Product catalogue** — browsable grid with category sections (Women, Men, Accessories, Footwear)
- **Client-side filtering** — filter products by category and sale status without a page reload
- **Quick add to cart** — add items directly from the product grid
- **Sale countdown timer** — live countdown for the mid-season sale campaign
- **Lookbook carousel** — themed styling collections in a swipeable carousel
- **Newsletter signup** — email capture form
- **Contact channels** — WhatsApp and email enquiry links
- **Fully responsive** — mobile-first layout tested from small phones up to desktop

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui, Base UI |
| Animation | Framer Motion |
| Carousel | Embla Carousel |
| Icons | Lucide React |
| Deployment | Netlify (static export) |

## Getting Started

```bash
# install dependencies
npm install

# start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# production build
npm run build
```

## Project Structure

```
src/            application source (routes, components, data)
public/         static assets
scripts/        build and packaging helpers
next.config.ts  Next.js configuration (static export)
```

## Roadmap

Planned additions as the project develops:

- [ ] Backend API for products and orders
- [ ] Database-backed product catalogue
- [ ] User accounts and authentication
- [ ] Persistent cart and checkout flow
- [ ] Admin dashboard for inventory

## Author

**Abdalrahman Ayman Habboub** — Computer Engineering student, Islamic University of Gaza

- GitHub: [@10abood10](https://github.com/10abood10)
- LinkedIn: [Abdalrahman Habboub](https://www.linkedin.com/in/eng-abdalrahman-habboub-26a09a408)
