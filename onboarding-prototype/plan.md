# MUI Migration Plan — TrackLynk Lite

This document is the full task list for rebuilding the app using Material UI (MUI v5).
Every task is written at the level where you can hand it to an AI or a developer and
have it execute with no ambiguity. Tasks are ordered by dependency — complete earlier
phases before starting later ones.

---

## Phase 0 — Package & Tooling Setup

### 0.1 Install MUI core packages
```
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @mui/lab          # Timeline component used in TripDetail
```
Keep existing packages: `framer-motion`, `lucide-react`, `@react-google-maps/api`.
Framer Motion stays — MUI does not replace it for the slide/spring transitions.

### 0.2 Remove Tailwind
- Delete `@tailwind base/components/utilities` directives from `src/index.css`.
- Remove `tailwindcss` and `@tailwindcss/vite` (or postcss plugin) from `package.json`
  and the Vite/PostCSS config.
- Tailwind utility classes are only used in `index.css` directives, not in JSX, so no
  JSX hunt-and-replace is needed.

### 0.3 Remove the `glass` / `glass-sm` CSS classes from `index.css`
They are replaced by a MUI `sx` prop pattern (see Phase 1.3). Keep the `@keyframes`
blocks (`glow-pulse`, `float`) and the `.car-float` rule — those are used by
`Welcome.jsx` and have no MUI equivalent.

### 0.4 Verify Inter font is still loaded
`index.css` already imports Inter via Google Fonts. Keep that `@import` line.
MUI's theme will reference `'Inter'` explicitly (see 1.1).

---

## Phase 1 — MUI Theme Configuration

This is the most important phase. Get the theme right and every screen follows
naturally. The brand accent is `#C8FF00` (electric lime). All surfaces are dark glass.

### 1.1 Create `src/theme.js`
Define a MUI `createTheme` with the following tokens:

**Palette**
```js
palette: {
  mode: 'dark',
  primary:   { main: '#C8FF00', contrastText: '#000' },
  error:     { main: '#E8656A' },
  success:   { main: '#4ade80' },
  warning:   { main: '#F59E0B' },
  background: {
    default: '#000',
    paper:   'rgba(18,22,32,0.92)',   // matches current glass cards
  },
  text: {
    primary:   '#ffffff',
    secondary: 'rgba(255,255,255,0.38)',
    disabled:  'rgba(255,255,255,0.18)',
  },
  divider: 'rgba(255,255,255,0.07)',
}
```

**Typography**
```js
typography: {
  fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  h1: { fontWeight: 900, letterSpacing: '-1.8px' },   // wordmark
  h2: { fontWeight: 800, letterSpacing: '-0.8px' },   // screen headings
  h3: { fontWeight: 800, letterSpacing: '-0.5px' },
  body1: { fontSize: '14px' },
  body2: { fontSize: '12.5px' },
  caption: { fontSize: '11px', color: 'rgba(255,255,255,0.38)' },
}
```

**Shape**
```js
shape: { borderRadius: 18 }   // default card radius; override per-component
```

**Component overrides** (the bulk of this task):

| Component | Override goal |
|---|---|
| `MuiButton` | Variant `contained` → lime gradient bg, black text, borderRadius 18, height 54px. Variant `outlined` → glass bg, white border rgba(255,255,255,0.14). Variant `text` → no bg, lime accent for important CTAs. Remove default text-transform uppercase. |
| `MuiTextField` / `MuiOutlinedInput` | Dark glass bg `rgba(255,255,255,0.06)`, border `rgba(255,255,255,0.10)`, borderRadius 14, white placeholder at 28% opacity, lime focus border. |
| `MuiSwitch` | Track color `rgba(255,255,255,0.12)` when off, `#C8FF00` when on. Thumb color `rgba(255,255,255,0.55)` when off, `#000` when on. This replaces the hand-rolled `Toggle` component everywhere in Settings. |
| `MuiListItem` / `MuiListItemButton` | Remove default horizontal padding; set `px: 2`. Bottom divider via `divider` prop. |
| `MuiListItemIcon` | Min-width 48px; center icon in a 34×34 rounded box (iconBg logic). |
| `MuiChip` | Outlined variant → glass bg, lime border and text for active state. |
| `MuiBottomNavigation` / `MuiBottomNavigationAction` | Transparent bg, glass backdrop, lime active color, borderRadius 28 for the pill indicator. |
| `MuiDrawer` (bottom variant) | Paper bg `#0d1018`, borderRadius `24px 24px 0 0`, border-top `rgba(255,255,255,0.08)`. |
| `MuiDialog` | Same glass surface as cards. |
| `MuiStepper` | `StepIcon` active color lime, connector color `rgba(255,255,255,0.12)`. |
| `MuiLinearProgress` | Track `rgba(255,255,255,0.08)`, bar `#C8FF00`. |
| `MuiIconButton` | Default bg `rgba(255,255,255,0.07)`, border `rgba(255,255,255,0.10)`. |
| `MuiTooltip` | Dark glass surface. |

