# Splintercat SEO Implementation Checklist

**Snapshot date:** August 30, 2026

**Use:** Work from top to bottom. P0 items block a healthy public launch; P1 items block scalable publishing; P2 items improve growth after the foundation is stable.

Legend:

- `[x]` observed in the repository at the snapshot date.
- `[ ]` open or requires live verification.
- **[OWNER]** requires an authorized owner account, credential, legal/business decision, or external service change.

Repository checks are not proof of live behavior. Close a delivery item only after testing the production URL.

## P0: secure canonical site

- [ ] **[OWNER]** Confirm the apex and `www` DNS records against the current GitHub Pages custom-domain instructions; remove conflicts only after resolving the exact targets.
- [ ] **[OWNER]** Verify `splintercatgear.com` as a custom domain in the repository owner’s GitHub account.
- [ ] Wait for GitHub Pages to issue a valid certificate covering the canonical host.
- [ ] **[OWNER]** Enable **Enforce HTTPS** in GitHub Pages.
- [ ] Verify `https://splintercatgear.com/` returns `200` with a valid certificate.
- [ ] Verify every `http://splintercatgear.com/...` request redirects once to the matching HTTPS path.
- [ ] Verify `www` resolves or redirects once to the chosen apex host; no chain or mixed canonical host.
- [x] Canonical tags use the intended HTTPS apex host.
- [x] `robots.txt` and the sitemap declaration use the intended HTTPS host.
- [ ] Re-crawl every canonical and sitemap URL after HTTPS enforcement.
- [ ] Record the certificate/enforcement date in the release log and measurement annotations.

Do not “fix” the current mismatch by changing canonicals to HTTP. Fix certificate and delivery. GitHub Pages does not apply Netlify `_redirects` or `_headers` directives; use supported Pages/DNS/edge configuration.

## P0: crawl, index, and status codes

- [x] `robots.txt` permits normal crawling and declares a sitemap.
- [x] Ensure the sitemap includes every published indexable guide and removes obsolete/noncanonical URLs.
- [x] Use a truthful `lastmod` only for substantive publication or revision work.
- [ ] Verify all sitemap URLs return a direct `200`, self-canonicalize, and are indexable.
- [ ] Verify CSS, JavaScript, fonts, and meaningful images needed to render content are crawlable.
- [ ] Verify an unknown path returns a real HTTP `404` while rendering the custom error page.
- [ ] Verify no production page unintentionally includes `noindex`, `nofollow`, a blocked canonical, or a canonical to a different intent.
- [ ] Verify slash behavior is consistent and does not create duplicate indexable paths.
- [ ] Verify no redirect chains, loops, soft 404s, or mixed-content requests.
- [x] Run a full internal-link crawl and resolve all broken links and fragments.
- [x] Run the automated SEO audit in continuous integration or before every production release.

## P0: webmaster tools

- [ ] **[OWNER]** Create or select the Google Search Console **Domain property**.
- [ ] **[OWNER]** Add the required DNS verification record; do not expose account credentials in the repository.
- [ ] Submit `https://splintercatgear.com/sitemap.xml` after HTTPS works.
- [ ] Inspect the home page, guide hub, setup pillar, gear page, and every newly published guide.
- [ ] Review Pages/Indexing, HTTPS, Core Web Vitals, manual actions, and security reports.
- [ ] **[OWNER]** Verify Bing Webmaster Tools or use its supported Search Console import flow.
- [ ] Submit the canonical sitemap in Bing and inspect the same priority URLs.
- [ ] Record account owners, permission levels, verification method, and recovery contact in a private operations record.

## P1: site architecture and keyword ownership

- [x] Keep the home page focused on the brand and broad editorial value.
- [x] Keep `/guides/` focused on browsing guides by problem.
- [x] Keep `/guides/indoor-cat-setup/` focused on the complete setup process.
- [x] Maintain page-level ownership in `seo/KEYWORD-MAP.csv`.
- [ ] Before approving a new brief, search the map for the same intent and define the “not this page” boundary.
- [x] Give every published guide a crawlable link from `/guides/`.
- [x] Give every leaf guide at least three contextual incoming internal links.
- [x] Link every leaf guide back to its parent hub/setup pillar and to two or three relevant sibling decisions.
- [x] Use descriptive anchors that state the destination’s purpose; avoid “click here” and repeated sitewide exact-match anchors.
- [x] Keep commercial links downstream of useful decision support.
- [ ] Run a monthly Search Console landing-page/query overlap review for cannibalization.
- [ ] Consolidate or redirect pages only after confirming the intents are not meaningfully distinct.
- [ ] Maintain a redirect map for every changed or retired URL and test it before release.

