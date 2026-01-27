import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { updateProfile } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog"
import { Camera, LogOut } from 'lucide-react';
import { useRouter } from '../utils/router';
import { useProfile } from '../hooks/queries/naval/useProfile';
import { useQueryClient } from '@tanstack/react-query';
import { navalKeys } from '../lib/query-keys';

interface EditProfileProps {
  user: User | null;
  onClose: () => void;
}

function EditProfile({ user, onClose }: EditProfileProps) {
  const { navigate } = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: profile } = useProfile(user?.id);

  // Profile State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch initial data
  useEffect(() => {
    if (profile) {
      // Adapted: profile.full_name from DB, profile.name from code snippet
      setName(profile.full_name || profile.name || '');
      setCity(profile.city || '');
      // profile.avatar_url might not exist in DB but keeping per snippet
      setAvatarUrl(profile.avatar_url || '');
      return;
    }

    if (user) {
      setName(user.user_metadata?.name || user.user_metadata?.full_name || '');
      setCity(user.user_metadata?.city || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Update Profile Table
      const { success, error: profileError } = await updateProfile(user.id, {
        name: name,
        city: city,
      });

      if (!success) throw profileError;

      // 2. Update Password (if provided)
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          alert('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (passwordError) throw passwordError;
      }

      // 3. Update User Metadata (Legacy/Fallback sync)
      await supabase.auth.updateUser({
        data: { name, full_name: name, city }
      });

      await queryClient.invalidateQueries({ queryKey: navalKeys.profile(user.id) });
      await queryClient.invalidateQueries({ queryKey: navalKeys.authUser() });

      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(`Erro ao atualizar perfil: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('login');
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground text-center">Editar Perfil</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Atualize suas informações pessoais
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar Display */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full border-4 border-muted shadow-inner bg-muted overflow-hidden group">
              <img
                src={avatarUrl || user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Sua cidade"
                className="bg-background"
              />
            </div>

            {/* Password Section */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Label className="text-muted-foreground font-semibold text-sm">Alterar Senha</Label>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              onClick={handleSave}
              disabled={loading}
              variant="default"
              className="w-full font-medium shadow-md"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full gap-2 shadow-sm"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Wrapper to function as a Page
export function EditProfilePage() {
  const { currentUser, navigate, refreshCurrentUser } = useRouter();

  // If not logged in, usually router handles it, but just in case
  if (!currentUser) return null;

  return (
    <EditProfile
      user={currentUser.auth}
      onClose={async () => {
        // Must refresh user context to reflect changes in UI immediately if router keeps cache
        await refreshCurrentUser();
        navigate('index');
      }}
    />
  );
}
