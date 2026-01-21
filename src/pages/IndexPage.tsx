import { useEffect, useState } from "react";
import { useRouter } from "../utils/router";
import { authService } from "../services/auth";
import { Button } from "../components/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/Card";

export function IndexPage() {
  const { navigate, currentUser } = useRouter();
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (currentUser?.user_metadata?.full_name) {
      setDisplayName(currentUser.user_metadata.full_name);
    } else if (currentUser?.email) {
      setDisplayName(currentUser.email);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await authService.signOut();
    navigate("login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Toescalado</CardTitle>
          <CardDescription>
            You are logged in successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Logged in as:</p>
            <p className="font-medium text-foreground">{displayName}</p>
          </div>
          {currentUser?.email && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email:</p>
              <p className="font-medium text-foreground break-all">
                {currentUser.email}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => navigate("editprofile")}>
            Editar Perfil
          </Button>
          <Button variant="outline" onClick={() => navigate("login")}>
            Back to Login
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
