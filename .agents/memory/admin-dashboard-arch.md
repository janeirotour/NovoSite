---
name: Admin Dashboard Architecture
description: How the admin sidebar nav works, URL-based tab routing, auth guard ownership, and the overview dashboard design.
---

# Admin Dashboard Architecture

## Navigation pattern
- Tab routing uses URL query param: `/admin/dashboard?tab=tours` (not React Tabs component)
- `AdminDashboard` reads active tab via `useSearch()` from wouter: `new URLSearchParams(search).get("tab") ?? "overview"`
- Sidebar links in `AdminLayout` navigate to `?tab=<slug>` — no page reload, just URL update

## Auth guard ownership
- **AdminLayout** owns auth: calls `useGetAdminMe()`, redirects to `/admin` via `useEffect` (NOT inline during render) if unauthenticated
- **AdminDashboard** still calls `useGetAdminMe()` for the username display but does NOT redirect — just returns `null` if `!me`
- This avoids the "cannot update while rendering" React warning from having two components both call `setLocation` inline

**Why:** Having both AdminLayout and AdminDashboard redirect inline caused a React warning about setState during render. Putting redirect in `useEffect` in AdminLayout and `return null` in AdminDashboard is the correct pattern.

## Sidebar design
- `AdminLayout.tsx` is a complete custom sidebar, NOT shadcn Sheet/Drawer
- Sidebar bg: `bg-[#111827]` (dark charcoal)
- Active nav item: `bg-[#1B4332]` (forest green) with green icon `text-[#4ade80]`
- Nav groups: Business, Website Content, Engagement, Settings & SEO
- User avatar at bottom with logout button

## Overview section
- Premium KPI cards: Total Revenue (from paid reservations), Reservations count, Published Tours, Avg Rating
- Secondary stats row: Total Tours, Destinations, Reviews, Blog Posts
- Recent reservations table: last 5, sorted by `createdAt` desc, shows payment badge
- Quick Actions grid: 4 cards linking to Tours, Bookings, Blog, Settings

## Section page headers
- Each non-overview tab gets a `PageHeader` component showing a title + description above the tab content
- Defined inline inside AdminDashboard (not exported)

## Key file locations
- `artifacts/janeiro-tour/src/components/layout/AdminLayout.tsx` — sidebar shell, auth guard, nav groups
- `artifacts/janeiro-tour/src/pages/admin-dashboard.tsx` — all tab content (2600+ lines); main export at ~line 742
