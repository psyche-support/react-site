# Psyche Support – Counselling & Psychotherapy Website

This repository contains the source code for **psyche.support**, a multilingual counselling and psychotherapy website. It’s built with **React + TypeScript + Vite** and is fully deployable to **GitHub Pages** or a custom domain.

## Features

- **Multilingual support (Greek & English)** – translations split by page and stored in the `i18n/` folder.
- **Professional counselling content** – services, sessions, articles, and resources for mental health.
- **Articles system with tags and filtering** – supports banners, reading time, SEO meta tags, and social sharing.
- **Responsive design** – mobile-friendly layouts, accessible components.
- **Booking integration** – floating “Book Your Session” button that opens a scheduling iframe.
- **SEO optimized** – dynamic `<title>`, meta descriptions, Open Graph, and JSON-LD structured data for each page.
- **Google Analytics with consent bar** – tracks events like booking clicks.
- **Dark/light theme toggle** – saved to local storage.
- **Modular React components** – navigation, hero sections, spotlight, footer with social links and badges.

## Pages

- **Landing page** – Overview of the service, spotlight on therapist, quick actions.
- **Services** – Detailed description of offerings and approaches.
- **Sessions** – Online and in-person session options, duration details.
- **Articles** – List of articles with search, pagination, and tag filtering. Each article has its own page.
- **About** – Background, education, and experience.
- **Contact/Booking** – Floating booking button accessible on all pages.

## Tech Stack

- **React 18 + TypeScript**
- **Vite** for fast builds and dev server
- **React Router v6** for routing
- **React Helmet Async** for SEO tags
- **Tailwind/Custom CSS** for styling
- **GitHub Actions** for CI/CD to GitHub Pages

## Deployment

The site can be deployed to GitHub Pages using the included workflow:

- `vite.config.ts` configures the base path.
- `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.
- Supports **custom domain** (via `public/CNAME`).

## How to Run Locally

```bash
git clone https://github.com/USERNAME/psyche-support.git
cd psyche-support
npm install
npm run dev