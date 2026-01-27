import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import type { EventItem, AgendaViewMode, Participant, EventType } from "../types/agenda";
import { computeDurationMinutes } from "../types/agenda";
import { Search, Plus, X, User } from "lucide-react";
import { useUsers } from "../hooks/queries/useUsers";

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

// Lista de usuários disponíveis para convidar
const availableUsers: Participant[] = [
  { id: "u1", name: "Ana Silva", email: "ana@example.com" },
  { id: "u2", name: "Carlos Santos", email: "carlos@example.com" },
  { id: "u3", name: "Maria Oliveira", email: "maria@example.com" },
  { id: "u4", name: "João Costa", email: "joao@example.com" },
  { id: "u5", name: "Patricia Lima", email: "patricia@example.com" },
];

const eventTypes: { value: EventType; label: string }[] = [
  { value: "reuniao", label: "Reunião" },
  { value: "ensaio", label: "Ensaio" },
  { value: "culto", label: "Culto" },
  { value: "outro", label: "Outro" },
];

export function AgendaPage() {
  const [view, setView] = useState<AgendaViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "reuniao" as EventType,
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [participantSearch, setParticipantSearch] = useState("");
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);

  // Buscar usuários reais do Supabase
  const { data: supabaseUsers, isLoading: isLoadingUsers } = useUsers();

  // Buscar usuários reais do Supabase
  const { data: supabaseUsers, isLoading: isLoadingUsers } = useUsers();

  // Usar usuários do Supabase ou fallback para lista mockada
  const availableUsersList = useMemo(() => {
    if (supabaseUsers && supabaseUsers.length > 0) {
      return supabaseUsers.map(user => ({
        id: user.id,
        name: user.full_name || 'Sem nome',
        email: user.email,
        avatar_url: user.avatar_url,
      }));
    }
    return availableUsers;
  }, [supabaseUsers]);

  const events = useMemo(() => sampleEvents, []);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const query = searchQuery.toLowerCase();
    return events.filter(
      (ev) =>
        ev.title.toLowerCase().includes(query) ||
        ev.description?.toLowerCase().includes(query) ||
        ev.participants?.some((p) => p.name.toLowerCase().includes(query))
    );
  }, [events, searchQuery]);

  const filteredParticipants = useMemo(() => {
    if (!participantSearch.trim()) return availableUsers;
    const query = participantSearch.toLowerCase();
    return availableUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [participantSearch]);

  const handleAddParticipant = (participant: Participant) => {
    if (!selectedParticipants.find((p) => p.id === participant.id)) {
      setSelectedParticipants([...selectedParticipants, participant]);
    }
    setParticipantSearch("");
    setShowParticipantDropdown(false);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setSelectedParticipants(selectedParticipants.filter((p) => p.id !== participantId));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementará a lógica de criação do evento
    console.log("Criar evento:", { ...newEvent, participants: selectedParticipants });
    setIsDialogOpen(false);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
    });
    setSelectedParticipants([]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Barra de busca e botão de adicionar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Busque por música, artista ou álbum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            className="flex items-center justify-center h-12 w-12 rounded-full bg-card border border-border hover:bg-accent transition-colors"
            aria-label="Adicionar evento"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-5 w-5 text-foreground" />
          </button>
        </div>

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
                {filteredEvents.map((ev) => (
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

        {/* Dialog de Criar Evento */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-between mb-2">
                <DialogTitle>Criar Novo Evento</DialogTitle>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <DialogDescription>
                Preencha os detalhes do evento abaixo.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateEvent} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Título do Evento</Label>
                <Input
                  id="event-title"
                  type="text"
                  placeholder="Ex: Reunião de alinhamento"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Convidados</Label>
                <div className="space-y-2">
                  {/* Participantes selecionados */}
                  {selectedParticipants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedParticipants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center gap-2 bg-muted rounded-full pl-1 pr-3 py-1"
                        >
                          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                            {getInitials(participant.name)}
                          </div>
                          <span className="text-sm">{participant.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipant(participant.id)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Campo de busca de participantes */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar por nome ou email..."
                      value={participantSearch}
                      onChange={(e) => {
                        setParticipantSearch(e.target.value);
                        setShowParticipantDropdown(true);
                      }}
                      onFocus={() => setShowParticipantDropdown(true)}
                    />
                    
                    {/* Dropdown de usuários */}
                    {showParticipantDropdown && participantSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredParticipants.length > 0 ? (
                          filteredParticipants.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleAddParticipant(user)}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors text-left"
                              disabled={selectedParticipants.some((p) => p.id === user.id)}
                            >
                              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
                                {getInitials(user.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground">
                            Nenhum usuário encontrado
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Descrição</Label>
                <textarea
                  id="event-description"
                  placeholder="Adicione mais detalhes sobre o evento..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-date">Data</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-start-time">Hora Início</Label>
                  <Input
                    id="event-start-time"
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-end-time">Hora Término</Label>
                  <Input
                    id="event-end-time"
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-location">Local</Label>
                <Input
                  id="event-location"
                  type="text"
                  placeholder="Ex: Sala de reuniões 1"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Criar Evento
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default AgendaPage;