## P1: metadata and HTML template

For every indexable page:

- [x] Unique `<title>` aligned with its owned intent and the actual page answer.
- [x] Unique meta description written for the result snippet, not as a keyword list.
- [x] One visible, descriptive H1.
- [x] One self-referencing absolute HTTPS canonical.
- [x] `lang="en"`, UTF-8, mobile viewport, and a working skip link.
- [x] `index,follow,max-image-preview:large` where appropriate.
- [x] Open Graph type, site name, title, description, canonical URL, and relevant owned image.
- [x] Twitter/X summary-card metadata where a social image exists.
- [ ] Social image resolves over HTTPS, has the correct dimensions/type, and does not contain misleading product claims. The asset and metadata are present; live HTTPS verification remains blocked by certificate issuance.
- [x] Favicon and web manifest resolve correctly.
- [x] No duplicate IDs; heading order and landmarks remain accessible.
- [x] Every image has appropriate `alt`, explicit `width`/`height`, and useful nearby text.
- [x] No essential editorial image exists only as a CSS background.
- [x] External new-tab links use `noopener`; monetized links also follow the affiliate relationship rules below.

Sitewide release checks:

- [x] No duplicate indexable titles, descriptions, canonicals, or H1 omissions.
- [ ] Titles/descriptions are human-readable on mobile results; do not truncate mechanically to hit a character number.
- [x] The canonical title, H1, breadcrumb, link anchors, and structured data describe the same page intent.

## P1: structured data

- [x] Use Organization/WebSite data on the home page only when the properties are real.
- [x] Use Article and BreadcrumbList on research guides.
- [x] Use CollectionPage/ItemList on hubs only when every listed item is visible and linked on the page.
- [x] Keep IDs, URL, headline, image, author, publisher, publication date, and modification date consistent with visible content.
- [x] Validate JSON syntax locally on every build.
- [ ] Validate representative live templates with Schema.org and Google’s Rich Results Test where the type is supported.
- [ ] Do not add Product, Review, AggregateRating, Offer, rating, or “best” markup without matching visible, eligible evidence.
- [ ] Do not mark a category/watchlist page as a single Product.
- [ ] Do not create FAQ markup merely to repeat keywords or pursue an unavailable rich result.
- [ ] Revalidate after template, canonical-host, author, or image changes.

## P1: editorial quality and trust

- [x] Publish a visible methodology, editorial policy, affiliate disclosure, about page, correction path, privacy policy, accessibility statement, and terms.
- [x] Define Research Guide, Marketplace Watch, Field Note, and Hands-on Tested labels.
- [ ] Show the correct label near the top of every substantive page.
- [ ] Show a real byline or the accurately described organizational Research Desk byline.
- [ ] Never imply that the Research Desk has veterinary credentials.
- [ ] Name a reviewer only with permission and a retained review record.
- [ ] Add a visible publication date and change the modified date only after substantive work.
- [ ] Keep a claim/source log for every guide.
- [ ] Prioritize peer-reviewed research, veterinary professional guidance, universities, government/standards sources, and current manuals.
- [ ] Record source publisher, URL, access date, and the claim supported.
- [ ] Attribute manufacturer claims and distinguish them from measured facts, research conclusions, and editorial judgment.
- [ ] Include trade-offs, uncertainty, limitations, and “who should skip it” guidance.
- [ ] Add a veterinarian prompt for sudden or persistent health, appetite, drinking, mobility, elimination, pain, or behaviour changes.
- [ ] Do not diagnose, fabricate experience, or promise outcomes.
- [ ] Do not copy retailer descriptions, photos, reviews, rankings, badges, prices, or ratings.
- [ ] Make material corrections visible and include what changed.
- [ ] Confirm `hello@splintercatgear.com` is a working mailbox or forwarder before relying on it as the public correction path. **[OWNER]**

## P1: content publishing workflow

- [ ] Create a brief with primary intent, reader scenario, page boundary, sources, original artifact, internal links, label, reviewer need, and update cadence.
- [ ] Review current search-result intent without copying competitor structure.
- [ ] Draft the direct answer and decision framework before adding background.
- [ ] Produce at least one useful original artifact for major guides: diagram, checklist, worksheet, measurements, maintenance log, or test evidence.
- [ ] Complete claim-level source verification.
- [ ] Complete a second editorial pass for safety, medical-adjacent, travel, or regulation-dependent claims.
- [ ] Add metadata, structured data, imagery, breadcrumbs, and internal links.
- [ ] Add the canonical URL to the sitemap.
- [ ] Run HTML, JSON-LD, link, accessibility, mobile, and performance tests.
- [ ] Verify the live HTTPS page and request indexing for priority content.
- [ ] Add the next review date to the private inventory.
- [ ] Follow `seo/CONTENT-CALENDAR.md`, but delay a slot when evidence or QA is incomplete.

