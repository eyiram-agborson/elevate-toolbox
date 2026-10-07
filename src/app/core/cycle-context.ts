import { Cycle } from './models';

/** Newest cycle first. */
export function newestFirst(cycles: Cycle[]): Cycle[] {
  return [...cycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

/** The cycle a screen should open on: the one asked for, else the active one, else the newest. */
export function pickCycle(cycles: Cycle[], wantedId?: string | null): Cycle | null {
  return (
    cycles.find((c) => c._id === wantedId) ?? cycles.find((c) => c.status === 'ACTIVE') ?? cycles[0] ?? null
  );
}
