# Splintercat Organic Measurement Plan

**Purpose:** Measure whether Splintercat is indexable, earns qualified non-brand discovery, helps readers move between useful decisions, and generates compliant retailer interest without sacrificing trust or performance.

This plan defines what to collect. It does not include credentials or tracking IDs. No account identifier, API secret, Amazon tag, tax information, or payment information belongs in the repository.

## Owner-controlled inputs

These steps require the site owner or an explicitly authorized operator:

- **Google Search Console:** verify the domain property, ideally using a DNS record; submit `https://splintercatgear.com/sitemap.xml`; add appropriate users.
- **Google Analytics 4:** create or select the property and web data stream; provide the real `G-...` Measurement ID; approve the privacy, retention, and consent approach before the tag is deployed.
- **Bing Webmaster Tools:** verify the domain or import the verified property where available; submit the sitemap; add appropriate users.
- **Amazon Associates:** obtain the approved Amazon.com tracking ID, configure OneLink for Canadian traffic or provide an approved Amazon.ca tracking ID, and approve the required disclosures before monetized links are deployed.
- **Business decisions:** name the reporting owner, choose a time zone and currency for analytics, and confirm who can approve privacy, legal, and affiliate changes.

Until those inputs exist, keep the site free of placeholder IDs and fabricated affiliate parameters.

## Measurement principles

1. Search Console is the source of truth for Google organic queries, clicks, impressions, position, indexing, and search appearance.
2. GA4 is the source of truth for on-site sessions and defined interactions after it is lawfully and correctly deployed.
3. Bing Webmaster Tools is the source of truth for Bing crawl, indexing, and query visibility.
4. Amazon Associates reporting is the source of truth for attributed affiliate orders, commission, returns, and program-recognized revenue.
5. GitHub Pages or an approved uptime monitor is the source for availability and delivery incidents.
6. No system should be forced to answer a question it cannot measure. Search Console and GA4 will not reconcile exactly because their scopes, attribution, privacy thresholds, time zones, and processing differ.
7. Collect the minimum useful data. Never send names, email addresses, free-form form text, precise addresses, or other personally identifiable information in event names, URLs, or event parameters.

## Implementation order

### Phase 0 — delivery health

Do not judge organic performance until the canonical HTTPS site works.

1. Repair the custom-domain certificate and enable HTTPS enforcement.
2. Confirm the apex canonical host returns `200` and HTTP/`www` variants redirect correctly.
3. Verify `robots.txt`, the sitemap, representative pages, assets, and the true 404 response.
4. Record the fix date as the start of the technical baseline.

### Phase 1 — webmaster tools

1. Verify the Google Search Console domain property.
2. Submit the sitemap and inspect the home page, guide hub, setup pillar, gear page, and each newly published guide.
3. Verify Bing Webmaster Tools and submit the same canonical sitemap.
4. Record verification, submission, first crawl, and first indexed dates in the reporting log.

Search Console verification does not require a visitor analytics script and should not wait for GA4.

### Phase 2 — GA4

1. Approve the privacy/consent design appropriate to the site’s actual audience and technologies. This plan is not legal advice.
2. Update the privacy policy and consent controls before analytics is activated where required.
3. Add the real Measurement ID once, preferably through a small first-party integration rather than multiple overlapping tag systems.
4. Enable only useful enhanced measurement features; inspect outbound-click behavior before creating a duplicate custom event.
5. Add the content and retailer events defined below.
6. Validate in browser developer tools, GA4 DebugView, and the real-time report without sending personal data.
7. Re-run performance and accessibility tests after the script is added.

### Phase 3 — affiliate attribution

1. Activate only real Amazon-generated Special Links and approved tracking IDs.
2. Use a small, durable tracking-ID taxonomy within program rules, such as by major content cluster rather than one tag per URL.
3. Apply the required on-page disclosures, paid-link labels, and `rel="sponsored nofollow noopener"`.
4. Validate every monetized link with the repository check before release.
5. Compare GA4 retailer outbound clicks with Amazon reporting directionally; do not expect exact equality.

## Data layer and page classification

Each indexable content page should have a stable classification available to analytics code, whether read from markup or provided through a small data object:

| Field | Example | Purpose |
|---|---|---|
| `content_id` | `guide_litter_box_placement` | Stable identifier that survives title edits |
| `page_type` | `guide`, `guide_hub`, `marketplace_watch`, `trust`, `home` | Template and journey analysis |
| `content_cluster` | `litter`, `feeding_hydration`, `habitat`, `enrichment`, `travel`, `trust` | Cluster reporting |
| `content_label` | `research_guide`, `marketplace_watch`, `hands_on_tested`, `field_note` | Evidence-level analysis |
| `publication_date` | `2026-08-30` | Cohort analysis |
| `modified_date` | `2026-08-30` | Refresh analysis; only a real modification date |
| `affiliate_status` | `none`, `active` | Separates editorial launch from monetized state |

Do not register every field as a GA4 custom dimension automatically. Start with `page_type`, `content_cluster`, `content_label`, and `affiliate_status`; add others only when a report needs them and quota/cardinality has been reviewed.

## Event specification

GA4 already records page views and, if enabled, some enhanced-measurement interactions. Do not duplicate automatically collected events. The custom events below describe Splintercat-specific decisions.

| Event | Trigger | Parameters | Use | Key event? |
|---|---|---|---|---|
| `primary_setup_click` | A visitor clicks the header/home “start with your setup” CTA | `source_page`, `link_position` | Measures entry into the setup journey | No |
| `guide_card_click` | A visitor selects a guide from a topic/card interface | `source_page`, `destination_content_id`, `content_cluster`, `link_position` | Measures hub and home discovery paths | No |
| `related_guide_click` | A visitor follows an in-article or related-content link to another guide | `source_content_id`, `destination_content_id`, `content_cluster`, `link_position` | Measures internal learning journeys | No |
| `retailer_outbound_click` | A visitor activates a product or retailer CTA | `content_id`, `content_cluster`, `product_category`, `product_name`, `product_id`, `retailer`, `destination_market`, `affiliate_status`, `link_position` | Measures qualified commercial interest | After affiliate activation, yes |
| `market_source_click` | A visitor opens a retailer category/source link used to explain marketplace selection | `content_id`, `product_category`, `retailer`, `link_position` | Separates methodology/source inspection from product interest | No |
| `methodology_click` | A visitor opens methodology/editorial evidence from a guide or gear page | `source_content_id`, `destination`, `link_position` | Indicates trust-path use | No |
| `resource_download` | A visitor downloads a real checklist, worksheet, or printable | `content_id`, `resource_id`, `resource_type`, `content_cluster` | Measures use of original utility assets | Consider after baseline |
| `correction_contact_click` | A visitor opens the correction email link | `source_page` | Monitors use of the correction path without collecting message content | No |

Implementation notes:

- Fire each click event once, before navigation. Preserve normal link behavior if analytics fails.
- Do not append internal UTM parameters. They overwrite session attribution and fragment reporting.
- Do not put the full outbound URL into GA4 if it contains a tracking tag that creates unnecessary cardinality. Send the retailer, market, stable product ID/ASIN, and approved affiliate-status field instead.
- `product_name` must be a controlled label, not user input.
- A click is not a sale, recommendation success, or welfare outcome.
- If GA4 enhanced measurement already records outbound clicks, either enrich the existing event carefully or disable that portion before implementing the custom retailer event. Do not double count.

## Campaign tagging standard

Use UTM parameters only for inbound campaigns controlled by Splintercat, never for internal navigation.

Required fields:

- `utm_source`: platform or partner, such as `instagram`, `pinterest`, `shelter_partner`.
- `utm_medium`: stable channel, such as `organic_social`, `email`, `referral`.
- `utm_campaign`: lowercase campaign or guide identifier, such as `litter_placement_launch`.
- `utm_content`: optional creative identifier, such as `floorplan_carousel`.

Naming rules:

- Lowercase ASCII, underscores instead of spaces, no dates unless the campaign itself is date-specific.
- Never place personal information in a parameter.
- Maintain a shared campaign-name log to prevent synonyms such as `ig`, `instagram`, and `Instagram`.
- Amazon tracking IDs and Special Links follow Amazon program rules; they are not replaced by UTM parameters.

## Core KPIs and definitions

### Technical/indexing health

| KPI | Definition | Decision use |
|---|---|---|
| Canonical HTTPS availability | Share of declared canonical URLs returning `200` with a valid certificate | Must remain 100%; any failure is a P0 incident |
| Index coverage ratio | Valid indexed canonical content URLs divided by submitted indexable content URLs | Diagnose discovery, quality, canonical, or crawl issues; legal/support pages may be segmented separately |
| Sitemap parity | Published indexable canonical URLs present in sitemap and no obsolete/noncanonical URLs present | Release gate |
| Broken internal-link count | Crawlable internal links returning non-2xx/non-intended redirect | Release and weekly maintenance gate |
| Core Web Vitals pass rate | URLs rated “Good” in Search Console field data, by template when available | Protect performance as scripts and media grow |