### 1.2 Wrap the app in `ThemeProvider`
In `src/main.jsx`:
```jsx
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'

<ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>
```
`CssBaseline` replaces the `*{box-sizing:border-box; margin:0; padding:0}` reset in
`index.css`. Keep the body background rule in the theme's `components.MuiCssBaseline`
override so the outer page stays `#04050d`.

### 1.3 Create a shared `sx` glass mixin
In `src/theme.js` export a plain object:
```js
export const glassSx = {
  background: 'rgba(255,255,255,0.055)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.10)',
}
export const glassSmSx = {
  background: 'rgba(255,255,255,0.045)',
  backdropFilter: 'blur(12px) saturate(140%)',
  WebkitBackdropFilter: 'blur(12px) saturate(140%)',
  border: '1px solid rgba(255,255,255,0.08)',
}
```
These are spread into `sx` props throughout the app, replacing every inline
`background: 'rgba(255,255,255,0.055)'` + `backdropFilter` triplet.

---

## Phase 2 — Shared Component Rewrites

### 2.1 Rewrite `src/components/BottomTabs.jsx`
**Current:** hand-rolled flex div with motion.button and a layoutId indicator.
**MUI target:** `BottomNavigation` + `BottomNavigationAction` from `@mui/material`.

Steps:
- Use `<BottomNavigation value={current} onChange={...}>`.
- Pass lucide icons via the `icon` prop (wrap in a `<SvgIcon>` or just pass the
  component directly — MUI accepts any React node).
- Apply the pill indicator via a `motion.div` with `layoutId="tab-indicator"` on top
  of the active action (keep Framer Motion for this animation — MUI has no equivalent).
- Apply the glass surface and `borderRadius: 28` via `sx` on the `BottomNavigation` root.
- Disabled state (Profile tab) remains custom logic using `disabled` prop.

### 2.2 Create `src/components/GlassCard.jsx`
A thin wrapper so every screen doesn't repeat the same `sx` spread:
```jsx
// MUI Paper with glassSx preset
import { Paper } from '@mui/material'
import { glassSx } from '../theme'
export default function GlassCard({ sx, children, ...props }) {
  return <Paper elevation={0} sx={{ ...glassSx, borderRadius: 3, ...sx }} {...props}>{children}</Paper>
}
```
Replace every `<div style={{background:'rgba(255,255,255,0.055)', backdropFilter:...}}>` in
every screen with `<GlassCard sx={{...}}>`.

### 2.3 Create `src/components/PrimaryButton.jsx`
The lime gradient button recurs in every onboarding screen:
```jsx
import { Button } from '@mui/material'
export default function PrimaryButton({ children, ...props }) {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        height: 54,
        background: 'linear-gradient(135deg,#C8FF00 0%,#8FB800 100%)',
        boxShadow: '0 8px 32px rgba(200,255,0,0.30)',
        '&:hover': { background: 'linear-gradient(135deg,#d4ff26 0%,#9dcf00 100%)' },
        fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px',
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
```

