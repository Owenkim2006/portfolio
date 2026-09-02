@AGENTS.md

# Owen Kim — Portfolio v2

A neuroscience-themed personal portfolio for Owen Kim (o5kim@uwaterloo.ca), a biomedical engineering student at the University of Waterloo. The central conceit: an interactive 3D brain where each anatomical region navigates to a portfolio section.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router), React 19.2.4 |
| Language | TypeScript (strict mode, path alias `@/*` → `./src/*`) |
| 3D | Three.js v0.184, React Three Fiber v9, Drei v10, React Spring Three |
| Animation | Framer Motion v12.38.0 (2D/scroll), React Spring (3D) |
| Styling | Tailwind CSS v4 with `@tailwindcss/postcss`, custom CSS variables |
| Canvas | Native 2D Canvas (NeuronCanvas), WebGL (Brain3D via R3F) |
| Notifications | react-toastify (ToastContainer in layout, showToast() helper in Toast.tsx) |

---

## Project Structure

```
src/
  app/
    layout.tsx        # Root layout — fonts (Inter, JetBrains Mono), OpenGraph meta, ToastContainer
    page.tsx          # Main page — renders Navbar, SectionDotNav, Hero, Projects, Research,
                      #   Experience, Contact, BrainWidget, Footer (CLIENT component)
    globals.css       # Design system: CSS vars, keyframes, Tailwind @theme block
  components/
    layout/
      Navbar.tsx          # Fixed header, scroll-blur trigger, useActiveSection highlight
      Footer.tsx          # Stack attribution (static)
      NeuronCanvas.tsx    # 2D particle neuron field (hero background)
      Brain3D.tsx         # 3D interactive brain (R3F, dynamic import, no SSR)
      SectionDotNav.tsx   # Right-side fixed 5-dot section navigator (lg+ only)
      BrainWidget.tsx     # Bottom-right floating panel: lobe facts carousel
      NodeButton.tsx      # Pulsing orbital-ring nav button (built, not yet used in page)
      EEGProgressBar.tsx  # Animated EEG trace canvas (built, not yet rendered in page.tsx)
    sections/
      Hero.tsx        # Full-viewport hero with Brain3D background, scroll-fade indicator
      Research.tsx    # Sidebar + cards from src/data/research.ts
      Projects.tsx    # Filter bar + 2-col grid from src/data/projects.ts
      Experience.tsx  # Animated timeline from src/data/experience.ts
      Contact.tsx     # CTA with email/GitHub/LinkedIn
    ui/
      AnimateOnScroll.tsx # Framer Motion inView wrapper ("actionPotential" preset)
      Toast.tsx           # Global toast system (module-level listener set, no Context)
  data/
    research.ts     # 2 research items (typed ResearchItem[])
    projects.ts     # 2 projects (typed Project[])
    experience.ts   # 2 experience items (typed ExperienceItem[])
  hooks/
    useActiveSection.ts   # IntersectionObserver hook — returns active section ID string
    useScrollProgress.ts  # Thin wrapper around Framer Motion useScroll()
  lib/
    theme.ts        # Centralized color/section constants mirroring CSS vars
  types/
    index.ts        # ResearchItem, Project, ExperienceItem, SocialLink interfaces
public/
  fonts/            # Placeholder (empty — fonts loaded from Google Fonts in layout)
  models/           # Placeholder (empty — Brain3D geometry is procedurally generated)
```

---

## Design System

All colors are defined as CSS custom properties in `globals.css` and mirrored in `src/lib/theme.ts`.

| Token | Value | Usage |
|---|---|---|
| `--neural-purple` | `#7F77DD` | Hero, general accent |
| `--synapse-teal` | `#1D9E75` | Research section |
| `--axon-amber` | `#BA7517` | Projects section |
| `--dendrite-coral` | `#D85A30` | Experience section |
| `--bg-primary` | `#0a0a12` | Page background (very dark blue) |
| `--text-primary` | `#f0f0f5` | Body text |
| `--text-secondary` | `#9898b0` | Dimmed text |
| `--text-muted` | `#5a5a78` | Subtle text |

**Keyframes:** `signal` (scale pulse), `nodeBreathe` (oscillating scale), view-transition-group animations.

When adding new sections or colors, update **both** `globals.css` (CSS vars) and `src/lib/theme.ts` (JS constants) together.

