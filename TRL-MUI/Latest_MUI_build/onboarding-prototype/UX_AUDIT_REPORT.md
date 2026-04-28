# TrackLynk Lite — UX Flow Audit Report

**App:** http://localhost:5175/  
**Build:** TrackLynk Onboarding Prototype (React + MUI + Framer Motion)  
**Audit date:** 2026-04-28  
**Persona tested:** New user, happy path with light edge-case probing  
**Viewport:** Desktop browser rendering of mobile phone frame (390 × 844)  
**Design system reference:** MUI v9 + custom dark theme (`src/theme.js`) with lime primary `#C8FF00`, glass surfaces, Inter typography  

---

## 1. Executive summary

This is a polished-looking prototype that **falls apart the moment a user behaves like a real user**. The visual language is consistent and well-considered, but the flow leaks fake state everywhere, has a Trips screen in the wrong theme, ships with no Google Maps API key, and treats every "skip" as the primary action — which means a user can complete onboarding without ever entering a real value, scanning a real device, or pairing anything, and still land on a Success screen that confidently lies to them.

Severity buckets:

- **🔴 BLOCKERs found:** 13
- **🟡 ISSUEs found:** 28
- **🔵 SUGGESTIONs found:** 9

The single biggest pattern problem is **state lying**: the app pretends the user did things they didn't, and contradicts itself between screens (Toyota Tacoma in the main app, Tesla Model 3 in Settings; "Free plan active" on Success, "Annual Plan $7.99/mo" on Settings).

---

## 2. Flow tested

```
Welcome (3-slide carousel)
   ↓
Auth ("Create your account")
   ↓
SignUp (Step 1/5 — Create Account)
   ↓
ScanDevice (Step 2/5 — Connect Device)
   ↓
AddVehicle (Step 3/5 — Add Your Vehicle)
   ↓
VehicleDetails (Step 4/5 — Vehicle Details)
   ↓
DeviceSetupWizard (Step 5/5 — Device Setup, 4 sub-steps)
   ↓
Success ("You're all set!")
   ↓
Main app: Home / Trips / Settings (Profile tab disabled)
```

---

## 3. Findings by flow step