### 2.4 Create `src/components/GlassButton.jsx`
The secondary ghost button (glass bg, white text) recurs heavily:
```jsx
import { Button } from '@mui/material'
import { glassSmSx } from '../theme'
export default function GlassButton({ children, ...props }) {
  return (
    <Button
      variant="outlined"
      fullWidth
      sx={{ ...glassSmSx, height: 48, borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.72)', fontSize: 15, fontWeight: 600 }}
      {...props}
    >
      {children}
    </Button>
  )
}
```

### 2.5 Delete `src/screens/SignUp.jsx` exported primitives
`SignUp.jsx` currently exports `screenBase`, `headingStyle`, `subStyle`, `PrimaryButton`,
`glassCard` as plain JS objects that other screens import. After the above components
exist, audit every import site (`DeviceSetupWizard`, `Auth`, etc.) and replace with:
- `screenBase` → just a MUI `Box` with `height:'100%' display:'flex' flexDirection:'column'`
- `headingStyle` / `subStyle` → MUI `Typography` with `variant="h2"` / `variant="body2"`
- `PrimaryButton` → the new shared component
- `glassCard` → `glassSx` from theme

---

## Phase 3 — Onboarding Screens (in flow order)

### 3.1 `Welcome.jsx` — Carousel splash
**What it is:** 3-slide auto-advancing carousel (Hero, Features, Pricing) with swipe
gesture, dot indicators, and 3 CTA buttons at the bottom.

**What changes:**
- The carousel and slide transition logic stays in Framer Motion — do not replace.
- The auto-advancing timer and drag-end handler stay unchanged.
- **Slide 1 (Hero):** Replace `<h1 style=...>` with `<Typography variant="h1">`. The
  Car3D component and `.car-float` animation stay as-is.
- **Slide 2 (Features):** Replace the 3 feature cards (`div.glass`) with `<GlassCard>`.
  Replace `<h2>` / `<p>` with MUI `Typography`. Icon boxes become MUI `Avatar` with
  `sx={{ bgcolor:'rgba(200,255,0,0.10)', border:'1px solid rgba(200,255,0,0.18)' }}`.
- **Slide 3 (Pricing):** The Monthly/Annual toggle becomes a MUI `ToggleButtonGroup` +
  `ToggleButton` pair styled to match the current pill toggle. The price card becomes a
  `<GlassCard>`. Feature checkmarks become MUI `List` + `ListItem` with a custom lime
  `Avatar` icon.
- **Dot indicators:** Keep current Framer Motion animated dots — MUI `MobileStepper`
  doesn't support the animated pill expansion.
- **CTA buttons:** Replace with `<PrimaryButton>`, `<GlassButton>`, and MUI `Button
  variant="text"` respectively.

### 3.2 `Auth.jsx` — Account creation / OAuth
**What it is:** Back button, heading, Apple/Google OAuth buttons, divider, email link,
returning-user Face ID card.

**What changes:**
- Back button → MUI `IconButton` with `ArrowBack` icon (or keep lucide `ArrowLeft`
  inside an `IconButton`).
- Apple CTA → `<PrimaryButton>` with `startIcon={<AppleIcon />}` (keep the inline SVG).
- Google CTA → `<GlassButton>` with `startIcon={<GoogleIcon />}`.
- Email link → MUI `Button variant="text"`.
- "or" divider → MUI `Divider` with `sx={{ color:'rgba(255,255,255,0.22)' }}` and
  `children="or"`.
- Returning-user card → `<GlassCard>` containing:
  - `<Typography>` for label and heading.
  - The `FaceIDButton` component stays as-is (it has custom animation states and is
    self-contained).
- Legal text → MUI `Typography variant="caption"` with MUI `Link` for the underlined
  terms/privacy spans.

### 3.3 `SignUp.jsx` — Email sign-up form
**What it is:** Email + password fields, submit button, progress bar header.

**What changes:**
- All three text inputs → MUI `TextField` with `variant="outlined"` and the dark glass
  override from the theme (Phase 1.1). No `sx` needed per-field once the theme override
  is in place; just add `fullWidth` and `label` props.
