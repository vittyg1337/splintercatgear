# Splintercat website

A dependency-free static website for `splintercatgear.com`.

Production hosting: GitHub Pages from the `main` branch, with `splintercatgear.com` as the custom domain.

## What is included

- Responsive, accessible homepage with an original SVG brand system and cinematic forest hero art
- Guide hub and a sourced indoor-cat setup guide
- Transparent testing methodology and content labels
- About, editorial, affiliate, privacy, accessibility, contact, and terms pages
- Canonical metadata, Open Graph metadata, JSON-LD, `robots.txt`, and XML sitemap
- Custom 404 page and optional static-host security headers

## Preview locally

From this directory, run any static server. For example:

```powershell
npx serve .
```

Do not open the HTML files directly if you want absolute links such as `/guides/` to work.

## Before public deployment

1. Enable `hello@splintercatgear.com` as a working mailbox or forwarder.
2. Have the owner review every page, especially the founder/story copy and legal-policy drafts.
3. Replace or supplement the organizational Research Desk byline with a real, public author or qualified reviewer when ready.
4. Confirm the production host returns a true HTTP 404 for `404.html`.
5. Redirect HTTP and `www` to `https://splintercatgear.com/`.
6. Verify the domain in Google Search Console and Bing Webmaster Tools, then submit `/sitemap.xml`.
7. Add real social-profile URLs to structured data only after the accounts are claimed.
8. Update the privacy and terms pages before adding analytics, forms, accounts, ads, or commerce.
9. Ensure publication and sitemap dates match the actual public launch or revision date.

## Content rule

Never label a page **Hands-on Tested** until a real test record exists under the published methodology. Affiliate links must be disclosed before the first monetized link and use `rel="sponsored"`.