---

## Key Components

### `NeuronCanvas.tsx`
- ~194 neurons: 64 on brain outline (ray-cast rejection sampling against Bézier/harmonic brain shape) + 130 interior points
- Physics: spring forces pull nodes home; mouse proximity triggers "firing" glow effect
- Edges connect nodes within 0.17 normalized units
- Signal particles travel edges with chained pulses (35% chance to spawn second pulse)
- Glow via `shadowBlur`; responds to window resize and mousemove

### `Brain3D.tsx`
- Dynamically imported with `{ ssr: false }` — Three.js cannot run on the server
- 7 lobes rendered as deformed spheres with noise-based sulci; cerebellum uses folia geometry
- Corpus Callosum rendered as a 3D tube connecting lobes
- **Lobe → Section mapping (actual):**
  - Frontal Lobe, Parietal Lobe, Temporal Lobe L → Research
  - Temporal Lobe R, Occipital Lobe → Projects
  - Cerebellum → Experience
  - Brainstem → Contact
- Hover: color shifts to section accent + emissive glow (dark `#1e1e38` → accent)
- Click: fires `onSectionClick` prop; Hero and BrainWidget each wire this up differently
- Dashed bezier connections between lobes with animated `InstancedMesh` signal particles (~2 per connection)
- `OrbitControls` with auto-rotate; zoom/pan disabled
- Accepts `miniMode` prop (used inside BrainWidget facts panel) and `heroMode` prop (used in Hero)
- DPR clamped to 1.5 max in non-hero mode; heavy memoization of geometry/materials

### `SectionDotNav.tsx`
- Fixed to right edge of viewport, hidden below `lg` breakpoint
- 5 dots: hero, projects, research, experience, contact
- Active dot expands to a colored pill; hover shows tooltip label
- Clicking scrolls to the target section
- Uses `useActiveSection` hook for active state

### `BrainWidget.tsx`
- Floating button fixed bottom-right (z-50); pulses 3× when user scrolls past 25% of page
- Opens a panel showing an auto-cycling lobe facts carousel synced to active section via `useActiveSection`

### `EEGProgressBar.tsx`
- Simulates alpha (10 Hz), beta (22 Hz), theta (6 Hz), delta (2 Hz) EEG bands on a 2D Canvas
- K-complex spikes every ~3.7 s; sweep cursor + ghost preview of next 10 s cycle
- **Not currently rendered in `page.tsx`** — component is built but unused

### `NodeButton.tsx`
- Pulsing orbital-ring nav button with concentric ring animation
- **Not currently used anywhere** — built but not wired into any page or layout

### `AnimateOnScroll.tsx`
- Framer Motion `useInView` wrapper with `margin: "-80px"` (fires before element fully enters view)
- Custom `actionPotential` preset: opacity 0→1, y bounce (20 → -4 → 1 → 0), scale bounce (0.98 → 1.02 → 0.995 → 1)
- Accepts optional `delay` prop for staggered lists

### `Toast.tsx`
- Global toast notifications without React Context — uses a module-level `Set` of listeners
- Call `showToast(message, type)` from anywhere; `ToastContainer` in `layout.tsx` renders them
- Auto-dismiss after 2.5 s; two styles: `info` (purple border), `success` (teal border)
- Currently used in `Research.tsx` to show "Coming soon" for outputs without `href`

---

## Custom Hooks

### `useActiveSection.ts`
- Takes a `sectionIds` string array + options (`threshold`, `defaultId`)
- Creates one `IntersectionObserver` per section ID; returns the currently intersecting section ID
- Used by: `Navbar`, `SectionDotNav`, `BrainWidget`, `Research` sidebar

### `useScrollProgress.ts`
- Thin wrapper around Framer Motion's `useScroll()`
- Returns `scrollYProgress` motion value
- Used by `Hero.tsx` to fade out the scroll indicator

---

## Data

All content lives in typed arrays in `src/data/`. To add items, append to the array — components map automatically.

### `research.ts` — `ResearchItem[]`
1. "Neural Signal Decoding for Motor Prosthetics" — UW NeuroEng Lab, **current**. EEG→motor intent for prosthetics. First-author NeurIPS 2025 submission in prep. Outputs: UW Research Symposium 2025 poster, BME Seminar talk.
2. "Automated Seizure Detection via Self-Supervised EEG Representation Learning" — Toronto Western Hospital, **completed** Jan–Aug 2024. 12% F1 improvement. Output: EMBC 2024 conference paper.

