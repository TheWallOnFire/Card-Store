# TCG Marketplace - Server-Side Module

This is the standalone backend for the TCG Marketplace, built with Next.js 14+ (App Router).

## Getting Started

1. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in your Supabase and Stripe credentials.
   ```bash
   cp .env.example .env
   ```

2. **Installation**:
   ```bash
   npm install
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

## Architecture

- **Actions (`src/app/actions`)**: Standardized server actions for Listings, Posts, Decks, and Bulk Imports with built-in RBAC and Zod validation.
- **API (`src/app/api`)**: High-performance REST endpoints for search, market stats, and third-party webhooks.
- **Lib (`src/lib`)**: Shared utilities for Supabase client, auth-helpers, and database types.

## Deployment

This module can be deployed independently as a Next.js application or integrated as a microservice for the TCG ecosystem.
