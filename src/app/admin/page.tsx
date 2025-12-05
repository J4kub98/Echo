"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase, type Report, type MoodEntry } from "@/lib/supabase";
import { Loader2, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ReportWithDetails extends Report {
  mood_entries: MoodEntry | null;
  profiles: { username: string } | null; // Reporter
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<ReportWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdmin();
    }
  }, [user]);

  async function checkAdmin() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user?.id)
        .single();

      if (error || !data?.is_admin) {
        router.push("/"); // Redirect non-admins
        return;
      }

      setIsAdmin(true);
      fetchReports();
    } catch (error) {
      console.error("Admin check failed:", error);
      router.push("/");
    }
  }

  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          mood_entries (*),
          profiles (username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data as any || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Chyba při načítání reportů");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEntry(entryId: string, reportId: string) {
    if (!confirm("Opravdu smazat tento příspěvek?")) return;

    try {
      // Delete the entry
      const { error: deleteError } = await supabase
        .from("mood_entries")
        .delete()
        .eq("id", entryId);

      if (deleteError) throw deleteError;

      // Update report status
      await supabase
        .from("reports")
        .update({ status: "resolved" })
        .eq("id", reportId);

      toast.success("Příspěvek smazán");
      fetchReports();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Nepodařilo se smazat příspěvek");
    }
  }

  async function handleDismissReport(reportId: string) {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: "dismissed" })
        .eq("id", reportId);

      if (error) throw error;
      toast.success("Nahlášení zamítnuto");
      fetchReports();
    } catch (error) {
      console.error("Error dismissing report:", error);
      toast.error("Chyba při aktualizaci");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen pb-20">
      <h1 className="text-3xl font-bold text-text mb-8 flex items-center gap-2">
        <AlertTriangle className="text-red-500" />
        Admin Panel - Nahlášený obsah
      </h1>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <p className="text-text-secondary">Žádná aktivní nahlášení.</p>
        ) : (
          reports.map((report) => (
            <div 
              key={report.id} 
              className={`bg-surface rounded-card p-6 shadow-sm border-l-4 ${
                report.status === 'pending' ? 'border-red-500' : 'border-gray-300 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                    report.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {report.status}
                  </span>
                  <p className="text-sm text-text-secondary mt-2">
                    Nahlásil: <strong>{report.profiles?.username || "Neznámý"}</strong> • Důvod: <strong>{report.reason}</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleDismissReport(report.id)}
                        className="p-2 text-text-secondary hover:bg-surfaceAlt rounded-full"
                        title="Ignorovat"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => report.mood_entries && handleDeleteEntry(report.mood_entries.id, report.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        title="Smazat příspěvek"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {report.mood_entries ? (
                <div className="bg-surfaceAlt p-4 rounded-lg">
                  <h3 className="font-bold text-text">{report.mood_entries.headline}</h3>
                  <p className="text-text-secondary text-sm mt-1">{report.mood_entries.reflection}</p>
                  {report.mood_entries.image_url && (
                    <img src={report.mood_entries.image_url} alt="Reported content" className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>
              ) : (
                <p className="text-text-tertiary italic">Příspěvek již byl smazán.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
