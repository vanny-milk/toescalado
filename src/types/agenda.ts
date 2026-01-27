export type DurationMinutes = number; // duration in minutes

export type EventType = "reuniao" | "ensaio" | "culto" | "outro";

export interface Department {
  id: string;
  name: string;
}

export interface Participant {
  id: string;
  name: string;
  email?: string | null;
  departmentId?: string | null;
  avatar_url?: string | null;
}

export interface EventItem {
  id: string;
  title: string;
  type?: EventType;
  description?: string | null;
  start: string; // ISO datetime
  end?: string; // ISO datetime
  durationMinutes?: DurationMinutes;
  participants?: Participant[];
  departmentId?: string | null;
  location?: string | null;
}

export type AgendaViewMode = "list" | "month";

export interface AgendaState {
  events: EventItem[];
  departments: Department[];
}

// Utility to compute duration if start and end provided
export function computeDurationMinutes(startIso: string, endIso?: string): DurationMinutes | undefined {
  if (!endIso) return undefined;
  try {
    const s = new Date(startIso);
    const e = new Date(endIso);
    const diff = (e.getTime() - s.getTime()) / 60000;
    return Math.max(0, Math.round(diff));
  } catch (err) {
    return undefined;
  }
}
