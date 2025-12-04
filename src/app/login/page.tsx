"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signInAnonymously, loading } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleAnonymousLogin = async () => {
    setIsSigningIn(true);
    await signInAnonymously();
    setIsSigningIn(false);
    router.push("/");
  };

  if (loading) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Echo</h1>
          <p className="text-text-secondary text-lg">
            Bezpečný prostor pro tvé pocity.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleAnonymousLogin}
            disabled={isSigningIn}
            className="w-full py-4 bg-surface text-text font-semibold rounded-button shadow-card hover:bg-surfaceAlt transition-all active:scale-95 border border-border"
          >
            {isSigningIn ? "Přihlašování..." : "Pokračovat anonymně"}
          </button>
          
          <p className="text-xs text-text-tertiary mt-4">
            Pokračováním souhlasíš s pravidly komunity.
            <br />
            Anonymní účet je vázaný na toto zařízení.
          </p>
        </div>
      </div>
    </main>
  );
}
