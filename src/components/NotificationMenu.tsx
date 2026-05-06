import { useState, useRef, useEffect } from 'react';
import { 
  Bell, Calendar, MessageSquare, ExternalLink, Loader2, 
  UserCheck, UserX, CheckCircle, Star, AlertTriangle 
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { formatRelativeTime } from '../utils/dateUtils';
import { useRouter } from '../utils/router';

export function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const menuRef = useRef<HTMLDivElement>(null);
  const { navigate } = useRouter();

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    // Lógica de redirecionamento baseada no tipo
    if (notification.type.includes('event') || notification.type.includes('guest') || notification.type.includes('pending')) {
      navigate("agenda");
    }
    
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_invite': return <Calendar className="h-5 w-5" />;
      case 'guest_confirmed': return <UserCheck className="h-5 w-5" />;
      case 'guest_unavailable': return <UserX className="h-5 w-5" />;
      case 'all_guests_confirmed': return <CheckCircle className="h-5 w-5" />;
      case 'event_today': return <Star className="h-5 w-5" />;
      case 'pending_reminder': return <AlertTriangle className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'event_invite': return 'bg-blue-500/10 text-blue-500';
      case 'guest_confirmed': return 'bg-green-500/10 text-green-500';
      case 'guest_unavailable': return 'bg-red-500/10 text-red-500';
      case 'all_guests_confirmed': return 'bg-emerald-500/10 text-emerald-500';
      case 'event_today': return 'bg-yellow-500/10 text-yellow-500';
      case 'pending_reminder': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão do Sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted transition-all duration-300 group"
        aria-label="Notificações"
      >
        <Bell className={`h-6 w-6 text-muted-foreground group-hover:text-brand-primary transition-colors ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              Notificações
              {unreadCount > 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{unreadCount} novas</span>}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline font-medium"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm">Carregando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 opacity-20" />
                </div>
                <p className="text-sm font-medium">Tudo limpo por aqui!</p>
                <p className="text-xs opacity-60 mt-1">Você não tem nenhuma notificação no momento.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full p-4 flex gap-4 text-left hover:bg-muted/50 transition-colors group relative ${!n.is_read ? 'bg-primary/[0.03]' : ''}`}
                  >
                    {/* Icon based on type */}
                    <div className={`mt-1 h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center ${getNotificationColor(n.type)}`}>
                      {getNotificationIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold truncate ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                          {formatRelativeTime(n.created_at)}
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-2 ${!n.is_read ? 'text-foreground/80 font-medium' : 'text-muted-foreground'}`}>
                        {n.message}
                      </p>
                      
                      {/* Action indicator */}
                      {!n.is_read && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-full" />
                      )}
                      
                      <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider flex items-center gap-1">
                          Ver detalhes <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-muted/10 border-top border-border text-center">
              <button className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
