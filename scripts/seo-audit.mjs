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
