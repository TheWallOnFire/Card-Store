# TCG Marketplace Ecosystem

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An enterprise-grade Trading Card Game (TCG) marketplace and management ecosystem. This platform integrates a high-performance card catalog, a real-time listing engine, and professional deck management tools into a unified, type-safe architecture.

## 🚀 Vision & Objectives

The TCG Marketplace is designed to solve the complexity of large-scale card hobbyist needs:
- **Unified Catalog**: A single source of truth for cards across multiple games (MTG, Pokémon, Yu-Gi-Oh!).
- **Seller Command Center**: Tools for bulk inventory management and market analytics.
- **Content-First**: integrated strategy guides and news via a modular CMS.
- **Native Experience**: Cross-platform availability through web and mobile companion apps.

---

## 🛠️ Project Structure

The project is organized as a monorepo-style ecosystem:

- **`/webstore`**: The flagship customer-facing marketplace. Built with Next.js 14, TanStack Query, and Framer Motion.
- **`/serverside`**: The core business logic layer. Implements Next.js Server Actions and secure Supabase API routes.
- **`/adminweb`**: Dedicated portal for marketplace administrators and content creators.
- **`/mobileport`**: Cross-platform companion app built with React Native and Expo.
- **`/db`**: Centralized SQL schema definitions, RLS policies, and PostgreSQL functions.

---

## ⚙️ Core Feature Set

### 🔍 Intelligence-Driven Search
- **Faceted Navigation**: Real-time filtering by Game, Rarity, Price, and Type.
- **URL-Synced State**: Filters are persisted in the search parameters for deep linking.
- **Resilient Catalog**: Intelligent fallback to mock data ensures UI stability even during backend maintenance.

### 📦 Marketplace Engine
- **Listing Aggregation**: Automatic grouping of individual seller listings by unique card identifiers.
- **Quick-Add Interface**: High-speed inventory entry with Zod-validated pricing and condition logic.

### 🃏 Professional Deck Management
- **Bulk Import**: Industry-standard syntax support (`[gameid]_[cardid]_[count]`) via optimized Regex parsing.
- **Transaction Safety**: Atomic PostgreSQL operations ensure deck integrity.

---

## 🏗️ Technical Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **State Management**: TanStack Query (Server State), Zustand/Context (Cart & UI State).
- **Backend/DB**: Supabase (PostgreSQL), Row Level Security (RLS).
- **Animations**: Framer Motion & Lucide Icons.
- **Validation**: Zod (Schema Validation), React Hook Form.

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- Supabase Project (URL & Anon Key)

### 2. Environment Setup
Configure your `.env.local` in `webstore` and `serverside`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SERVERSIDE_API_URL=http://localhost:3000/api
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Start webstore development
cd webstore
npm run dev
```

---

## 📄 Documentation Links
- **[Architecture Deep-Dive](ARCHITECTURE.md)**: Detailed breakdown of the system design and data flow.
- **[Database Schema](db/initial_schema.sql)**: Raw SQL definitions for the marketplace core.

---

> [!NOTE]
> This platform is currently under active modernization. For architectural decisions or technical debt queries, please refer to the `ARCHITECTURE.md` guide.
