# Splintercat website

A dependency-free static website for `splintercatgear.com`.

Production hosting: GitHub Pages from the `main` branch, with `splintercatgear.com` as the custom domain.

## What is included

- Responsive, accessible homepage with an original SVG brand system and cinematic forest hero art
- Guide hub, a sourced indoor-cat setup pillar, and five intent-specific supporting guides
- Transparent testing methodology and content labels
- About, editorial, affiliate, privacy, accessibility, contact, and terms pages
- Canonical metadata, Open Graph/Twitter metadata, JSON-LD, `robots.txt`, image-aware XML sitemap, and RSS feed
- Responsive WebP image variants and original article visuals
- A full organic-search package under `seo/` with keyword ownership, a 12-month calendar, measurement, and launch checklists
- Custom 404 page and optional static-host security headers
- Dated popular-gear marketplace watchlist with original buying checks
- Generated research shortlists for cat toys, scratching posts, and small-space cat trees, backed by exact product evidence records
- Nine original, product-specific editorial illustrations with responsive WebP and JPEG derivatives

## Preview locally

From this directory, run any static server. For example:

```powershell
npx serve .
```

Do not open the HTML files directly if you want absolute links such as `/guides/` to work.

## Quality checks

Run these before every release:

```powershell
node scripts/build-product-catalog.mjs
node scripts/seo-audit.mjs
node scripts/check-amazon-links.mjs
npx --yes html-validate "**/*.html"
```

The category and product pages under `gear/cat-toys/`, `gear/scratching-posts/`, `gear/cat-trees-small-spaces/`, and `gear/products/` are generated from `data/products.json`; edit the dataset or generator instead of hand-editing those pages. The SEO audit checks indexable metadata, canonical paths, JSON-LD parsing, image attributes, duplicate IDs, internal links and fragments, sitemap parity, product-data/page parity, and affiliate-link semantics. Use `node scripts/check-amazon-links.mjs --require-affiliate` only after approved Amazon Special Links and the required disclosures are in place.

## Product image provenance

The nine product visuals in `assets/products/` were created for Splintercat with Codex's built-in image generation tool on 2026-08-30. They are original editorial illustrations, not manufacturer or Amazon photographs and not evidence of an exact current variant. Product records display that limitation in a visible caption; category-card thumbnails use empty alternative text because the adjacent product heading already identifies the item. The editorial illustrations may be used as each page's representative `Article`/`WebPage` image, but deliberately are not declared as `Product.image` in structured data.

Every prompt shared this art direction: a square product-only, polished 3D catalogue render on a deep navy-to-black studio gradient with cyan rim light and a restrained orange reflection; centered three-quarter composition; complete object visible; no cats, people, packaging, logos, brand text, labels, prices, ratings, badges, watermarks, or retailer UI. Each prompt explicitly described the output as an original editorial approximation rather than a copied product photograph.

The product-specific prompt summaries were:

- Catstages Tower of Tracks: tiered captive-ball track tower with six cyan and orange balls.
- Cat Dancer 101: flexible spring-steel wire with rolled-cardboard ends.
- Go Cat Da Bird: dark wand, tether, swivel, and one natural-feather lure.
- Nina Ottosson Buggin' Out: low leaf-pattern puzzle board with integrated covers and orange pegs.
- SmartCat Ultimate Scratching Post: one tall rectangular woven-sisal post on a broad square base.
- Amazon Basics 35-inch post: one tall jute post, broad base, and one short-cord plush ball.
- PetFusion Ultimate Scratcher Lounge: one low corrugated-cardboard infinity-curve lounger.
- Yaheetech 54-inch tree: one stable grey plush tower with two condos, three upper perches, sisal supports, and a discreet restraint strap.
- Amazon Basics 22-inch tree: one compact three-step beige-and-charcoal platform tree with jute supports.

For each slug, the committed derivatives are a 1024×1024 WebP (`-editorial-v1.webp`), a 640×640 WebP (`-editorial-v1-640.webp`), and a 1024×1024 JPEG fallback/social image (`-editorial-v1.jpg`). Do not replace them with copied marketplace imagery. If exact licensed photography is added later, retain the source URL, permission or API basis, credit, model/variant, and an internal provenance record before publishing it.

The organic-search operating documents are in [`seo/`](seo/):

- `SEO-STRATEGY.md`
- `KEYWORD-MAP.csv`
- `CONTENT-CALENDAR.md`
- `MEASUREMENT-PLAN.md`
- `IMPLEMENTATION-CHECKLIST.md`

## Before public deployment

1. Enable `hello@splintercatgear.com` as a working mailbox or forwarder.
2. Have the owner review every page, especially the founder/story copy and legal-policy drafts.
3. Replace or supplement the organizational Research Desk byline with a real, public author or qualified reviewer when ready.
4. Confirm the production host returns a true HTTP 404 for `404.html`.
5. Redirect HTTP and `www` to `https://splintercatgear.com/`.
6. Verify the domain in Google Search Console and Bing Webmaster Tools, then submit `/sitemap.xml`. Follow the launch sequence in `seo/IMPLEMENTATION-CHECKLIST.md`.
7. Add real social-profile URLs to structured data only after the accounts are claimed.
8. Update the privacy and terms pages before adding analytics, forms, accounts, ads, or commerce.
9. Ensure publication and sitemap dates match the actual public launch or revision date.

## Content rule

Never label a page **Hands-on Tested** until a real test record exists under the published methodology. Affiliate links must be disclosed before the first monetized link and use `rel="sponsored"`.

## Amazon affiliate activation

The links in `/gear/` and its generated product records are currently ordinary Amazon.com and Amazon.ca product or search links. They intentionally contain no tracking ID and earn no commission.

Before monetizing them:

1. Apply to Amazon Associates and register `splintercatgear.com` in the account.
2. Obtain the real Amazon.com tracking ID. Never commit passwords, tax information, payment information, or API secret keys.
3. Enable Amazon OneLink for Canadian traffic, or create and verify separate Amazon.ca Special Links with the Canadian tracking ID.
4. Replace each product URL with the full Special Link generated by Amazon. Do not use internal redirects or third-party URL shorteners.
5. Put the exact required Amazon Associate statement before the first tagged link, add `(paid link)` beside every tagged call to action, and add `rel="sponsored nofollow noopener"`.
6. Change the current non-monetized notice on `/gear/`, every generated product record, and the affiliate disclosure before deployment.
7. Run `node scripts/check-amazon-links.mjs --require-affiliate`; activation mode fails when no tagged links exist and also catches placeholder tags, missing link attributes, missing paid-link labels, missing disclosure text, shortened URLs, or Amazon-hosted images.

Do not publish static Amazon prices, star ratings, review counts, availability claims, badges, or scraped listing images. Re-check the marketplace selection date and every retailer link whenever the watchlist is materially updated.
