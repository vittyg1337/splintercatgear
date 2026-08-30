import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const errors = [];
const requireAffiliate = process.argv.includes("--require-affiliate");
let amazonLinks = 0;
let affiliateLinks = 0;

function normalizedEmbeddedUrls(source) {
  const normalized = source
    .replaceAll("&amp;", "&")
    .replace(/\\u002[fF]/g, "/")
    .replace(/\\u003[aA]/g, ":")
    .replace(/\\\//g, "/");

  return [...normalized.matchAll(/(?:https?:)?\/\/[a-z0-9.-]+(?::\d+)?(?:[/?#][^"'<>\\\s)]*)?/gi)]
    .map((match) => match[0]);
}

function isAmazonImageHost(url) {
  try {
    const parsed = new URL(url.startsWith("//") ? `https:${url}` : url);
    const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
    return /(?:^|\.)(?:media-amazon|ssl-images-amazon|images-amazon)\.com$/.test(host)
      || /(?:^|\.)images\.amazon\.(?:com|ca)$/.test(host);
  } catch {
    return false;
  }
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    if (entry.isFile() && extname(entry.name) === ".html") files.push(path);
  }

  return files;
}

for (const file of await htmlFiles(root)) {
  const html = await readFile(file, "utf8");
  const name = relative(root, file).replaceAll("\\", "/");
  const anchors = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/gi)];
  let firstTaggedLink = -1;

  const amazonImageUrls = [...new Set(normalizedEmbeddedUrls(html).filter(isAmazonImageHost))];
  for (const imageUrl of amazonImageUrls) {
    errors.push(`${name}: Amazon-hosted image URL found in HTML, responsive markup, metadata, or JSON-LD; use owned/licensed art or an approved API workflow: ${imageUrl}`);
  }

  for (const anchor of anchors) {
    const [markup, href] = anchor;
    const isAmazon = /^https:\/\/(?:www\.)?amazon\.(?:com|ca)\//i.test(href);
    const isShortened = /^https:\/\/(?:amzn\.to|a\.co)\//i.test(href);

    if (isShortened) {
      errors.push(`${name}: shortened Amazon URL is not allowed: ${href}`);
      continue;
    }

    if (!isAmazon) continue;
    amazonLinks += 1;

    if (/\btag=/i.test(href)) {
      affiliateLinks += 1;
      if (firstTaggedLink < 0) firstTaggedLink = anchor.index;

      if (/(?:YOUR|TRACKING|PLACEHOLDER|EXAMPLE)[-_A-Z0-9]*-20/i.test(href)) {
        errors.push(`${name}: placeholder Amazon tracking ID found: ${href}`);
      }

      const rel = markup.match(/\brel="([^"]+)"/i)?.[1]?.split(/\s+/) ?? [];
      for (const required of ["sponsored", "nofollow", "noopener"]) {
        if (!rel.includes(required)) errors.push(`${name}: tagged Amazon link is missing rel="${required}": ${href}`);
      }

      const nearby = html.slice(anchor.index, anchor.index + markup.length + 180);
      if (!/\(paid link\)/i.test(nearby)) {
        errors.push(`${name}: tagged Amazon link needs a nearby “(paid link)” label: ${href}`);
      }
    }
  }

  if (firstTaggedLink >= 0) {
    const beforeFirstLink = html
      .slice(0, firstTaggedLink)
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<script\b[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[\s\S]*?<\/style>/gi, "");
    const statement = "As an Amazon Associate I earn from qualifying purchases.";
    if (!beforeFirstLink.includes(statement)) {
      errors.push(`${name}: required Amazon Associate statement must appear before the first tagged link.`);
    }
    if (!/class="[^"]*affiliate-status[^"]*"[^>]*data-affiliate-status="active"/i.test(beforeFirstLink)) {
      errors.push(`${name}: tagged links require a visible affiliate-status block marked active.`);
    }
  }
}

if (requireAffiliate && affiliateLinks === 0) {
  errors.push("Activation check failed: no tagged Amazon affiliate links were found.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Amazon link check passed: ${amazonLinks} retailer links, ${affiliateLinks} tagged affiliate links${requireAffiliate ? " (activation mode)" : ""}.`);
}
