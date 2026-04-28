# Tracklynk Lite — MUI Migration Plan

## What this is

A view-layer rewrite of the existing Vite + React app against a MUI component foundation.
Logic (state, effects, animations, maps, routing) stays untouched.
Goal: zero hardcoded hex strings, zero `style={{}}` props, all spacing/color/typography from a
single theme file.

---

## Phase 0 — Repo cleanup

Delete everything that isn't source code or assets actively used by the app.

**Delete from root:**
- `Boucie screenshots/` — competitor research images (60+ PNGs, PDF, zip)
- `Bouncie GPS Vehicle Tracker Review_…` — empty folder
- `Bouncie_UX_Audit.pptx`
- `Bouncie_UX_Gap_Analysis.pptx`
- `TracklynkLite_Competitive_Analysis.pptx`
- `OBD_Feature_Matrix.html`
- `OBD_UIX_Research.html`
- `vehicle-ui-moodboard.html`
- `deep-dive/` — research notes
- `qa-reports/` — old audit reports
- All root-level PNGs: `auth-final.png`, `auth-screen.png`, `features-final.png`,
  `hero-final.png`, `hero-final2.png`, `hero-slide.png`, `hero-v4.png`, `hero-v5.png`,
  `hero-v6.png`, `pricing-slide.png`, `welcome-carousel.png`, `welcome-v3.png`

**Delete from `onboarding-prototype/`:**
- All screenshot PNGs at package root (not inside `src/`): `add-vehicle.png`, `auth.png`,
  `compact-kpi-home.png`, `compact-kpi.png`, `device-setup-step2.png`, `device-setup.png`,
  `home-chat-tab.png`, `home-collapsed.png`, `home-dashboard-tab.png`, `home-expanded.png`,
  `home-map-check.png`, `home-map-loaded.png`, `home.png`, `scan-device.png`, `success.png`,
  `vehicle-details.png`, `welcome.png`
- `antivibe/` — empty folder
- `vite.config.js.timestamp-*.mjs` — Vite cache artifact

**Keep:**
- `onboarding-prototype/Car_images/` — used by `src/components/Car3D.jsx`
- `README.md` — update after migration

---

## Phase 1 — Install MUI

```bash
cd onboarding-prototype
npm install @mui/material @emotion/react @emotion/styled
```

Do NOT install `@mui/icons-material` — keep `lucide-react` (~350KB saved).
Do NOT install `@mui/lab` unless Timeline is explicitly needed later.

---

## Phase 2 — Create theme file

**`onboarding-prototype/src/theme.js`**

Single source of truth for all design tokens:

| Token | Value |
|---|---|
| `palette.primary.main` | `#C8FF00` (neon lime) |
| `palette.primary.dark` | `#8FB800` (olive, gradient end) |
| `palette.background.default` | `#04050d` |
| `palette.background.paper` | `#0d0d14` |
| `palette.text.primary` | `#ffffff` |
| `palette.text.secondary` | `rgba(255,255,255,0.70)` |
| `palette.text.disabled` | `rgba(255,255,255,0.38)` |
| `typography.fontFamily` | `"Inter", system-ui, sans-serif` |
| `typography.fontWeightBlack` | `900` (custom token — MUI has no built-in 900) |
| `shape.borderRadius` | `16` |
| `spacing` | `4` (4px base → `spacing(6)` = 24px) |

**Critical hazards baked into the theme:**
- `MuiCssBaseline` uses `@global body` override — not inline — so it wins over CssBaseline's default body rule
- `MuiAvatar` global `borderRadius: 13` (MUI default is 50% circle — wrong for this design)
- `MuiButton` pill shape (`borderRadius: 99`), lime gradient, glow shadow on `containedPrimary`
- `MuiOutlinedInput` glass background + lime focus border
- `MuiBottomNavigation` glass blur + lime selected state
- No global `MuiPaper` override — glass styles are applied per-component, not globally (prevents Drawer/Dialog contamination)

---

## Phase 3 — Shared utilities

**`onboarding-prototype/src/styles/glass.js`**

```js
export const glassCard = {
  background: 'rgba(255,255,255,0.055)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
}

export const glassSm = {
  ...glassCard,
  backdropFilter: 'blur(12px) saturate(140%)',
  WebkitBackdropFilter: 'blur(12px) saturate(140%)',
}
```

**`onboarding-prototype/src/components/GlassCard.jsx`**

```jsx
import { Box } from '@mui/material'
import { glassCard } from '../styles/glass'

export function GlassCard({ children, sx, ...props }) {
  return <Box sx={{ ...glassCard, ...sx }} {...props}>{children}</Box>
}
```

**Fix glassCard import chain before touching SignUp.jsx:**
- `src/screens/Auth.jsx` — change import to `'../styles/glass'`
- `src/screens/DeviceSetupWizard.jsx` — change import to `'../styles/glass'`