### `projects.ts` — `Project[]`
1. "NeuroLink Dashboard" — EEG monitoring + seizure detection. 1st place MedHacks 2024, <200ms latency on Pi 4, 120+ GitHub stars. Featured, ai-health.
2. "Synapse Annotator" — EM stack segmentation with SAM + active learning. 60% annotation time reduction. Used by 2 UW labs. Featured, ai-health.

### `experience.ts` — `ExperienceItem[]`
1. NeurotechX Student Chapter UW — Product Lead (startup, Sep 2023–present). 12-person team, $3k prototype v1, $8k grants, 20+ user research sessions.
2. MedTech Co. — Software Engineering Intern (industry, May–Aug 2024). Wearable sensor data pipeline, 35% latency cut, FHIR RFC authorship.

### `types/index.ts` — Interfaces
- `ResearchItem`: id, title, institution, institutionShort, role, dateRange, description, tags[], status, highlight?, outputs[] (type, label, href?)
- `Project`: id, name, tagline, description, category, tags[], outcomes[], featured, links[] (label, href, type)
- `ExperienceItem`: id, company, role, dateRange, location, type, description, wins[], stack[]
- `SocialLink`: label, href, icon — **defined but not used in current codebase**

---

## Current State

All core components are built, wired, and functional:
- `page.tsx` renders the full page: `NeuronCanvas` (fixed bg) → `Navbar` → `SectionDotNav` → `Hero` → `Projects` → `Research` → `Experience` → `Contact` → `BrainWidget` → `Footer`
- `Hero.tsx` renders `Brain3D` in heroMode as its background layer
- Scroll-based active section tracking works across Navbar, SectionDotNav, BrainWidget, and Research sidebar
- `BrainWidget` floating panel: facts + rule-based chat, both functional
- Toast system: operational via `showToast()` helper
- All 4 portfolio sections animated (Framer Motion scroll-in, timeline, filter transitions)
- Git: one commit (`Initial commit from Create Next App`) — all current work is uncommitted

---

## What's Incomplete / Not Yet Wired

- **`EEGProgressBar.tsx`** — fully built but never imported/rendered in `page.tsx`. Add it if the scrolling EEG trace is desired.
- **`NodeButton.tsx`** — fully built but not used anywhere. Intended as an orbital nav control; never integrated.
- **Contact form** — `Contact.tsx` has only mailto/GitHub/LinkedIn links. No serverless form handler.
- **Research output `href`s** — some outputs have `href: undefined` (shows "Coming soon" toast). Populate when links are available.
- **Mobile 3D fallback** — no performance degradation strategy or static image fallback for low-end mobile.
- **No tests** — no Jest, Vitest, or Playwright configured.
- **No CI/CD** — no GitHub Actions, no `vercel.json`. Ready to deploy to Vercel as-is (App Router auto-detected).
- **`public/fonts/`** is empty — fonts load from Google Fonts CDN via `layout.tsx`. Add `.woff2` files here if self-hosting.
- **`public/models/`** is empty — Brain3D geometry is fully procedural; no external model files needed.
- **`SocialLink` type** — defined in `types/index.ts` but unused.

---

## Important Notes

1. **Next.js 16.2.4** — newer than training data. Read `node_modules/next/dist/docs/` before using any Next.js API. APIs may differ from what you expect.
2. **React 19** — `'use client'` directive required on any component using hooks or browser APIs.
3. **Tailwind v4** — uses `@theme` directive in `globals.css`. No `tailwind.config.*` file exists.
4. **Three.js / R3F** — never import at the module level in a server component. Always use `dynamic(..., { ssr: false })`.
5. **Theme consistency** — updating colors requires changes in both `globals.css` (CSS vars) and `src/lib/theme.ts` (JS constants).
6. **Data files are the CMS** — no database. Add a project by appending to `src/data/projects.ts`.
7. **Brain3D lobe mapping** — frontal/parietal/temporal_L → Research; temporal_R/occipital → Projects; cerebellum → Experience; brainstem → Contact. The old CLAUDE.md mapping was inaccurate.
