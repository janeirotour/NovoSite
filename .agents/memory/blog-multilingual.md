---
name: Blog multilingual schema & admin dashboard patterns
description: New fields added to blog_posts and site_settings; admin dashboard component patterns for multilingual forms.
---

## Blog multilingual columns (added)
- `excerpt_es`, `excerpt_pt` — nullable text
- `content_es`, `content_pt` — nullable text
- `seo_title_es`, `seo_title_pt` — nullable text
- `seo_description_es`, `seo_description_pt` — nullable text
- `gallery_images` — JSONB, not null, default []

## Site settings columns (added)
- `site_name` — text, default "Janeiro Tour & Travel"
- `seo_title`, `seo_description`, `og_image_url` — nullable text
- `hero_image_url` — nullable text

## Workflow
After any schema change: `pnpm --filter @workspace/db run push` then `pnpm --filter @workspace/api-spec run codegen`
The blog route uses spread (`...post`) so new columns are returned automatically without touching blog.ts route.

## Admin dashboard component patterns
- `BlogForm` is defined as a named inner function (not arrow) inside the main `AdminDashboard` component but outside `BlogTab`, to avoid re-mounting on every render.
- DestForm is defined as a named inner function inside `DestinationsTab` — it has its own `useState` for language tab.
- Both use language tab switcher: `["en","es","pt"]` mapped to flag+name labels.
- `duplicatePost` strips `id` and `createdAt`, appends `-copy-{Date.now().toString(36)}` to slug, sets published=false.

## FAQ page
- Switched from hardcoded FAQS constant to `useListFaqs()` API hook.
- DB format: `question, questionEs, questionPt, answer, answerEs, answerPt` → mapped to `{en:{q,a}, es:{q,a}, pt:{q,a}}`.
- Falls back to EN strings when ES/PT translations are null.
- 10 FAQs seeded; 14 blog posts total (5 pre-existing + 9 new originals).

**Why:** Admin must be able to manage all content from the dashboard without code changes. FAQ and blog are the two highest-traffic content areas.

**How to apply:** Any new page content that needs multilingual admin control should follow the same tabbed EN/ES/PT pattern in the admin form, and the DB columns should follow the `_es`/`_pt` suffix convention.
