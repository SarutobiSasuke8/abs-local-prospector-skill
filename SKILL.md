---
name: abs-local-prospector
description: Find and qualify local business prospects for Astraeus Business Solutions. Use when the user asks to prospect local businesses, find leads near a place, audit local companies for weak websites or digital operations, create outreach target lists, build lead sheets, or identify businesses that may need websites, booking flows, CRM, automation, AI ops, Google Business Profile cleanup, or lightweight digital transformation.
---

# ABS Local Prospector

Use this skill to turn local market research into qualified prospects for [[Business/Companies/Astraeus Business Solutions]].

Default to browser-assisted research, not bulk scraping. Prefer fewer verified leads over large weak lists.

## Inputs

Infer reasonable defaults and continue unless the base location is missing.

- `base_location`: town, area, landmark, address, or business anchor.
- `radius_km`: default 20 km.
- `categories`: default local services, trades, clinics, salons, fitness, restaurants, hospitality, professional services, and owner-operated shops.
- `max_leads`: default 15.
- `offer_focus`: default website plus conversion flow; optionally automation, AI ops, CRM, booking, Google Business, or general digital cleanup.
- `output`: default chat table; use CSV/XLSX only when requested or when the list is too large for chat.
- `language`: match the user.

## Guardrails

- Use public web research and the browser responsibly.
- Do not bypass CAPTCHAs, login walls, paywalls, bot protections, or rate limits.
- Do not extract Google Maps data at scale. Treat maps as a discovery surface and cross-check details with public search results, official sites, social pages, directories, or Google Business snippets.
- Prefer official business contact channels. Avoid private personal emails unless the source is clearly public business contact information and the user has a lawful outreach basis.
- Do not mark a business `Hot` unless at least one exact-name web search was attempted.
- Do not claim a site is absent if only a maps listing was checked.
- Keep claims evidence-backed and mark uncertainty plainly.

## Workflow

1. Identify the search area, categories, radius, date, and offer focus.
2. Search category plus location, then gather candidates from public search results, local directories, business pages, maps snippets, and social pages.
3. For each candidate, search exact business name plus town/city.
4. Check whether the business has a standalone website, only social/marketplace pages, a weak site, or a credible site.
5. Look for ABS-relevant pain signals: unclear offer, no booking/contact path, outdated site, no SSL, weak mobile layout, poor Google Business presence, manual intake signals, fragmented tools, no reviews response pattern, or obvious missed conversion opportunities.
6. Score each lead using the rubric below.
7. Deduplicate, remove closed or irrelevant businesses, and keep the strongest verified prospects.
8. Return a concise table plus the best first outreach targets.

Read `references/lead-rubric.md` when scoring feels ambiguous, when the user asks for an outreach angle, or when creating a CSV/XLSX.

## Scoring

- `Hot`: active business, reachable, near target area, and has no site, social-only presence, severe site weakness, or a clear conversion/booking/automation gap.
- `Warm`: has a site but visible quality, trust, conversion, Google Business, booking, CRM, or automation problems suggest a realistic improvement offer.
- `Low`: good site or weak evidence, but still a possible future contact.
- `Skip`: closed, duplicate, outside radius, irrelevant, franchise/local decision-maker unlikely, no public contact path, or already has a strong digital presence.

Use `High`, `Medium`, or `Low` confidence:

- `High`: official site/social/page plus at least one corroborating source.
- `Medium`: one credible source and consistent search evidence.
- `Low`: incomplete, ambiguous, stale, or not independently checked.

## Chat Output

Use this table:

| Score | Business | Category | Area | Distance | Website status | Website/Social | Phone | ABS angle | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Rules:

- Website status values: `No site found`, `Social only`, `Weak site`, `Marketplace/booking only`, `Has site`, `Unclear`.
- Keep `ABS angle` concrete and outreach-ready.
- Use `Not found` instead of blank fields.
- Include source links in the `Website/Social` field when possible.
- After the table, add `Best first outreach targets` with the top 3 leads and one reason each.
- Finish with the search location, radius, categories, date, and unresolved uncertainties.

## CSV Columns

When returning CSV-style rows or creating a spreadsheet, use:

```csv
score,business,category,area,distance_km,website_status,website_url,social_urls,phone,source_urls,abs_angle,confidence,notes,next_action
```

## Vault Follow-Through

When the user wants the results captured in the vault:

- File lead sheets or workflow notes under `Business/My Businesses/Astraeus Business Solutions/Sales/`.
- Add actionable follow-ups as markdown tasks:
  `- [ ] #task [project:: Astraeus Business Solutions] Contact BUSINESS about SPECIFIC_ANGLE`
- Use `#next` only for the immediate first outreach actions.
- Link ABS as [[Business/Companies/Astraeus Business Solutions]].
