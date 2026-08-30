import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const ORIGIN = "https://splintercatgear.com";
const errors = [];
const warnings = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", "node_modules", "seo"].includes(entry.name)) return [];
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function relative(file) {
  return path.relative(ROOT, file).replaceAll("\\", "/");
}

function routeFor(file) {
  const name = relative(file);
  if (name === "index.html") return "/";
  if (name.endsWith("/index.html")) return `/${name.slice(0, -"index.html".length)}`;
  return `/${name}`;
}

function decode(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function stripMarkup(value = "") {
  return decode(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function matches(source, expression) {
  return [...source.matchAll(expression)];
}

function attribute(markup, name) {
  const match = markup.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return match ? decode(match[1] ?? match[2]) : null;
}

function metaValues(source, key, value) {
  return matches(source, /<meta\b[^>]*>/gi)
    .filter((tag) => attribute(tag[0], key)?.toLowerCase() === value.toLowerCase())
    .map((tag) => attribute(tag[0], "content"))
    .filter(Boolean);
}

function schemaTypes(entity) {
  const value = entity?.["@type"];
  return new Set(Array.isArray(value) ? value : value ? [value] : []);
}

function schemaReference(value) {
  if (typeof value === "string") return value;
  return value?.["@id"] || "";
}

function schemaEntities(source) {
  const entities = [];
  for (const match of matches(source, /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const document = JSON.parse(match[1]);
      const documents = Array.isArray(document) ? document : [document];
      for (const item of documents) {
        if (Array.isArray(item?.["@graph"])) entities.push(...item["@graph"]);
        else if (item && typeof item === "object") entities.push(item);
      }
    } catch {
      // The page-level JSON-LD parser reports the actionable syntax error.
    }
  }
  return entities;
}

function imageDimensions(file) {
  const bytes = fs.readFileSync(file);

  if (bytes.length >= 24 && bytes.toString("ascii", 1, 4) === "PNG") {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }

  if (bytes.length >= 12 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = bytes[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      if (marker === 0xda) break;
      const length = bytes.readUInt16BE(offset + 2);
      if (length < 2 || offset + length + 2 > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
      }
      offset += length + 2;
    }
  }

  if (bytes.length >= 30 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    const chunk = bytes.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return { width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1 };
    }
    if (chunk === "VP8L" && bytes[20] === 0x2f) {
      const b1 = bytes[21];
      const b2 = bytes[22];
      const b3 = bytes[23];
      const b4 = bytes[24];
      return {
        width: 1 + (((b2 & 0x3f) << 8) | b1),
        height: 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | (b2 >> 6))
      };
    }
    if (chunk === "VP8 ") {
      for (let offset = 20; offset + 6 < Math.min(bytes.length, 64); offset += 1) {
        if (bytes[offset] === 0x9d && bytes[offset + 1] === 0x01 && bytes[offset + 2] === 0x2a) {
          return {
            width: bytes.readUInt16LE(offset + 3) & 0x3fff,
            height: bytes.readUInt16LE(offset + 5) & 0x3fff
          };
        }
      }
    }
  }

  return null;
}

function routeToFile(route) {
  const pathname = route.split("#")[0].split("?")[0];
  const clean = decodeURIComponent(pathname);
  if (clean === "/") return path.join(ROOT, "index.html");
  if (clean.endsWith("/")) return path.join(ROOT, clean.slice(1), "index.html");
  const direct = path.join(ROOT, clean.slice(1));
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  return path.join(ROOT, clean.slice(1), "index.html");
}

function addError(file, message) {
  errors.push(`${relative(file)}: ${message}`);
}

const htmlFiles = walk(ROOT).filter((file) => file.endsWith(".html"));
const pages = [];

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, "utf8");
  const route = routeFor(file);
  const noindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(source);
  const titles = matches(source, /<title>([\s\S]*?)<\/title>/gi).map((item) => stripMarkup(item[1]));
  const descriptions = matches(source, /<meta\s+[^>]*name=["']description["'][^>]*>/gi).map((item) => attribute(item[0], "content"));
  const canonicals = matches(source, /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi).map((item) => attribute(item[0], "href"));
  const headings = matches(source, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map((item) => stripMarkup(item[1]));
  const ids = matches(source, /\bid=["']([^"']+)["']/gi).map((item) => item[1]);
  const metaTags = matches(source, /<meta\b[^>]*>/gi).map((item) => item[0]);
  const metaContent = (key, value) => metaTags
    .filter((tag) => attribute(tag, key)?.toLowerCase() === value.toLowerCase())
    .map((tag) => attribute(tag, "content"))
    .filter(Boolean);

  if (!/<html\s+[^>]*lang=["']en(?:-[a-z]{2})?["']/i.test(source)) addError(file, "missing an English html lang attribute");
  if (!/<meta\s+charset=["']utf-8["']/i.test(source)) addError(file, "missing UTF-8 charset declaration");
  if (!/<meta\s+name=["']viewport["']/i.test(source)) addError(file, "missing viewport metadata");
  if (titles.length !== 1 || !titles[0]) addError(file, `expected one non-empty title; found ${titles.length}`);
  if (!noindex && (descriptions.length !== 1 || !descriptions[0])) addError(file, `expected one non-empty meta description; found ${descriptions.length}`);
  if (headings.length !== 1 || !headings[0]) addError(file, `expected one non-empty H1; found ${headings.length}`);

  if (!noindex) {
    if (canonicals.length !== 1 || !canonicals[0]) {
      addError(file, `expected one canonical URL; found ${canonicals.length}`);
    } else {
      const expected = `${ORIGIN}${route}`;
      if (canonicals[0] !== expected) addError(file, `canonical is ${canonicals[0]}; expected ${expected}`);
      if (!canonicals[0].startsWith("https://")) addError(file, "canonical must use HTTPS");
    }
    if (!/<meta\s+name=["']robots["'][^>]*max-image-preview:large/i.test(source)) {
      warnings.push(`${relative(file)}: consider max-image-preview:large in robots metadata`);
    }
    const socialFields = ["og:title", "og:description", "og:url", "og:image", "og:image:alt"];
    for (const field of socialFields) {
      const values = metaContent("property", field);
      if (values.length !== 1) addError(file, `expected one ${field} value; found ${values.length}`);
    }
    const ogUrl = metaContent("property", "og:url")[0];
    if (ogUrl && canonicals[0] && ogUrl !== canonicals[0]) addError(file, `og:url does not match canonical: ${ogUrl}`);
    if (metaContent("name", "twitter:card").length !== 1) addError(file, "expected one twitter:card value");
  }

  if (titles[0] && (titles[0].length < 25 || titles[0].length > 65)) {
    warnings.push(`${relative(file)}: title length is ${titles[0].length} characters`);
  }
  if (descriptions[0] && (descriptions[0].length < 70 || descriptions[0].length > 170)) {
    warnings.push(`${relative(file)}: description length is ${descriptions[0].length} characters`);
  }

  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) addError(file, `duplicate id values: ${[...new Set(duplicateIds)].join(", ")}`);

  for (const match of matches(source, /<img\b[^>]*>/gi)) {
    const markup = match[0];
    if (attribute(markup, "alt") === null) addError(file, `image is missing alt: ${markup.slice(0, 120)}`);
    if (!attribute(markup, "width") || !attribute(markup, "height")) addError(file, `image is missing intrinsic width/height: ${markup.slice(0, 120)}`);
    const imagePath = attribute(markup, "src");
    if (imagePath?.startsWith("/")) {
      const target = path.join(ROOT, imagePath.slice(1));
      if (!fs.existsSync(target)) addError(file, `image does not exist: ${imagePath}`);
    }
  }

  for (const match of matches(source, /<source\b[^>]*>/gi)) {
    const srcset = attribute(match[0], "srcset");
    if (!srcset) continue;
    for (const candidate of srcset.split(",")) {
      const candidatePath = candidate.trim().split(/\s+/)[0];
      if (candidatePath.startsWith("/") && !fs.existsSync(path.join(ROOT, candidatePath.slice(1)))) {
        addError(file, `responsive image candidate does not exist: ${candidatePath}`);
      }
    }
  }

  for (const match of matches(source, /<link\b[^>]*rel=["']preload["'][^>]*>/gi)) {
    const href = attribute(match[0], "href");
    if (href?.startsWith("/") && !fs.existsSync(path.join(ROOT, href.slice(1)))) addError(file, `preload does not exist: ${href}`);
  }

  for (const match of matches(source, /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      addError(file, `invalid JSON-LD: ${error.message}`);
    }
  }

  if (/\bog:type=["']?\s*content=/i.test(source)) addError(file, "Open Graph properties appear malformed");
  if (/content=["']article["']/i.test(source) && /property=["']og:type["']/i.test(source)) {
    if (!/property=["']article:published_time["']/i.test(source)) warnings.push(`${relative(file)}: article:published_time is missing`);
    if (!/property=["']article:modified_time["']/i.test(source)) warnings.push(`${relative(file)}: article:modified_time is missing`);
  }

  for (const link of matches(source, /<a\b[^>]*href=["'][^"']+["'][^>]*>/gi)) {
    const href = attribute(link[0], "href");
    if (!href) continue;
    if (/^https?:\/\/(?:www\.)?amazon\.(?:com|ca)\//i.test(href) && /[?&]tag=/i.test(href)) {
      const rel = (attribute(link[0], "rel") || "").split(/\s+/);
      if (!rel.includes("sponsored")) addError(file, `tagged Amazon link is missing rel=sponsored: ${href}`);
    }
    if (/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    const absoluteRoute = href.startsWith("/")
      ? href
      : new URL(href, `${ORIGIN}${route}`).pathname + new URL(href, `${ORIGIN}${route}`).hash;
    const targetFile = routeToFile(absoluteRoute);
    if (!fs.existsSync(targetFile)) {
      addError(file, `internal link does not resolve: ${href}`);
      continue;
    }
    const fragment = absoluteRoute.includes("#") ? decodeURIComponent(absoluteRoute.split("#")[1]) : "";
    if (fragment && targetFile.endsWith(".html")) {
      const targetSource = fs.readFileSync(targetFile, "utf8");
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`\\b(?:id|name)=["']${escaped}["']`, "i").test(targetSource)) {
        addError(file, `internal fragment does not resolve: ${href}`);
      }
    }
  }

  pages.push({ file, route, source, noindex, title: titles[0], description: descriptions[0], canonical: canonicals[0] });
}

for (const field of ["title", "description", "canonical"]) {
  const indexable = pages.filter((page) => !page.noindex && page[field]);
  const groups = new Map();
  for (const page of indexable) groups.set(page[field], [...(groups.get(page[field]) || []), relative(page.file)]);
  for (const [value, files] of groups) {
    if (files.length > 1) errors.push(`duplicate ${field} across ${files.join(", ")}: ${value}`);
  }
}

for (const target of pages.filter((page) => !page.noindex && page.route.startsWith("/guides/") && page.route !== "/guides/")) {
  const incoming = pages.filter((sourcePage) => {
    if (sourcePage.file === target.file || sourcePage.noindex) return false;
    return matches(sourcePage.source, /<a\b[^>]*href=["'][^"']+["'][^>]*>/gi).some((match) => {
      const href = attribute(match[0], "href");
      if (!href || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(href)) return false;
      const resolved = new URL(href, `${ORIGIN}${sourcePage.route}`);
      return resolved.pathname === target.route;
    });
  });
  if (incoming.length < 3) addError(target.file, `only ${incoming.length} other indexable pages link to this guide; expected at least 3`);
}

const MIN_PRODUCT_COUNT = 9;
const PRODUCT_IMAGE_FIELDS = ["kind", "src", "srcSmall", "fallback", "width", "height", "alt", "caption", "rightsBasis", "credit", "provenanceRecord"];
const productDataPath = path.join(ROOT, "data", "products.json");
if (!fs.existsSync(productDataPath)) {
  errors.push("data/products.json is missing");
} else {
  try {
    const productData = JSON.parse(fs.readFileSync(productDataPath, "utf8"));
    const products = Array.isArray(productData.products) ? productData.products : [];
    const slugs = products.map((product) => product.slug).filter(Boolean);
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    const expectedCategories = new Set(["cat-toys", "scratching-posts", "cat-trees-small-spaces"]);
    const productImageOwners = new Map();

    if (!products.length) errors.push("data/products.json contains no products");
    if (products.length < MIN_PRODUCT_COUNT) errors.push(`data/products.json must contain at least ${MIN_PRODUCT_COUNT} product records; found ${products.length}`);
    if (duplicateSlugs.length) errors.push(`data/products.json contains duplicate slugs: ${[...new Set(duplicateSlugs)].join(", ")}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(productData.checkedAt || "")) errors.push("data/products.json checkedAt must use YYYY-MM-DD");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(productData.publishedAt || "")) errors.push("data/products.json publishedAt must use YYYY-MM-DD");

    for (const category of expectedCategories) {
      const categoryFile = path.join(ROOT, "gear", category, "index.html");
      if (!fs.existsSync(categoryFile)) errors.push(`generated category page is missing: /gear/${category}/`);
      if (!products.some((product) => product.category === category)) errors.push(`product dataset has no records for category: ${category}`);
    }

    for (const product of products) {
      const required = ["slug", "category", "brand", "name", "format", "shortAnswer", "bestFor", "skipIf", "manufacturerUrl", "amazonUs", "amazonCa"];
      for (const field of required) {
        if (!product[field]) errors.push(`data/products.json product ${product.slug || "(missing slug)"} is missing ${field}`);
      }
      if (!expectedCategories.has(product.category)) errors.push(`data/products.json product ${product.slug} has unknown category ${product.category}`);
      if (!Array.isArray(product.specs) || product.specs.length < 2) errors.push(`data/products.json product ${product.slug} needs at least two specs`);
      if (!Array.isArray(product.cautions) || product.cautions.length < 1) errors.push(`data/products.json product ${product.slug} needs at least one caution`);

      const productLabel = product.slug || "(missing slug)";
      const image = product.image;
      if (!image || typeof image !== "object" || Array.isArray(image)) {
        errors.push(`data/products.json product ${productLabel} is missing its owned-editorial image object`);
      } else {
        for (const field of PRODUCT_IMAGE_FIELDS) {
          if (image[field] === undefined || image[field] === null || image[field] === "") {
            errors.push(`data/products.json product ${productLabel} image is missing ${field}`);
          }
        }
        if (image.kind !== "owned-editorial-illustration") {
          errors.push(`data/products.json product ${productLabel} image kind must be owned-editorial-illustration`);
        }
        if (image.rightsBasis !== "owned") {
          errors.push(`data/products.json product ${productLabel} image rightsBasis must be owned`);
        }
        if (image.credit !== "Splintercat") {
          errors.push(`data/products.json product ${productLabel} image credit must be Splintercat`);
        }
        for (const field of ["alt", "caption", "provenanceRecord"]) {
          if (typeof image[field] !== "string" || !image[field].trim()) {
            errors.push(`data/products.json product ${productLabel} image ${field} must be non-empty text`);
          }
        }
        if (!Number.isInteger(image.width) || image.width !== 1024 || !Number.isInteger(image.height) || image.height !== 1024) {
          errors.push(`data/products.json product ${productLabel} image dimensions must be 1024 x 1024`);
        }

        const pathRules = {
          src: /\.webp$/i,
          srcSmall: /\.webp$/i,
          fallback: /\.jpe?g$/i
        };
        const ownPaths = new Set();
        for (const [field, extension] of Object.entries(pathRules)) {
          const value = image[field];
          if (typeof value !== "string" || !value.startsWith("/assets/") || value.includes("..") || /[?#]/.test(value)) {
            errors.push(`data/products.json product ${productLabel} image ${field} must be a clean root-relative /assets/ path`);
            continue;
          }
          if (!extension.test(value)) errors.push(`data/products.json product ${productLabel} image ${field} has the wrong file type: ${value}`);
          if (product.slug && !value.includes(product.slug)) errors.push(`data/products.json product ${productLabel} image ${field} must include the product slug`);
          if (ownPaths.has(value)) errors.push(`data/products.json product ${productLabel} reuses the same file for multiple image variants: ${value}`);
          ownPaths.add(value);

          const existingOwner = productImageOwners.get(value);
          if (existingOwner && existingOwner !== productLabel) {
            errors.push(`data/products.json products ${existingOwner} and ${productLabel} share the same image asset: ${value}`);
          } else {
            productImageOwners.set(value, productLabel);
          }

          const file = path.join(ROOT, value.slice(1));
          if (!fs.existsSync(file)) {
            errors.push(`data/products.json product ${productLabel} image file does not exist: ${value}`);
            continue;
          }
          const dimensions = imageDimensions(file);
          if (!dimensions) {
            errors.push(`data/products.json product ${productLabel} image dimensions could not be read: ${value}`);
            continue;
          }
          if (field === "srcSmall") {
            if (dimensions.width >= image.width || dimensions.height >= image.height || dimensions.width !== dimensions.height) {
              errors.push(`data/products.json product ${productLabel} image srcSmall must be a smaller square variant; found ${dimensions.width} x ${dimensions.height}`);
            }
          } else if (dimensions.width !== image.width || dimensions.height !== image.height) {
            errors.push(`data/products.json product ${productLabel} image ${field} is ${dimensions.width} x ${dimensions.height}; expected ${image.width} x ${image.height}`);
          }
        }
      }

      for (const urlField of ["manufacturerUrl", "secondarySourceUrl", "amazonUs", "amazonCa"]) {
        if (!product[urlField]) continue;
        try {
          const parsed = new URL(product[urlField]);
          if (parsed.protocol !== "https:") errors.push(`data/products.json product ${product.slug} ${urlField} must use HTTPS`);
        } catch {
          errors.push(`data/products.json product ${product.slug} has an invalid ${urlField}`);
        }
      }
      if (product.asinUs) {
        if (!/^[A-Z0-9]{10}$/.test(product.asinUs)) errors.push(`data/products.json product ${product.slug} has an invalid US ASIN`);
        if (!new URL(product.amazonUs).pathname.toUpperCase().includes(`/DP/${product.asinUs}`)) {
          errors.push(`data/products.json product ${product.slug} US URL does not match ASIN ${product.asinUs}`);
        }
      }

      const productRoute = `/gear/products/${product.slug}/`;
      const productFile = routeToFile(productRoute);
      if (!fs.existsSync(productFile)) {
        errors.push(`generated product page is missing: ${productRoute}`);
        continue;
      }
      const source = fs.readFileSync(productFile, "utf8");
      if (!source.includes("Generated by scripts/build-product-catalog.mjs")) addError(productFile, "missing generated-page provenance comment");
      if (!source.includes(`data-commerce-module="${product.slug}"`)) addError(productFile, "missing matching commerce-module identifier");
      if (/"(?:offers|aggregateRating)"\s*:/i.test(source)) addError(productFile, "must not publish offer or aggregate-rating schema without a live approved data source");

      if (image && typeof image === "object" && !Array.isArray(image)) {
        const expectedImageUrl = `${ORIGIN}${image.fallback}`;
        const renderedImages = matches(source, /<img\b[^>]*>/gi).map((match) => match[0]);
        const productImage = renderedImages.find((markup) => attribute(markup, "src") === image.fallback);
        if (!productImage) {
          addError(productFile, `does not render the approved product image fallback ${image.fallback}`);
        } else {
          if (attribute(productImage, "loading") !== "lazy") addError(productFile, "product evidence image must use loading=lazy");
          if (attribute(productImage, "alt") !== image.alt) addError(productFile, "product evidence image alt does not match data/products.json");
          if (Number(attribute(productImage, "width")) !== image.width || Number(attribute(productImage, "height")) !== image.height) {
            addError(productFile, "product evidence image intrinsic dimensions do not match data/products.json");
          }
        }

        const responsiveSource = matches(source, /<source\b[^>]*>/gi)
          .map((match) => attribute(match[0], "srcset") || "")
          .find((srcset) => srcset.includes(image.src) && srcset.includes(image.srcSmall));
        if (!responsiveSource) addError(productFile, "product evidence image is missing its approved responsive WebP sources");

        const captions = matches(source, /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/gi).map((match) => stripMarkup(match[1]));
        if (!captions.includes(image.caption)) addError(productFile, "product evidence image caption does not match data/products.json");

        const expectedMeta = [
          ["property", "og:image", expectedImageUrl],
          ["property", "og:image:width", String(image.width)],
          ["property", "og:image:height", String(image.height)],
          ["property", "og:image:alt", image.alt],
          ["name", "twitter:image", expectedImageUrl],
          ["name", "twitter:image:alt", image.alt]
        ];
        for (const [key, name, expected] of expectedMeta) {
          const values = metaValues(source, key, name);
          if (values.length !== 1 || values[0] !== expected) {
            addError(productFile, `${name} must equal ${expected}; found ${values.length === 1 ? values[0] : `${values.length} values`}`);
          }
        }

        const entities = schemaEntities(source);
        const productEntities = entities.filter((entity) => schemaTypes(entity).has("Product"));
        if (productEntities.length !== 1) addError(productFile, `expected one Product schema entity; found ${productEntities.length}`);
        for (const entity of productEntities) {
          if (Object.prototype.hasOwnProperty.call(entity, "image")) {
            addError(productFile, "owned editorial illustration must not be claimed as Product.image");
          }
        }

        const articlePage = entities.find((entity) => {
          const types = schemaTypes(entity);
          return types.has("Article") && types.has("WebPage");
        });
        if (!articlePage) addError(productFile, "missing combined Article/WebPage schema entity");

        const imageObjects = entities.filter((entity) => schemaTypes(entity).has("ImageObject"));
        const imageObject = imageObjects.find((entity) => entity.contentUrl === expectedImageUrl);
        if (!imageObject) {
          addError(productFile, `missing ImageObject for ${expectedImageUrl}`);
        } else {
          if (!imageObject["@id"]) addError(productFile, "product-page ImageObject is missing @id");
          if (imageObject.url && imageObject.url !== expectedImageUrl) addError(productFile, "product-page ImageObject url does not match contentUrl");
          if (Number(imageObject.width) !== image.width || Number(imageObject.height) !== image.height) addError(productFile, "product-page ImageObject dimensions do not match image data");
          if (imageObject.caption !== image.caption) addError(productFile, "product-page ImageObject caption does not match image data");
          if (imageObject.creditText !== image.credit) addError(productFile, "product-page ImageObject creditText does not match image data");
          if (articlePage) {
            const imageId = imageObject["@id"];
            if (schemaReference(articlePage.image) !== imageId) addError(productFile, "Article/WebPage image does not reference the approved ImageObject");
            if (schemaReference(articlePage.primaryImageOfPage) !== imageId) addError(productFile, "Article/WebPage primaryImageOfPage does not reference the approved ImageObject");
          }
        }

        const categoryFile = path.join(ROOT, "gear", product.category, "index.html");
        if (fs.existsSync(categoryFile)) {
          const categorySource = fs.readFileSync(categoryFile, "utf8");
          const categoryImage = matches(categorySource, /<img\b[^>]*>/gi)
            .map((match) => match[0])
            .find((markup) => attribute(markup, "src") === image.fallback);
          if (!categoryImage) {
            addError(categoryFile, `category card does not render product image ${image.fallback}`);
          } else if (attribute(categoryImage, "loading") !== "lazy") {
            addError(categoryFile, `category-card image for ${productLabel} must use loading=lazy`);
          }
          const categoryResponsiveSource = matches(categorySource, /<source\b[^>]*>/gi)
            .map((match) => attribute(match[0], "srcset") || "")
            .find((srcset) => srcset.includes(image.src) && srcset.includes(image.srcSmall));
          if (!categoryResponsiveSource) addError(categoryFile, `category-card image for ${productLabel} is missing approved responsive WebP sources`);
        }
      }
    }

    const generatedProductPages = pages.filter((page) => page.route.startsWith("/gear/products/"));
    if (generatedProductPages.length !== products.length) {
      errors.push(`generated product page count (${generatedProductPages.length}) does not match product dataset count (${products.length})`);
    }
  } catch (error) {
    errors.push(`data/products.json is invalid: ${error.message}`);
  }
}

const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
const sitemapUrls = matches(sitemap, /<loc>([^<]+)<\/loc>/gi).map((item) => decode(item[1]));
const expectedUrls = pages.filter((page) => !page.noindex && page.canonical).map((page) => page.canonical).sort();
const missingFromSitemap = expectedUrls.filter((url) => !sitemapUrls.includes(url));
const extraInSitemap = sitemapUrls.filter((url) => !expectedUrls.includes(url));
if (missingFromSitemap.length) errors.push(`sitemap is missing: ${missingFromSitemap.join(", ")}`);
if (extraInSitemap.length) errors.push(`sitemap contains non-indexable or unknown URLs: ${extraInSitemap.join(", ")}`);
if (new Set(sitemapUrls).size !== sitemapUrls.length) errors.push("sitemap contains duplicate URLs");
for (const imageUrl of matches(sitemap, /<image:loc>([^<]+)<\/image:loc>/gi).map((item) => decode(item[1]))) {
  if (!imageUrl.startsWith(`${ORIGIN}/`)) errors.push(`sitemap image is off the canonical host: ${imageUrl}`);
  const imageFile = path.join(ROOT, new URL(imageUrl).pathname.slice(1));
  if (!fs.existsSync(imageFile)) errors.push(`sitemap image does not exist: ${imageUrl}`);
}

const robots = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) errors.push("robots.txt does not declare the canonical sitemap URL");
const feedPath = path.join(ROOT, "feed.xml");
if (!fs.existsSync(feedPath)) {
  errors.push("feed.xml is missing");
} else {
  const feed = fs.readFileSync(feedPath, "utf8");
  const feedUrls = matches(feed, /<guid\s+isPermaLink=["']true["']>([^<]+)<\/guid>/gi).map((item) => decode(item[1]));
  const guideUrls = pages
    .filter((page) => !page.noindex && page.route.startsWith("/guides/") && page.route !== "/guides/")
    .map((page) => page.canonical)
    .sort();
  const missingFromFeed = guideUrls.filter((url) => !feedUrls.includes(url));
  if (missingFromFeed.length) errors.push(`RSS feed is missing published guides: ${missingFromFeed.join(", ")}`);
}

if (warnings.length) {
  console.log(`SEO audit warnings (${warnings.length}):`);
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${pages.length} HTML pages, ${expectedUrls.length} indexable URLs, ${sitemapUrls.length} sitemap entries.`);
