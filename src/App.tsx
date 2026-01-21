import { RouterProvider, useRouter } from "./utils/router";
import { IndexPage } from "./pages/IndexPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

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
      <AppContent />
    </RouterProvider>
  );
}
