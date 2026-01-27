import { RouterProvider, useRouter } from "./utils/router";
import { IndexPage } from "./pages/IndexPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AgendaPage } from "./pages/AgendaPage";
import { GraphicsPage } from "./pages/GraphicsPage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { BottomNav } from "./components/BottomNav";
import { NavHeader } from "./components/NavHeader";

import { useEffect } from "react"; // 1. Importe o useEffect
// ... (seus outros imports permanecem iguais)

function AppContent() {
  const { currentPage, isLoading, navigate, currentUser } = useRouter();

  // Lógica de Redirecionamento Automático
  useEffect(() => {
    if (isLoading) return;

    const publicPages = ["login", "signup", "forgotpass"];
    const isLoggingIn = publicPages.includes(currentPage);

    if (currentUser && isLoggingIn) {
      // Se está logado e tenta ver login -> vai para agenda
      navigate("agenda");
    } else if (!currentUser && !isLoggingIn && currentPage !== "index") {
      // Se não está logado e tenta ver páginas internas -> vai para login
      navigate("login");
    }
  }, [currentUser, currentPage, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // 4. Melhore a detecção de quando mostrar os menus
  // Adicionei "index" na lista para não mostrar nav na Landing Page, se desejar
  const showNav = !["login", "signup", "forgotpass", "index"].includes(currentPage);

  let pageContent;
  switch (currentPage) {
    case "index":
      pageContent = <IndexPage />;
      break;
    case "agenda":
      pageContent = <AgendaPage />;
      break;
    case "graphics":
      pageContent = <GraphicsPage />;
      break;
    case "editprofile":
      pageContent = <EditProfilePage />;
      break;
    case "login":
      pageContent = <LoginPage />;
      break;
    case "signup":
      pageContent = <SignUpPage />;
      break;
    case "forgotpass":
      pageContent = <ForgotPasswordPage />;
      break;
    default:
      pageContent = currentUser ? <AgendaPage /> : <LoginPage />;
      break;
  }

  return (
    <>
      {showNav && <NavHeader />}
      <main className={showNav ? "pb-20" : ""}> 
        {pageContent}
      </main>
      {showNav && <BottomNav />}
    </>
  );
}

export function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}