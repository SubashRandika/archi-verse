import * as z from "zod/mini";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Learner progress, persisted to localStorage (ADR-0004).
 *
 * - A concept without a record is "not started".
 * - Persisted data is validated record by record when it is loaded: invalid records are
 *   dropped (with a console warning) instead of discarding everything or crashing.
 * - `skipHydration`: the store starts empty so the first render matches the static HTML;
 *   `<PersistedStateSync />` loads saved progress after hydration.
 */

export const PROGRESS_STORAGE_KEY = "archiverse:progress";
export const PROGRESS_STORAGE_VERSION = 1;

const progressRecordSchema = z.object({
  status: z.enum(["in-progress", "completed"]),
  updatedAt: z.string(),
  completedAt: z.optional(z.string()),
  /** Last guided step visited (written from Phase 4/5). */
  lastStepId: z.optional(z.string()),
});

export type ProgressRecord = z.infer<typeof progressRecordSchema>;
export type ProgressRecords = Readonly<Record<string, ProgressRecord>>;

interface ProgressState {
  concepts: ProgressRecords;
  markCompleted: (conceptId: string) => void;
  markNotStarted: (conceptId: string) => void;
  /** Records the current guided step; marks the concept in progress unless already completed. */
  recordStep: (conceptId: string, stepId: string) => void;
  reset: () => void;
}

const now = () => new Date().toISOString();

/** Parses persisted progress, keeping every valid record. */
export function parsePersistedProgress(value: unknown): ProgressRecords {
  const container = z.object({ concepts: z.record(z.string(), z.unknown()) }).safeParse(value);
  if (!container.success) {
    if (value !== undefined) console.warn("[archiverse] Ignoring unreadable saved progress.");
    return {};
  }
  const records: Record<string, ProgressRecord> = {};
  let dropped = 0;
  for (const [conceptId, record] of Object.entries(container.data.concepts)) {
    const parsed = progressRecordSchema.safeParse(record);
    if (parsed.success) records[conceptId] = parsed.data;
    else dropped += 1;
  }
  if (dropped > 0)
    console.warn(`[archiverse] Dropped ${dropped} invalid saved progress record(s).`);
  return records;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      concepts: {},

      markCompleted: (conceptId) =>
        set((state) => {
          const timestamp = now();
          const previous = state.concepts[conceptId];
          return {
            concepts: {
              ...state.concepts,
              [conceptId]: {
                ...previous,
                status: "completed",
                updatedAt: timestamp,
                completedAt: timestamp,
              },
            },
          };
        }),

      markNotStarted: (conceptId) =>
        set((state) => {
          const { [conceptId]: _removed, ...rest } = state.concepts;
          return { concepts: rest };
        }),

      recordStep: (conceptId, stepId) =>
        set((state) => {
          const previous = state.concepts[conceptId];
          return {
            concepts: {
              ...state.concepts,
              [conceptId]: {
                ...previous,
                status: previous?.status ?? "in-progress",
                updatedAt: now(),
                lastStepId: stepId,
              },
            },
          };
        }),

      reset: () => set({ concepts: {} }),
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: PROGRESS_STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ concepts: state.concepts }),
      // Version 1 is the first schema; future versions add migrations here.
      migrate: (persisted) => persisted,
      merge: (persisted, current) => ({ ...current, concepts: parsePersistedProgress(persisted) }),
    },
  ),
);
