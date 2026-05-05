import { useCallback, useRef } from 'react';

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        // Link de um som de notificação limpo (Ping)
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      }
      
      // Reiniciar o som se já estiver tocando
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('[useNotificationSound] Falha ao tocar áudio (interação do usuário necessária):', err);
      });
    } catch (error) {
      console.error('[useNotificationSound] Error:', error);
    }
  }, []);

  return { playSound };
}