## P1: imagery, performance, and accessibility

- [ ] Use original or properly licensed images; retain source/license records outside public HTML where appropriate.
- [x] Export responsive raster sizes and modern formats where supported; avoid shipping a desktop hero at full resolution to small screens.
- [x] Give the above-the-fold hero appropriate priority and lazy-load below-the-fold media.
- [x] Preserve explicit image dimensions to prevent layout shift.
- [x] Keep meaningful text in HTML, not embedded only in images.
- [ ] Test keyboard navigation, focus visibility, menu state, link purpose, contrast, zoom/reflow, and reduced motion.
- [x] Run an automated accessibility audit on each indexable content and commercial template; manual keyboard/screen-reader smoke testing remains an owner/editor task.
- [x] Run Lighthouse or equivalent on home, representative article, and gear templates after material CSS/JS/media changes.
- [ ] Review field Core Web Vitals in Search Console when sufficient data exists.
- [ ] Set a performance budget before adding analytics, ads, embeds, tag managers, or affiliate widgets.
- [ ] Avoid third-party widgets that add render blocking, tracking, or inaccessible controls without clear reader value.

## P1: Amazon and affiliate activation

Current state:

- [x] `/gear/` separates category Research Shortlists from its dated Marketplace Watch and does not present either as a tested ranking.
- [x] The current disclosure says Amazon links are ordinary and non-monetized.
- [x] The repository includes an Amazon-link validation script.
- [x] No placeholder affiliate tag should be published.

Before monetization:

- [ ] **[OWNER]** Apply for and receive approval for Amazon Associates with the correct website listed.
- [ ] **[OWNER]** Provide the real Amazon.com tracking ID through an approved implementation process.
- [ ] **[OWNER]** Configure OneLink for Canadian traffic or provide a verified Amazon.ca program/tracking ID.
- [ ] **[OWNER]** Approve the exact required Associate statement and placement.
- [ ] Generate full Special Links through Amazon; do not fabricate tags or use an unapproved shortener.
- [ ] Place the required disclosure before the first monetized link.
- [ ] Add `(paid link)` beside each monetized call to action.
- [ ] Apply `rel="sponsored nofollow noopener"` to each monetized link.
- [ ] Update `/affiliate-disclosure/`, `/gear/`, and every affected page before the links go live.
- [ ] Do not use internal redirect cloaking.
- [ ] Do not publish static Amazon price, availability, rating, review count, badge, or scraped listing image.
- [ ] Run `node scripts/check-amazon-links.mjs --require-affiliate` and resolve every failure.
- [ ] Manually open every destination in the intended market and confirm it matches the described product.
- [ ] Record link check, product/model check, and disclosure check dates.
- [ ] Separate editorial selection from affiliate earnings in reporting and decision records.

Recurring affiliate maintenance:

- [ ] Check retailer destinations monthly while promoted.
- [ ] Conduct a full marketplace selection/specification review at least quarterly.
- [ ] Remove or update discontinued, materially changed, or misleading destinations promptly.
- [ ] Review Amazon program terms and required statements whenever notified of a change.

## P1: analytics and measurement

- [ ] **[OWNER]** Create/select GA4 property and web stream; provide the real Measurement ID.
- [ ] **[OWNER]** Approve privacy, data retention, advertising-feature, and consent choices before deployment.
- [ ] Update the privacy policy and consent controls before adding technologies that require them.
- [ ] Never commit analytics secrets, account screenshots, personal data, or placeholder IDs.
- [ ] Implement the minimum events in `seo/MEASUREMENT-PLAN.md`.
- [ ] Check GA4 enhanced measurement before adding a custom outbound event; prevent duplicate clicks.
- [ ] Validate events and controlled parameters in DebugView and real time.
- [ ] Confirm analytics failure never blocks navigation or retailer links.
- [ ] Exclude internal/developer traffic using a tested configuration.
- [ ] Re-run performance and accessibility checks after analytics deployment.
- [ ] Use UTM parameters only for controlled inbound campaigns, never internal links.
- [ ] Establish the first 28-complete-day baseline only after HTTPS, indexing, and measurement are stable.
- [ ] Do not set traffic, ranking, or revenue guarantees.

## P2: content assets and authority

