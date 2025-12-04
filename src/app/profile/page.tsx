"use client";

import { useAuth } from "@/lib/auth-context";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text">Profil</h1>
      
      <div className="bg-surface rounded-card p-6 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-surfaceAlt flex items-center justify-center">
          <User className="w-10 h-10 text-text-secondary" />
        </div>
        <div className="text-center">
          <p className="font-bold text-lg text-text">Anonymní Uživatel</p>
          <p className="text-sm text-text-secondary">ID: {user?.id.slice(0, 8)}...</p>
        </div>
      </div>

      <button
        onClick={() => signOut()}
        className="w-full py-3 text-red-500 font-medium bg-surface rounded-xl border border-red-100 hover:bg-red-50 transition-colors"
      >
        Odhlásit se
      </button>
    </div>
  );
}