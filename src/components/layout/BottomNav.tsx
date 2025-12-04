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
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={onCreateClick}
                className="w-14 h-14 -mt-6 bg-primary text-white rounded-full flex items-center justify-center shadow-button hover:bg-primaryHover transition-all active:scale-95 touch-manipulation"
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
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 touch-manipulation transition-colors ${
                isActive ? "text-primary" : "text-text-tertiary"
              }`}
              aria-label={item.label}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
