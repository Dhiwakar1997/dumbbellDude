# Dumbbell Dude

**Lift heavy, log heavier.** A friendly, slightly cheeky gym companion: a mobile-first workout tracker for one lifter,
with all data kept on the device (localStorage). No account, no server.

- **Home**: greeting, training streak, this week's workouts and volume, last workout, a big "Start workout" button.
- **Start workout**: pick a routine or start empty. **Active workout**: elapsed timer, exercises with set rows
  (weight, reps, done tick), add exercise / add set, a rest timer after each ticked set, and finish/discard confirms.
- **Exercise library**: ~40 built-in exercises, search, muscle-group filter, and custom exercises.
- **Routines**: a list and an editor (name, ordered exercises, target sets × reps).
- **History**: workouts grouped by week. **Workout detail**: sets, total volume, duration and PR badges.
- **Progress**: pick an exercise to see its best set over time (a hand-drawn SVG chart) and its personal records.
- **Settings**: kg/lb (weights are always stored in kg), default rest time, JSON export/import, reset everything.

Stack: Vite 5, React 18, TypeScript (strict), react-router-dom 6, plain CSS built from design tokens, and Vitest with
Testing Library and jsdom. No UI kit, chart library or state library.

## How it was built with Trussel

Dumbbell Dude was built end to end with the Trussel IDE workflow, in a local sandbox branch:

1. **UI design in Trussel**: design set **`D-ZWEKZCRHB5` "Dumbbell Dude App"** (latest version **v178**).
   It has 20 phone screens: the 8 product screens, plus empty, error and overlay variants. It has 33 reusable
   components, a dark-first style guide (lime accent `#c6ff3d`), and a clickable prototype with 63 flow links,
   31 interactions and 7 screen states. Every screen was checked with `snapshot_screen` for overflow, clipping and
   contrast.
2. **Architecture design in Trussel**: pass **"Dumbbell Dude v1"** (`P-3`), committed at revision 1, with
   **199 nodes and 253 edges**. The nodes cover domain entities and pure logic, application ports and 6 use-case
   services, LocalStorage adapters, 32 UI components, 12 screens, and the composition root and router. They are
   placed in Trussel's detected columns: routes → components → hooks → apiClients → types, plus toolkit.
   Every UI node names the design screen (`S-…`) and component (`C-…`) IDs it implements.
3. **Implementation**: every design node is stamped in the code (`// trussel: <node ID>@1`), and there are
   199 stamps in `src`.
4. **Verification**: `request_analysis` reports **199 of 199 nodes implemented**. The design was rechecked against
   the code for Home, Active workout and Progress, and the mismatches found were fixed. The full story, with every
   ID, decision and open item, is in [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md).

### Layout (dependencies point inward)

```
src/domain/          entities + pure logic (volume, PRs, streak, kg/lb, validation) — no I/O, no React
src/application/     use-case services + ports (repository interfaces, Clock, IdGenerator)
src/adapters/        LocalStorage repositories (versioned keys, schema envelope, safe JSON parse), clock, UUIDs, seed
src/ui/components/   presentational components matching the design set's components
src/ui/screens/      one screen per design screen
src/app/             composition root (createServices), services context, router
```

## Run, test, build

Requires Node 18 or later (Netlify is configured for Node 22).

```bash
npm install          # install dependencies
npm run dev          # dev server at http://localhost:5173
npm test             # vitest run: 98 tests (domain, services, repository contract, screens)
npx tsc --noEmit -p tsconfig.app.json   # type-check
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build locally
```

## Deploy to Netlify

`netlify.toml` is already set up: build command `npm run build`, publish directory `dist`, and an SPA fallback
(`/*  /index.html  200`) so deep links such as `/history/123` work.

**Option A: connect the repo (recommended)**
1. In Netlify, choose *Add new site → Import an existing project* and pick this GitHub repository.
2. Build command: `npm run build`. Publish directory: `dist`. These are read from `netlify.toml`.
3. Deploy. Every push to the connected branch redeploys.

**Option B: Netlify CLI**
```bash
npm run build
netlify deploy --prod --dir dist
```

## Evidence

Screenshots of the Trussel design set, the architecture canvas, the analysis results and the running app are in
[`docs/evidence/`](docs/evidence/). This is a placeholder: add the images there.
