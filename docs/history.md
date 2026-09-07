# History & Undo

Everything that CineRename modifies on your disk is **traceable** and **reversible**. The **History** tab is your time machine.

## What is recorded

For each rename batch executed in the Studio, CLI, or automation pipeline, CineRename records:

- Precise **date and time** (started, completed, undone)
- **Batch status** (`running`, `applied`, `failed`, `undone`)
- Full **Before / After** for each file (original path and name, renamed path and name, media kind)
- Applied **rename template**
- **Undo availability** and validation status

Data is stored locally in an **SQLite** database (via `rusqlite` in the Rust core). No data is sent to external servers or cloud services.

::: info What is not in History
The SQLite History table specifically tracks rename and move batches. Subtitle downloads and duplicate deletions are independent actions not tracked as undoable rename batches.
:::

## History view and organization

The History screen presents a unified virtualized list grouped chronologically:

- **Grouped by date** — sections for Today, Yesterday, and earlier dates
- **Real-time search** — filter batches and entries by original or renamed filename/path
- **Status filter** — display all batches, only restorable batches, undone batches, or failed runs
- **Sorting** — toggle chronological order (newest or oldest first)

## Undo

Select an operation and click **Undo**. CineRename:

1. Verifies that the files still exist at their destination
2. Asks for confirmation
3. Restores the original names / locations
4. Marks the operation as canceled in the history (with a new "undo" record)

::: tip Chained undo
You can undo several days of successive modifications — the history goes back to the beginning of your installation.
:::

## Limitations of undo

Undo may fail if:

- Files have been **manually deleted** in the meantime (not in the trash).
- You have **manually renamed** a file after CineRename processed it — the undo doesn't know it's the same file.
- The **source disk** is no longer mounted (unplugged NAS, removed USB drive).

In these cases, CineRename reports the failure and keeps the original record for reference.

## Multiple selection

`Ctrl + click` (or `Cmd + click`) to select multiple operations, then **Undo selection**. Undos are performed in reverse order (LIFO) to respect dependencies between operations.

You can also press `Ctrl+A` (or `Cmd+A` on macOS) outside the search field to select or clear all restorable batches.

## Resetting local history

The desktop app does not automatically upload or sync history. If you need a clean installation, back up anything important, copy support diagnostics if you need them, then remove CineRename's local app-data folder for your operating system. Removing local history also removes the ability to undo older operations.