- Password show/hide toggle → use `InputAdornment` + `IconButton` inside the TextField's
  `endAdornment` prop. Remove the hand-rolled absolute-positioned eye icon.
- Submit button → `<PrimaryButton>`.
- "Already have an account" link → MUI `Button variant="text"`.
- `ProgressBar` header stays as-is (it's a thin wrapper, no MUI dependency needed).

### 3.4 `AddVehicle.jsx` — Vehicle type selection
**What it is:** Selectable vehicle-type cards in a grid.

**What changes:**
- Each vehicle card → MUI `Card` + `CardActionArea`. Selected state gets a lime border
  via `sx={{ border: selected ? '2px solid #C8FF00' : '1px solid rgba(255,255,255,0.08)' }}`.
- The grid layout → MUI `Grid` (2 columns).
- Continue button → `<PrimaryButton>`.

### 3.5 `VehicleDetails.jsx` — Make/model/year form
**What it is:** Three form fields (make, model, year) and a continue button.

**What changes:**
- All fields → MUI `TextField`. Year can use `type="number"` or a MUI `Select`.
- Continue → `<PrimaryButton>`.
- No structural change needed.

### 3.6 `ScanDevice.jsx` — QR / plug scan step
**What it is:** An animated scanning illustration, instructions, and a confirm button.

**What changes:**
- Instruction text → `Typography`.
- Any pill/badge → MUI `Chip`.
- The animated pulse ring (glow-pulse keyframe) stays in CSS/inline — MUI has no
  equivalent for that specific effect.
- Button → `<PrimaryButton>`.

### 3.7 `DeviceSetupWizard.jsx` — Multi-step OBD setup (4 steps)
**What it is:** A 4-step wizard: locate OBD port → plug in device → Bluetooth pairing
→ firmware check. Each step has an illustration, text, and next button. A progress
indicator sits at the top.

**What changes (most impactful MUI win in the whole app):**
- Replace the custom step counter / `ProgressBar` component with MUI `Stepper`
  (`orientation="horizontal"`, `alternativeLabel`). Use `Step`, `StepLabel`,
  `StepConnector`. Override the connector and icon colors in the theme (Phase 1.1).
  Alternatively, use MUI `LinearProgress` if the design wants a bar not dots.
- Each step's content area is already structured as a single `<div>` per step —
  wrap it in a `<Box>` inside a `<AnimatePresence>` block (keep Framer Motion for
  the slide transition between steps).
- The OBD port SVG illustration (`OBDPortIllustration`) uses `motion.rect` for the
  pulsing highlight — keep as-is.
- Bluetooth, firmware step illustrations are simple SVG/icon compositions — keep as-is.
- "Next" / "Back" buttons → `<PrimaryButton>` / `<GlassButton>`.

### 3.8 `Success.jsx` — Onboarding complete
**What it is:** Animated checkmark, congratulation copy, enter-app button.

**What changes:**
- Heading / body → `Typography`.
- The animated checkmark ring (Framer Motion) stays.
- Enter button → `<PrimaryButton>`.
- Any feature-pill list → MUI `Chip` components in a `Box` with flexWrap.

---

## Phase 4 — Main App Screens

### 4.1 `Home.jsx` — Map + conversational sheet
This is structurally the most complex screen. It has four overlapping layers:
map (full-screen), floating header, trip info card, and a bottom sheet that expands.

**FloatingHeader:**
- The glass `div` → `<GlassCard>` with `position:'absolute'`.
- Vehicle name → `Typography variant="h3"` + MUI `KeyboardArrowDown` icon.
- Bell button → MUI `IconButton` with `<NotificationsNone>`.
- Avatar → MUI `Avatar` with lime gradient bg.

**TripInfoCard:**
- The glass `div` → `<GlassCard>`.
- "Live Trip" badge → MUI `Chip size="small"` with lime color.
- GO button → MUI `Fab` (Floating Action Button) variant `"extended"` is overkill for
  42×42 — use a small MUI `Button variant="contained"` with fixed `width/height`.

**ConversationalSheet (bottom sheet):**
- The animated height `motion.div` → keep Framer Motion spring animation on height
  (MUI `SwipeableDrawer` would destroy the custom expand/collapse spring).
- Quick pills → MUI `Chip` with `onClick`. Map the current pill buttons 1:1.
- Health status chips (Fuel/Batt/Engine/Device) → MUI `Chip size="small"` with
  custom `icon` prop for the lucide icon.
- Stats (Range/Trip/Speed) → simple `Typography` stack — no MUI special component.
- Action buttons (Trips/Alerts/History/Network) → MUI `ButtonBase` or `IconButton`
  with label below (MUI `BottomNavigationAction` pattern without the nav context).
- "Ask AI" divider → MUI `Divider` with `children` text.
- Chat messages → map existing bubble `div`s to MUI `Paper` components with the
  appropriate `sx` for user vs. AI styling.
- Chat input → MUI `TextField` with `InputProps={{ endAdornment: ... }}` containing
  Mic and Send `IconButton`s. The mic pulse ring stays as a Framer Motion overlay.
- Drag handle → keep as-is (simple `div`).

**Google Map:** unchanged — `@react-google-maps/api` is kept.

### 4.2 `Trips.jsx` — Trip history list
**What it is:** Header with filter button, weekly-stats summary card, grouped trip list,
and a filter bottom sheet.

**Header:**
- `Typography variant="h3"` for "Trips".
- Active filter badge → MUI `Chip size="small"` with lime color.
- Filter button → MUI `IconButton` with `<TuneRounded>` or lucide `SlidersHorizontal`.

**Weekly summary card:**
- The lime-tinted stat card → MUI `Paper` (or `GlassCard`) with
  `sx={{ background:'rgba(200,255,0,0.05)', border:'1px solid rgba(200,255,0,0.12)' }}`.
- Stat values → `Typography` with lime `color="primary"`.

**TripCard:**
- Replace each card `div` → MUI `Paper` with `sx` for the glass/border look.
- Route icon in a circle → MUI `Avatar` with dynamic `sx` colors based on `trip.scoreColor`.
- Trip name → `Typography variant="body1"` bold.
- Time range → `Typography variant="caption"`.
- Score pill → MUI `Chip size="small"` with dynamic color.
- Chevron → MUI `ChevronRight` icon.
- The `whileTap` scale → keep Framer Motion `motion.div` wrapper.

**FilterSheet:**
- Replace the custom bottom sheet with MUI `SwipeableDrawer anchor="bottom"`.
  - `PaperProps={{ sx: { borderRadius:'24px 24px 0 0', background:'#0d1018', border:'1px solid rgba(255,255,255,0.08)' } }}`.
- Filter option buttons → MUI `ToggleButtonGroup` + `ToggleButton` or MUI `Chip`
  components (chips are visually closer to the current design).
- Reset button → MUI `Button variant="outlined"`.
- Apply button → `<PrimaryButton>`.
- Drag handle → keep the `div` pill (same as current).
- Remove the hand-rolled backdrop `div` — `SwipeableDrawer` provides its own `Backdrop`.

### 4.3 `TripDetail.jsx` — Individual trip view
**What it is:** Back button header, route map (Google Maps), stat chips, driving events
timeline, score badge.

**Header:**
- Back button → MUI `IconButton` with `ArrowBack`.
- Title → `Typography`.

**Stat chips (distance, duration, speed, score):**
- Each pill → MUI `Chip` with `icon` prop. Active/highlight chip gets lime color.

**Events timeline:**
- Replace the current custom-built events list with MUI Lab `Timeline`:
  ```
  import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector,
           TimelineContent, TimelineDot } from '@mui/lab'
  ```
  - `TimelineDot` color matches event type (brake = red, accel = amber, speed = lime).
  - `TimelineContent` contains event name + timestamp in `Typography`.
- Empty state (no events) → a centered `Typography` with a lime `CheckCircle` icon.

**Score card:**
- MUI `Card` with the drive-score letter in a large `Typography` and a colored border.

**Google Map:** unchanged.

### 4.4 `Settings.jsx` — Full settings screen (3,368 lines)
This is the largest file. It has a navigation stack (main menu → sub-screens), a shared
`Toggle`, `Row`, and `Section` primitive, and many sub-pages (Vehicle, Alerts,
Notifications, Privacy, Billing, Security, Integrations, Support, etc.).

**Strategy:** The three hand-rolled primitives map perfectly to MUI — replace them
throughout the entire file in one pass.

**`Toggle` component → delete, use MUI `Switch`:**
- Everywhere `<Toggle on={x} onToggle={fn} />` is used → replace with
  `<Switch checked={x} onChange={fn} size="small" />`.
- The theme override (Phase 1.1) gives it the lime/dark styling automatically.

**`Row` component → replace with MUI `ListItemButton` + `ListItemIcon` + `ListItemText`:**
```jsx
<ListItemButton onClick={onPress} divider={!last}>
  <ListItemIcon>
    <Avatar sx={{ width:34, height:34, borderRadius:'10px', bgcolor: danger ? 'rgba(232,101,106,0.15)' : iconBg || 'rgba(200,255,0,0.10)' }}>
      <Icon size={15} color={...} />
    </Avatar>
  </ListItemIcon>
  <ListItemText
    primary={<Typography color={danger ? 'error' : 'text.primary'}>{label}</Typography>}
    secondary={sublabel}
  />
  {toggle && <Switch checked={toggle.on} onChange={toggle.onToggle} />}
  {value && <Typography variant="caption">{value}</Typography>}
  {onPress && !toggle && <ChevronRight size={15} />}
</ListItemButton>
```

**`Section` component → replace with MUI `List` + `ListSubheader`:**
```jsx
<List
  subheader={title && <ListSubheader sx={{ bgcolor:'transparent', color:'rgba(255,255,255,0.28)', fontSize:10.5, letterSpacing:'0.7px', textTransform:'uppercase' }}>{title}</ListSubheader>}
  sx={{ mb: 3, ...glassSx, borderRadius: 3, p: 0, overflow:'hidden' }}
  component={motion.ul}
  initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
>
  {children}
</List>
```

**Sub-screen navigation (the `AnimatePresence` slide stack):**
Settings has ~12 sub-screens rendered via an `AnimatePresence` stack (Vehicles,
Alerts, Notifications, Privacy, Billing, Security, Help, etc.). This structure stays
exactly as-is — Framer Motion handles the slide transition. MUI changes only the
visual primitives inside each sub-screen.

**Per sub-screen checklist:**
- **Vehicles sub-screen:** Vehicle cards → MUI `Card` + `CardContent`. Add vehicle
  button → MUI `Button variant="outlined"` with `startIcon={<Add />}`.
- **Alerts sub-screen:** Speed/geofence/trip alert toggles → MUI `Switch` via the
  new Row component. Threshold inputs (e.g., speed limit) → MUI `TextField` with
  `type="number"` and `InputAdornment` for the unit label.
- **Notifications sub-screen:** All toggles → MUI `Switch`.
- **Privacy sub-screen:** Location sharing dropdown → MUI `Select` with `MenuItem`
  options. Data toggles → MUI `Switch`.
- **Billing sub-screen:** Plan card → `<GlassCard>` with lime accent. Payment method
  row → `ListItemButton`. Cancel/manage buttons → MUI `Button`.
- **Security sub-screen:** 2FA toggle → MUI `Switch`. Session list → MUI `List`.
  Device list → `ListItemButton`.
- **Integrations sub-screen:** Integration cards → `<GlassCard>`. Connect/disconnect
  buttons → `<PrimaryButton>` / MUI `Button variant="outlined"`.
- **Help & Support sub-screen:** FAQ items → MUI `Accordion` + `AccordionSummary` +
  `AccordionDetails`. Contact cards → `ListItemButton`.
- **Danger zone (Delete account, Log out):** Buttons → MUI `Button variant="outlined"
  color="error"` and `color="error"` respectively.

---

## Phase 5 — App Shell (`App.jsx`)

### 5.1 Replace the outer page layout
Current: raw `div` with inline `style={{ display:'flex', alignItems:'center', background:... }}`.
Replacement: MUI `Box` with `sx`:
```jsx
<Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:... }}>
```

### 5.2 Phone frame
Keep the phone frame as a raw `div` with inline styles — it is a design prop of the
prototype (fixed 390×844 frame) and is not a UI component. MUI adds nothing here.

### 5.3 Status bar icons
The three SVG mini-icons (Signal, Wifi, Battery) stay as inline SVG components.
No MUI equivalent.

### 5.4 Screen routing
The `SCREENS` array, `step` state, and `AnimatePresence` slide logic stay unchanged.
`isMainApp` branch logic stays unchanged. MUI is not a router.

---

## Phase 6 — Cleanup & Polish

### 6.1 Remove the old shared-style exports from `SignUp.jsx`
After Phase 2.5 is done and all import sites are updated, delete the exported
`screenBase`, `headingStyle`, `subStyle`, `PrimaryButton`, `glassCard` objects from
`SignUp.jsx`. The file then only exports the `SignUp` screen component.

### 6.2 Audit all remaining `style={{ fontFamily: 'Inter, sans-serif' }}`
Once the MUI theme sets Inter globally, every inline `fontFamily` prop is redundant.
Do a global find-and-replace to remove them. Exception: SVG text elements.

### 6.3 Remove leftover `backdropFilter` inline styles
After `glassSx` is adopted everywhere, audit for any remaining `backdropFilter: 'blur(...)'`
in inline `style={}` props and migrate them to `sx` or `GlassCard`.

### 6.4 Input focus states
MUI's `TextField` has a built-in focus ring. Remove the `input:focus { outline: none }`
rule from `index.css` — it was suppressing the native ring because the original inputs
were raw `<input>` elements.

### 6.5 Scrollbar hiding
The `::-webkit-scrollbar { width: 0 }` rule in `index.css` is still needed for the
trip list and chat message area. Keep it.

### 6.6 Visual regression check
For each screen, compare screenshots before and after. Key visual invariants to verify:
- Lime (#C8FF00) accent is consistent everywhere (buttons, active tabs, toggles, chips).
- Glass backdrop blur is present on all card surfaces.
- Dark backgrounds are correct per section (pure `#000` for Home map area,
  `#0d0d14` for Trips, `#000` for onboarding).
- Font weights match (900 for wordmark/prices, 800 for headings, 700 for button labels,
  600 for secondary labels, 400/500 for body).
- The phone frame, status bar, and home indicator are unchanged.

---

## Dependency Map

```
Phase 0 (packages)
  └── Phase 1 (theme)
        ├── Phase 2 (shared components)
        │     ├── Phase 3 (onboarding screens) — can be done in parallel per screen
        │     └── Phase 4 (main app screens)   — can be done in parallel per screen
        └── Phase 5 (App.jsx shell)
              └── Phase 6 (cleanup)
```

Phases 3 and 4 screens are independent of each other and can be worked on in parallel
once Phase 2 is complete.

---

## Risk Notes

| Risk | Mitigation |
|---|---|
| Settings.jsx is 3,368 lines — a large single-pass rewrite | Do it in sub-screen chunks: Replace `Toggle`→`Switch` first (global find), then `Row`→`ListItemButton`, then `Section`→`List`. Each is a mechanical substitution. |
| MUI `SwipeableDrawer` spring feel may not match current Framer Motion spring | Use `transitionDuration={0}` on the Drawer and keep a Framer Motion `motion.div` wrapper for the animation — or accept the Material default spring and tune it. |
| MUI `Stepper` styling in DeviceSetupWizard may clash with the dark theme | The Phase 1.1 component overrides for `MuiStepper` / `MuiStepIcon` are critical. Test this screen early. |
| `@mui/lab` `Timeline` is in an unstable package — API may change | Pin `@mui/lab` version. If it causes issues, fall back to a custom flex-column list for the events. |
| Framer Motion `whileTap={{ scale: 0.97 }}` on MUI `Button` may conflict | Wrap MUI Buttons in `motion.div` instead of using `component={motion.button}` — avoids event handler conflicts. |
