# Splintercat Organic Search Strategy

**Planning period:** September 2026–August 2027

**Market:** English-speaking indoor-cat households in the United States and Canada

**Business model:** Editorial-first publication with a future, clearly disclosed affiliate program

**Status:** Working strategy. Revisit after the first 90 days of verified Search Console data.

## Executive direction

Splintercat should not try to outrank established publishers for undifferentiated phrases such as “best cat products.” Its defensible opening is **constraint-first indoor-cat guidance**: what fits a small home, where an item should go, how resources work together, what maintenance really involves, and which household or cat should skip a purchase.

The organic growth loop is:

1. Answer a specific setup problem with a well-sourced guide.
2. Connect that guide to a broader topic hub and two or three closely related guides.
3. Give the reader a transparent path to a buying checklist or marketplace watchlist.
4. Publish original measurements and hands-on evidence when the testing program is ready.
5. Use search and retailer-click data to improve the answer, not to manufacture freshness or rankings.

The first success condition is not a ranking guarantee. It is a technically indexable site with clear page ownership, credible coverage of four connected topics, and enough measurement to learn which problems earn qualified search demand.

## P0 launch risk: HTTPS

The August 30, 2026 technical audit found that the GitHub Pages custom domain was serving over HTTP while HTTPS enforcement was off and the HTTPS endpoint did not yet present a valid certificate for `splintercatgear.com`. At the same time, canonical tags, structured data, `robots.txt`, and the sitemap consistently point to HTTPS.

This is the highest-priority SEO issue. A crawler that follows the canonical can encounter an invalid destination, while visitors can land on an insecure version. Do not change canonical URLs back to HTTP. Fix the delivery layer:

1. Confirm the apex and `www` DNS records match the current GitHub Pages custom-domain instructions, with no conflicting records.
2. Verify the custom domain in the repository owner’s GitHub account.
3. Wait for GitHub to issue the certificate, then enable **Enforce HTTPS** in Pages settings.
4. Confirm `https://splintercatgear.com/` returns `200`, the certificate covers the hostname, and every `http://` request redirects once to the matching HTTPS URL.
5. Choose one host, preferably the apex, and redirect `www` to it without creating a chain.
6. Re-crawl all canonical and sitemap URLs after the change.

GitHub Pages does not apply Netlify-style `_redirects` or `_headers` files. Redirect and HTTPS behavior must be configured through DNS and GitHub Pages, or through a supported edge provider if one is added later.

**Owner input required:** repository/domain access and approval to change DNS or GitHub Pages settings.

## Brand position and audience

### Editorial promise

Splintercat helps people build an indoor environment before they buy more objects. Advice is practical, North America aware, transparent about evidence, and honest about maintenance, fit, and trade-offs.

### Primary audiences

- Renters and condo owners with limited floor space.
- First-time indoor-cat guardians planning a complete setup.
- Multi-cat households trying to reduce competition around resources.
- People replacing a poor-fit product after a placement, cleaning, noise, or size problem.
- US and Canadian shoppers who need availability and retailer-context clarity.

### Differentiators to repeat across the site

- Constraint-first recommendations: room, footprint, cat size, household size, noise, cleaning, and budget.
- Decision support instead of generic product roundups.
- Evidence labels that distinguish research, marketplace popularity, field observation, and hands-on testing.
- Clear “who should skip it” guidance.
- North American availability context without pretending US and Canadian assortments are identical.

## Search intent model

| Stage | Searcher need | Splintercat answer | Primary next action |
|---|---|---|---|
| Discover | “What does my indoor cat need?” | Setup and enrichment guides | Continue to a relevant sub-guide |
| Diagnose | “Why is this setup not working?” | Placement, access, maintenance, and behaviour-context guides | Apply a checklist; consult a veterinarian for health concerns |
| Compare | “Which type fits my home?” | Buying guides with dimensions, trade-offs, and skip criteria | Review a category watchlist or tested comparison |
| Select | “Is this specific item suitable?” | Future hands-on review or dated marketplace watch | Follow a clearly labelled retailer link |
| Maintain | “How do I clean, replace, or improve it?” | Maintenance and total-cost guides | Return to related setup and product guidance |

