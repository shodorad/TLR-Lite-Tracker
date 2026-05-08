---
name: TLN Dashboard
description: Clean Financial SaaS / Elevated Data Dashboard — engineering progress tracker with fintech polish and consumer-facing warmth.
register: product

colors:
  calm-base: "oklch(96.5% 0.002 258)"
  card-white: "oklch(99.5% 0.001 258)"
  ghost-border: "oklch(93% 0.003 258)"
  whisper-border: "oklch(96% 0.002 258)"
  ink: "oklch(14% 0.005 258)"
  body-text: "oklch(22% 0.008 258)"
  utility-gray: "oklch(55% 0.007 258)"
  quiet-gray: "oklch(70% 0.005 258)"
  brand-green: "oklch(62% 0.19 145)"
  green-tint: "oklch(95.5% 0.045 145)"
  salmon-red: "oklch(60% 0.18 22)"
  red-tint: "oklch(96% 0.04 22)"
  warm-amber: "oklch(76% 0.14 75)"
  amber-tint: "oklch(96.5% 0.04 75)"

typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    note: "Hero metrics only. Hierarchy through size contrast, not color."
  heading:
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
    maxWidth: "72ch"
    note: "Designed for scan, not read. Tight but comfortable."
  label:
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.05em"
    textTransform: "uppercase"

rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "100px"

spacing:
  xs: "8px"
  sm: "14px"
  md: "20px"
  lg: "24px"
  xl: "32px"

elevation:
  card: "0 1px 2px oklch(10% 0.005 258 / .04), 0 2px 12px oklch(10% 0.005 258 / .05)"
  float: "0 4px 24px oklch(10% 0.005 258 / .10)"
  modal: "0 8px 48px oklch(10% 0.005 258 / .16)"

---

# Design System: TLN Dashboard

## Creative North Star: "Elevated Data Dashboard"

Sits at the intersection of fintech utility and consumer-facing polish. Not a hardcore BI tool. Wants to feel approachable, almost like a wellness app, but with enough density to serve real data. Think Credit Karma meets a modern SaaS dashboard like Linear or Notion.

## 1. Visual Style

**Theme sentence:** Engineering lead reviewing sprint progress on a MacBook in a bright office, glancing between this and their calendar — wants the numbers to feel decisive and calm, not clinical or alarming.
→ Light. Neutral. Unambiguously readable.

**Color strategy:** Restrained + semantically loaded. The background is calm and recedes. Color only appears when it carries meaning.

## 2. Color System

### The Palette

**Background — Calm Base** (`oklch(96.5% 0.002 258)`):
Near-white, nearly achromatic. The `#F5F5F5` range. Creates a neutral, calm base — no warmth bias, no cool bias. The page disappears and data reads forward.

**Card Surface** (`oklch(99.5% 0.001 258)`):
Near-white card backgrounds lift cleanly off the base without needing strong borders.

**Ghost Border** (`oklch(93% 0.003 258)`):
The main separator — very low contrast. Cards use this or nothing at all. Never a strong structural element.

**Ink — Near-Black** (`oklch(14% 0.005 258)`):
Used sparingly and purposefully: CTA buttons (full-pill dark buttons), the nav active state, hero numerals. Its restraint is what gives it authority. When it appears, hierarchy is unmistakable.

**Brand Green** (`oklch(62% 0.19 145)`):
Saturated, slightly warm mid-green. Not `#00FF00`, not mint, not sage. A deliberate brand-level decision — the green you'd use on a logo. Communicates "positive / on-track." Used on progress fills, completion indicators, success states, logo mark.

**Salmon Red** (`oklch(60% 0.18 22)`):
For negative / blocked states. Reads as red but with enough warmth to feel considered rather than alarming. Not pure red.

**Warm Amber** (`oklch(76% 0.14 75)`):
Neutral / at-risk / partial states. Lower chroma than green or red — it sits between them in both hue and emotional valence.

### Semantic Rules

The status monopoly: green = positive/done, red = blocked/negative, amber = in-progress/at-risk. No color is used decoratively. Signal, always.

Black earns its place. Any element using near-ink color is a primary action or the most important number on screen. If it's not one of those, it should be utility gray or body text.

## 3. Typography

**Two modes, no others.**

**Display mode** (hero metrics, key numbers):
700–800 weight. Hierarchy through size contrast, not color. The biggest number dominates; its label sits smaller and in utility gray. This is functional, not expressive.

**Utility mode** (table data, labels, metadata, supporting copy):
Small (11–13px), regular weight, `oklch(55% 0.007 258)` gray on white. Designed for scan, not read. Tight line height, comfortable density. No decorative choices.

**The Weight-and-Size Rule:** Every hierarchy step must change both weight and size. A step that changes only one of them is not a step — it's noise.

## 4. Layout and Grid

**Cards** compartmentalize data. Radius: 12–16px. Border: ghost only (nearly invisible) or none. Generous inner padding — this is not cramped. Cards breathe.

**No nested cards.** Ever.

**Two layout zones (conceptually):**
- Summary zone: the big number, the overall health read. High emotional impact. Gives the verdict in under a second.
- Detail zone: tables, breakdowns, module-level data. Progressive disclosure, functional density.

**Spacing varies.** Padding inside cards differs from section gutters. Section headers have more top space than bottom. Same padding everywhere is monotony.

## 5. Component Patterns

**Gauge / Donut — Hero Component:**
The central, high-impact element. Communicates the overall verdict in under a second. Sized generously. The arc color follows the semantic palette (green = healthy, amber = at risk, red = blocked). A near-black numeral sits centered in the donut — readable at two meters.

**Chip / Tag Components:**
Rounded pill shape (radius: full). Low-contrast: tinted background + matching foreground, no border. Color-coded to semantic roles. Used as "impact signal" layers on stats (think "High impact / Medium impact"). Not loud — they annotate, they don't shout.

**Full-Width Pill CTA:**
Single action, full width, near-black background, white text. When it appears, there is no ambiguity about what to do. High contrast, pill-shaped, nothing competing with it.

**Table Rows with Expansion:**
Chevron affordance suggests expandable detail. The expansion reveals a card-within-the-section pattern (not a nested card — it's a contained block in the row context). Good for progressive disclosure.

## 6. Data Visualization

Minimal and purposeful. Each chart communicates exactly one idea. No overload.

- The overall donut: completion verdict, instantly
- The module health chart: which areas are lagging, by discipline
- Progress bars: per-discipline fill, threshold-colored
- No chart decorates. Every chart earns its pixel count.

## 7. Interaction Affordances

- Hover states: subtle background shift, no shadow addition
- Focus: 3px ring in brand green
- Primary CTA: full-width dark pill, bottom of its section, full contrast
- Chevron rows: suggest depth without requiring it until the user wants it

## 8. What This System Is Not

- Not Jira: no bureaucratic density, no icon overload, no status-color decoration
- Not a BI tool: no dark mode by default, no cramped table density, no toolbar overload
- Not a marketing dashboard: no gradient text, no gradient accent cards, no hero-metric theater
- Not a generic SaaS dashboard: not blue-on-white, not the same card grid repeated six times
