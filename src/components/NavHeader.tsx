import { useState } from 'react';
import EditProfile from './EditProfile';
import { Badge } from './ui/badge';
import { useUserRoles, useAuthUser, useProfile } from '../hooks/useNavalHooks';
import { useRouter } from '../utils/router';

export function NavHeader() {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const { currentUser } = useRouter();

    // Hooks adapted from snippet to use our implementation
    const { data: authUser } = useAuthUser();
    const { data: profile } = useProfile(authUser?.id);
    const { data: userRoles } = useUserRoles();

    // Only show if logged in
    if (!currentUser) return null;

    const avatarUrl = profile?.avatar_url
        || authUser?.user_metadata?.avatar_url
        || 'https://i.pravatar.cc/150?u=' + (authUser?.id || 'user');

    const userName = profile?.name
        || authUser?.user_metadata?.name
        || authUser?.user_metadata?.full_name
        || authUser?.email?.split('@')[0]
        || 'Piloto';

    const navalName = authUser?.user_metadata?.naval_name || 'Turma Naval';

    return (
        <>
            <header className="w-full h-20 bg-background/95 backdrop-blur-md border-b border-border flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 transition-all duration-300">
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsEditProfileOpen(true)}
                        className="relative group cursor-pointer outline-none"
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-primary group-hover:border-brand-accent transition-all duration-300 shadow-sm group-hover:shadow-md">
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold tracking-wider">EDITAR</span>
                        </div>
                    </button>

                    {/* User Name & Naval Name */}
                    <div className="flex flex-col animate-in slide-in-from-left-2 duration-500">
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-foreground leading-tight">{userName}</span>
                            {/* Badges de Roles */}
                            <div className="flex items-center gap-1">
                                {userRoles?.isAdmin && (
                                    <Badge variant="alert" className="text-[10px] px-1.5 py-0">ADMIN</Badge>
                                )}
                                {userRoles?.isPilot && (
                                    <Badge variant="info" className="text-[10px] px-1.5 py-0">PILOTO</Badge>
                                )}
                                {userRoles?.isTripulante && (
                                    <Badge variant="success" className="text-[10px] px-1.5 py-0">TRIPULANTE</Badge>
                                )}
                                {userRoles?.tripulanteRoles?.map((role: string) => (
                                    <Badge
                                        key={role}
                                        variant="secondary"
                                        className="text-[10px] px-1.5 py-0 uppercase"
                                    >
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <span className="text-xs text-brand-primary font-bold tracking-widest uppercase mt-0.5">{navalName}</span>
                    </div>
                </div>

                {/* Right: Logo */}
                <div className="flex items-center gap-3 select-none">
                    <img
                        src="/logo/logo.png"
                        alt="Naval Logo"
                        className="h-10 w-auto object-contain fallback-logo"
                        onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-anchor'%3E%3Ccircle cx='12' cy='5' r='3'%3E%3C/circle%3E%3Cline x1='12' y1='22' x2='12' y2='8'%3E%3C/line%3E%3Cpath d='M5 12H2a10 10 0 0 0 20 0h-3'%3E%3C/path%3E%3C/svg%3E";
                            e.currentTarget.classList.add("p-1", "bg-foreground/10", "rounded");
                        }}
                    />
                </div>
            </header>

            {isEditProfileOpen && (
                <EditProfile user={authUser ?? null} onClose={() => setIsEditProfileOpen(false)} />
            )}
        </>
    );
}
