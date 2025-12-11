"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const { signInAnonymously, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  
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
        setCheckEmail(true);
        toast.success("Registrace úspěšná!");
      }
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("Email not confirmed")) {
        toast.error("Email nebyl potvrzen. Zkontroluj svou schránku.");
      } else {
        toast.error(error.message || "Něco se pokazilo.");
      }
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

  if (checkEmail) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center safe-bottom">
        <div className="max-w-md w-full bg-surface p-8 rounded-card shadow-card border border-border space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-text">Zkontroluj svůj email</h2>
          <p className="text-text-secondary">
            Odeslali jsme potvrzovací odkaz na <strong>{email}</strong>. 
            Pro dokončení registrace prosím klikni na odkaz v emailu.
          </p>
          <button
            onClick={() => setCheckEmail(false)}
            className="text-primary font-medium hover:underline"
          >
            Zpět na přihlášení
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-warm text-center safe-bottom relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h1 className="text-5xl font-bold text-primary mb-3 font-serif tracking-tight">Echo</h1>
          <p className="text-text-secondary text-lg font-medium">
            Bezpečný prostor pro tvé pocity.
          </p>
        </div>

        <div className="bg-surface/60 backdrop-blur-xl p-8 rounded-3xl shadow-glass border border-border/50">
          {/* Tabs */}
          <div className="flex p-1.5 bg-surfaceAlt/50 rounded-2xl mb-8">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                mode === "signin"
                  ? "bg-surface text-primary shadow-sm scale-100"
                  : "text-text-secondary hover:text-text scale-95 opacity-70 hover:opacity-100"
              }`}
            >
              Přihlášení
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                mode === "signup"
                  ? "bg-surface text-primary shadow-sm scale-100"
                  : "text-text-secondary hover:text-text scale-95 opacity-70 hover:opacity-100"
              }`}
            >
              Registrace
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary ml-1 uppercase tracking-wider">Uživatelské jméno</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Jak ti máme říkat?"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surfaceAlt/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary ml-1 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  inputMode="email"
                  enterKeyHint="next"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surfaceAlt/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary ml-1 uppercase tracking-wider">Heslo</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  enterKeyHint="done"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surfaceAlt/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-primary text-white rounded-2xl font-bold shadow-button hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : mode === "signin" ? (
                "Přihlásit se"
              ) : (
                "Vytvořit účet"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50">
            <button
              onClick={handleAnonymousLogin}
              disabled={isLoading}
              className="w-full py-3.5 bg-surfaceAlt/50 text-text-secondary rounded-2xl font-medium hover:bg-surfaceAlt hover:text-text transition-all border border-border/50"
            >
              Pokračovat jako host
            </button>
          </div>
        </div>
        
        <p className="text-xs text-text-tertiary">
          Používáním aplikace souhlasíš s našimi podmínkami použití a zásadami ochrany osobních údajů.
        </p>
      </div>
    </main>
  );
}
