import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import type { EventItem, AgendaViewMode } from "../types/agenda";
import { computeDurationMinutes } from "../types/agenda";

const sampleEvents: EventItem[] = [
  {
    id: "e1",
    title: "Reunião de alinhamento",
    description: "Alinhar metas do trimestre",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    participants: [
      { id: "p1", name: "Ana Silva", email: "ana@example.com" },
    ],
    departmentId: "d1",
  },
  {
    id: "e2",
    title: "Planejamento de Sprint",
    start: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    durationMinutes: 90,
    participants: [{ id: "p2", name: "Carlos" }],
    departmentId: "d2",
  },
];

export function AgendaPage() {
  const [view, setView] = useState<AgendaViewMode>("list");

  const events = useMemo(() => sampleEvents, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agenda</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>Lista</Button>
                <Button variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")}>Mês</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === "list" ? (
              <div className="space-y-4">
                {events.map((ev) => (
                  <div key={ev.id} className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{ev.title}</h3>
                        {ev.description ? <p className="text-sm text-muted-foreground">{ev.description}</p> : null}
                        <p className="text-sm text-muted-foreground mt-2">
                          Início: {new Date(ev.start).toLocaleString()} • Duração: {ev.durationMinutes ?? computeDurationMinutes(ev.start, ev.end) ?? "—"} minutos
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ev.participants?.map((p) => p.name).join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">Visão mensal (simples)</p>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-md border border-border p-2 bg-background">
                      <div className="text-sm text-muted-foreground">{i + 1}</div>
                      <div className="mt-2 text-xs">
                        {events.filter((e) => new Date(e.start).getDate() === ((i % 31) + 1)).slice(0, 2).map((ev) => (
                          <div key={ev.id} className="text-ellipsis overflow-hidden whitespace-nowrap text-[12px]">• {ev.title}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AgendaPage;
