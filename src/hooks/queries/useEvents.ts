import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../../services/eventService';
import { authService } from '../../services/auth';
import type { EventItem } from '../../types/agenda';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.listEvents(),
  });
}

export function useEventMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (event: Omit<EventItem, 'id'>) => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('Usuário não autenticado');
      return eventService.createEvent(event, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (event: EventItem) => eventService.updateEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId: string) => eventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    createEvent: createMutation.mutateAsync,
    updateEvent: updateMutation.mutateAsync,
    deleteEvent: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
