import { useEffect, useState } from "react";
import { useRouter } from "../utils/router";
import { authService } from "../services/auth";
import { Button } from "../components/Button";
import { InputWithIcon } from "../components/InputWithIcon";
import { Label } from "../components/Label";
import { FormFooter } from "../components/FormFooter";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/Card";

export function EditProfilePage() {
  const { navigate, currentUser, refreshCurrentUser } = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.user_metadata?.full_name || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await authService.updateProfile({ fullName });
      if (!res.success) {
        setError(res.message || "Failed to update profile");
      } else {
        await refreshCurrentUser();
        navigate("index");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl">Editar Perfil</CardTitle>
          <CardDescription>Atualize suas informações</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <InputWithIcon
                id="fullName"
                type="text"
                placeholder="Seu nome"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <InputWithIcon
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={() => {}}
                required
                disabled
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full text-primary"
              onClick={() => navigate("index")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </CardFooter>
          <FormFooter />
        </form>
      </Card>
    </div>
  );
}
