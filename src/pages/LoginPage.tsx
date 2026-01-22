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
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
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