### Search discovery

| KPI | Definition | Decision use |
|---|---|---|
| Non-brand organic clicks | Search Console clicks excluding brand variants such as `splintercat` and `splinter cat gear` | Measures discovery beyond known demand |
| Non-brand impressions | Search Console impressions using the same brand exclusion | Early visibility indicator |
| Cluster clicks/impressions | Landing pages grouped by the approved keyword-map cluster | Determines where topical coverage is gaining traction |
| Query-position opportunity | Queries with relevant intent and sustained impressions in positions 8–30 | Prioritizes evidence and answer improvements |
| Search CTR | Clicks divided by impressions, analyzed with position, device, query intent, and country | Improves titles/descriptions only when the result promise is mismatched |
| Landing-page overlap | Same or near-identical query consistently showing multiple Splintercat landing pages | Triggers an intent/cannibalization review, not automatic consolidation |

Average position is a directional aggregate, not a precise rank tracker. Never report it without query, page, device, country, and date context.

### On-site usefulness

| KPI | Definition | Decision use |
|---|---|---|
| Guide-to-guide rate | Sessions with `related_guide_click` divided by eligible guide sessions | Tests whether internal paths match reader needs |
| Hub-to-guide rate | `guide_card_click` sessions divided by guide-hub sessions | Tests guide discovery and card clarity |
| Setup-entry rate | Sessions with `primary_setup_click` divided by eligible home/navigation sessions | Measures the primary editorial funnel |
| Resource-use rate | Sessions with `resource_download` divided by eligible content sessions | Tests value of original tools |
| Engaged sessions | GA4 engaged sessions, segmented by page type and organic source | Diagnostic context, not a quality verdict by itself |

Do not optimize for a lower bounce rate or longer time in isolation. A reader who gets a quick, correct answer may be successful.

### Commercial and affiliate

| KPI | Definition | Decision use |
|---|---|---|
| Retailer outbound rate | Sessions with `retailer_outbound_click` divided by eligible commercial-page sessions | Measures qualified retailer interest |
| Category click share | Retailer clicks grouped by content cluster/product category | Informs which buyer guides deserve deeper testing |
| Affiliate ordered items | Amazon-reported attributed items | Program outcome; account for returns and reporting lag |
| Affiliate conversion rate | Amazon-reported ordered items divided by Amazon-reported clicks, where provided | Use Amazon’s own denominator rather than blending GA4 counts |
| Earnings per click | Net Amazon earnings divided by Amazon-reported clicks | Commercial efficiency after returns; never a content-quality score |
| Original-evidence coverage | Monetized comparison/review pages with the required original evidence divided by all such pages | Trust and thin-affiliation control |

Revenue should never determine a factual conclusion or ranking. Report earnings beside evidence coverage, corrections, and reader-use metrics.

## Baselines and targets

Do not publish traffic, ranking, or revenue guarantees. Establish targets in three steps:

1. Start the baseline only after canonical HTTPS works, Search Console is verified, the sitemap is processed, and analytics is validated.
2. Use the first **28 complete days** as the operational baseline. For new clusters with too little data, wait for a full comparable period rather than extrapolating from a few impressions.
3. Set the next quarter’s improvement range for each cluster using its baseline, planned content, seasonality, and indexing state. Record the assumption and owner.

Non-negotiable control targets can exist without traffic history:

- 100% of declared canonicals resolve over valid HTTPS.
- 100% of published indexable pages have sitemap parity and pass the release crawl.
- 0 placeholder analytics IDs or affiliate tags.
- 0 tagged affiliate links missing required disclosure, paid-link label, or sponsored relationship attribute.
- 0 pages labelled Hands-on Tested without a complete test record and original evidence.

## Reporting views

### 1. Executive monthly scorecard

- Technical incidents and resolution status.
- Indexed/submitted content by cluster.
- Non-brand clicks and impressions by cluster, current 28 days vs previous 28 days and year-over-year when available.
- Top gaining and declining landing pages with an explanation, not just a percentage.
- Guide-to-guide and retailer outbound rates.
- Affiliate clicks/orders/net earnings after activation.
- Editorial evidence coverage, overdue reviews, and corrections.
- Next month’s two content deliverables and blockers.

