# StackShop – Stackline Full Stack Assessment (Bug Fixes)

## Summary
This repo is a small Next.js (App Router) eCommerce demo with intentional bugs across UX, functionality, and route/API usage.

I focused on fixes that:
- improve correctness and user experience in the core flows (filters + product detail)
- reduce fragility/security risk (avoid shipping serialized product JSON in URLs)
- keep changes reviewable and aligned with typical production patterns

## Tech
- Next.js (App Router)
- TypeScript
- Tailwind + shadcn/ui
- JSON-backed `productService`

## Getting Started

```bash
yarn install
yarn dev
```

## What I Fixed

### 1) Subcategory filtering did not respect the selected category
**Issue:** The UI fetched `/api/subcategories` without passing the selected category, so the subcategory dropdown could not be correctly scoped.

**Fix:** Updated the request to include `?category=<selectedCategory>` (URL-encoded) so the server can filter correctly.

**Why this approach:** The API route already supports category filtering through query params, so this is the smallest correct change.

---

### 2) Product detail navigation used serialized product JSON in the URL
**Issue:** The list page navigated to `/product` using a `product=<JSON string>` query param. This is fragile and has downsides:
- very long URLs / encoding issues
- breaks deep-linking and refresh reliability
- forces parsing untrusted URL data (`JSON.parse`)

**Fix:** Switched to SKU-based routing using `/product/[sku]` and loaded the product via `/api/products/[sku]`.

**Why this approach:** Stable identifiers in the URL are standard for commerce product pages, support refresh/deep-linking, and reduce risk from URL-driven JSON parsing.

---

### 3) `/api/products/[sku]` route handler used incorrect params typing
**Issue:** The route handler typed `params` as a Promise and awaited it. In Next.js route handlers, `params` is provided as an object.

**Fix:** Corrected the handler signature to `{ params: { sku: string } }`.

**Why this approach:** Aligns with Next.js conventions and avoids runtime/type inconsistencies.

---

### 4) Loading state could get stuck on network/API errors
**Issue:** The product list page only cleared `loading` on success.

**Fix:** Added `.catch()` and `.finally()` so loading always resolves and the UI shows a basic error state.

**Why this approach:** Prevents “infinite loading” UX and makes failures visible.

---

### 5) Accessibility/UX improvement: removed nested interactive elements
**Issue:** A `<Link>` wrapped a `<Button>` inside the product card, creating nested interactive elements and inconsistent click/keyboard behavior.

**Fix:** The card is no longer wrapped in a Link; instead the footer uses `Button asChild` with a Link to the product detail page.

**Why this approach:** Improves accessibility and keeps a clear click target.

## Notes / Tradeoffs
- Kept changes intentionally scoped and easy to review.
- Did not add pagination, caching, or tests due to the time-box.

## If I Had More Time
- Add debounced search to reduce request volume
- Add pagination UI to match the existing `limit`/`offset` API support
- Persist filter selections in the URL query parameter
- Add a small test suite (unit tests for `productService`, basic route tests)
