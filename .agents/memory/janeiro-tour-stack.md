---
name: Janeiro Tour stack
description: Key stack facts for the Janeiro Tour & Travel monorepo
---

- pnpm workspaces: api-server (`@workspace/api-server`, port 8080, path /api), janeiro-tour (`@workspace/janeiro-tour`, Vite+React, path /)
- DB: PostgreSQL + Drizzle ORM. Push schema: `pnpm --filter @workspace/db run push`
- Codegen: `pnpm --filter @workspace/api-spec run codegen` — regenerates React Query hooks + Zod schemas
- OpenAPI spec drives all client hooks in `lib/api-client-react/src/generated/api.ts`
- Tours table has: regiondo_widget, seo_title, seo_description, title_es, title_pt, overview_es, overview_pt, sort_order fields
- Settings table stores hero content, contact info, social links, SEO defaults
- Logo: `/home/runner/workspace/attached_assets/janeiro-tour-logo.png` → copied to `artifacts/janeiro-tour/public/janeiro-logo.png`
- Brand colors: primary #FFB600 (golden yellow), accent #009743 (Brazil green)

**Why:** Reference for future sessions to avoid re-discovering stack details.