Informational pages must remain useful without a purchase. Commercial links should be a logical continuation, never the only substance on the page.

## Topical architecture

The canonical keyword-to-URL assignments are maintained in `KEYWORD-MAP.csv`. Each cluster has one broad owner and supporting pages with narrower jobs.

### 1. Indoor habitat and small-space catification

**Pillar:** `/guides/indoor-cat-setup/`

**Secondary hub:** `/guides/small-apartment-cat-setup/`

Support this cluster with safe-room planning, renter-friendly vertical space, compact cat trees, window-perch safety, senior-cat accessibility, and multi-cat layouts. The strategic angle is usable dimensions and placement, not aesthetic inspiration alone.

### 2. Litter setup and cleanup

**Existing owner:** `/guides/litter-box-placement/`

Build supporting coverage around litter-box dimensions, number and distribution of boxes, tracking control, small-bathroom trade-offs, and the maintenance burden of automatic systems. Keep medical diagnosis out of editorial copy; persistent elimination changes require a veterinary prompt.

### 3. Feeding and hydration

**Existing owner:** `/guides/food-water-station/`

Build supporting coverage around fountain cleaning, filter availability and annual cost, automatic feeder suitability for two cats, bowl access, resource separation, and multi-cat feeding. Specifications should be verified against current manufacturer documentation, with dates.

### 4. Play, scratching, and enrichment

**Existing owners:** `/guides/indoor-cat-enrichment/` and `/guides/scratching-post-placement/`

Build support around scratcher orientation, toy rotation, hunting-style play routines, window enrichment, nighttime activity, quiet exercise equipment, and compact climbing options. Recommendations should account for individual preference rather than implying one product works for every cat.

### 5. Travel and care

**Initial commercial bridge:** `/gear/#travel-care`

Build durable informational coverage on carrier sizing, carrier acclimation, emergency kits, and car-travel preparation. Health, medication, airline, and cross-border requirements can change; those pages require current primary sources and prominent jurisdiction/date context.

### Commercial layer

`/gear/` is a dated **Marketplace Watch**, not a test winner page. As evidence accumulates, create category buying guides before single-product reviews. A category guide must define selection criteria and practical trade-offs; a hands-on review must follow the published methodology and contain original evidence.

Do not create Product, Review, AggregateRating, or “best” claims merely to seek a rich result. Structured data and labels must describe the content that actually exists.

## Keyword ownership rules

1. One indexable URL owns each primary intent.
2. A support page must answer a narrower question than its parent and link back with descriptive anchor text.
3. Do not create separate pages for trivial wording variants such as “cat apartment setup” and “apartment setup for cats.” Cover natural variants on the same page.
4. If two pages receive impressions for the same query, compare intent and usefulness before consolidating. Do not merge solely because keywords overlap.
5. The home page owns the brand and broad value proposition, not “indoor cat setup.”
6. `/guides/` owns guide discovery by topic, while `/guides/indoor-cat-setup/` owns the complete setup process.
7. `/gear/` owns the Amazon marketplace-watch intent until evidence supports narrower category pages.

## On-page publishing specification

Every new indexable guide should ship with:

- A unique, descriptive URL that remains stable.
- One primary intent and a written “not this page” boundary in the brief.
- A unique title that leads with the problem or category, followed by `| Splintercat` where space permits.
- A unique meta description that describes the actual answer and useful differentiator; it is copy, not a keyword list.
- One clear H1, a direct answer or decision framework near the top, logical H2/H3 structure, and a table of contents for long guides.
- A canonical that resolves to the live HTTPS page.
- Open Graph/Twitter metadata and a relevant, owned image with descriptive alternative text, explicit dimensions, and a sensible filename.
- `Article` and `BreadcrumbList` structured data for editorial guides; use accurate publication and modification dates.
- A visible byline, evidence label, publication date, actual revision date when applicable, source list, limitations, and a veterinarian caveat where health or behaviour concerns could be involved.
- Links to the parent hub, the setup pillar, two or three useful sibling guides, and one commercial next step only when it helps the reader.
- A final decision checklist or actionable summary.

