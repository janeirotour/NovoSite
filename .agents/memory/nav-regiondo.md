---
name: Nav and Regiondo widget design
description: Decisions for premium navigation and Regiondo widget embedding
---

## Premium Navigation (Header.tsx)
- Uses shadcn `NavigationMenu` (radix-based, hover dropdowns) for desktop
- Mobile: custom accordion panel with full-screen overlay
- Logo: `<img src="/janeiro-logo.png">` with `brightness-0 invert` filter on hero (transparent mode), normal otherwise
- Transparent on homepage hero (`location === "/" && !isScrolled && !mobileOpen`), white/blur on scroll
- Right side: Globe+lang dropdown, WhatsApp (wa.me/5521972633333), golden "Book Now" button
- Nav structure: Home | Tours▾ | Destinations▾ | About Us▾ | Travel Guide▾ | Contact

## Regiondo Widget (tour-detail.tsx)
- `RegionodoWidget` component uses `useRef<HTMLDivElement>` + `useEffect` to inject scripts
- Pattern: clone div, copy non-script nodes, then for each script tag create new `<script>` element and append to container (forces browser to execute it)
- Field: `tour.regiondoWidget` (string | null). If empty → show "Request Availability via WhatsApp" placeholder
- The booking sidebar checks `hasRegionodo = !!(tour.regiondoWidget as string)?.trim()`

**Why:** `dangerouslySetInnerHTML` does NOT execute script tags; the useEffect+script-clone pattern is the standard workaround.

## Admin Dashboard Tour Form fields added
- regiondoWidget (large code textarea, monospace)
- titleEs, titlePt, overviewEs, overviewPt (translation section)
- seoTitle, seoDescription (SEO section)
- Tours table shows "Widget Active" badge when regiondoWidget is set