### 2. Search opportunity view

- Query, landing page, cluster, country, device, impressions, clicks, CTR, and average position.
- Filter for relevant queries with sustained impressions in positions 8–30.
- Flag queries where the wrong URL appears or multiple URLs alternate.
- Exclude or separately report branded queries.

### 3. Content inventory view

- URL, content ID, primary intent, cluster, label, author/byline, reviewer, publication date, material modification date, next review date, source check, internal inlinks, organic performance, commercial status, and correction status.

### 4. Affiliate compliance view

- Monetized URL, retailer, market, approved tracking-ID family, disclosure present, paid-link label present, relationship attribute present, last link check, last product/manual review, and owner.

### 5. Technical quality view

- HTTPS/certificate, status code, canonical, indexability, sitemap membership, title/H1/schema validation, Core Web Vitals, accessibility checks, and broken links by template.

## Cadence and ownership

| Cadence | Review | Owner role | Output |
|---|---|---|---|
| After every release | Live status, canonical, schema, sitemap, links, event firing, visual/mobile QA | Publisher/developer | Release record and rollback decision |
| Weekly | HTTPS/uptime, Search Console indexing, manual actions/security messages, broken links, affiliate-link validation | Technical SEO owner | Issue queue with severity and owner |
| Monthly | Search/query performance, internal journeys, retailer clicks, content decay, planned vs delivered content | SEO/editorial lead | Scorecard and next-month priorities |
| Quarterly | Cluster coverage, conversion assists, evidence quality, Core Web Vitals, content consolidation, calendar changes | Owner + SEO + editorial | Quarterly review and approved roadmap |
| Annually | Analytics/privacy configuration, user access, retention, affiliate program status, strategy and taxonomy | Business owner | Governance audit and revised measurement plan |

If one person fills multiple roles, the checks still need named ownership and dates.

## Data quality QA

Before accepting a report:

- Confirm the date range uses complete days and the agreed time zone.
- Annotate HTTPS changes, migrations, analytics releases, major content updates, and retailer-program changes.
- Check that GA4 internal/developer traffic filters are tested before being made permanent.
- Verify organic channel definitions and exclude obvious spam/referral pollution where supported.
- Confirm events fire once and parameters use controlled values.
- Compare live pages with the content inventory so removed or redirected URLs are not presented as current.
- State whether metrics come from Search Console, GA4, Bing, Amazon, or a crawl.
- Preserve raw exports or reproducible report definitions for material business decisions.

## Alerts and incident handling

Treat these as immediate incidents:

- Certificate invalid, HTTPS unavailable, or canonical host not serving.
- Home page, guide hub, sitemap, or `robots.txt` returns an unexpected status.
- Search Console reports a manual action or security issue.
- A release introduces `noindex`, blocked resources, wrong canonicals, or sitemap-wide failures.
- Analytics begins sending personal data or duplicate revenue/click events.
- An affiliate page lacks the required disclosure or link treatment.

Treat these as investigation triggers, not proof of a penalty:

- A sustained search decline compared with the previous comparable 28-day period.
- A sharp divergence between impressions and clicks.
- Multiple pages alternating for one query.
- A content cluster gains impressions but no useful internal or retailer journey.
- A high-performing page has overdue source or product verification.

For every incident, record detection time, affected URLs, cause, correction, validation, and the date data returned to normal.

## Privacy, access, and retention

- Update the privacy policy before deploying analytics, advertising, personalization, embedded media, accounts, or other tracking technology.
- Implement the approved consent approach for the jurisdictions actually served; obtain qualified advice where needed.
- Grant the minimum account permissions necessary and review user access quarterly.
- Use organization-controlled accounts and recovery methods.
- Do not put credentials in source control, dashboards shared publicly, screenshots, or content briefs.
- Set GA4 retention and advertising features deliberately; do not enable extra data collection by default.
- Avoid cross-device/user-ID tracking unless there is a real product need, a lawful basis, and updated disclosure.

## First dashboard checkpoint

Schedule the first decision review after all of the following are true:

- HTTPS has been valid and enforced for 28 complete days.
- Google Search Console and Bing have processed the current sitemap.
- GA4 has passed implementation QA, if the owner chose to deploy it.
- The published guide inventory and keyword map match.
- No material crawl or canonical incident remains open.

At that checkpoint, keep, move, or replace future calendar topics based on verified query intent and editorial capacity—not on unverified tool estimates alone.
