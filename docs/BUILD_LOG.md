# Dumbbell Dude — Build Log

Times in IST (Asia/Kolkata).

## Status at a glance
- **Run 1 (2026-11-01): Phase 0 + Phase 1 — DONE.** Design set D-ZWEKZCRHB5 v178.
- **Run 2 (2026-11-01): Phase 2 + Phase 3 — DONE.** Scaffold commit e866bc1; pass P-3 committed (rev 1,
  199 nodes, 253 edges, 0 violations).
- Next run: **Phase 4 — Implement** (stamps `// trussel: <T-ID>` above each definition).

## Run 1 — Phase 0 + Phase 1 (2026-11-01)

### Phase 0 — Orient (done)
- Repository: `dumbbelldude` (id `local-b34ab6ec2e6c`), branch `claude/github-repo-creation-2dngb5`.
- Mode: **local** (sandbox), review_state `draft` — OK to proceed (not connected).
- Default pass present: `P-2` (named after the branch, no goal, phase open, revision 1, committed_revision 0, no nodes).
  Phase 3 will create a dedicated pass "Dumbbell Dude v1" as instructed; do not confuse it with P-2.
- Stamp format: `trussel: <node ID>@<revision>` in a `//` comment on the line just above the definition
  (above decorators), or first line of the body; module stamp near top of file. One stamp per node.
  The server's stamp rule says nothing about a watermark/body-hash convention — re-check get_context /
  server instructions in Phase 4 before inventing one (see Decisions).
- Analysis freshness: never analysed (`analysed: false`, `stale: true`, `analysed_at: null`). Repo held only README.md.

### Phase 1 — UI design in Trussel (done)
- Design set: **D-ZWEKZCRHB5 "Dumbbell Dude App"**, colour mode **free**, final version **v178** (sandbox: latest = the design).
- v2 design prompt; v3 colour mode free; v4 style guide; v5–v42 components; v43–v77 screens + fixes;
  v78–v170 flow links + interactions; v171–v177 screen states; v178 arrange_screens auto.
- Style guide (tokens, all `--vd-*`): background `#0e0f12`, surface `#1a1c21`, raised `#25282f`, border `#2f333b`,
  foreground `#f4f5f7`, muted `#9aa0ab`, accent `#c6ff3d` (on-accent `#0e0f12`), accent-soft, success `#34d399`
  (+soft), danger `#ff5c5c` (+soft), scrim; spacing 4/8/12/16/24/32; type 12/15/20/24(number)/28(title)/44(display),
  leading 1.4, font Inter/system; radius 8/14/22/pill; tap 48, tap-lg 56, tabbar 68.
- Totals: **20 screens, 33 components, 63 flow links, 31 interactions, 7 screen states**.

#### Screens
| ID | Screen | Notes / states |
|---|---|---|
| S-VCG8FMQQZQ | Home | tab home; state "Streak lost" (click streak) |
| S-T350ZXWASA | Home — empty | empty state, streak zero |
| S-2YJQSZFD9R | Start workout | empty start + routine cards |
| S-YKPWM78WME | Active workout | ticked sets (placement state done); state "All sets ticked"; tick → rest overlay; Finish → confirm; Discard → confirm |
| S-Q9Y1MWY28B | Active workout — set error | validation error on set row (reps 0) |
| S-BGYY020JSP | Rest timer (overlay) | 390×380 bottom sheet; state "Rest over" |
| S-7WGZZXGG5G | Finish workout confirm (modal) | confirm → Workout detail |
| S-ZYJ11ET1CP | Discard workout confirm (modal) | danger; confirm → Home |
| S-YFC8KV1GV2 | Exercise library | tab library; chip filter setState per muscle; "+ Custom" → sheet; state "Search focused" |
| S-86SZ93FJAA | Add custom exercise (sheet) | 390×470 bottom sheet |
| S-2RERWN3QTT | Add exercise to workout (picker) | pickable/selected rows |
| S-FV8H80157X | Routines | list (edit) |
| S-EAA9SRC6AG | Routine editor | name, ordered exercises, sets × reps; state "Name missing" |
| S-GFFTPCESPF | History | tab history; workouts by week |
| S-W5H4SKMCAG | History — empty | empty state |
| S-53X1CJ7X9F | Workout detail | stats (time/volume/PRs), per-exercise sets, PR badges, zero-weight (BW) set |
| S-XJ9Y32E8SM | Progress | tab progress; exercise picker, SVG line chart, PR list; state "No data yet" |
| S-HZ2GVRC6ZA | Settings | tab settings; units kg/lb, rest time, export, import, reset; state "Units lb" |
| S-A3WZ55KPAN | Reset data confirm (modal) | danger; confirm → Home — empty |
| S-DFT1S10WN0 | Import data confirm (modal) | confirm → Home |

