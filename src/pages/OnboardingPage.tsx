import { useState } from "react";
import { useRouter } from "../utils/router";
import { supabase } from "../services/auth";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/Card";

export default function OnboardingPage() {
  const { navigate, currentUser } = useRouter();
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [departments, setDepartments] = useState("");
  const [otherEmails, setOtherEmails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = currentUser?.auth?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!userId) {
      setError("User not found");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: userId,
        city: city || null,
        role: role || null,
        departments: departments
          ? departments.split(",").map((s) => s.trim())
          : null,
        other_emails: otherEmails
          ? otherEmails.split(",").map((s) => s.trim())
          : null,
      };

      const { error: upsertError } = await supabase.from("profiles").upsert(payload as any);

      if (upsertError) {
        setError(upsertError.message || "Failed to save profile");
      } else {
        navigate("index");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Welcome — let’s finish your profile</CardTitle>
          <CardDescription>
            Complete these details so other people in your church can connect with you.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departments">Departamentos (separados por vírgula)</Label>
              <Input id="departments" value={departments} onChange={(e) => setDepartments(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherEmails">E-mails de outras pessoas (separados por vírgula)</Label>
              <Input id="otherEmails" value={otherEmails} onChange={(e) => setOtherEmails(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Finish setup"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
