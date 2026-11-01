# Dumbbell Dude — Build Log

Times in IST (Asia/Kolkata).

## Status at a glance
- **Run 1 (2026-11-01): Phase 0 + Phase 1 — DONE.**
- Next run: **Phase 2 — Scaffold** (Vite + React + TS strict, router, Vitest/RTL/jsdom, layered folders,
  netlify.toml, .gitignore, commit "Scaffold Dumbbell Dude", then request_analysis + get_architecture).

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

## Decisions
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
