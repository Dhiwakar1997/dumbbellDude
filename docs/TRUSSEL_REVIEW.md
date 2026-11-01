# Trussel dogfood review: building Dumbbell Dude

What we learned from building Dumbbell Dude end to end through Trussel: the gaps we found, where Trussel got in the
way, and the decisions that need the owner. It is written for the Trussel owner. The full run-by-run record is
[BUILD_LOG.md](BUILD_LOG.md), and the screenshots are in [evidence/](evidence/).

- **When:** 1 Nov 2026, evening (IST).
- **Trussel version:** `trussel-frontend` at commit `9df640de`, run as the web workbench (`scripts/code-server.sh`) in a
  cloud sandbox, driven through headless Chromium.
- **Mode:** a **local sandbox** project: no Studio, no sign-in, no approvals.
- **Agent:** Claude Code, connected to the IDE's local MCP server through **Trussel: Copy MCP Configuration**, in four
  runs (Phases 0–1, 2–3, 4–5 and 6).
- **Outcome:** design set `D-ZWEKZCRHB5` v178 (20 screens, 33 components) → pass `P-3` "Dumbbell Dude v1" (198 nodes,
  253 edges) → code with one stamp per node → Trussel shows the pass **Done, 198 of 198 implemented**. Build, `tsc`
  and 98 tests pass.

Each item has an ID, so it can be referred to in a reply (for example "D1: option A").

**Severity:**
- **High:** blocks or misleads the workflow.
- **Medium:** costs real time or trust.
- **Low:** an annoyance.

---

## 1. At a glance

