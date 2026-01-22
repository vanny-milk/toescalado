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

function AppContent() {
  const { currentPage, isLoading } = useRouter();

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

  switch (currentPage) {
    case "index":
      return <IndexPage />;
    case "agenda":
      return <AgendaPage />;
    case "graphics":
      return <GraphicsPage />;
    case "editprofile":
      return <EditProfilePage />;
    case "login":
      return <LoginPage />;
    case "signup":
      return <SignUpPage />;
    case "forgotpass":
      return <ForgotPasswordPage />;
    default:
      return <LoginPage />;
  }
}

export function App() {
  return (
    <RouterProvider>
      <NavHeader />
      <AppContent />
      <BottomNav />
    </RouterProvider>
  );
}
