import { useRouter } from '../utils/router';

export function useAuthUser() {
    const { currentUser } = useRouter();
    return { data: currentUser?.auth };
}

export function useProfile(_userId?: string) {
    const { currentUser } = useRouter();
    // basic check to ensure we are returning profile for the logged user
    // in a real concurrent app we'd fetch for userId, but here we assume it's for current user
    return { data: currentUser?.profile };
}

export function useUserRoles() {
    const { currentUser } = useRouter();
    const profile = currentUser?.profile;
    const roles: string[] = profile?.roles || []; // assume roles might be json/array if exists, or simple string?

    // Fallback if roles structure is different in DB
    const rawRole = profile?.role; // string like 'pilot' or 'admin' ?

    // Logic to determine roles. Adjust based on actual DB schema.
    // For now, mapping string 'role' to boolean flags.
    const isAdmin = rawRole === 'admin' || roles.includes('admin');
    const isPilot = rawRole === 'pilot' || roles.includes('pilot');
    const isTripulante = rawRole === 'tripulante' || roles.includes('tripulante');

    // If tripulante have sub-roles
    const tripulanteRoles: string[] = [];

    return {
        data: {
            isAdmin,
            isPilot,
            isTripulante,
            tripulanteRoles
        }
    };
}
