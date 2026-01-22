export const navalKeys = {
    all: ['naval'] as const,
    profiles: () => [...navalKeys.all, 'profiles'] as const,
    profile: (userId: string | undefined) => [...navalKeys.profiles(), userId] as const,
    authUser: () => ['auth', 'user'] as const,
};
