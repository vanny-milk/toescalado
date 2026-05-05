import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import type { EventItem, AgendaViewMode, Participant, EventType } from "../types/agenda";
import { Search, Plus, X, ChevronLeft, ChevronRight, Pencil, ArrowUpDown, Loader2, Calendar, Clock } from "lucide-react";
import { useUsers } from "../hooks/queries/useUsers";
import { useCalendar } from "../hooks/useCalendar";
import { useEvents, useEventMutation } from "../hooks/queries/useEvents";

// Fallback para lista mockada apenas se o banco estiver vazio
const fallbackUsers: Participant[] = [
  { id: "u1", name: "Ana Silva", email: "ana@example.com" },
  { id: "u2", name: "Carlos Santos", email: "carlos@example.com" },
  { id: "u3", name: "Maria Oliveira", email: "maria@example.com" },
];

export function AgendaPage() {
  const [view, setView] = useState<AgendaViewMode>("list");
  const [activeTab, setActiveTab] = useState<"gerais" | "convidados">("gerais");
  const { currentDate, nextMonth, prevMonth, calendarWeeks, year, month } = useCalendar();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id: undefined as string | undefined,
    title: "",
    type: "reuniao" as EventType,
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: new Date().toTimeString().slice(0, 5),
    location: "",
  });
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [participantSearch, setParticipantSearch] = useState("");
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>({ key: "start", direction: "asc" });

  // Buscar eventos reais do Supabase
  const { data: dbEvents, isLoading: isLoadingEvents } = useEvents();
  const { createEvent, updateEvent, isCreating, isUpdating } = useEventMutation();

  // Buscar usuários reais do Supabase
  const { data: supabaseUsers } = useUsers();

  // Usar usuários do Supabase ou fallback para lista mockada
  const availableUsersList = useMemo(() => {
    if (supabaseUsers && supabaseUsers.length > 0) {
      return supabaseUsers.map(user => ({
        id: user.id,
        name: user.name || user.full_name || 'Sem nome',
        email: user.email,
        avatar_url: user.avatar_url,
      }));
    }
    return fallbackUsers;
  }, [supabaseUsers]);

  const events = useMemo(() => dbEvents || [], [dbEvents]);

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

  const sortedEvents = useMemo(() => {
    let sortableEvents = [...filteredEvents];
    if (sortConfig !== null) {
      sortableEvents.sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";

        if (sortConfig.key === 'start' || sortConfig.key === 'diasRestantes') {
          aValue = new Date(a.start).getTime();
          bValue = new Date(b.start).getTime();
        } else if (sortConfig.key === 'title') {
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
        } else if (sortConfig.key === 'type') {
          aValue = (a.type || "").toLowerCase();
          bValue = (b.type || "").toLowerCase();
        } else if (sortConfig.key === 'location') {
          aValue = (a.location || "").toLowerCase();
          bValue = (b.location || "").toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableEvents;
  }, [filteredEvents, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredParticipants = useMemo(() => {
    if (!participantSearch.trim()) return availableUsersList;
    const query = participantSearch.toLowerCase();
    return availableUsersList.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [participantSearch, availableUsersList]);

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

  const handleEditEvent = (event: EventItem) => {
    const startDate = new Date(event.start);
    
    setNewEvent({
      id: event.id,
      title: event.title,
      type: event.type || "reuniao",
      description: event.description || "",
      date: startDate.toISOString().split("T")[0],
      startTime: startDate.toTimeString().slice(0, 5),
      location: "",
    });
    setSelectedParticipants(event.participants || []);
    setActiveTab("gerais");
    setIsDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Combinar data e hora para o formato ISO
      const startDateTime = new Date(`${newEvent.date}T${newEvent.startTime}:00`).toISOString();
      
      const eventData: EventItem = {
        id: newEvent.id as string,
        title: newEvent.title,
        type: newEvent.type,
        description: newEvent.description,
        start: startDateTime,
        location: newEvent.location,
        participants: selectedParticipants,
      };

      if (newEvent.id) {
        await updateEvent(eventData);
      } else {
        await createEvent(eventData);
      }

      setIsDialogOpen(false);
      setNewEvent({
        id: undefined,
        title: "",
        type: "reuniao" as EventType,
        description: "",
        date: new Date().toISOString().split("T")[0],
        startTime: new Date().toTimeString().slice(0, 5),
        location: "",
      });
      setSelectedParticipants([]);
      setActiveTab("gerais");
    } catch (error: any) {
      console.error('Erro ao salvar evento:', error);
      alert(`Erro ao salvar o evento: ${error.message || 'Verifique se você tem permissão.'}`);
    }
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
            className="flex items-center justify-center h-12 w-12 rounded-full bg-card border border-border hover:bg-accent transition-colors shadow-sm hover:shadow-md"
            aria-label="Adicionar evento"
            onClick={() => {
              setNewEvent({
                id: undefined,
                title: "",
                type: "reuniao" as EventType,
                description: "",
                date: new Date().toISOString().split("T")[0],
                startTime: new Date().toTimeString().slice(0, 5),
                location: "",
              });
              setSelectedParticipants([]);
              setIsDialogOpen(true);
            }}
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
            {isLoadingEvents ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Carregando escala...</p>
              </div>
            ) : view === "list" ? (
              <div className="rounded-md border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-muted-foreground">
                    <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border">
                      <tr>
                        <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => requestSort('start')}>
                          <div className="flex items-center gap-1">Data {sortConfig?.key === 'start' && <ArrowUpDown className="h-3 w-3" />}</div>
                        </th>
                        <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => requestSort('diasRestantes')}>
                          <div className="flex items-center gap-1">Dias restantes {sortConfig?.key === 'diasRestantes' && <ArrowUpDown className="h-3 w-3" />}</div>
                        </th>
                        <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => requestSort('title')}>
                          <div className="flex items-center gap-1">Nome {sortConfig?.key === 'title' && <ArrowUpDown className="h-3 w-3" />}</div>
                        </th>
                        <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => requestSort('type')}>
                          <div className="flex items-center gap-1">Tipo Evento {sortConfig?.key === 'type' && <ArrowUpDown className="h-3 w-3" />}</div>
                        </th>
                        <th scope="col" className="px-4 py-3 cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => requestSort('location')}>
                          <div className="flex items-center gap-1">Local {sortConfig?.key === 'location' && <ArrowUpDown className="h-3 w-3" />}</div>
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Convidados
                        </th>
                        <th scope="col" className="px-4 py-3 text-right">
                          <span className="sr-only">Ações</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedEvents.map((ev) => {
                        const eventDate = new Date(ev.start);
                        const daysRemaining = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <tr key={ev.id} className="border-b border-border hover:bg-muted/30 transition-colors last:border-0">
                            <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                              {eventDate.toLocaleDateString('pt-BR')} <span className="text-muted-foreground ml-1">{eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </td>
                            <td className="px-4 py-3">
                              {daysRemaining > 0 ? (
                                <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500/20">
                                  {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                                </span>
                              ) : daysRemaining === 0 ? (
                                <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20">
                                  Hoje
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                                  Passado
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-medium text-foreground">
                              {ev.title}
                            </td>
                            <td className="px-4 py-3">
                              {ev.type && (
                                <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full capitalize">
                                  {ev.type}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 truncate max-w-[150px]">
                              {ev.location || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex -space-x-2">
                                {['confirmed', 'pending', 'unavailable'].map(statusGroup => {
                                  const groupParticipants = ev.participants?.filter(p => p.status === statusGroup) || [];
                                  return groupParticipants.map(p => {
                                    const statusStyles = p.status === 'confirmed' 
                                      ? 'ring-2 ring-green-500' 
                                      : p.status === 'pending' 
                                      ? 'ring-2 ring-yellow-500' 
                                      : 'ring-2 ring-red-500';
                                      
                                    return (
                                      <div key={`${ev.id}-${p.id}`} className="relative group cursor-pointer z-0 hover:z-10">
                                        <div className={`w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-medium border border-background ${statusStyles} overflow-hidden`}>
                                          {p.avatar_url ? (
                                            <img src={p.avatar_url} alt={p.name} className="w-full h-full object-cover" />
                                          ) : (
                                            getInitials(p.name)
                                          )}
                                        </div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-border">
                                          <span className="font-semibold block text-center">{p.name}</span>
                                          {p.role && <span className="block text-center text-[10px] text-muted-foreground mt-0.5">{p.role}</span>}
                                        </div>
                                      </div>
                                    );
                                  });
                                })}
                                {(!ev.participants || ev.participants.length === 0) && (
                                  <span className="text-xs text-muted-foreground">-</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleEditEvent(ev)}
                                className="p-1.5 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground inline-flex"
                                title="Editar evento"
                                aria-label="Editar evento"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      
                      {sortedEvents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                            Nenhum evento encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Visão mensal</p>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={prevMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium capitalize w-32 text-center text-sm">
                      {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-[auto_repeat(7,1fr)] gap-2">
                  {/* Cabeçalho dos dias da semana */}
                  <div className="h-8 flex items-center justify-center"></div>
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, idx) => (
                    <div key={idx} className="h-8 flex items-center justify-center font-medium text-sm text-muted-foreground bg-muted/50 rounded-md">
                      {day}
                    </div>
                  ))}

                  {/* Dias do calendário */}
                  {calendarWeeks.map((weekInfo, weekIdx) => (
                    <div key={weekIdx} className="contents">
                      {/* Week number */}
                      <div className="flex items-center justify-center text-xs font-semibold text-muted-foreground bg-muted/30 rounded-md border border-border/50 min-w-[2rem]">
                        {weekInfo.weekNo}
                      </div>
                      {/* Days */}
                      {weekInfo.days.map((dayInfo, i) => (
                        <div key={i} className={`h-24 rounded-md border p-2 ${dayInfo.isValid ? 'border-border bg-background' : 'border-transparent bg-transparent'}`}>
                          {dayInfo.isValid && (
                            <>
                              <div className="text-sm text-muted-foreground">{dayInfo.dayNumber}</div>
                              <div className="mt-2 text-xs">
                                {events
                                  .filter(e => {
                                    const ed = new Date(e.start);
                                    return ed.getFullYear() === year && 
                                           ed.getMonth() === month && 
                                           ed.getDate() === dayInfo.dayNumber;
                                  })
                                  .slice(0, 2)
                                  .map(ev => (
                                    <div key={ev.id} className="text-ellipsis overflow-hidden whitespace-nowrap text-[12px]">• {ev.title}</div>
                                  ))}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
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
                <DialogTitle>{newEvent.id ? "Editar Evento" : "Criar Novo Evento"}</DialogTitle>
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
              <div className="flex border-b border-border mt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("gerais")}
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "gerais" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  tabIndex={-1}
                >
                  Gerais
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("convidados")}
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "convidados" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  tabIndex={-1}
                >
                  Convidados
                </button>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleCreateEvent} className="space-y-4 mt-4 flex flex-col">
              {/* ABA: GERAIS */}
              <div className={activeTab === "gerais" ? "space-y-4" : "hidden"}>
                <div className="space-y-2">
                  <Label htmlFor="event-title">Título do Evento</Label>
                  <Input
                    id="event-title"
                    type="text"
                    placeholder="Ex: Reunião de alinhamento"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required={activeTab === "gerais"}
                  />
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Data</Label>
                    <div className="relative group">
                      <Input
                        id="event-date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        required={activeTab === "gerais"}
                        className="pr-10 cursor-pointer block"
                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-start-time">Hora Início</Label>
                    <div className="relative group">
                      <Input
                        id="event-start-time"
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        required={activeTab === "gerais"}
                        className="pr-10 cursor-pointer block"
                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
                    </div>
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
              </div>

              {/* ABA: CONVIDADOS */}
              <div className={activeTab === "convidados" ? "space-y-4" : "hidden"}>
                <div className="space-y-2">
                  <Label>Buscar Convidados</Label>
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
                                {user.avatar_url ? (
                                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  getInitials(user.name)
                                )}
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

                <div className="space-y-2">
                  <Label>Convidados Selecionados ({selectedParticipants.length})</Label>
                  {selectedParticipants.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {selectedParticipants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center gap-2 bg-muted/30 rounded-lg p-2 border border-border"
                        >
                          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {participant.avatar_url ? (
                              <img src={participant.avatar_url} alt={participant.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              getInitials(participant.name)
                            )}
                          </div>
                          <span className="text-sm font-medium flex-1 truncate">{participant.name}</span>
                          
                          <Input
                            type="text"
                            placeholder="Função (ex: Vocal)"
                            value={participant.role || ""}
                            onChange={(e) => {
                              setSelectedParticipants(prev => prev.map(p => 
                                p.id === participant.id ? { ...p, role: e.target.value } : p
                              ));
                            }}
                            className="w-32 h-8 text-xs"
                          />
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipant(participant.id)}
                            className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors flex-shrink-0"
                            title="Remover"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground p-4 text-center border border-dashed border-border rounded-lg">
                      Nenhum convidado selecionado ainda.
                    </div>
                  )}
                </div>
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
                <Button type="submit" className="flex-1" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : newEvent.id ? (
                    "Salvar Alterações"
                  ) : (
                    "Criar Evento"
                  )}
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