Avoid FAQs written only to repeat keywords. Use an FAQ section only when real reader questions require answers, and do not expect FAQ rich results for a general commercial publication.

## Internal linking system

Use a hub-and-spoke structure with contextual cross-links:

- The home page links to the guide hub, setup pillar, and the four primary problem clusters.
- `/guides/` links to every published guide and groups them by task.
- Every guide links up to `/guides/` and laterally to two or three adjacent decisions.
- Informational guides link to `/gear/` or a future category buying guide only after the reader has enough context to choose.
- Future category buying guides link back to placement, maintenance, and setup guidance.
- The methodology, editorial policy, disclosure, and about pages should be accessible from all money pages, usually through the footer plus contextual evidence links.

Anchor text should name the destination’s purpose: “litter-box placement guide,” not “click here.” Avoid sitewide exact-match keyword stuffing and orphan pages. Before publication, verify each new page has at least three crawlable internal links from existing pages and at least two onward links.

## Editorial, source, and evidence standards

### Source hierarchy

For welfare, behaviour, safety, and medical-adjacent topics, prefer:

1. Peer-reviewed research and consensus guidelines.
2. Veterinary professional bodies and university programs.
3. Government or standards organizations for regulations and safety.
4. Current manufacturer manuals for product-specific dimensions, maintenance, warnings, and compatibility.
5. Retailer pages only for current assortment, availability, and marketplace context—not proof of quality.

Useful foundational sources include the AAFP/ISFM feline environmental-needs guidance, FelineVMA resources, the Ohio State Indoor Pet Initiative, and relevant peer-reviewed feline behaviour literature. Record the source URL, publisher, access date, and the claim it supports in the working brief.

### Claim discipline

- Attribute measured facts, manufacturer claims, research conclusions, and editorial judgment separately.
- Never imply that the organizational Research Desk has veterinary credentials.
- Name a veterinarian or other reviewer only with permission and a real review record.
- Do not diagnose. Use a clear veterinary prompt for sudden or persistent appetite, drinking, mobility, elimination, pain, or behaviour changes.
- Do not copy retailer descriptions, customer reviews, rankings, product photography, star ratings, prices, inventory, or badges.
- Do not present marketplace popularity as a quality verdict.
- Do not publish exact performance claims without a reproducible test record.

### Evidence labels

- **Research Guide:** synthesis of credible sources and practical reasoning; no hands-on claim.
- **Marketplace Watch:** dated retailer snapshot with buying checks; no endorsement.
- **Field Note:** clearly bounded longer-term observation.
- **Hands-on Tested:** only after the item, method, dates, conditions, measurements, drawbacks, and original evidence are documented.

### Update policy

- Marketplace Watch: verify retailer destinations and the research date monthly while actively promoted; conduct a full selection review at least quarterly.
- Product/category buying guides: check specifications, models, consumables, and links quarterly or after a known model change.
- Evergreen setup guides: editorial review every six months; update sooner when credible guidance changes.
- Safety, travel, or regulation-dependent pages: event-driven review plus a scheduled review every three months.
- Policy and trust pages: annual review and before any material business-model, analytics, privacy, or affiliate change.

Only change `dateModified` after a substantive verified update. Record material changes visibly.

## Affiliate and ecommerce SEO rules

The current Amazon links are ordinary, non-commissioned links. Affiliate activation requires owner-controlled account setup before any HTML is changed.

**Owner inputs required:**