#### Components
| ID | Component | States |
|---|---|---|
| C-40A37181K1 | TabBar (parts home/history/progress/library/settings) | home, history, progress, library, settings |
| C-W21Z71AA4M | AppHeader (eyebrow, title, action part) | noaction |
| C-7WBSGTY0J4 | StatTile | accent |
| C-H00R71NPHW | WeekStatRow (2× StatTile) | — |
| C-KZ1JW6QA0B | WorkoutSummaryStats (3× StatTile) | — |
| C-WWT1XVTC56 | WorkoutCard | nobadge |
| C-PGJPSBK6MH | SectionTitle (link part) | nolink |
| C-9YSZYWVH8J | PrimaryButton | disabled, danger |
| C-TVFATMYR0Q | SecondaryButton | danger, ghost |
| C-RXZ2TBZDQT | StreakBanner | zero |
| C-B3YWXCKKEF | WorkoutTimerBar (parts discard/finish) | — |
| C-CEJYG76YXT | ExerciseBlockHeader (exercise card top + column labels) | — |
| C-XRJ49Y3XKF | SetRow (parts weight/reps/tick) | done, error |
| C-P546QY9WGR | AddSetButton (exercise card bottom) | — |
| C-GJKKCHEYVV | ExerciseRow (part add) | custom, pickable, selected |
| C-2P80YNQKJR | SearchField | filled, focused |
| C-QPQ8K6TKAH | ChipFilter (parts per muscle group) | all, chest, back, legs, shoulders, arms, core, wrap |
| C-2586HK1N9A | Chip | selected — **currently unplaced** (see Needs the owner) |
| C-GKKNW9VS4N | Modal (parts cancel/confirm, slot body) | danger |
| C-TGPP7GS8ST | TextField | placeholder, error, inset |
| C-610GB7K16B | RestTimerOverlay (parts minus/plus/skip) | done |
| C-M9HKCJ8Q74 | SheetHandle | — |
| C-J0PKS9XF4S | EmptyState | — |
| C-0PNTT5SFWD | LineChart (hand-drawn SVG) | empty |
| C-WQYJ5CAE3J | RoutineCard (part start) | edit |
| C-9Z7MXPTQ49 | RoutineExerciseRow (parts handle/sets/reps/up/down) | error |
| C-44T3FSYACR | PRRow | — |
| C-MY23KHP4MG | SettingRow (parts value/import/reset) | danger, accent, import |
| C-Z2R65CPEEE | SegmentedControl (parts a/b) | b |
| C-5XHYBWCGT0 | SettingsGroupLabel | — |
| C-NZWWYJ84GF | StickyFooter | abovetabs — **currently unplaced** |
| C-R1A986TJBZ | ExerciseSummaryHeader | — |
| C-GFP18A5XFT | SetSummaryLine | pr, last, lastpr |

## Run 2 — Phase 2 + Phase 3 (2026-11-01)

### Phase 2 — Scaffold (done)
- Vite 5.4 + React 18.3 + TypeScript 5.6 (strict, noUncheckedIndexedAccess), react-router-dom 6.28,
  Vitest 2.1 + @testing-library/react 16 + jest-dom + user-event + jsdom 25. No UI kit / chart / state libs.
- Folders: `src/domain`, `src/application`, `src/adapters`, `src/ui/components`, `src/ui/screens`, `src/app`
  (placeholder `index.ts` each), `src/styles/tokens.css` (exact `--vd-*` tokens from D-ZWEKZCRHB5), `global.css`.
