---
name: TipTap v3 API quirks
description: Breaking changes from TipTap v2 to v3 affecting imports, BubbleMenu, Table, TextStyle extensions
---

# TipTap v3 API differences (vs v2)

**Why:** v3 is a major rewrite and docs/AI training often cite v2 patterns that silently fail.

## Import changes
- `BubbleMenu` → from `@tiptap/react/menus` (NOT from `@tiptap/react`)
- `TextStyle`, `Color`, `FontSize` → all named exports from `@tiptap/extension-text-style` (single package, not separate)
- `TableKit` → from `@tiptap/extension-table` (replaces Table + TableRow + TableCell + TableHeader separate imports)
- Must install `@tiptap/core` as a direct dep (not just transitive) when using `Extension` from it

## BubbleMenu positioning
- v2 used Tippy.js → `tippyOptions={{ placement: "top-start" }}`
- v3 uses Floating UI → `options={{ placement: "top-start" }}` (different prop name)

## setContent
- v2: `editor.commands.setContent(html, false)` (second param = emitUpdate boolean)
- v3: second param is `SetContentOptions` object, not a boolean → use a `isProgrammatic` ref flag instead to prevent onChange loops

## setImage
- No `class` property in v3 — use `HTMLAttributes` on the extension configure instead

## StarterKit
- No `history` config option in v3 (history is built-in differently)

## How to apply
Always check these when copying TipTap v2 examples to v3 projects. The `lazy()` import for RichTextEditor must be placed AFTER all `import` statements in the file (not between them) or Vite HMR will break.
