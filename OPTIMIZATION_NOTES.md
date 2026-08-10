# Mobile Lighthouse optimization notes

## Changes in this package

- `_includes/head.html`
  - Preloads the WebP thumbnail used by the first homepage card (`i-rest-thumb.webp`) only on the homepage and marks it high priority, so its request can begin in the document head.
  - Keeps the small site stylesheet render-blocking. This is intentional: it is necessary to paint the existing layout with stable dimensions and avoids the severe CLS caused by making it asynchronous.
  - Keeps Google Fonts non-render-blocking but changes the loading policy from `swap` to `optional`. A slow font will now remain on the metric-compatible fallback instead of swapping after paint and moving the homepage content.
  - Removes the high-priority preload for Font Awesome. The icon stylesheet remains available asynchronously, but it no longer competes with the LCP image.
- `_includes/javascripts.html`
  - Loads `tags-filter.js` only on the tags page. The homepage and posts no longer download or run a script that immediately exits there.
- `assets/img/i-rest-thumb.webp`
  - Re-encoded at visually conservative WebP quality 78 (PSNR 40.7 dB), reducing the LCP asset from 45,262 B to 40,876 B without changing its 720 × 480 dimensions.

## Logical backup

Original copies of every modified file are in `_optimization-backup/`, preserving the project-relative paths:

- `_optimization-backup/_includes/head.html`
- `_optimization-backup/_includes/javascripts.html`
- `_optimization-backup/assets/img/i-rest-thumb.webp`

## GitHub Pages cache limitation

GitHub Pages controls the `Cache-Control` response headers for `github.io` assets. A Jekyll repository cannot set a longer TTL using `_config.yml`, `.htaccess`, a meta tag, or an HTML `cache-control` tag. Therefore the Lighthouse **efficient cache lifetime** audit cannot be guaranteed to pass while the site is served directly from `*.github.io`; changing file names or query strings only creates a fresh URL, not a longer TTL.

To control browser cache headers, serve the site through a custom domain with a configurable CDN/proxy (for example Cloudflare) and set immutable caching for versioned static assets. Do not cache HTML as immutable; it must retain a short revalidation policy.

## Remaining measured-risk items

- Font Awesome 4.7 ships a 76 KiB WOFF2 for the eight icons used here. It was retained to preserve the exact icon artwork. A later, separately verified improvement can replace those icons with local inline SVGs or a subsetted WOFF2.
- The included JavaScript has no geometry reads (`offset*`, `client*`, `getBoundingClientRect`) followed by writes. The reported forced reflow should be re-profiled on the deployed page; it may be browser/layout work or an external script rather than these files.
- The homepage contains only six cards in this archive (well below the usual large-DOM threshold). Reducing it further would change pagination/content behavior, so no DOM structure was removed.
