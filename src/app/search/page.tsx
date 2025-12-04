import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-text">Hledat</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder="Hledat příspěvky, lidi, témata..."
          className="w-full pl-10 p-3 rounded-xl bg-surface border border-border focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <div className="text-center py-10 text-text-secondary">
        <p>Zadejte hledaný výraz...</p>
      </div>
    </div>
  );
}