- `netlify.toml`: build `npm run build`, publish `dist`, `/* /index.html 200`. `.gitignore`: node_modules, dist, coverage.
- Checks: `npm run build` ✓ (dist 142.6 kB JS), `vitest run` 1/1 ✓, `tsc --noEmit` ✓.
- Commit `e866bc1` "Scaffold Dumbbell Dude".
- `request_analysis` → done. `get_architecture`:
  - Root `typescript:` — profile **componentBased** ("Component-based", frontend), confidence **0.45**, detected.
  - Columns (flow left → right): **routes** (Pages / Routes) → **components** → **hooks** (Hooks & State) →
    **apiClients** (API clients) → **types** (Types & Models); **toolkit** secondary/exempt.
  - Modules: only `styles` (key `src/styles`); empty placeholder folders produced no module yet.
    Origin: `src/main.tsx` (renderRoot) in routes. Violations: none.
- Column mapping chosen for the layered design (see Decisions): app + ui/screens → routes;
  ui/components → components; application services + React context hook → hooks;
  adapters → apiClients; domain entities/logic + application ports → types.

### Phase 3 — Architecture design in Trussel (in progress)
- Pass **P-3 "Dumbbell Dude v1"**, goal "Build the designed app end to end" (P-2 default pass untouched).
- Lesson: `propose_node` for a function refuses without a parent ("A function needs the node it is declared
  in") → one `module` node per source file, functions parented to it. Interfaces/classes accept no parent.
- Node IDs so far (module `domain`, column `types`):
  - model.ts module T-EV4A831W55: Exercise T-7PRESQS732, SetEntry T-EW7JNYHDSS, WorkoutExercise T-TZMD43754B,
    Workout T-DB1T0BBWSA, RoutineExercise T-Q2SES3BY6X, Routine T-XCVF8WSBWD, Settings T-SBBZ5NF3PW,
    PersonalRecord T-AF11X1FNYP
  - units.ts T-7SKE4M0B5P: kgToLb T-MTX7H0MW28, lbToKg T-GPM6DFPD2S, toDisplayWeight T-PR9VZSS9BE,
    fromDisplayWeight T-7Q8NCZ56YW, formatWeight T-6N2VWETMRT
  - volume.ts T-1V5TZEAQE7: setVolume T-HR3PXA52C1, exerciseVolume T-3GMFXWNJ2S, workoutVolume T-KHVTMKD9EN,
    countDoneSets T-V1YEPJZA7Z, workoutDurationMinutes T-YBSYRNQ29N
  - records.ts T-W6XY30YQZK: estimateOneRepMax T-89YXE4QAVF, personalRecords T-5ZMHXM46FK,
    findPersonalRecordSetIds T-JN94BZS6DV, bestSetSeries T-JM1HCD8NST
  - streak.ts T-GDCE0YVFSZ: localDayKey T-W54919TP9S, currentStreak T-SMH9K7PTMK, weekSummary T-3Q6GMV65P7
  - validation.ts T-E24YQR6FMX: validateSetEntry T-3PGVK54KPC, validateName T-7BTK5EH7S4,
    validateRoutineTargets T-1QP3QQVJGE; ValidationError class T-ZT2QS66GSN (in model.ts)
- Module `application`:
  - ports.ts T-K8G26A943X (column types): WorkoutRepository T-Q3KJ0FD12W, RoutineRepository T-AFZX8743KX,
    ExerciseRepository T-K497X0TA0F, SettingsRepository T-KVN1AP4N82, Clock T-ZBRG887BYQ, IdGenerator T-4J2TWE9EC0
  - services (column hooks), file module → class: WorkoutService T-HE4BBNG508 → T-N3DR6WH6FJ;
    RoutineService T-390N43Z0CP → T-PMYF6RDQTS; ExerciseService T-4FP39ZW7Q4 → T-R58S4ZBRH0;
    ProgressService T-9H8ST2Y8EC → T-QPQSNMBA45; SettingsService T-JT5MGN6CNJ → T-KPEVC9RKQQ;
    DataTransferService T-6BXMGQG9D3 → T-4CSKCX4AWE
  - WorkoutService methods: getActive T-DKNVXNHJHV, startEmpty T-YSJX4VNKHB, startFromRoutine T-YD1QG556DJ,
    addExercises T-D891B41X1B, addSet T-955TG1P0FW, updateSet T-65CR34TBS8, toggleSetDone T-3CWYR32D3B,
    finish T-CXER9149Q5, discard T-GTPVCZ9G8H, listHistory T-EFA3G0P2B7, getWorkoutDetail T-AZGEG9MM7S,
    homeSummary T-6JW8DG3JSQ, previousSets T-RKJNSQV10T
  - RoutineService: list T-P533N6ZQ18, get T-ZTFRRQDW60, save T-XT27BGKT3M, remove T-HPEXAPWW41
  - ExerciseService: search T-SZGVR2SGC9, getExercise T-TXHAK9REYR, createCustom T-TVNV40N2N7
  - ProgressService: loggedExercises T-HDN3691W00, seriesFor T-GR6MVGW51Z, recordsFor T-59X77W9JJJ
  - SettingsService: getSettings T-7STVKC6E1N, setUnits T-8B25B9Y65G, setDefaultRest T-Q9V4JE22Q1
  - DataTransferService: exportData T-9TD1E9B5TC, parseImport T-472B0E2M0D, applyImport T-CFMZ4DX6K8,
    resetAll T-6E4HQVR6WF
- Module `adapters` (column apiClients), file module → class/function:
  storage T-XQNKTNS8ZN → LocalStorageStore T-TARHR5WN3J; LocalStorageWorkoutRepository T-30V5HB73GS → T-64Z5RJATJ4;
  LocalStorageRoutineRepository T-7KJVT27YYS → T-151H7JE8N7; LocalStorageExerciseRepository T-WH7R0WMPZY → T-QFW2Q4HMKV;
  LocalStorageSettingsRepository T-24Q59G82H0 → T-3PGZDK46XR; system T-8E81202NCT → SystemClock T-H4YJRAE95X,
  UuidGenerator T-XYV4Y4EY3N; seedExercises T-YR2PY9CFG2 → seedExercises() T-QNHJG9B83R
- Module `components` (column components), file modules: TabBar T-KDV8X8JD1M, AppHeader T-DYWZRNANNY,
  StatTile T-HVYEZ8GAZA, StatRow T-8CMH26ZQDM, WorkoutCard T-6WFWXP6EEQ, SectionTitle T-3BEHHHVZEH,
  Buttons T-JM26XRD87N, StreakBanner T-1BW1QGPDYH, WorkoutTimerBar T-E7P1MDP3G7, ExerciseBlock T-MPV7TDRFY2,
  ExerciseRow T-07R7PTHA2W, SearchField T-6XF838MSRV, ChipFilter T-8W2MM52FQV, Modal T-26HPQ654AY,
  TextField T-16T7AN7ZT6, RestTimerOverlay T-KX8F3F3WTT, BottomSheet T-2M7JGFGQK4, EmptyState T-7TBYYZ9PJX,
  LineChart T-5GTABSSBCB, RoutineCard T-4EP231AWFY, RoutineExerciseRow T-FKWA451SF1, PRRow T-GDNNVQGK8E,
  SettingsControls T-5Q00DV8DM6, StickyFooter T-SVKY5SVGVN, ExerciseSummary T-2PZSQ8CWF7
- Module `ui` (column toolkit): format T-ZR5DY2ZTTH
- Component functions (column components): TabBar T-NQJ20J0N56, AppHeader T-ZY2QM99JEG, StatTile T-F191YC8GDZ,
  StatRow T-TETC4NM269, WorkoutCard T-1JH3FVCJXK, SectionTitle T-0755PGGEF9, PrimaryButton T-JAZ8S1HEMP,
  SecondaryButton T-547CJRPGCV, StreakBanner T-00GRPTPDFC, WorkoutTimerBar T-3WSEBR701F,
  ExerciseBlockHeader T-FYKJ50QC38, SetRow T-41F4YWWM2G, AddSetButton T-ZN6NQS0J87, ExerciseRow T-GTYQAAZYM4,
  SearchField T-P8CM20W609, Chip T-RHNGJG67XP, ChipFilter T-34K3GSTY7J, Modal T-E0GR6QP6Z0, TextField T-28S6VSQ79K,
  RestTimerOverlay T-QR0KRTVZ57, BottomSheet T-4F4057C6AB, EmptyState T-NXA1V9GY0K, LineChart T-3RAND8YAZJ,
  RoutineCard T-4ZNW004F9H, RoutineExerciseRow T-HS1F6S107D, PRRow T-4PAFWCTCCV, SettingRow T-AFT3M6XBQY,
  SegmentedControl T-0RYEMDY8M2, SettingsGroupLabel T-QJCXP0VSRS, StickyFooter T-JZ1NXGBKDN,
  ExerciseSummaryHeader T-BF12T2D9H5, SetSummaryLine T-W09P97WCEP
  (every design component C-… maps to one of these; StatRow covers both C-H00R71NPHW and C-KZ1JW6QA0B;
  BottomSheet covers C-M9HKCJ8Q74 SheetHandle; Chip and StickyFooter, unplaced in the design, are used in code)
- format fns (ui/toolkit): formatShortDate T-EZ8FQFE7ES, formatLongDate T-F01G87CW3P, formatTimeOfDay T-7PFY89B0C0,
  formatElapsed T-X6EGEZQPTR, formatCountdown T-XNYWX6XVVP, formatMinutes T-VYTXMQ54SK, weekGroupLabel T-QXTFFZXTQJ
- Module `screens` (column routes), file module → function: HomeScreen T-KWBRFF4683 → T-FXPBWB3GST;
  StartWorkoutScreen T-QNDP4PEJ1Y → T-RT5HEJZJER; ActiveWorkoutScreen T-51BQCCA91K → T-JF27E1HQ7C;
  ExercisePickerScreen T-2YVSMWM8JC → T-T8JTYK2GZ0; ExerciseLibraryScreen T-67RKMQPEHE → T-83C452ECZY;
  AddCustomExerciseSheet T-E1BP3VPRRP → T-H35PB4JQR7; RoutinesScreen T-B45EZD1Z9E → T-8K9D1PVFFY;
  RoutineEditorScreen T-45W0B435KE → T-AW2FV75YDX; HistoryScreen T-3VJY0RQC51 → T-65FPQVHV8P;
  WorkoutDetailScreen T-119M3CRVT0 → T-2E754EAKBM; ProgressScreen T-2031468DDQ → T-NZQ3A6N3T9;
  SettingsScreen T-TGZF6PP6YK → T-HY9J7ERGG1
- Module `app`: container T-EPMKZ1Z88E (routes) → createServices T-D66YY49PVF; ServicesContext T-0D6J6JWTRC (hooks)
  → ServicesProvider T-7ZC8RC7B7X, useServices T-7GNA9H23Q8; AppRouter T-MCS96X42Q8 (routes) → AppRouter
  T-X9RZRYM5XN, AppLayout T-Q6TSKHW9MH; App T-Y70497A5J4 → App T-4HZXAJ7HW9
- Existing node `typescript:#mod:src/main.tsx` added to the pass as **changing** (render <App/>).
- Edges proposed: 253 (PE-…): 6 IMPLEMENTS (adapters → ports), repos → LocalStorageStore/seed/domain types,
  30 services → ports (DEPENDS_ON), service methods → domain functions (CALLS), domain-internal calls,
  createServices → 7 adapters + 6 services, App → createServices/ServicesProvider/AppRouter, main → App,
  AppRouter → AppLayout + 11 screens, AppLayout → TabBar, every screen → useServices + the service methods it
  calls + the UI components it renders + format/units helpers + ValidationError.
- `get_architecture view=incoming` showed no violations, but it does not list uncommitted pass nodes yet.
- `get_pass`: 199 members (198 new + 1 changing: main.tsx), 253 proposed edges, conflicts [], blocking [].
  Kinds: 78 functions, 63 modules, 30 methods, 14 interfaces, 14 classes.
- `design_ready` mode **implement** → pass P-3 phase **committed**, committed_revision **1**, 199 nodes, 253 edges.
  Stamps for new nodes: `// trussel: <T-ID>` (revision only needed for changed existing nodes → main.tsx gets
  `// trussel: typescript:#mod:src/main.tsx@1` per the stamp rule — check get_pass to_implement in Phase 4).
- `get_architecture view=incoming` after commit: columns routes 32 · components 57 · hooks 15 · apiClients 15 ·
  types 42 · toolkit 8; **violations: []**. 31 entry points (screens/app, design-only). Design nodes show
  `module: null` until analysed — re-check module names after Phase 4 analysis.

### Phase 3 — done.
Next run: Phase 4 implement in generation order domain → ports → adapters → services → UI components → screens →
app, stamping every node, with tests (domain + services with in-memory fakes, repository contract tests against
fake + LocalStorage, RTL tests for ActiveWorkoutScreen and RoutineEditorScreen).

## Run 3 — Phase 4 + Phase 5 (2026-11-01)

### Phase 4 — Implement (in progress)
- Stamp used everywhere: `// trussel: <T-ID>@1` on the line above each definition; file modules stamped at the
  top of the file. (Server stamp format is `trussel: <node ID>@<revision>`; committed_revision = 1.)
- Watermark + body-hash: the run prompt mentions a "watermark + body-hash convention", but the Trussel server's
  stamp rule (get_context.stamp) defines none. Per "follow the server's instructions", I did **not** invent one —
  see Decisions.
- Milestones: `3971649` domain (27 tests) · `ec90fbc` application services + in-memory fakes (17 tests) ·
  `d3079a2` adapters + repository contract suite against fake AND LocalStorage (24 tests).
- report_outside_pass D-1: src/adapters/guards.ts shape guards + MemoryStorage helper (undeclared helpers).
- Next: ui/format, ui/components (+ components.css from design CSS), app, screens, RTL tests.

## Decisions
- (Run 3) No watermark/body-hash added to stamps: the server's stamp rule is the only convention and it defines
  just `trussel: <ID>@<revision>`. Prompt vs server conflict resolved in favour of the server.
- (Run 3) Shape guards for storage reads live in src/adapters/guards.ts (reported outside pass), duplicated in a
  stricter form inside DataTransferService for import validation — adapters (apiClients) may not depend on a
  service (hooks), and the domain had no declared guard node.
- (Run 2) possible_duplicates only ever matched my own sibling nodes in this pass (Exercise vs WorkoutExercise,
  kgToLb vs lbToKg, …). I ran get_node on the first set of hits; after that, for hits that are nodes I had just
  written in this pass (content already known), I judged them distinct without a separate get_node. Pre-checks
  are batched per group; `propose_node` repeats the same check on every proposal.
- (Run 2) Trussel detected a component-based profile, not a hexagonal one. I kept the hexagonal folders but
  map them onto the detected columns so every dependency still points right (= inward): screens/app (routes)
  → services (hooks) → ports + domain (types); adapters (apiClients) → ports + domain (types). Ports live in
  `src/application/ports` but sit in the `types` column, so both services and adapters depend rightward on them.
- Kept the server's `--vd-*` token names and replaced their values (instead of removing tokens) to respect the
  "never remove" rule; added success/danger/soft variants, scrim, number/display type, tap sizes, tabbar height.
- Trussel nests children per *component*, not per placement, and screens are a flat ordered list. So repeating
  structures that vary per instance are flattened into placeable pieces: an exercise card on Active workout is
  `ExerciseBlockHeader` + N × `SetRow` + `AddSetButton`; a workout-detail exercise is `ExerciseSummaryHeader` +
  N × `SetSummaryLine` (last row uses state `last`/`lastpr`). Fixed groups (Home week stats, detail stats) are
  small composites of `StatTile`.
- ChipFilter rewritten as one component with a part + state per muscle group (selection via setState), because
  child placements cannot carry a state through update_component.
- Modals, rest timer and add-exercise sheet are their own small custom-size screens, shown with
  `showOverlay overlay_screen` so each overlay keeps its own copy (params) and its own confirm/cancel wiring.
- Validation error on a set row and empty Home/History are separate variant screens (states that change copy
  and structure); lighter toggles use `set_state` (streak lost, all sets ticked, no chart data, name missing,
  units lb, search focused, rest over).
- SettingRow got hidden full-row hit parts (`import`, `reset`) that exist only in the matching state, so one
  component can route Import and Reset clicks to different modals.
- TabBar is `position: absolute; bottom: 0` so it pins to the bottom of the phone frame in the Design view.
  The implementation will use `position: fixed` + page bottom padding.
- Primary CTAs are placed at the end of each screen's content rather than in a sticky footer; the
  Active workout keeps "Finish" in the top bar too. The implementation should make the CTA sticky above the
  tab bar (as the design prompt says), which is what `StickyFooter` was made for.
- Danger buttons use dark `--vd-on-accent` text on `--vd-danger` (white failed contrast at 2.77:1).

- (Run 2) Several small, always-together design components share a file (Buttons.tsx: Primary/Secondary;
  ExerciseBlock.tsx: ExerciseBlockHeader/SetRow/AddSetButton; SettingsControls.tsx; ExerciseSummary.tsx;
  ChipFilter.tsx: Chip/ChipFilter) — still one node per design component, one stamp each.
- (Run 2) StatRow implements both C-H00R71NPHW WeekStatRow and C-KZ1JW6QA0B WorkoutSummaryStats; BottomSheet
  implements C-M9HKCJ8Q74 SheetHandle; the design-unplaced Chip and StickyFooter are used in code (StickyFooter
  realises the prompt's thumb-zone CTA rule).
- (Run 2) Design gaps filled in the architecture notes, not in the design set: a "Remove" control on routine rows,
  a "Delete this routine?" confirm (reuses Modal), "Resume workout" on Home when one is active, per-exercise
  progress link from the library, empty states for routines/library/progress. Recorded so a designer can add them.
- (Run 2) The format helpers (src/ui/format.ts) were declared as nodes rather than left as undeclared code,
  per the server's "propose_node rather than inventing undeclared structure".
- (Run 2) Ports are synchronous (localStorage is synchronous) to keep services and tests simple.
- (Run 2) Streak = consecutive local calendar days with a finished workout, alive if the last one was today or
  yesterday (matches the design's "5 day streak").

## Needs the owner
- `C-2586HK1N9A Chip` and `C-NZWWYJ84GF StickyFooter` are not placed on any screen (Chip was superseded by
  ChipFilter's parts; StickyFooter can't hold per-screen buttons because children are per component). Not
  removed per the rules — the owner may delete them or keep them as implementation hints.

## Blocked
_(nothing blocked)_

## How Trussel helped
- `get_context` gave the stamp format and confirmed sandbox mode up front, and showed a default pass already
  exists (so Phase 3 must not confuse it with the new pass).
- `create_design_set` returned a suggested prompt/style guide to replace rather than starting from nothing.
- `snapshot_screen` caught real problems before moving on:
  - Active workout: "Finish workout" button overflowed the 844px frame → tightened SetRow padding (64→56px rows).
  - Start workout: routine exercise lists were clipped by ellipsis → allowed wrapping.
  - Discard modal: danger button text contrast 2.77:1 → switched to dark text on red (also fixed PrimaryButton danger).
  - Reset modal overflowed its 222px frame by 20px → resized frame; rest-timer and modal frames trimmed to content.
  - The first Home snapshot showed the tab bar floating mid-screen → pinned it to the frame bottom.
- The store's validation accepted every component first time with tokens-only CSS; `get_design_set` gave one
  authoritative dump of screens, placements, links and interactions for this log.
- **Where it got in the way:** the layout report measures bottom-pinned elements in a ~4096px-tall container,
  so every screen with the pinned TabBar reports a false "overflow" (box y=4028) even though the PNG is correct.
  Per-component (not per-placement) children forced flattening of cards and some near-duplicate composites
  (WeekStatRow vs WorkoutSummaryStats). `set_state` classes apply to every placement of a component on a screen,
  so a single-row error can't be a toggle — it needed a variant screen. No bulk tool for flow links: tab
  navigation took ~45 separate set_flow_link calls.
- (Run 2) `request_analysis` + `get_architecture` on the bare scaffold gave the concrete column vocabulary
  (componentBased: routes/components/hooks/apiClients/types/toolkit) before any design, so every node was placed
  in a real column and the post-commit check showed **zero flow violations** for 253 edges.
- (Run 2) `propose_node` refused functions without a parent ("A function needs the node it is declared in"),
  which forced one module node per file — the design now mirrors the file tree exactly, which will make
  stamp-to-file verification in Phase 5 straightforward.
- (Run 2) `get_pass` gave a single go/no-go (conflicts [], blocking []) over 199 nodes and 253 edges before
  committing; `design_ready implement` committed it in one step.
- (Run 2) Where it got in the way: no bulk propose — 199 nodes and 253 edges took ~450 separate calls;
  `possible_duplicates` is name-only, so it flagged every sibling (kgToLb/lbToKg, Routine/RoutineRepository) and
  the server's "get_node each hit" rule would have doubled the calls; `get_architecture` doesn't show
  uncommitted pass nodes, so flow violations could only be checked after commit; `get_pass` output for a pass this
  size is 76 KB (I parsed it with a script rather than reading it).