- [ ] Create one link-worthy original asset per major guide: floor plan, printable checklist, measurement guide, cost worksheet, or transparent test protocol.
- [ ] Build a relevant outreach list of shelters, foster groups, veterinary practices, apartment-living publishers, cat educators, and renter communities.
- [ ] Offer source review, corrections, or genuinely useful resources before requesting promotion.
- [ ] Reuse each guide’s original decision insight in organic social posts and link to the canonical guide.
- [ ] Claim official social profiles before adding them to Organization structured data. **[OWNER]**
- [ ] Keep consistent brand name, domain, description, and contact information across claimed profiles.
- [ ] Do not buy links, automate low-quality guest posts, exchange undisclosed product for coverage, or place links in irrelevant directories.
- [ ] Track earned mentions and referral visits; judge a relationship by relevance and readership, not domain metrics alone.

## P2: scale controls

- [ ] Add an RSS feed for new guides and advertise it in relevant page heads.
- [ ] Maintain a private content inventory with owner, intent, sources, label, review date, and performance.
- [ ] Build genuine contributor/reviewer profile pages when people are ready to publish under their names.
- [ ] Create a category-specific testing protocol before the first hands-on comparison in that category.
- [ ] Require original photos, measurements, conditions, dates, drawbacks, and limitations for Hands-on Tested content.
- [ ] Consider separate US/Canada pages only when substantially different availability, terms, regulations, or fulfillment justify maintainable unique content.
- [ ] Do not auto-generate thin location, product-variant, FAQ, or retailer pages.
- [ ] Reassess the content calendar quarterly based on verified query data and editorial capacity.

## Recurring operating checklist

### Every release

- [ ] Diff contains only intended files and no credentials or personal data.
- [ ] HTML and JSON-LD validate.
- [ ] Metadata/canonical/H1 are unique and aligned.
- [ ] Internal and external links work; affiliate checker passes in the appropriate mode.
- [ ] Images load, have correct alt/dimensions, and are licensed/owned.
- [ ] Keyboard and mobile smoke tests pass.
- [ ] Canonical live URL returns the expected status over HTTPS.
- [ ] Sitemap reflects the publication.
- [ ] Event changes are validated and do not duplicate.
- [ ] Release date and material update notes are truthful.

### Weekly

- [ ] Check HTTPS, home, guide hub, sitemap, and `robots.txt` availability.
- [ ] Review Search Console/Bing indexing, manual-action, and security messages.
- [ ] Run broken-link and affiliate-link checks.
- [ ] Triage corrections and high-risk source changes.

### Monthly

- [ ] Export and review non-brand queries and landing pages by cluster.
- [ ] Review pages with relevant impressions in positions 8–30.
- [ ] Check landing-page overlap/cannibalization.
- [ ] Review guide-to-guide and retailer-outbound journeys.
- [ ] Verify promoted retailer destinations and marketplace research dates.
- [ ] Review upcoming content briefs, sources, original assets, and blockers.
- [ ] Update the scorecard with clear data-source labels and annotations.

### Quarterly

- [ ] Reprioritize keyword map/calendar using verified data.
- [ ] Review content due for update and product/model/specification changes.
- [ ] Audit affiliate disclosure and monetized-link compliance.
- [ ] Review Core Web Vitals, accessibility, and third-party script cost.
- [ ] Review permissions for Search Console, GA4, Bing, GitHub, domain, and affiliate accounts. **[OWNER]**
- [ ] Measure original-evidence coverage across monetized comparison/review pages.

## Launch acceptance record

Do not declare the SEO foundation complete until the release record contains:

- [ ] Production HTTPS/certificate and redirect evidence.
- [ ] Final canonical URL inventory and sitemap parity result.
- [ ] Full crawl and broken-link result.
- [ ] HTML/structured-data validation result.
- [ ] Accessibility and performance results for all major templates.
- [ ] Search Console and Bing verification/submission dates. **[OWNER]**
- [ ] GA4 decision and, if deployed, Measurement ID owner plus event-QA date. **[OWNER]**
- [ ] Amazon affiliate state: inactive, or approved with compliance-check result. **[OWNER]**
- [ ] Known limitations, owners, due dates, and rollback path.

## Owner input pack

The implementation team needs these decisions or credentials through a secure, non-repository channel:

1. Domain registrar and GitHub Pages access for HTTPS/DNS remediation.
2. Google Search Console property owner and preferred verification method.
3. Bing Webmaster Tools property owner.
4. GA4 Measurement ID, account owner, reporting time zone/currency, retention setting, and approved consent/privacy design.
5. Amazon Associates approval state, Amazon.com tracking ID, Canadian routing decision, and required disclosure wording.
6. Confirmation that `hello@splintercatgear.com` receives mail.
7. Named editorial approver, technical release owner, and person responsible for recurring source/product checks.

Never send passwords, tax information, bank information, recovery codes, or API secret keys through a content brief, commit, or public issue.