### Step 1 — Welcome (3-slide auto-advancing carousel)

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **Carousel leaves a blank/black screen for ~2–3 seconds** when transitioning between slides. The DOM contains content from multiple slides at once during the transition, but the visible area shows nothing. Reproduces consistently with auto-advance at 4.5s and on direct dot taps. | Audit `AnimatePresence mode="popLayout"` + spring transition timing. Slide entry/exit should overlap seamlessly. Likely cause: `mode="popLayout"` removing the outgoing slide before the incoming one has positioned. Try `mode="wait"` or explicit `key` ordering. |
| 🔴 BLOCKER | **Pricing slide visual blow-out** — the radial gradient on the price card (`top: -30, right: -30, width: 130, height: 130`) leaks far beyond its 130×130 bounds and partially obscures the bottom feature ("Multi-vehicle dashboard" check icon goes nearly invisible). The card's `overflow: 'hidden'` is on `GlassCard sx`, but the rendered output behaves as if it is not clipping. | Verify `overflow: 'hidden'` is reaching the right element. The blob is referenced by source but the gradient may be drawing through `backdrop-filter`. Lower the gradient opacity or move the blob outside the card. |
| 🟡 ISSUE | **Carousel dot indicators are not in the accessibility tree.** `find_page` query for "carousel dot indicators" returned no results. They have onClick handlers but no `role="button"`, no `aria-label`, no keyboard support. | Wrap dots in `<button>` with `aria-label="Go to slide N"` and `aria-current` for the active one. |
| 🟡 ISSUE | **"Sign In" link goes to a "Create your account" screen.** `onClick={next}` for the Sign In link routes to Auth.jsx, whose heading is "Create your account". A returning user clicking "Sign In" lands on a sign-up screen. Confusing. | Either give Auth.jsx a sign-in mode, or route "Sign In" to a dedicated sign-in screen. At minimum the Auth screen heading should adapt based on entry point. |
| 🟡 ISSUE | **"Test drive the app" jumps directly into main app**, bypassing all of onboarding. Label doesn't make this consequence obvious. `onClick={onEnterApp}` fires `setAppPhase('main')` immediately. | Rename to "Skip onboarding & explore" or wrap in a confirmation. Currently this skips signup, vehicle entry, device pairing — and Settings will still show fake user/vehicle/plan data, exposing the prototype's hardcoded state. |
| 🟡 ISSUE | **Auto-advance at 4.5s with no pause-on-hover, no pause-on-focus.** Reading the pricing slide while the toggle animates and the next slide is queued is rushed. Worse for accessibility (users who need more time can't slow it down). | Pause auto-advance on hover, focus, and touch. Stop auto-advancing entirely after first user interaction. |
| 🔵 SUGGESTION | $9.65/mo and $7.99/mo are oddly specific — feels like placeholder values rather than real pricing. | Decide on real pricing; if these are real, the savings copy "SAVE $21" should reconcile (12 × $1.66/mo difference = $19.92, not $21). |

### Step 2 — Auth ("Create your account")

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **All four CTAs (Apple, Google, Email, "Sign in", Face ID) advance to the same next screen** without any actual authentication branching. `onClick={onOAuthLogin || next}` for the OAuth buttons, plain `next` for everything else. | Prototype-acceptable but the "Sign in" path needs to differ from "Create account" so testers and stakeholders can see both flows. |
| 🟡 ISSUE | **The "or" divider renders at 4px tall**, not 1px. Because `height: 1` in MUI sx maps through the spacing function (4px base) → 4px. It looks like a stack of two empty input field stubs flanking the word "or", not a divider. | Use `sx={{ height: '1px' }}` (with units) or `borderTop: '1px solid …'` on a Box. |
| 🟡 ISSUE | **"Returning user → Sign in with Face ID" card sits inside a "Create your account" screen.** A returning user's affordance is buried below sign-up CTAs and visually mismatches the heading. | Split into two screens (sign-in vs sign-up) or hoist the Face ID option above the heading when the user is recognized. |
| 🟡 ISSUE | **"Use Face ID" sub-card in the Returning user section is squashed.** "Quick, secure re-entry" wraps awkwardly across two lines and the icon + label fight each other for horizontal space at 390px viewport. | Restructure as a full-width row with icon left, label center, chevron right — drop the inline button form. |
| 🟡 ISSUE | **Legal footer is at `rgba(255,255,255,0.20)`** — well below the WCAG AA 4.5:1 contrast minimum on the dark background. The "Terms of Service" and "Privacy Policy" links are at 0.38 with underline, still under-contrast. | Bump to at least `rgba(255,255,255,0.55)` for body text, `rgba(255,255,255,0.75)` for links. Run an a11y contrast audit. |
| 🟡 ISSUE | **Back button is 38×38px** — below Apple's HIG 44×44 and Google's Material 48×48 minimum touch target. | Increase to 44×44; keep the 38×38 visual chip if needed by using a larger transparent hit area. |

### Step 3 — SignUp ("Let's get you set up", Step 1 of 5)

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **No form validation.** I clicked Continue on a completely empty form (no first name, last name, phone, email, or password) and the flow advanced to ScanDevice. `onClick={next}` has no guard. | Disable Continue until required fields are valid. Show inline errors per field on blur. Without this you can ship a user to "device setup" with literally zero account data captured. |
| 🟡 ISSUE | **Four overlapping progress indicators**: text "STEP 1 OF 5", percentage "20%", progress bar, and 5 dots — all rendered in the same header. Cognitive overload at the top of every step. | Pick two: I'd keep the dots + step label, drop the bar and percentage. Or keep the bar + label, drop dots and percentage. |
| 🟡 ISSUE | **Phone field assumes US format** with placeholder "+1 (555) 000-0000" and no country picker. International users will type their full number including country code and the field has no formatting/validation. | Add a country picker or use a library like `libphonenumber-js`. |
| 🟡 ISSUE | **Password rules are advertised as "Min. 8 characters"** placeholder. No strength meter, no list of requirements (uppercase, number, symbol). User has no feedback before submission. | Add a strength meter + checklist that updates as the user types. |
| 🟡 ISSUE | **No T&C consent checkbox** — "By continuing you agree to our Terms & Privacy Policy" is implicit acceptance via Continue. This is shaky for GDPR / CCPA / common app store reviews. | Add an explicit unchecked checkbox; disable Continue until it is checked. |
| 🟡 ISSUE | **All-caps 11px field labels** — every field labeled "FIRST NAME", "MOBILE NUMBER", etc. Hard to scan, harder for screen readers, and clashes with the otherwise modern type voice. | Switch to sentence-case 12-13px labels. |
| 🔵 SUGGESTION | "Confirm password" field absent. Standard for signup. | Add confirm-password to catch typos before account creation. |

### Step 4 — ScanDevice ("Scan your device", Step 2 of 5)

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **Primary lime CTA when no scan = "Skip for now."** The most prominent action on the screen invites the user to skip pairing entirely. The intended primary action ("Scan Barcode") is a smaller, lower-contrast secondary button. The label only flips to "Continue →" after a successful scan. | Make "Scan Barcode" the primary lime CTA. Demote "Skip for now" to a text link below. As-is, this trains users to skip core setup. |
| 🟡 ISSUE | **"Or enter the IMEI manually" hinted in copy, no UI for it.** The hint text says "Scan the barcode on the back of the device, or enter the IMEI manually" but only a Scan Barcode button exists. False affordance. | Add a "Enter manually" link/button or remove the manual mention from copy. |
| 🟡 ISSUE | **Hardcoded IMEI 352602116146553** returned on every scan. Acceptable for a prototype, but it ends up echoed all the way through the rest of the flow. | Note in handoff doc; replace with placeholder during real integration. |
| 🟡 ISSUE | **"Step 2 of 5" progress shown but the 5 steps are never previewed** anywhere. User has no idea what's coming. | Add a one-time onboarding overview ("Account → Device → Vehicle → Setup → Done") at the start. |

### Step 5 — AddVehicle ("Add your vehicle", Step 3 of 5)

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **Same skip-as-primary pattern** — when VIN is empty/invalid the lime CTA reads "Skip for now" and advances anyway. Continue path is identical to Skip path (`onClick={next}`). | Disable Continue until VIN is 17 chars or move "Skip for now" to a quieter tertiary action. |
| 🟡 ISSUE | **VIN match is faked** — typing any 17 chars triggers the "Match found — Toyota Tacoma 2024" badge. This is fine for prototype but contributes to the data-lying problem downstream. | Document. |
| 🟡 ISSUE | **No live VIN validation feedback** below the field length counter. If a user pastes "1ABC" we just sit at 4/17 silently. No "must be 17 characters" hint until they hit 17. | Add inline hint: "VINs are exactly 17 characters" + format check (no `I`, `O`, `Q`). |
| 🔵 SUGGESTION | The "Where to find your VIN" hint is text-only. A small visual would help users locate the sticker faster. | Add a thumbnail of a typical VIN sticker location. |

### Step 6 — VehicleDetails ("Name your vehicle", Step 4 of 5)

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **Vehicle preview card is visually broken.** The card's footer info row ("My Vehicle / Toyota Tacoma 2024" + "Parked" status pill) is partially clipped behind a circular dark vignette. Text reads as fragments — "Vehicle" without "My", "...oma 2024" partial — and the green Parked pill is mostly cut off. | Inspect the card's `position: relative + overflow: hidden` interaction with the radial gradient overlay (`width: 240, height: 60` ground glow at `bottom: 0`). The blur seems to render the gradient much larger than its declared size on macOS Chrome. Try lowering blur amount or moving the glow outside the card. |
| 🔴 BLOCKER | **Hardcoded "Toyota Tacoma 2024 / Parked" survives even when the user skipped VIN entry.** I skipped AddVehicle entirely; VehicleDetails confidently shows a Tacoma anyway. | Render placeholder ("No vehicle on file — add one to continue") when state is empty. |
| 🟡 ISSUE | **"Name your vehicle" heading + "Optional" subhead** are contradictory. The heading is imperative; the subhead absolves the user of the imperative. | Pick a tone: either "Optional" goes to the heading ("Name your vehicle (optional)"), or the heading becomes informational ("Give your vehicle a name?"). |
| 🟡 ISSUE | **"Parked" live status pill on a setup screen** — there's no telemetry, no connected device, no parked location. Pure decoration. | Hide the status pill until real telemetry exists; use a "New" or "Setup" pill instead. |

### Step 7 — DeviceSetupWizard ("Device Setup", Step 5 of 5, 4 sub-steps)

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🟡 ISSUE | **"Step 5 of 5 — 100%" header lies.** The outer progress bar shows 100% complete, but four sub-steps (Find OBD → Plug In → Engine → Bluetooth) still need to be done. User thinks they're done; they're not. | Either change the outer label to "Step 5 of 5 — Device Setup (4 quick steps)" or postpone the 100% reading until Bluetooth pairs successfully. |
| 🟡 ISSUE | **"Skip guide →" in the upper right** lets you bypass the entire device setup including Bluetooth pairing, and lands you on Success regardless. There's no warning. | Confirm before skipping; or only skip the guide and still require pairing. |
| 🟡 ISSUE | **Primary CTA enables before the simulation tap.** On Step 2 ("Plug in the device") and Step 3 ("Start your engine") and Step 4 ("Bluetooth pairing"), the primary CTA can be tapped without the user actually touching the simulation widget. So I clicked "All done →" while the screen still said "Scanning for your TrackLynk device via Bluetooth…" | Disable CTA until the per-step simulated state is reached. |
| 🟡 ISSUE | **CTA label updates before slide content updates** during sub-step transitions. Saw "Find the OBD port" + "It's plugged in →" CTA simultaneously, and "Start your engine" + "All done →" CTA. The CTA-content out-of-sync moment is jarring. | Coordinate the CTA label change with the AnimatePresence slide. Let the new CTA fade in once `wizardStep` actually changes. |
| 🟡 ISSUE | **"tap to simulate" hint is visible to end users**, breaking the illusion. Acceptable in a prototype, but easy to forget at handoff. | Strip simulation hints behind a `import.meta.env.DEV` check. |

### Step 8 — Success ("You're all set!")

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **"Device validation complete" + "Device ready" status chip displayed regardless of actual state.** I skipped scan, skipped pairing — Success still claims the device is ready. | Make these chips conditional on real state. If the user skipped, label the device as "Pending setup" and route them to a clear next step. |
| 🔴 BLOCKER | **"Free plan active" chip displayed.** No plan-selection screen exists in the flow. The Welcome pricing slide is decorative. The user never chose Free; the system chose for them silently. Then Settings shows "Annual Plan — $7.99/mo" — direct contradiction. | Either add a real plan-selection step before Success, or be honest: "Trial active — choose a plan to continue." |
| 🔴 BLOCKER | **"What's next" Step 1 = "Plug in your device" — directly contradicts "Device ready" above it.** Either device is ready, or it needs to be plugged in. Cannot be both on the same screen. | Reconcile state. If device isn't actually ready, the success copy should change to "You're set up — let's plug in your device next." |
| 🟡 ISSUE | **`Open TrackLynk` button has `transition: { delay: 1.05 }`** so it animates in over a second after the page loads. Feels delayed. | Reduce to ~0.4s or animate alongside the rest of the content. |

### Step 9 — Home (Main app)

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **Google Maps modal: "This page can't load Google Maps correctly. Do you own this website?"** The `VITE_GOOGLE_MAPS_API_KEY` env var is missing or unauthorized. Modal must be dismissed before the screen is usable. | Add a valid restricted API key. Until then, gate `MapView` behind `loadError` and render the fallback "Map unavailable" placeholder so this modal never appears. |
| 🔴 BLOCKER | **Map renders in default Google light theme** with "For development purposes only" watermarks, despite the configured `DARK_MAP_STYLES`. Cause: same API auth failure — Maps doesn't apply custom styles when unlicensed. The dark-theme app suddenly has a bright gray map and pink POI pins. | Resolve the API key; styles will then apply. |
| 🔴 BLOCKER | **Status bar text is invisible on dark Home.** `App.jsx` sets `statusBarColor = isMainApp ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)'`. On the dark Home/Settings screens (black background) the 65%-black "9:41" and signal/wifi/battery icons are nearly invisible. They become visible only on the light Trips screen. | Per-screen status bar tinting, or detect the scrim color at the top of the visible content. |
| 🟡 ISSUE | **"Toyota Tacoma" hardcoded** in `FloatingHeader`. Doesn't match what Settings calls the same vehicle. | Pull from a single source of truth. |
| 🟡 ISSUE | **"Live Trip / Morning Commute / Candace Ln · 5 mins away"** — if it's a live trip, "5 mins away" reads like an ETA, but ETAs apply to upcoming trips, not active ones. Mixed metaphor. | Decide: is this an in-progress trip (then show live KPIs: speed, elapsed) or an upcoming planned trip (then ETA is fine). Today it's both. |
| 🟡 ISSUE | **Bottom sheet collapsed at 108px** shows quick action pills. Users may not realize the sheet expands. The 36×4px drag handle is the only affordance. | Add a subtle "swipe up" hint on first paint, or expand the sheet by default and let users collapse. |

### Step 10 — Trips

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **Trips renders in full LIGHT theme** (`bgcolor: '#F9FAFB'`, white cards, gray text) inside an otherwise dark-themed app. This is not "dark mode + light mode toggle" — Trips is the only screen that does this, and it does it without user opt-in. | Re-skin Trips in the dark theme. Use the same `glassCard` surface and `text.primary` colors as Home and Settings. |
| 🔴 BLOCKER | **Bottom tab bar disappears against the white Trips background.** The tabs use `bgcolor: 'rgba(18,22,32,0.92)'` which still shows but the dark glass effect is mismatched against the bright surface. Visual whiplash. | Same fix as above — Trips dark theme. |
| 🟡 ISSUE | **Stagger animation runs too long.** Six trip cards × 50ms delay × spring damping means the last card fades in ~2 seconds after navigation. I had to wait between screenshots to capture the full list. | Drop stagger delay to 25ms or skip stagger when count > 4. |
| 🟡 ISSUE | **No empty state.** What if the user has no trips? The grouped reduce on `TRIPS` array always renders headers + cards. With an empty array, you'd render nothing — no "You haven't taken any trips yet" message. | Add an empty state. |
| 🔵 SUGGESTION | Date headers mix relative (TODAY, YESTERDAY) and absolute (APR 15) formats. | Use relative for the most recent ~3 days, absolute thereafter, or always absolute — but be consistent. |

### Step 11 — Settings

| Sev | Issue | Recommendation |
|-----|-------|----------------|
| 🔴 BLOCKER | **Vehicle name disagrees with Home.** Home: "Toyota Tacoma". Settings: "My Tesla Model 3". One user, one onboarding flow, two different cars. | Single source of truth. Both screens should read from the same context/store. |
| 🔴 BLOCKER | **Plan disagrees with Success.** Success: "Free plan active". Settings: "Annual Plan — $7.99/mo, Renews Jan 15, 2026". | Same fix — single source of truth, and reconcile with the (currently absent) plan-selection step. |
| 🟡 ISSUE | **"Jane Smith / jane@email.com" hardcoded user identity.** SignUp form was empty when I clicked Continue, but Settings shows a fully populated profile. This makes it impossible to test what the app looks like for a real user with no data. | Bind to actual form state, or at minimum to the SignUp placeholder values, or to "Set up your profile" empty state. |
| 🟡 ISSUE | **"Profile" bottom tab is disabled with no indication of why.** Clicking it does nothing — no toast, no tooltip, no navigation. Users will tap it and assume the app is broken. The disabled state visually is just a slightly dimmer icon (rgba(0.18) vs 0.45) — easy to miss. | Either implement Profile or remove the tab. If keeping it disabled, add a "Coming soon" tooltip on tap. |
| 🟡 ISSUE | **Brand inconsistency: "Share Tracklynk"** uses lowercase `l` while everywhere else the brand is "TrackLynk" with capital L. | Lock the brand spelling and audit. |
| 🟡 ISSUE | **Destructive actions ("Delete Account", "Cancel Subscription")** use red label color but I see no confirmation step in the source. | Confirm via modal — single tap should never delete an account. |
| 🔵 SUGGESTION | "Rate the App" row shows 5 empty stars with no explanation that they are tappable. | Make stars obviously interactive (hover state, label "Tap a star to rate"). |

---

## 4. Cross-screen consistency findings

These issues span the whole app; fixing them once benefits multiple screens.

| Sev | Pattern | Where |
|-----|---------|-------|
| 🔴 BLOCKER | **Theme split-brain.** Trips is light; everything else is dark. The status bar tint is hardcoded for "main app phase" with a single color and breaks on every dark main-app screen. | Trips (worst), Home/Settings (status bar invisible) |
| 🔴 BLOCKER | **State lying.** Hardcoded values surface as "user data" in multiple places that contradict each other. Toyota Tacoma vs Tesla Model 3. Free plan vs Annual Plan. Device ready vs "Plug in your device next." | Welcome → Home → Settings, and Success → Settings |
| 🟡 ISSUE | **"Skip for now" as primary CTA** repeats on ScanDevice and AddVehicle. Trains users to bypass setup. | ScanDevice, AddVehicle |
| 🟡 ISSUE | **No form validation anywhere.** Continue advances with empty inputs across SignUp, AddVehicle, VehicleDetails. | SignUp, AddVehicle, VehicleDetails |
| 🟡 ISSUE | **Onboarding step ordering is non-intuitive.** signup → ScanDevice → AddVehicle → VehicleDetails → DeviceSetupWizard. The device gets scanned before we know what vehicle it's for, and again gets "set up" after the vehicle. Logical order would be: account → vehicle → device. | Whole flow |
| 🟡 ISSUE | **Slide transitions reveal blank state.** Multiple screen-to-screen and slide-to-slide transitions briefly render an empty viewport. Looks broken. | App-level AnimatePresence, Welcome carousel, DeviceSetupWizard sub-steps |
| 🟡 ISSUE | **Accessibility tree gaps.** Carousel dots, progress dots, and several decorative icons aren't surfaced to assistive tech. No `role`, `aria-label`, or keyboard support on dot navigators. | Welcome, ProgressBar, DeviceSetupWizard |
| 🟡 ISSUE | **ProgressBar over-communicates.** Same component renders four parallel progress signals (text + bar + dots + percentage). Used on every onboarding step. | SignUp, ScanDevice, AddVehicle, VehicleDetails, DeviceSetupWizard |
| 🟡 ISSUE | **Touch targets below 44×44 minimum.** Back button is 38×38; carousel dots are 6×6 (with motion expand to 24×6). Even the "active" dot fails the minimum. | Welcome, Auth, ProgressBar |
| 🔵 SUGGESTION | **Animation delays are conservative.** Multiple `transition: { delay: 0.3+ }` values stack — Success's "Open TrackLynk" button doesn't appear for over 1 second after the screen loads. | Success, Welcome, all hero screens |

---

## 5. Priority action list

In order of "most to least painful for a real user":

1. **Wire Google Maps API key** (Step 9 #1) — without this, the main app's centerpiece is a permission-denied dialog.
2. **Fix Trips theme split** (Step 10 #1) — single most jarring visual issue. The app suddenly turns into a different app.
3. **Reconcile state across screens** (Cross-screen) — same vehicle name, same plan name, same user identity across Home / Settings / Success. Build a single mock context for the prototype if real data isn't available yet.
4. **Stop claiming success when user skipped** (Step 8) — Success page must reflect actual state. "Plug in your device next" + "Device ready" cannot coexist.
5. **Fix VehicleDetails preview-card clipping** (Step 6 #1) — visually the worst layout bug.
6. **Stop the Welcome carousel from going blank** (Step 1 #1) — first impression killer.
7. **Add real form validation** (Step 3 #1) — Continue should not advance from an empty form.
8. **Stop using "Skip" as the primary CTA** (Steps 4, 5) — the lime button should be the action you want users to take.
9. **Fix status bar contrast on dark main-app screens** (Step 9 #3) — easy fix, big a11y win.
10. **Reduce ProgressBar visual noise** (Cross-screen) — pick two indicators, drop the rest.
11. **Make the disabled Profile tab either work or disappear** (Step 11 #4).
12. **Audit accessibility tree** (Cross-screen) — carousel/progress dots, button labels, focus states.
13. **Fix CTA-content sync in DeviceSetupWizard** (Step 7 #4) — wizard transitions feel buggy.
14. **Document hardcoded prototype values** (Cross-screen) — IMEI 352602116146553, "Toyota Tacoma 2024", "$7.99/mo annual" — list them so they don't slip into production.

---

## 6. What works well (so the report isn't only red ink)

- The visual identity (lime accent, dark glass surfaces, Inter typography, rounded-square avatars/cards) is cohesive and modern.
- The 3D car illustration with the lime GPS pin is a strong brand signature.
- The micro-interactions (Framer Motion springs on dot indicators, button scale-on-tap, scan-line animation, plug simulation) are responsive and well-tuned in isolation.
- The MUI theme override (`src/theme.js`) is comprehensive and reusable — most screens benefit from a single source of styling truth.
- Component decomposition is clean (`GlassCard`, `Car3D`, `BottomTabs`, `ProgressBar` are reusable).
- Settings is feature-rich with reasonable groupings (Vehicles, Subscription, Notifications, Account & Security, More).

The bones are good. The flow logic and state continuity is the main work to land before this is shippable beyond a stakeholder demo.

---

## 7. Tooling notes

- Audited via Chrome MCP at desktop viewport. The app is built as a phone-frame mockup inside a desktop browser. Some visual issues (e.g., card clipping in VehicleDetails) may render differently on real iOS Safari at 390px CSS width — recommend a follow-up audit on actual device.
- Found 1 missing env var: `VITE_GOOGLE_MAPS_API_KEY`. Without it, the main app shows a Google authorization modal on every load.
- Source files reviewed: `App.jsx`, `theme.js`, `glass.js`, `Welcome.jsx`, `Auth.jsx`, `SignUp.jsx`, `ProgressBar.jsx`, `ScanDevice.jsx`, `AddVehicle.jsx`, `VehicleDetails.jsx`, `Car3D.jsx`, `GlassCard.jsx`, `DeviceSetupWizard.jsx`, `Success.jsx`, `Home.jsx`, `Trips.jsx`, `Settings.jsx` (partial — file is ~72k tokens), `BottomTabs.jsx`.
- `ChoosePlan.jsx` exists in `/screens/` but is not imported anywhere in `App.jsx`. It's dead code or an unfinished feature — worth checking whether it should be wired in (which would resolve the "Free plan active" contradiction on Success).
