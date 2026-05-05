

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
  status?: "confirmed" | "pending" | "unavailable";
  role?: string;
}

export interface EventItem {
  id: string;
  title: string;
  type?: EventType;
  description?: string | null;
  start: string; // ISO datetime
  participants?: Participant[];
  departmentId?: string | null;
  location?: string | null;
  responsible?: Participant;
}

export type AgendaViewMode = "list" | "month";

export interface AgendaState {
  events: EventItem[];
  departments: Department[];
}

