"use client";

import { Home, Search, Grid, Bell, User, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface BottomNavProps {
  onCreateClick: () => void;
}

export function BottomNav({ onCreateClick }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    { id: "search", icon: Search, label: "Search", href: "/search" },
    { id: "create", icon: Plus, label: "Create", isCenter: true },
    { id: "activity", icon: Bell, label: "Activity", href: "/activity" },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-t border-border/50 safe-bottom z-50 shadow-nav">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={onCreateClick}
                className="w-14 h-14 -mt-8 bg-primary text-white rounded-full flex items-center justify-center shadow-button hover:bg-primaryHover hover:scale-105 transition-all active:scale-95 touch-manipulation ring-4 ring-surface"
                aria-label={item.label}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }

          const isActive = pathname === item.href;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href!)}
              className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 touch-manipulation transition-all duration-300 active:scale-95 ${
                isActive 
                  ? "text-primary" 
                  : "text-text-tertiary hover:text-text-secondary active:text-text"
              }`}
              aria-label={item.label}
            >
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/10 -translate-y-1" : ""}`}>
                <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? "stroke-[2.5px] scale-105" : "stroke-2"}`} />
              </div>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