---

## Phase 4 — Wire up app root

**`onboarding-prototype/src/main.jsx`**

```jsx
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
)
```

At this point the app looks identical — expected. ThemeProvider only activates when MUI components are present.

---

## Phase 5 — Screen migration order

Migrate one screen at a time. After each screen, run:
```bash
grep -n "style={{" src/screens/<Screen>.jsx
grep -n "#C8FF00\|rgba(" src/screens/<Screen>.jsx
```
Both should return zero results before moving to the next screen.

| Order | Screen | Why |
|---|---|---|
| 1 | `Welcome.jsx` | Smallest, most self-contained — validates the full pattern end-to-end |
| 2 | `Auth.jsx` | Simple layout, no complex state |
| 3 | `SignUp.jsx` | Has exported style objects to kill; fix imports first (Phase 3) |
| 4 | `AddVehicle.jsx` | Vehicle card grid pattern |
| 5 | `VehicleDetails.jsx` | Forms — validates TextField migration |
| 6 | `ScanDevice.jsx` | Step UI |
| 7 | `DeviceSetupWizard.jsx` | Step flows with progress |
| 8 | `Success.jsx` | Simple |
| 9 | `Home.jsx` | Complex (map + chat sheet) |
| 10 | `Trips.jsx` | Medium complexity |
| 11 | `Settings.jsx` | Last — largest (3,368 lines), most mechanical, highest blast radius |
| 12 | `ChoosePlan.jsx` | Currently orphaned (not in App.jsx routing) — migrate last |

**Replace ProgressBar.jsx** with MUI `LinearProgress` (lime gradient via `sx`) during Step 7.

---

## Phase 6 — Migration rules per component type

### Motion + MUI buttons (HAZARD: ref collision)
```jsx
// WRONG — MUI + Framer both try to own the ref:
<Button component={motion.button} whileTap={{ scale: 0.97 }} />

// CORRECT — motion() factory is forwardRef-aware:
import { motion } from 'framer-motion'
const MotionButton = motion(Button)
<MotionButton whileTap={{ scale: 0.97 }} />
```

### Drawers / Dialogs inside phone frame (HAZARD: Portal clips backdrop-filter)
```jsx
// Phone frame has overflow:hidden + borderRadius — Portal renders outside it.
// Always use disablePortal for glass blur to work:
<Drawer disablePortal ...>
<Dialog disablePortal ...>
```

### whileTap + MUI list items (HAZARD: ripple/scale stutter)
```jsx
// Disable MUI ripple when Framer Motion handles the press feel:
<ListItemButton disableRipple disableTouchRipple component={MotionListItemButton} whileTap={{ scale: 0.985 }}>
```

### Keep motion.div as animation wrapper
```jsx
// motion.div owns the animation, MUI component owns the styles — don't collapse into one:
<motion.div whileHover={...}>
  <GlassCard>
    <Button>...</Button>
  </GlassCard>
</motion.div>
```

---

## Phase 7 — Components NOT migrated to MUI

| Component | Reason |
|---|---|
| `BottomTabs.jsx` | MUI `BottomNavigation` has `overflow:hidden` that clips the Framer Motion `layoutId` indicator |
| `Toggle.jsx` (custom switch) | MUI Switch uses CSS transition on thumb; Framer Motion spring feel cannot be replicated |
| PricingSlide toggle (Welcome.jsx) | Sliding pill requires `motion.div` with absolute position — MUI `ToggleButtonGroup` has no shared indicator concept |
| `Car3D.jsx` | Pure visual component, no styling benefits from MUI |

---

## Phase 8 — Remove Tailwind

Do this last, after all screens are migrated.

1. Remove from `onboarding-prototype/src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
2. Verify no raw `<h1>`–`<h6>` elements remain (browser defaults return once Preflight is removed — all headings must use MUI `<Typography>`)
3. Remove `tailwindcss` and `autoprefixer` from `package.json` devDependencies

---

## Final verification

```bash
# These should return zero results in src/ (outside theme.js and glass.js)
grep -r "style={{" onboarding-prototype/src/
grep -rE "#[0-9a-fA-F]{3,6}|rgba\(" onboarding-prototype/src/ \
  --include="*.jsx" --include="*.js" \
  | grep -v "theme.js\|glass.js"
```

Functional checks:
- `npm run dev` — no console errors or warnings
- Primary `Button` → lime gradient + pill shape + glow shadow
- `GlassCard` → blurred glass (not solid background)
- Drawer/Dialog opened → glass blur works inside phone frame
- `motion(Button)` + `whileTap` → no React ref warning in console
- All headings render at correct weight (h1 → 900, not 700)
- Tailwind removed → no heading or layout regressions