- Approved Amazon Associates account and the real Amazon.com tracking ID.
- Amazon OneLink configuration for Canadian traffic, or a verified Amazon.ca program and tracking ID.
- Approval of the exact disclosure language required by the program.

Activation requirements:

- Use Amazon-generated Special Links; never fabricate tracking tags.
- Display the required Associate statement before the first monetized link.
- Label each monetized call to action `(paid link)` and apply `rel="sponsored nofollow noopener"`.
- Do not cloak destinations with internal redirects or unapproved shorteners.
- Do not publish static Amazon price, rating, review-count, availability, or image data unless the program and implementation explicitly permit it and keep it current.
- Run the repository’s affiliate-link validation before each release.
- Keep substantial original comparison value on every affiliate page; avoid thin product-list pages.

## Technical SEO roadmap

### P0 — indexability and canonical delivery

- Repair HTTPS and enforce a single secure hostname.
- Verify all sitemap and canonical URLs return `200` over HTTPS.
- Verify the custom 404 returns a true `404` status.
- Ensure `robots.txt` remains reachable and references the final HTTPS sitemap.
- Add every published indexable guide to the sitemap with a truthful modification date.

### P1 — quality control and discoverability

- Run automated checks for unique titles, descriptions, canonicals, one H1, valid JSON-LD, image dimensions/alt text, broken internal links, and sitemap parity.
- Keep CSS/JS/image assets crawlable.
- Use image files in HTML where the image contributes meaning; CSS backgrounds do not replace an indexable article image.
- Add relevant image entries to the sitemap if image discovery remains weak.
- Monitor Core Web Vitals by template after field data becomes available; protect current static-site speed as analytics and affiliate code are added.
- Keep structured data minimal and truthful: Organization/WebSite, CollectionPage, Article, BreadcrumbList, and ItemList where appropriate.

### P2 — scale safely

- Add an RSS feed for new guides.
- Establish a repeatable content-brief and pre-publication QA process.
- Add genuine author/reviewer profile pages when people are ready to publish under their names.
- Create category buying-guide templates only after the first real category methodology exists.
- Consider US/Canada localization only when there is enough distinct content, fulfillment, pricing, or regulatory value to maintain separate pages. Do not create near-duplicate country pages.

## Authority and organic distribution

Organic search is strengthened by useful exposure, not mass link placement. For every major guide, create one distribution asset that can earn references:

- A printable room-measurement or resource-placement checklist.
- An original diagram showing a small-space layout.
- A maintenance-cost worksheet for fountains, feeders, or automatic litter systems.
- A transparent category test protocol.
- A compact US/Canada availability comparison with a clear research date.

Pitch only genuinely relevant organizations: shelters, foster networks, veterinary practices, apartment-living publishers, cat behaviour educators, and renter communities. Ask for correction or resource feedback before asking for a link. Do not buy links, automate guest-post outreach, exchange products for undisclosed coverage, or use manufacturer copy as “research.”

Social content should demonstrate the guide’s decision process: one measurement, placement mistake, cleaning burden, or “skip this if” rule per post. Link to the canonical guide rather than recreating the whole answer in a disposable caption.

## Measurement and decision rules

Instrumentation is defined in `MEASUREMENT-PLAN.md`. The required owner-controlled inputs are Google Search Console, GA4, Bing Webmaster Tools, and Amazon affiliate program access.

Primary organic indicators:

- Valid indexed canonical URLs and no material HTTPS, crawl, or canonical errors.
- Non-brand impressions and clicks by topical cluster.
- Queries and landing pages gaining positions 8–30, which indicate improvement candidates.
- CTR by query/page after position and device are considered.
- Internal journeys from guide to guide and guide to commercial next step.
- Monetized retailer click-through by page/category after affiliate activation.
- Percentage of commercial pages with original evidence and a current review date.

Do not set traffic or revenue promises before a baseline exists. Use the first 28 complete days after verified tracking and indexing as the baseline, then set quarterly improvement ranges by cluster.

## First 90 days

