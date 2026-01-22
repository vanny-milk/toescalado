import { useState } from "react";
import { useRouter } from "../utils/router";
import { authService, supabase } from "../services/auth";
import { Button } from "../components/Button";
import { InputWithIcon } from "../components/InputWithIcon";
import { Label } from "../components/Label";
import { Checkbox } from "../components/Checkbox";
import { FormFooter } from "../components/FormFooter";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/Card";

export function LoginPage() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.signIn({
        email,
        password,
      });

      if (!response.success) {
        setError(response.message || "Failed to login");
      } else {
        const userId = response.user?.id;
        if (userId) {
          const resp = await supabase.from("profiles").select("*").eq("id", userId).single();
          const profile = resp.data as any;

          const needsOnboarding = !profile || !profile.city || !profile.role;
          if (needsOnboarding) {
            navigate("onboarding");
          } else {
            navigate("index");
          }
        } else {
          navigate("index");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-3xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

        <CardHeader className="space-y-4 text-center pb-8 pt-8">
          <div className="flex flex-col items-center justify-center mb-0">
            <img src="/logo/logo.svg" alt="Tô Escalado?" className="w-16 h-16 mb-2" />
            <h1 className="text-xl font-bold text-white mb-1">Tô Escalado?</h1>
          </div>
          <CardTitle className="text-3xl font-bold text-white tracking-tight">Bem-vindo</CardTitle>
          <CardDescription className="text-gray-400 text-base">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-8">
            {error && (
              <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200 border border-red-500/20 text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 ml-1">Email</Label>
              <InputWithIcon
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 h-12 rounded-xl"
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 ml-1">Senha</Label>
              <InputWithIcon
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-purple-500/50 h-12 rounded-xl"
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <Label
                  htmlFor="rememberMe"
                  className="cursor-pointer font-normal text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Lembrar-me
                </Label>
              </div>
              <Button
                type="button"
                variant="link"
                className="px-0 font-normal text-purple-400 hover:text-purple-300 h-auto"
                onClick={() => navigate("forgotpass")}
                disabled={isLoading}
              >
                Esqueceu a senha?
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 px-8 pb-8 pt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Entrando...
                </span>
              ) : "Entrar"}
            </Button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs uppercase text-gray-500">Ou continue com</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 bg-white text-black hover:bg-gray-100 font-semibold rounded-xl border-0 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              onClick={async () => {
                try {
                  await authService.signInWithGoogle();
                } catch (error) {
                  console.error("Google login error:", error);
                }
              }}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <div className="text-center text-sm text-gray-500">
              Não tem uma conta?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-purple-400 hover:text-purple-300 font-semibold"
                onClick={() => navigate("signup")}
                disabled={isLoading}
              >
                Criar conta
              </Button>
            </div>
          </CardFooter>
          <FormFooter />
        </form>
      </Card>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
