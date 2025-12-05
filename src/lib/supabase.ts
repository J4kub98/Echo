import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Types matching backend schema
export interface MoodEntry {
  id: string;
  author_id: string;
  headline: string;
  reflection: string;
  scope: "public" | "community" | "circle" | "private";
  tags: string[];
  mood_tone: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface Reaction {
  id: string;
  entry_id: string;
  user_id: string;
  reaction: "like" | "quote";
  text?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  updated_at: string;
}