### Days 0–14

- Resolve HTTPS and the canonical host.
- Verify Google Search Console and Bing Webmaster Tools; submit the sitemap.
- Add GA4 only after the Measurement ID, privacy review, and consent approach are approved.
- Publish the existing six-guide cluster cleanly and ensure each page is in the sitemap and internal link graph.
- Run a full crawl and structured-data validation.

### Days 15–45

- Publish four calendar items focused on litter dimensions, a safe-room plan, fountain maintenance, and scratcher selection.
- Create reusable content briefs and source logs.
- Establish the weekly search/indexing review and monthly reporting dashboard.
- Begin outreach around one genuinely useful downloadable or diagram.

### Days 46–90

- Publish the next two to four calendar items based on capacity.
- Inspect query overlap between the home page, guide hub, and setup pillar.
- Improve pages receiving impressions but weak engagement or mismatched queries.
- Finalize the first category-specific hands-on method; do not publish a test badge until a real test exists.
- Decide whether affiliate activation is operationally ready. Monetization should follow compliance, not precede it.

## Risks and controls

| Risk | Control |
|---|---|
| Canonicals point to unavailable HTTPS pages | Treat certificate/enforcement as P0 and verify every canonical after the fix |
| Broad pages cannibalize each other | Maintain keyword ownership and review landing-page/query overlap monthly |
| Thin affiliate content | Lead with original decision support; delay monetization when evidence is incomplete |
| Unsupported health or behaviour claims | Use professional/primary sources, precise attribution, limitations, and veterinarian prompts |
| Fabricated freshness | Update dates only after substantive work and show material correction notes |
| Product data becomes stale | Date all marketplace/specification research and follow the category review cadence |
| Analytics harms privacy or performance | Approve privacy/consent first, load the minimum script set, and monitor template performance |
| Content scale weakens quality | Cap publishing at the editorial team’s source-review and QA capacity |

## Strategy review cadence

- **Weekly:** indexing exceptions, HTTPS/uptime, broken links, publishing queue.
- **Monthly:** query/page performance, internal journeys, marketplace-link health, content decay, and cannibalization.
- **Quarterly:** cluster coverage, conversion assists, original-evidence coverage, affiliate compliance, and calendar reprioritization.
- **Annually:** audience, positioning, information architecture, trust policies, and whether country localization is justified.

This plan should change when verified data or better evidence changes the decision. It should not change simply to chase a single ranking fluctuation.

## Working reference set

Use current primary documentation when implementing or revising this plan:

- Google Search Central: [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- Google Search Central: [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- Google Search Central: [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- Google Search Central: [Google Images SEO best practices](https://developers.google.com/search/docs/appearance/google-images)
- Google Search Central: [Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- Google Search Central: [Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)
- Google Search Central: [Spam policies, including thin affiliation](https://developers.google.com/search/docs/essentials/spam-policies)
- Google Search Central: [Affiliate-link relationship guidance](https://developers.google.com/search/blog/2021/07/link-tagging-and-link-spam-update)
- Google Search Central: [Using Search Console and Google Analytics together](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console)
- AAFP/ISFM: [Feline environmental-needs guidelines](https://pmc.ncbi.nlm.nih.gov/articles/PMC11383066/)
- FelineVMA: [Setting Up for Success](https://catvets.com/resource/setting-up-for-success/)
- Ohio State Indoor Pet Initiative: [Litter boxes](https://indoorpet.osu.edu/cats/basic-indoor-cat-needs/litter-boxes)
- Peer-reviewed guidance: [Feline house-soiling and litter-box considerations](https://pmc.ncbi.nlm.nih.gov/articles/PMC11148882/)
- Peer-reviewed guidance: [Intercat tension guidelines](https://pmc.ncbi.nlm.nih.gov/articles/PMC11292941/)

Re-check dates, program terms, product manuals, and jurisdiction-specific information at the time of publication. A reference list does not substitute for claim-level source review.
