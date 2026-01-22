import { useState, useEffect, useRef } from "react";
import { authService } from "../services/auth";
import { useRouter } from "../utils/router";
import { Button } from "./Button";
import { InputWithIcon } from "./InputWithIcon";
import { Label } from "./Label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "./Card";

interface EditProfileProps {
    user: any;
    onClose: () => void;
}

export default function EditProfile({ user, onClose }: EditProfileProps) {
    const { refreshCurrentUser } = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || user.user_metadata?.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Close on click outside
    const handleClickOutside = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

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
                onClose();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={handleClickOutside}
        >
            <div ref={modalRef} className="w-full max-w-md animate-in zoom-in-95 duration-200">
                <Card className="shadow-2xl border-border/50 bg-card">
                    <CardHeader className="space-y-2 relative">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                            type="button"
                        >
                            ✕
                        </button>
                        <CardTitle className="text-2xl font-heading">Editar Perfil</CardTitle>
                        <CardDescription>Atualize suas informações pessoais</CardDescription>
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
                                    onChange={() => { }}
                                    required
                                    disabled
                                    className="opacity-60 cursor-not-allowed"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-2">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full border-transparent hover:bg-muted"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
