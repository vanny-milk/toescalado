import { useState } from "react";
import { useRouter } from "../utils/router";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action?: () => void;
};

const navItems: NavItem[] = [
  {
    id: "agenda-list",
    label: "Agenda",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    id: "agenda-calendar",
    label: "Calendário",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "graphics",
    label: "Gráficos",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    id: "editprofile",
    label: "Perfil",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    id: "share",
    label: "Compartilhar",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C9.953 15.938 11.935 17.914 14.531 19.116M8.684 13.342l2.121-2.121a1.5 1.5 0 112.121 2.121l-2.121 2.121m0 0l2.121 2.121a1.5 1.5 0 01-2.121 2.121l-2.121-2.121m0-4.242L6.563 9.221a1.5 1.5 0 10-2.121 2.121l2.121 2.121m12.728-12.728a1.5 1.5 0 10-2.121-2.121l-2.121 2.121m0 4.242l2.121 2.121a1.5 1.5 0 002.121-2.121l-2.121-2.121m0-4.242l2.121-2.121a1.5 1.5 0 11-2.121-2.121l-2.121 2.121"
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const { navigate, currentUser } = useRouter();
  const [activeNavId, setActiveNavId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Only show bottom nav if user is logged in
  if (!currentUser) {
    return null;
  }

  const handleShare = () => {
    if (currentUser?.auth?.id) {
      const shareLink = `${window.location.origin}?ref=${currentUser.auth.id}`;
      navigator.clipboard.writeText(shareLink);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleNavClick = (itemId: string) => {
    setActiveNavId(itemId);

    // Navigate based on the selected item
    switch (itemId) {
      case "agenda-list":
        navigate("agenda");
        break;
      case "agenda-calendar":
        navigate("agenda");
        break;
      case "graphics":
        navigate("graphics" as any);
        break;
      case "editprofile":
        navigate("editprofile");
        break;
      case "share":
        handleShare();
        break;
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center justify-center gap-2 bg-card border border-border rounded-full px-6 py-3 shadow-lg backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = activeNavId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={item.label}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {isActive && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in duration-200">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg text-sm">
            Link copiado para a área de transferência!
          </div>
        </div>
      )}
    </>
  );
}
