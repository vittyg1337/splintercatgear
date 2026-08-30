import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dataset = JSON.parse(await readFile(join(root, "data", "products.json"), "utf8"));
const origin = "https://splintercatgear.com";
const publishedAt = dataset.publishedAt || dataset.checkedAt;
const checkedAtDisplay = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC"
}).format(new Date(`${dataset.checkedAt}T12:00:00Z`));

const categories = {
  "cat-toys": {
    path: "/gear/cat-toys/",
    title: "Cat Toys by Play Style: Research Picks | Splintercat",
    description: "Compare cat toy research picks for wand play, batting, and food puzzles, with formats and safety checks grounded in published sources.",
    eyebrow: "Cat toy research shortlist",
    h1: "Choose a cat toy by how your cat hunts.",
    intro: "No single toy wins every cat. This shortlist covers four different jobs: independent batting, low-cost human-led movement, aerial wand play, and food-based problem solving. Choose the play pattern first, then inspect the exact product.",
    image: "/assets/cat-toys-tiger-research-v1.webp",
    imageSmall: "/assets/cat-toys-tiger-research-v1-800.webp",
    imageFallback: "/assets/cat-toys-tiger-research-v1.jpg",
    imageAlt: "A stylized tiger beside generic wand, track, and puzzle-toy forms in a dark research studio",
    illustrationNote: "Original Splintercat category illustration; it is not a photograph of any listed product.",
    facts: [
      ["Play style", "Wand, wire lure, captive track, or food puzzle"],
      ["Supervision", "Wands, strings, feathers, wire, and first puzzle sessions need direct supervision"],
      ["Rotation", "Use a small active set and rotate it instead of leaving every toy out"],
      ["Success signal", "The cat stalks, chases, catches, or solves without fear or unsafe chewing"]
    ],
    criteria: [
      "Each pick has a distinct play job instead of competing on a universal score.",
      "Exact format, dimensions, materials, or mechanism were checked against a manufacturer or primary product record.",
      "Safety and storage limits are stated beside the recommendation.",
      "North American retailer links are separated by country and carry no invented price, rating, or stock claim."
    ],
    safetyTitle: "Strings and feathers belong in supervised sessions",
    safetyCopy: "Cornell advises avoiding toys with small or linear parts that can detach and be swallowed. VCA likewise says wand and fishing-pole toys should not be left with cats unattended. Store interactive lures after play, inspect every connector, and remove damaged toys.",
    safetySources: [
      ["Cornell: safe toys and gifts", "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/safe-toys-and-gifts"],
      ["VCA: play and play toys", "https://vcahospitals.com/know-your-pet/cat-behavior-and-training---play-and-play-toys"]
    ],
    relatedGuide: "/guides/indoor-cat-enrichment/",
    relatedGuideLabel: "Build a repeatable enrichment routine"
  },
  "scratching-posts": {
    path: "/gear/scratching-posts/",
    title: "Cat Scratching Posts by Type: Research Picks | Splintercat",
    description: "Compare scratching-post research picks by height, base, orientation, and surface, with facts checked against published sources.",
    eyebrow: "Scratcher research shortlist",
    h1: "Choose a scratching post by orientation—not by hype.",
    intro: "A tall post, an extra-tall marketplace post, and a horizontal cardboard lounger solve different problems. Observe where and how your cat already scratches, then match the orientation, surface, stability, and placement.",
    image: "/assets/scratching-posts-tiger-research-v1.webp",
    imageSmall: "/assets/scratching-posts-tiger-research-v1-800.webp",
    imageFallback: "/assets/scratching-posts-tiger-research-v1.jpg",
    imageAlt: "A stylized tiger stretching on a generic tall sisal post beside horizontal and angled scratchers",
    illustrationNote: "Original Splintercat category illustration; it is not a photograph of any listed product.",
    facts: [
      ["Orientation", "Vertical, horizontal, or more than one"],
      ["Usable reach", "A vertical post must allow the individual cat to extend comfortably"],
      ["Stability", "The surface should resist shifting or tipping under force"],
      ["Placement", "Start beside an existing scratch target, sleeping area, or travel route"]
    ],
    criteria: [
      "The shortlist represents materially different orientations and surfaces.",
      "Published height, base footprint, and surface were checked against the manufacturer or primary product record.",
      "We favor usable scratching area and stability over decorative features.",
      "No product is called universal: cat preference and placement determine whether it works."
    ],
    safetyTitle: "Preference and placement matter as much as construction",
    safetyCopy: "Cornell recommends observing whether a cat scratches vertically or horizontally and matching the surface and orientation. A post that suits the preference still needs a stable base and a useful location near the cat’s chosen target.",
    safetySources: [
      ["Cornell: destructive scratching behavior", "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feline-behavior-problems-destructive-behavior"],
      ["FelineVMA: claw-friendly toolkit", "https://catvets.com/resource/claw-friendly-toolkit-faq/"]
    ],
    relatedGuide: "/guides/scratching-post-placement/",
    relatedGuideLabel: "Place the scratcher where it can work"
  },
  "cat-trees-small-spaces": {
    path: "/gear/cat-trees-small-spaces/",
    title: "Small-Space Cat Trees: Research Picks | Splintercat",
    description: "Compare two researched small-space cat-tree formats using footprint, usable platforms, height, anchoring, and cat-size fit—not outside height alone.",
    eyebrow: "Small-space cat-tree shortlist",
    h1: "Compare usable territory, not just advertised height.",
    intro: "A tall tower and a low compact perch can share a similar shopping label while doing different jobs. Measure every platform, route, and base before deciding which format adds useful territory to your room.",
    image: "/assets/cat-trees-tiger-research-v1.webp",
    imageSmall: "/assets/cat-trees-tiger-research-v1-800.webp",
    imageFallback: "/assets/cat-trees-tiger-research-v1.jpg",
    imageAlt: "A stylized tiger between generic compact and tall cat-tree structures in a dark architectural studio",
    illustrationNote: "Original Splintercat category illustration; it is not a photograph of either listed product.",
    facts: [
      ["Floor cost", "Measure the full base plus the landing route around it"],
      ["Usable platforms", "Compare the cat’s body with each perch and condo opening"],
      ["Vertical job", "Decide whether you need a high refuge, window perch, or low stepping route"],
      ["Stability", "Use the supplied wall restraint when the maker provides one"]
    ],
    criteria: [
      "The two formats solve different space and mobility constraints.",
      "Published footprint, height, platform fit, and anchoring information were checked against primary records.",
      "A large outside height does not compensate for unusable perches or an unsafe route.",
      "The recommendation states who should skip each tree."
    ],
    safetyTitle: "Vertical space needs a safe route and stable base",
    safetyCopy: "Feline environmental guidance treats elevated space as an important resource, but the structure has to fit the individual cat and household. Place it on a level surface, use supplied restraints, inspect hardware, and plan both the route up and the landing route down.",
    safetySources: [
      ["AAFP/ISFM environmental needs guidelines", "https://pmc.ncbi.nlm.nih.gov/articles/PMC11383066/"],
      ["FelineVMA: indoor/outdoor lifestyle statement", "https://catvets.com/resource/2024-indoor-outdoor-lifestyle-position-statement/"]
    ],
    relatedGuide: "/guides/small-apartment-cat-setup/",
    relatedGuideLabel: "Plan the whole small-apartment setup"
  }
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nav(current = "gear") {
  return `<header class="site-header">
    <div class="container nav-wrap">
      <a class="brand" href="/" aria-label="Splintercat home"><img src="/assets/logo-mark.svg" width="44" height="44" alt=""><span class="brand-name">SPLINTERCAT</span></a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Open navigation" data-menu-button><span></span></button>
      <nav class="site-nav" id="site-navigation" aria-label="Primary navigation" data-navigation data-open="false">
        <ul class="nav-list">
          <li><a href="/guides/">Guides</a></li>
          <li><a href="/gear/"${current === "gear" ? ' aria-current="page"' : ""}>Popular gear</a></li>
          <li><a href="/methodology/">How we test</a></li>
          <li><a href="/about/">Our story</a></li>
          <li><a class="nav-cta" href="/guides/indoor-cat-setup/">Start with your setup</a></li>
        </ul>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><a class="brand" href="/"><img src="/assets/logo-mark.svg" width="44" height="44" alt=""><span class="brand-name">SPLINTERCAT</span></a><p>Practical indoor-cat setup guides and transparent product research for North American homes.</p></div><div><p class="footer-heading">Explore</p><ul class="footer-links"><li><a href="/guides/">Guides</a></li><li><a href="/gear/">Popular gear</a></li><li><a href="/methodology/">How we test</a></li><li><a href="/about/">Our story</a></li><li><a href="/contact/">Contact</a></li></ul></div><div><p class="footer-heading">Standards</p><ul class="footer-links"><li><a href="/editorial-policy/">Editorial policy</a></li><li><a href="/affiliate-disclosure/">Affiliate disclosure</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="/accessibility/">Accessibility</a></li><li><a href="/terms/">Terms</a></li></ul></div></div><div class="footer-bottom"><p>© <span data-current-year>2026</span> Splintercat. Built in Canada for cats everywhere.</p><p>Not veterinary advice. Ask your veterinarian about individual needs.</p></div></div></footer>`;
}

function head({ title, description, path, image, imageSmall, imageAlt, type = "website", preloadImage = true, schema }) {
  const canonical = `${origin}${path}`;
  const preload = preloadImage
    ? `<link rel="preload" href="${image}" as="image" type="image/webp" imagesrcset="${imageSmall} 800w, ${image} 1536w" imagesizes="(max-width: 880px) 100vw, 52vw" fetchpriority="high">`
    : "";
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#050816">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/logo-512-v2.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css">
  ${preload}
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Splintercat">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${origin}${image}">
  <meta property="og:image:width" content="1536">
  <meta property="og:image:height" content="1024">
  <meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${origin}${image}">
  ${type === "article" ? `<meta property="article:published_time" content="${publishedAt}T00:00:00-04:00">\n  <meta property="article:modified_time" content="${dataset.checkedAt}T00:00:00-04:00">\n  <meta property="article:author" content="Splintercat Editorial Team">` : ""}
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>
</head>`;
}

function categoryPicture(category, loading = "eager") {
  return `<figure class="catalog-visual">
    <picture>
      <source type="image/webp" srcset="${category.imageSmall} 800w, ${category.image} 1536w" sizes="(max-width: 880px) 100vw, 52vw">
      <img src="${category.imageFallback}" width="1536" height="1024" alt="${escapeHtml(category.imageAlt)}" loading="${loading}" decoding="async"${loading === "eager" ? ' fetchpriority="high"' : ""}>
    </picture>
    <figcaption>${escapeHtml(category.illustrationNote)}</figcaption>
  </figure>`;
}

function productInitials(product) {
  return product.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function productDescriptor(product) {
  return [
    product.brand,
    product.model ? `Model ${product.model}` : "",
    product.variant || ""
  ].filter(Boolean).join(" · ");
}

function retailerVerb(url) {
  return url.includes("/s?") ? "Search" : "Check";
}

function categoryCard(product) {
  const specs = product.specs.slice(0, 2).map((spec) => `<div><dt>${escapeHtml(spec.label)}</dt><dd>${escapeHtml(spec.value)}</dd></div>`).join("");
  return `<article class="catalog-product-card">
    <div class="catalog-product-mark" aria-hidden="true"><span>${escapeHtml(productInitials(product))}</span><small>${escapeHtml(product.format)}</small></div>
    <div class="catalog-product-copy">
      <p class="content-label">${escapeHtml(product.pickLabel)}</p>
      <h3><a href="/gear/products/${escapeHtml(product.slug)}/">${escapeHtml(product.name)}</a></h3>
      <p class="catalog-model">${escapeHtml(productDescriptor(product))}</p>
      <p>${escapeHtml(product.shortAnswer)}</p>
      <dl class="catalog-facts">${specs}</dl>
      <div class="catalog-fit"><strong>Best fit</strong><span>${escapeHtml(product.bestFor)}</span></div>
      <a class="button small" href="/gear/products/${escapeHtml(product.slug)}/">View evidence record <span aria-hidden="true">→</span></a>
    </div>
  </article>`;
}

function categoryPage(categoryKey) {
  const category = categories[categoryKey];
  const products = dataset.products.filter((product) => product.category === categoryKey);
  const canonical = `${origin}${category.path}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": canonical,
        url: canonical,
        name: category.title.replace(" | Splintercat", ""),
        description: category.description,
        dateModified: dataset.checkedAt,
        isPartOf: { "@id": `${origin}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: `${origin}/gear/products/${product.slug}/`
          }))
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "Popular gear", item: `${origin}/gear/` },
          { "@type": "ListItem", position: 3, name: category.eyebrow, item: canonical }
        ]
      }
    ]
  };

  const rows = products.map((product) => `<tr><th scope="row"><a href="/gear/products/${escapeHtml(product.slug)}/">${escapeHtml(product.name)}</a><span>${escapeHtml(product.pickLabel)}</span></th><td>${escapeHtml(product.format)}</td><td>${escapeHtml(product.specs[1]?.value ?? product.specs[0].value)}</td><td>${escapeHtml(product.bestFor)}</td></tr>`).join("\n");
  const factCards = category.facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  const criteria = category.criteria.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const sources = category.safetySources.map(([label, url]) => `<li><a href="${escapeHtml(url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(label)} <span aria-hidden="true">↗</span></a></li>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
${head({ title: category.title, description: category.description, path: category.path, image: category.image, imageSmall: category.imageSmall, imageAlt: category.imageAlt, schema })}
<body>
  <!-- Generated by scripts/build-product-catalog.mjs from data/products.json. -->
  <a class="skip-link" href="#main-content">Skip to main content</a>
  ${nav()}
  <main id="main-content">
    <header class="catalog-page-hero">
      <div class="container catalog-hero-grid">
        <div class="catalog-hero-copy">
          <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/gear/">Popular gear</a></li><li aria-current="page">${escapeHtml(category.eyebrow)}</li></ol></nav>
          <p class="eyebrow">${escapeHtml(category.eyebrow)} · checked ${escapeHtml(checkedAtDisplay)}</p>
          <h1>${escapeHtml(category.h1)}</h1>
          <p class="lede">${escapeHtml(category.intro)}</p>
          <div class="hero-actions"><a class="button" href="#shortlist">Compare ${products.length} picks</a><a class="button secondary" href="${category.relatedGuide}">${escapeHtml(category.relatedGuideLabel)}</a></div>
        </div>
        ${categoryPicture(category)}
      </div>
    </header>

    <section class="section compact">
      <div class="container">
        <div class="callout affiliate-status" data-affiliate-status="inactive"><strong>Research status: not hands-on tested and not monetized</strong><p>Splintercat checked published specifications and fit constraints against the linked sources. Retailer links are ordinary convenience links; we currently earn no commission and show no copied Amazon price, rank, star rating, or stock claim.</p></div>
        <dl class="category-fact-strip">${factCards}</dl>
      </div>
    </section>

    <section class="section section-cream catalog-section" id="shortlist">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow">Answer first</p><h2>Pick the job before the product.</h2><p class="lede">The labels below are use-case conclusions from published facts, not universal rankings or hands-on verdicts.</p></div><p class="catalog-count">${products.length} evidence records</p></div>
        <div class="table-scroll"><table class="comparison-table"><caption>Research picks compared by format, one key fact, and intended fit</caption><thead><tr><th scope="col">Product</th><th scope="col">Format</th><th scope="col">Key fact</th><th scope="col">Who it may fit</th></tr></thead><tbody>${rows}</tbody></table></div>
        <div class="catalog-grid">${products.map(categoryCard).join("\n")}</div>
      </div>
    </section>

    <section class="section catalog-method-section">
      <div class="container article-layout">
        <article class="article-body">
          <p class="eyebrow">How we selected</p>
          <h2>A research shortlist with a visible evidence boundary.</h2>
          <ul>${criteria}</ul>
          <h2>${escapeHtml(category.safetyTitle)}</h2>
          <p>${escapeHtml(category.safetyCopy)}</p>
          <h3>Behavior and safety sources</h3>
          <ul class="source-list">${sources}</ul>
          <p>Product specifications can change. Confirm the exact model, package, dimensions, instructions, and retailer destination before buying. A manufacturer statement is evidence of what the maker publishes—not independent proof of performance.</p>
        </article>
        <aside class="toc" aria-label="Category navigation"><strong>Keep browsing</strong><ol><li><a href="/gear/">All popular gear</a></li><li><a href="/gear/cat-toys/">Cat toys</a></li><li><a href="/gear/scratching-posts/">Scratching posts</a></li><li><a href="/gear/cat-trees-small-spaces/">Small-space cat trees</a></li><li><a href="${category.relatedGuide}">${escapeHtml(category.relatedGuideLabel)}</a></li><li><a href="/methodology/">Research method</a></li></ol></aside>
      </div>
    </section>
  </main>
  ${footer()}
  <script src="/script.js" defer></script>
</body>
</html>\n`;
}

function productPage(product) {
  const category = categories[product.category];
  const path = `/gear/products/${product.slug}/`;
  const canonical = `${origin}${path}`;
  const title = `${product.name}: Specs & Fit | Splintercat`;
  const productEntity = {
    "@type": "Product",
    "@id": `${canonical}#product`,
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    ...(product.model ? { model: product.model } : {}),
    category: product.categoryName,
    description: product.shortAnswer,
    url: canonical,
    additionalProperty: product.specs.map((spec) => ({ "@type": "PropertyValue", name: spec.label, value: spec.value }))
  };
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Article", "WebPage"],
        "@id": canonical,
        url: canonical,
        name: title.replace(" | Splintercat", ""),
        headline: product.name,
        description: product.shortAnswer,
        datePublished: publishedAt,
        dateModified: dataset.checkedAt,
        author: { "@type": "Organization", name: "Splintercat Editorial Team", url: `${origin}/editorial-policy/#research-desk` },
        publisher: { "@id": `${origin}/#organization` },
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@id": `${canonical}#product` },
        mainEntity: { "@id": `${canonical}#product` }
      },
      productEntity,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "Popular gear", item: `${origin}/gear/` },
          { "@type": "ListItem", position: 3, name: product.categoryName, item: `${origin}${category.path}` },
          { "@type": "ListItem", position: 4, name: product.name, item: canonical }
        ]
      }
    ]
  };

  const specs = product.specs.map((spec) => `<div><dt>${escapeHtml(spec.label)}</dt><dd>${escapeHtml(spec.value)}</dd></div>`).join("");
  const checks = product.buyingChecks.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const cautions = product.cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const secondarySource = product.secondarySourceUrl ? `<li><a href="${escapeHtml(product.secondarySourceUrl)}" rel="noopener noreferrer" target="_blank">${escapeHtml(product.secondarySourceLabel)} <span aria-hidden="true">↗</span></a></li>` : "";
  const sourceNote = product.sourceNote ? `<p><strong>Source note:</strong> ${escapeHtml(product.sourceNote)}</p>` : "";
  const siblings = dataset.products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);

  return `<!DOCTYPE html>
<html lang="en">
${head({ title, description: product.shortAnswer, path, image: category.image, imageSmall: category.imageSmall, imageAlt: category.imageAlt, type: "article", preloadImage: false, schema })}
<body>
  <!-- Generated by scripts/build-product-catalog.mjs from data/products.json. -->
  <a class="skip-link" href="#main-content">Skip to main content</a>
  ${nav()}
  <main id="main-content">
    <header class="product-record-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/gear/">Popular gear</a></li><li><a href="${category.path}">${escapeHtml(product.categoryName)}</a></li><li aria-current="page">${escapeHtml(product.name)}</li></ol></nav>
        <div class="record-badges"><span class="content-label">${escapeHtml(product.pickLabel)}</span><span class="content-label orange">Marketplace researched</span><span class="content-label gold">Sources checked ${escapeHtml(checkedAtDisplay)}</span></div>
        <p class="eyebrow">${escapeHtml(productDescriptor(product))}</p>
        <h1>${escapeHtml(product.name)}</h1>
        <p class="lede"><strong>The short answer:</strong> ${escapeHtml(product.shortAnswer)}</p>
        <div class="article-byline"><span>By Splintercat Editorial Team</span><span>Not hands-on tested</span><span>Sources checked ${escapeHtml(checkedAtDisplay)}</span><a href="/methodology/">Methodology</a></div>
      </div>
    </header>

    <section class="section compact record-overview">
      <div class="container record-overview-grid">
        ${categoryPicture(category)}
        <div>
          <p class="eyebrow">Product evidence record</p>
          <h2>What this format is designed to do</h2>
          <p>${escapeHtml(product.summary)}</p>
          <dl class="record-spec-grid">${specs}</dl>
          <div class="fit-split"><div><strong>May suit</strong><p>${escapeHtml(product.bestFor)}</p></div><div><strong>Skip if</strong><p>${escapeHtml(product.skipIf)}</p></div></div>
        </div>
      </div>
    </section>

    <section class="section section-cream record-details">
      <div class="container article-layout">
        <article class="article-body">
          <h2 id="before-buying">Check before buying</h2>
          <ul>${checks}</ul>
          <h2 id="safety">Safety and failure checks</h2>
          <ul>${cautions}</ul>
          <h2 id="maintenance">Maintenance burden</h2>
          <p>${escapeHtml(product.maintenance)}</p>

          <section class="commerce-module" aria-labelledby="retailer-heading" data-commerce-module="${escapeHtml(product.slug)}">
            <p class="eyebrow">Current destinations</p>
            <h2 id="retailer-heading">Check the exact model at the retailer.</h2>
            <div class="callout affiliate-status" data-affiliate-status="inactive"><strong>These links are not monetized</strong><p>Splintercat currently earns no commission. Prices, availability, seller, model, and package can change; verify all five on the destination page.</p></div>
            <div class="retailer-actions">
              <a class="button" href="${escapeHtml(product.amazonUs)}" rel="noopener noreferrer" target="_blank" data-commerce-link data-product="${escapeHtml(product.slug)}" data-product-name="${escapeHtml(product.name)}" data-product-category="${escapeHtml(product.category)}" data-market="US" data-offer-id="${escapeHtml(product.asinUs || "")}" data-destination-type="${product.asinUs ? "exact-asin" : "search"}" data-link-version="${escapeHtml(dataset.version)}">${retailerVerb(product.amazonUs)} Amazon.com <span aria-hidden="true">↗</span></a>
              <a class="button secondary" href="${escapeHtml(product.amazonCa)}" rel="noopener noreferrer" target="_blank" data-commerce-link data-product="${escapeHtml(product.slug)}" data-product-name="${escapeHtml(product.name)}" data-product-category="${escapeHtml(product.category)}" data-market="CA" data-offer-id="" data-destination-type="search" data-link-version="${escapeHtml(dataset.version)}">${retailerVerb(product.amazonCa)} Amazon.ca <span aria-hidden="true">↗</span></a>
            </div>
            <p class="market-source">U.S. destination: ${product.asinUs ? `exact ASIN ${escapeHtml(product.asinUs)}` : "exact-name search"}. Canada destination is a search when an exact Canadian model/ASIN was not independently verified.</p>
          </section>

          <h2 id="evidence">Evidence ledger</h2>
          <p>The product conclusion above comes from published specifications and category-fit analysis. It is not a hands-on review, a durability guarantee, or a claim that the product will suit every cat.</p>
          <ul class="source-list">
            <li><a href="${escapeHtml(product.manufacturerUrl)}" rel="noopener noreferrer" target="_blank">${escapeHtml(product.manufacturerLabel)} <span aria-hidden="true">↗</span></a></li>
            ${secondarySource}
            <li><a href="${category.safetySources[0][1]}" rel="noopener noreferrer" target="_blank">${escapeHtml(category.safetySources[0][0])} <span aria-hidden="true">↗</span></a></li>
          </ul>
          ${sourceNote}
          <p><strong>Research boundary:</strong> no Amazon price, rating, review count, sales rank, or stock status is stored on this page. Those facts are volatile and should be checked live.</p>
        </article>
        <aside class="toc" aria-label="On this page"><strong>On this page</strong><ol><li><a href="#before-buying">Before buying</a></li><li><a href="#safety">Safety</a></li><li><a href="#maintenance">Maintenance</a></li><li><a href="#retailer-heading">Retailer links</a></li><li><a href="#evidence">Evidence</a></li></ol><hr><strong>Related</strong><ol><li><a href="${category.path}">Compare ${escapeHtml(product.categoryName.toLowerCase())}</a></li><li><a href="${product.relatedGuide}">${escapeHtml(product.relatedGuideLabel)}</a></li></ol></aside>
      </div>
    </section>

    <section class="section compact related-records">
      <div class="container"><div class="section-heading"><div><p class="eyebrow">Nearby records</p><h2>Compare the alternative format.</h2></div><a class="text-link" href="${category.path}">Open the full shortlist</a></div><div class="mini-record-grid">${siblings.map((item) => `<a href="/gear/products/${escapeHtml(item.slug)}/"><span>${escapeHtml(item.pickLabel)}</span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.format)}</small></a>`).join("")}</div></div>
    </section>
  </main>
  ${footer()}
  <script src="/script.js" defer></script>
</body>
</html>\n`;
}

async function save(relativePath, content) {
  const destination = join(root, relativePath);
  await mkdir(dirname(destination), { recursive: true });
  const normalized = content.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");
  await writeFile(destination, normalized, "utf8");
}

for (const categoryKey of Object.keys(categories)) {
  await save(join("gear", categoryKey, "index.html"), categoryPage(categoryKey));
}

for (const product of dataset.products) {
  await save(join("gear", "products", product.slug, "index.html"), productPage(product));
}

console.log(`Built ${Object.keys(categories).length} category pages and ${dataset.products.length} product records from data/products.json.`);
