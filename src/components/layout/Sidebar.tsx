"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Heart, User, Settings, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  onCreateClick: () => void;
}

export function Sidebar({ onCreateClick }: SidebarProps) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { icon: Home, label: "Domů", path: "/" },
    { icon: Search, label: "Hledat", path: "/search" },
    { icon: Heart, label: "Aktivita", path: "/activity" },
    { icon: User, label: "Profil", path: "/profile" },
  ];

  return (
    <aside className="h-full bg-surface/80 backdrop-blur-xl border-r border-border/50 flex flex-col p-6">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-primary/20">
          E
        </div>
        <h1 className="text-2xl font-bold text-text font-serif tracking-tight">Echo</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive(item.path)
                ? "bg-primary/10 text-primary font-bold shadow-sm"
                : "text-text-secondary hover:bg-surfaceAlt hover:text-text"
            }`}
          >
            <item.icon
              className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                isActive(item.path) ? "fill-current" : ""
              }`}
            />
            <span className="text-lg">{item.label}</span>
          </Link>
        ))}

        <button
          onClick={onCreateClick}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-primary text-white py-3.5 rounded-full font-bold shadow-button hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Nová nálada</span>
        </button>
      </nav>

      <div className="pt-6 border-t border-border/50 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
             isActive('/settings') 
               ? "bg-surfaceAlt text-text font-medium" 
               : "text-text-secondary hover:bg-surfaceAlt hover:text-text"
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-lg">Nastavení</span>
        </Link>
        
        {user ? (
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-lg">Odhlásit se</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-primary hover:bg-primary/5 transition-colors font-medium"
          >
            <LogIn className="w-6 h-6" />
            <span className="text-lg">Přihlásit se</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