| Section | Count | The ones that matter most |
|---|---|---|
| [2. Gaps](#2-gaps) | 6 in the app's design, 7 in Trussel | T1 (design ↔ architecture link not built), T2 (no bulk tools), T5 (state lives outside the repo) |
| [3. Where Trussel got in the way](#3-where-trussel-got-in-the-way) | 17 | F11 (cross-slice warnings contradict `explain_connection`), F14 (silent pass switch), F15 (extension starts before workspace trust) |
| [4. Decisions for you](#4-decisions-for-you) | 8 | D1 (the 15 cross-slice warnings), D2 (watermark + body-hash convention), D3 (design gaps) |
| [5. Unverified observations](#5-unverified-observations) | 3 | O1 (199 vs 198 nodes) |

---

## 2. Gaps

### 2.1 Gaps in the Dumbbell Dude design

These screens and behaviours were needed to build the app, but the design set doesn't have them. The agent did not
add them to the design. It recorded them in the architecture pass's implementation notes and built them. Until they
are designed, they exist only in code and notes. Decision **D3** covers what to do with them.

| ID | Gap | How it was handled | What the design would need |
|---|---|---|---|
| A1 | No way to remove an exercise from a routine | A "Remove" control on routine editor rows | A remove affordance on `RoutineExerciseRow` |
| A2 | No delete-routine flow | A "Delete this routine?" confirm, reusing `Modal` | A delete action plus a confirm modal screen |
| A3 | No "resume" when a workout is already in progress | A "Resume workout" CTA on Home | A Home state with an active workout |
| A4 | No path from the library to an exercise's progress | A per-exercise progress link | A link from `ExerciseRow` to Progress |
| A5 | No empty states for Routines, Library and Progress | Empty states built with `EmptyState` | Three empty-state screens or states |
| A6 | The CTA position conflicts with the design prompt | Built as a sticky footer, following the prompt's thumb-zone rule; the screens put it at the end of the content | Either move the CTAs into `StickyFooter` in the design, or change the prompt (see D5) |

### 2.2 Gaps in Trussel

These are capabilities that were missing or incomplete for this workflow.

| ID | Gap | Impact | Severity | Notes |
|---|---|---|---|---|
| T1 | **No structured link from architecture nodes to design components.** Front-end Pass 69 is still a brief. | The design → architecture hand-off is free text: every UI node's notes name `S-…`/`C-…` IDs by hand. Nothing checks those IDs, nothing shows which nodes implement a component, and a later design change can't raise design drift. | High | Pass 69 already scopes this. The run shows the notes approach works, but only through agent discipline. |
| T2 | **No bulk tools** for proposing nodes and edges, setting flow links, or reporting progress | About 450 `propose_node`/`propose_edge` calls for one architecture, about 45 `set_flow_link` calls for tab navigation, and `report_progress` one node at a time. Slow and expensive in tokens. | High | See F1 and F6. |
| T3 | **Flow can't be checked before commit:** `get_architecture` ignores uncommitted pass nodes | Flow violations show up only after `design_ready(implement)`, when fixing them means a new revision | Medium | A "preview with the current pass" view would catch them while still drafting. |
| T4 | **No watermark + body-hash convention in the IDE server.** The backend spec requires it (`trussel-backend/CLAUDE.md` §7 "Code ownership signal" and §8 rule 5), but the local server's stamp rule defines only `trussel: <ID>@<revision>`. | Agents can't follow the convention, and a function a human has taken over can't be detected | Medium | Spec vs implementation: decision D2. |
| T5 | **Sandbox state lives in the IDE's storage, not the repository.** Design sets, passes and graphs sit under the IDE's global storage. | The design and the pass can't be shared, reviewed or moved to another machine. This run's design set and pass vanish with the container; only code, log and screenshots survive. | High (for teams and demos) | It may be deliberate for sandboxes. Decision D8. |
| T6 | **The architecture can't be reviewed visually before code exists.** The Architecture canvas showed **0 nodes** with 168 designed; the pass editor drew all 198 nodes as one tall column. | The architecture step had no usable picture. The canvas became readable only after implementation and analysis. | Medium | Evidence: [05-pass-designed](evidence/05-pass-designed.jpg), [06-pass-editor](evidence/06-pass-editor.jpg). The pass editor's Auto-arrange wasn't tried. |
| T7 | **Design sets can't vary nested parts per placement.** Children belong to the component, and a state applies to every placement on a screen. | Cards that vary per use had to be flattened (header + N rows + footer), which created near-duplicate composites (`WeekStatRow` / `WorkoutSummaryStats`). A single invalid set row needed its own variant screen. | Medium | See F4. |

---

## 3. Where Trussel got in the way

Each item gives what happened, what it cost, and a suggested fix. The fixes are suggestions for the Trussel team,
not decisions.

### Design tools

| ID | What happened | Cost | Severity | Suggested fix |
|---|---|---|---|---|
| F1 | No bulk flow links: tab navigation across every tab screen took about 45 separate `set_flow_link` calls | Time and tokens | Medium | Accept a list of links, or a "tab bar" helper |
| F2 | **False overflow in `snapshot_screen`'s layout report:** a bottom-pinned element is measured in a container about 4,096 px tall, so every screen with the pinned tab bar reports an overflow (`y≈4028`) although the PNG is correct | The report can't be trusted on those screens, and real overflows can hide in the noise | Medium | Measure in the frame's height |
| F3 | `set_state` classes apply to every placement of a component on a screen | A single-row error state can't be a toggle; it needed a separate variant screen | Low | Per-placement states |
| F4 | Children belong to the component, not the placement | Flattened cards and near-duplicate composites | Medium | Per-placement children or slots (T7) |
| F5 | Two components ended up unplaced (`Chip`, `StickyFooter`), and the no-removal rule kept them | Clutter in the set | Low | Covered by D4 |

### Architecture tools

| ID | What happened | Cost | Severity | Suggested fix |
|---|---|---|---|---|
| F6 | No bulk propose: 198 nodes and 253 edges took about 450 calls | Phase 3 took about 21 minutes and 523 agent turns | High | `propose_nodes` / `propose_edges` taking lists, validated as one write |
| F7 | `propose_node` refuses a function without a parent ("A function needs the node it is declared in"), so every source file needs its own module node | 10 failed calls before the agent adapted, plus 63 module nodes | Low | Say so in the tool description; possibly create the module implicitly from `file` |
| F8 | `possible_duplicates` matches on names only, and flagged every sibling (`kgToLb`/`lbToKg`, `Routine`/`RoutineRepository`). The server's "`get_node` each hit" rule would have doubled the calls. | Noise and extra calls | Medium | Weigh kind, module and signature, or skip the agent's own nodes in the current pass |
| F9 | `get_pass` for a pass this size returned **76 KB** | The agent had to parse it with a script | Medium | Page it, or add a summary mode |
| F10 | The scaffold was detected as **component-based** (confidence 0.45), not hexagonal; the hexagonal folders were mapped onto the detected columns | Fine in the end, but the canvas names (routes, hooks, apiClients) don't match the code's layering | Low | Let a person choose the style for a sandbox (there may already be an override) |

### Verification

| ID | What happened | Cost | Severity | Suggested fix |
|---|---|---|---|---|
| F11 | **15 "cross-slice" flow violations contradict Trussel itself.** All of them point in the allowed direction; `explain_connection RoutineService → domain/validation.ts` returns `contains_violation: false`; and the same kind of call from screen functions (21 edges, routes → types) isn't flagged. Only calls from a **class** to a module-level function are. | The pass looks unclean when it may be fine, and clearing it would mean redesigning committed nodes | High | Check the heuristic against the flow rule and `explain_connection` (decision D1) |
| F12 | After the pass was fully implemented, the canvas kept showing **"Graph out of date"** until a manual re-analyse | Confusing right after a successful `request_analysis` | Low | Refresh after the agent's analysis completes |

### Session and state

| ID | What happened | Cost | Severity | Suggested fix |
|---|---|---|---|---|
| F13 | `report_progress` works one node at a time | The agent reported per file instead of per node | Low | A bulk version |
| F14 | **Silent pass switch:** when every node of P-3 was implemented, the session moved back to the default pass P-2 without saying so, so `get_pass` showed an empty pass | The agent had to confirm status node by node, and a less careful agent could have concluded the work was lost | High | Report the switch in the tool result, or let `get_pass` take a pass ID |

### Setup in the IDE (found by the operator, not the agent)

| ID | What happened | Cost | Severity | Suggested fix |
|---|---|---|---|---|
| F15 | **The extension starts before workspace trust.** In Restricted Mode the Trussel extension activated without registering the open Git repository, and trusting the folder didn't fix it. The MCP server answered "No repository with a checked-out branch is open in Trussel" until the window was reloaded. | A dead end for a first-time user | High | Re-scan the open repositories when trust is granted |
| F16 | **"Create a project" clones instead of using the open folder.** The page opens by default and asks for a GitHub URL. Using it shallow-cloned the repo into the IDE's storage as a separate project, with no checked-out branch, not tied to the open folder. | Two projects for one repo, and the MCP server still had no context | Medium | For an open folder with a remote, offer "Use this folder" first |
| F17 | **Misleading error on an empty repo.** The first analysis failed with "The Python language pack is not installed, so this root was not analysed", although the repo held only a README. Separately, the MCP secret changes on every IDE start or reload, so an external agent must re-copy its configuration. | Confusing first impressions | Low | Say "nothing to analyse yet" for an empty repo; note the secret rotation next to "Copy MCP Configuration" (the notification already says it) |

---

## 4. Decisions for you

Each decision gives options and a recommendation. Nothing has been changed for any of them.

### D1. The 15 "cross-slice" warnings (F11)

- **Context:** after verification, `get_architecture` still reports 15 violations on service → domain-function calls
  and on `LocalStorageStore` calling the checks each repository hands it. The evidence that they are false positives
  is in F11.
- **Options:**
  - **A.** Ask the Trussel team to confirm the heuristic and fix it; leave the app as is.
  - **B.** Redesign in a new pass: turn the domain's pure functions into classes or static members (or the services
    into functions) so the warnings clear.
  - **C.** Accept the warnings and record them as known.
- **Recommendation: A.** The app's layering is correct by Trussel's own rule and its own path check. Option B would
  distort the code to satisfy what looks like a heuristic bug.

### D2. The watermark + body-hash convention (T4)

- **Context:** the backend spec requires a watermark comment and a body hash on generated functions, so that a
  function a human took over can be detected. The IDE's local MCP server defines only the stamp, so the code has
  stamps only.
- **Options:**
  - **A.** Add the convention to the IDE server's instructions and stamp rule, then backfill Dumbbell Dude (it's
    small).
  - **B.** Drop or defer the convention in the spec, and record why in an ADR.
- **Recommendation:** your call, since it's a spec decision. If it stays, A is a front-end pass. The backfill here
  would take one sweep.

### D3. The design gaps A1–A5

- **Context:** five behaviours exist in code and architecture notes but not in the design set.
- **Options:**
  - **A.** Add them to the design set in a follow-up design pass. They then become reference designs for the next
    architecture revision.
  - **B.** Leave them as architecture-only and accept that the design set is incomplete.
- **Recommendation: A.** Otherwise the "design first" story has a hole that a reviewer will find.

### D4. The unplaced components `Chip` and `StickyFooter` (F5)

- **Options:**
  - **A.** Delete them from the design set.
  - **B.** Keep them as implementation hints. The code uses both, and `StickyFooter` is what the code uses for the
    sticky CTA.
- **Recommendation: B for `StickyFooter`, A for `Chip`.** `StickyFooter` is real in code; `Chip` was replaced by
  `ChipFilter`'s parts.

### D5. CTA placement: design vs design prompt (A6)

- **Context:** the design prompt asks for thumb-reachable sticky CTAs, but the screens put them at the end of the
  content. The code follows the prompt.
- **Options:**
  - **A.** Update the design so the screens use `StickyFooter`.
  - **B.** Change the code to match the screens.
- **Recommendation: A.** The code's behaviour is better on a phone, and the design should say what was built.

### D6. Streak rule

- **Context:** the rule the agent chose: a streak is consecutive local calendar days with a finished workout, and it
  stays alive if the last one was today or yesterday.
- **Options:**
  - **A.** Confirm it.
  - **B.** Define another rule, for example one that allows rest days.
- **Recommendation: A for v1.**

### D7. Ship it

- **Context:** the work is on `claude/github-repo-creation-2dngb5`. `main` holds only the initial README.
- **Options:**
  - **A.** Merge to `main` and connect Netlify to `main`.
  - **B.** Point Netlify at the branch for the demo, and merge later.
- **Recommendation: A.** `netlify.toml` already sets `npm run build` → `dist` and the deep-link redirect.

### D8. Where sandbox design and pass state should live (T5)

- **Context:** this is a product question for Trussel, not for this app. A sandbox's design sets and passes live
  only in the IDE's storage.
- **Options:**
  - **A.** Keep it that way: sandboxes are personal and disposable.
  - **B.** Add an export/import (or a repo-tracked folder such as `.trussel/`) so a sandbox design can be shared,
    reviewed and kept.
- **Recommendation:** worth a decision before demos. Without B, a demo can show the code but not the design and the
  pass that produced it.

---

## 5. Unverified observations

These were seen during the run but not confirmed. They're recorded so nobody over-claims from them.

| ID | Observation | Status |
|---|---|---|
| O1 | The agent reported **199** nodes and stamps; the IDE's pass page shows **198 of 198**, and `grep` finds **198** stamps in `src/`. | Most likely an off-by-one in the agent's count. Trust 198. |
| O2 | After implementation, the Architecture side panel's "Node states" read "0 designed, 0 implementing…" while the pass page showed 198 implemented. | Possibly because the session was back on P-2 (F14), or the panel is cut off. Needs a closer look. |
| O3 | `request_confirmation` was never needed, because every class and module was proposed before commit. | The developer-confirmation flow wasn't exercised in this run. |

---

## 6. Where Trussel clearly helped

For balance, these are the strongest results. The detail is in [BUILD_LOG.md](BUILD_LOG.md).

- **Design checks before code:** `snapshot_screen` caught a button off the frame, clipped lists, a modal overflow and
  a 2.77:1 contrast button. All were fixed in the design before any code.
- **Real columns from the start:** analysing the bare scaffold gave the actual column names, and the committed pass
  had no flow violations across 253 edges.
- **Notes as the contract:** implementation notes that named design IDs and rules made the build mostly
  transcription, and the notes became the test cases.
- **Checkable "done":** each node links to the file and line of its stamp, and one query confirmed nothing was left
  unbuilt.
- **Bugs the tests missed:** the analysis caught two layering bugs that `tsc` and 98 tests didn't.
- **Design vs code review:** rereading design components caught copy mismatches and an extra PR row in the code.
