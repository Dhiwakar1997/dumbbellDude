# Eda flows

Walkthroughs of real Dumbbell Dude features, played through the nodes of the Trussel graph with
`explain_flow`. Each JSON file next to this one is the exact `script` that `explain_flow` accepted.

The analysis these flows are based on was marked **stale** by Trussel when they were written (2026-11-01 IST).
The code was read directly to get the order of calls right. Methods such as `toggleSetDone` exist in the
graph only as design nodes, so each flow uses the analysed class or function node (for example `WorkoutService`)
as the actor.

No saved flow existed for any of these questions (`find_saved_flows` came back empty by query and by node).
`explain_flow` did not return a saved flow id. It returned only a draft playback id, listed below for reference.

## 1. Logging a set

File: [1-logging-a-set.json](1-logging-a-set.json)

**Question:** What happens when I tick a set on the Active workout screen?

**Valid set (9 steps)**
1. The lifter taps the tick on a set row; `SetRow` calls the screen's `toggle()`.
2. `ActiveWorkoutScreen` calls `WorkoutService.toggleSetDone(block, set)`.
3. The service loads the active workout from `LocalStorageWorkoutRepository` (through `LocalStorageStore` and localStorage).
4. The set is not done yet, so `validateSetEntry` checks its reps (1–999) and weight (0–1000 kg).
5. It is valid, so the set is marked done and gets a `completedAt` time from `SystemClock`.
6. The workout is saved back as the active workout, wrapped as `{ schemaVersion: 1, data }`.
7. The service returns `{ workout, nowDone }`. The screen stores the workout and clears any error on that set.
8. `nowDone` is true and `defaultRestSeconds` (from `SettingsService`) is above 0, so the screen opens the rest timer.
9. `RestTimerOverlay` counts down and shows the next unticked set. The lifter can add 15 s, cut 15 s, or skip.

**Invalid set (6 steps):** the lifter ticks a set with 0 reps → the service loads the workout → `validateSetEntry`
returns "Reps must be at least 1." → the service throws a `ValidationError` before saving anything → the screen
shows the message under the row and no rest timer starts → editing the weight or reps clears the error.

**What explain_flow marked:** nothing. It was accepted on the first attempt.
**Draft playback id:** `draft-7e3ee6c6-65be-4ec7-9ef6-e8c0614b767d`. No saved flow id was returned.

## 2. Finishing a workout and earning a PR

File: [2-finishing-a-workout.json](2-finishing-a-workout.json)

**Question:** What happens when I confirm Finish, and how does a personal record show up on Home, History and Progress?

**Finish with a PR (14 steps)**
1. The lifter taps Finish in the "Finish workout?" `Modal`, which runs the screen's `finish()`.
2. `ActiveWorkoutScreen` calls `WorkoutService.finish()`, which loads the active workout.
3. At least one set is ticked. Unticked sets and empty exercises are dropped, and `finishedAt` is stamped from `SystemClock`.
4. The finished workout is added to the `workouts` list in storage.
5. The active workout is cleared.
6. The screen calls `ServicesProvider`'s `refresh()` and navigates to `/history/:id`.
7. `WorkoutDetailScreen` calls `getWorkoutDetail(id)`, and the service lists every saved workout.
8. PRs are **not stored**. `findPersonalRecordSetIds` works them out on every read: a set counts if it beats earlier workouts on weight, estimated 1RM or reps.
9. The first time a lift is logged, only its single best set gets the badge.
10. The detail page shows a PRs tile with the count and a badge on each record set.
11. `HomeScreen` calls `homeSummary()`, which returns the streak, this week's volume and the last workout with its PR count.
12. `HistoryScreen` calls `listHistory()`, which returns every workout with its own PR count.
13. `ProgressScreen` asks `ProgressService.recordsFor()`, which reads all workouts and calls `personalRecords`.
14. The new best appears in the records list. Best set volume is calculated but not shown.

**Nothing ticked (6 steps):** Finish → `finish()` loads the workout → there are no done sets, so it throws
"Tick at least one set, or discard it." → the message shows inside the dialog and the workout stays active → the
lifter keeps lifting or discards it → nothing was written, so Home and History don't change.

**What explain_flow marked:** one call the graph does not show. In step 6, the screen navigating to
`WorkoutDetailScreen` is marked `not_in_graph`. This is accurate: the screen goes there through
`navigate('/history/:id')` and the router, not a direct call. It was accepted on the first attempt.
**Draft playback id:** `draft-f9e7e26d-c3e7-4e21-a879-f78d128c1054`. No saved flow id was returned.

## 3. Exporting and importing data

File: [3-exporting-and-importing-data.json](3-exporting-and-importing-data.json)

**Question:** How does Settings export my data as a JSON file, and how does importing a backup (or a bad file) work?

**Export (7 steps)**
1. The lifter taps the "Export data" `SettingRow`.
2. `SettingsScreen` calls `DataTransferService.exportData()`, which first gets the time from `SystemClock`.
3. It reads settings, custom exercises, routines and finished workouts from the four repositories. The active workout is not exported.
4. Each repository reads its own key through `LocalStorageStore` from localStorage.
5. It builds a single file tagged `app: "dumbbell-dude"`, `schemaVersion: 1`, named `dumbbell-dude-YYYY-MM-DD.json`.
6. The screen's `download()` turns the JSON into a Blob URL and clicks a hidden link, so the browser saves the file.
7. The row's hint changes to "Saved <filename>".

**Import a good file (9 steps)**
1. The lifter taps "Import data", which opens the hidden file input, and picks a file.
2. The screen reads the file as text.
3. `parseImport` checks that it is JSON, has the right app tag, and has a schemaVersion no newer than 1.
4. It then checks the shape of settings, custom exercises, routines and finished workouts. Nothing has been written yet.
5. It returns a preview with counts. The "Import backup?" `Modal` warns that this replaces the data on this device.
6. When the lifter confirms, the screen calls `applyImport(preview)`.
7. `applyImport` overwrites settings, custom exercises, routines and workouts, then clears any active workout.
8. Each repository writes its key through the store to localStorage.
9. The screen calls `refresh()` and goes to Home.

**Invalid file (6 steps):** the lifter picks a file → the screen passes its text to `parseImport` → it fails with
"That file isn't JSON." or "Not a Dumbbell Dude backup." → or, if the shape is wrong, with "This backup is damaged.
Nothing was imported." → the `ValidationError` is shown under the Import row → no dialog opens and no repository is
touched. The file input is reset so another file can be picked.

**What explain_flow marked:** nothing. The first attempt was accepted with nothing marked, but its import step 6
showed the lifter tapping the Settings row instead of the dialog. That step was corrected and the whole script sent
again (attempt 2). Attempt 2 was also accepted with nothing marked, and it is the version saved here.
**Draft playback id:** `draft-64e89681-5a24-429e-8844-1a5a580de956`. No saved flow id was returned.

## Animations

Recordings of each flow playing in the Trussel IDE (GIF and MP4) are in [docs/evidence/eda/](../evidence/eda/README.md).
