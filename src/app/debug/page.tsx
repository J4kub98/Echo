"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const [status, setStatus] = useState<string>("Checking...");
  const [envCheck, setEnvCheck] = useState<any>({});
  const [errorDetails, setErrorDetails] = useState<string>("");

  useEffect(() => {
    const checkConnection = async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      setEnvCheck({
        urlPresent: !!url,
        urlValue: url ? `${url.substring(0, 15)}...` : "MISSING",
        keyPresent: !!key,
        keyValue: key ? `${key.substring(0, 10)}...` : "MISSING",
      });

      try {
        const { count, error } = await supabase
          .from("mood_entries")
          .select("*", { count: "exact", head: true });

        if (error) {
          setStatus("Error");
          setErrorDetails(JSON.stringify(error, null, 2));
        } else {
          setStatus("Connected Successfully");
          setErrorDetails(`Found ${count} entries (Connection OK)`);
        }
      } catch (err: any) {
        setStatus("Network/Client Error");
        setErrorDetails(err.message || JSON.stringify(err));
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">System Debug</h1>
      
      <div className="p-4 bg-gray-100 rounded-lg space-y-2">
        <h2 className="font-bold">Environment Variables</h2>
        <pre className="text-sm">{JSON.stringify(envCheck, null, 2)}</pre>
      </div>

      <div className={`p-4 rounded-lg ${status.includes("Success") ? "bg-green-100" : "bg-red-100"}`}>
        <h2 className="font-bold">Connection Status</h2>
        <p className="font-bold text-lg">{status}</p>
        <pre className="mt-2 text-xs overflow-auto p-2 bg-white/50 rounded">
          {errorDetails}
        </pre>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>If Status is "Network/Client Error", check:</p>
        <ul className="list-disc pl-5">
          <li>Is the Supabase project paused?</li>
          <li>Are you using an Ad Blocker?</li>
          <li>Is the URL correct in Vercel?</li>
        </ul>
      </div>
    </div>
  );
}
