"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User } from "lucide-react";

export default function LoginPage() {
  const { signInAnonymously, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        toast.success("Vítej zpět!");
        router.push("/");
      } else {
        await signUpWithEmail(email, password, username);
        toast.success("Registrace úspěšná! Zkontroluj svůj email.");
        setMode("signin");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Něco se pokazilo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously();
      router.push("/");
    } catch (error) {
      toast.error("Chyba při anonymním přihlášení");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center safe-bottom">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Echo</h1>
          <p className="text-text-secondary text-lg">
            Bezpečný prostor pro tvé pocity.
          </p>
        </div>

        <div className="bg-surface p-6 rounded-card shadow-card border border-border">
          {/* Tabs */}
          <div className="flex p-1 bg-surfaceAlt rounded-xl mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              Přihlásit
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              Registrovat
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Uživatelské jméno"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 p-3 rounded-input bg-surfaceAlt border-transparent focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 rounded-input bg-surfaceAlt border-transparent focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                type="password"
                placeholder="Heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 rounded-input bg-surfaceAlt border-transparent focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-bold rounded-button shadow-button hover:bg-primaryHover transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === "signin" ? "Přihlásit se" : "Vytvořit účet"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-tertiary">nebo</span>
            </div>
          </div>

          <button
            onClick={handleAnonymousLogin}
            disabled={isLoading}
            className="w-full py-3 bg-surfaceAlt text-text font-bold rounded-button hover:bg-border transition-all active:scale-95"
          >
            Pokračovat anonymně
          </button>
        </div>
      </div>
    </main>
  );
}
