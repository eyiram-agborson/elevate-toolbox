import { Cycle, PersonRef } from './models';

// All dates are shown in UTC so a window "22 Jul" is 22 Jul for everyone.
const base = { timeZone: 'UTC' } as const;

export function fmtDate(d?: string | Date | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { ...base, day: 'numeric', month: 'short', year: 'numeric' });
}

export function fmtDayMonth(d?: string | Date | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { ...base, day: 'numeric', month: 'short' });
}

/** "22 Jul – 30 Jul 2026", or with both years when the range crosses a year. */
export function fmtRange(a?: string | Date | null, b?: string | Date | null): string {
  if (!a || !b) return '—';
  const sameYear = new Date(a).getUTCFullYear() === new Date(b).getUTCFullYear();
  return sameYear ? `${fmtDayMonth(a)} – ${fmtDate(b)}` : `${fmtDate(a)} – ${fmtDate(b)}`;
}

export function fmtDateTime(d?: string | Date | null): string {
  if (!d) return '—';
  const x = new Date(d);
  const time = x.toLocaleTimeString('en-GB', { ...base, hour: '2-digit', minute: '2-digit' });
  return `${fmtDate(x)}, ${time}`;
}

/** yyyy-mm-dd for <input type="date">. */
export function dateInput(d?: string | Date | null): string {
  return d ? new Date(d).toISOString().slice(0, 10) : '';
}

export function personName(p?: PersonRef | null): string {
  return p ? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() : '';
}

export function initials(p?: PersonRef | null): string {
  if (!p) return '?';
  return `${(p.firstName ?? '')[0] ?? ''}${(p.lastName ?? '')[0] ?? ''}`.toUpperCase() || '?';
}

/** A number without trailing zeros, "—" when there is none. */
export function fmtScore(n?: number | null): string {
  return n === null || n === undefined ? '—' : String(Math.round(n * 100) / 100);
}

export const PERIOD_LABELS: Record<string, string> = {
  Q1: 'January – March',
  Q2: 'April – June',
  Q3: 'July – September',
  Q4: 'October – December',
};

export function cycleName(period: string, startDate: string): string {
  const year = startDate ? new Date(startDate).getUTCFullYear() : new Date().getUTCFullYear();
  return `ELEVATE – ${period} (${PERIOD_LABELS[period]} ${year})`;
}

export type CycleStage = 'targets' | 'review' | 'done';

/** Where a cycle is today: target window, review window, or finished. */
export function cycleStage(c: Cycle, now = new Date()): CycleStage {
  if (c.status === 'CLOSED') return 'done';
  if (c.reviewStartDate && now >= new Date(c.reviewStartDate)) {
    const end = c.reviewEndDate ? new Date(c.reviewEndDate) : null;
    if (end) end.setUTCHours(23, 59, 59, 999);
    return end && now > end ? 'done' : 'review';
  }
  return 'targets';
}

export function statusLabel(c: Cycle): string {
  return c.status === 'ACTIVE' ? 'Active' : c.status === 'CLOSED' ? 'Completed' : 'Upcoming';
}
