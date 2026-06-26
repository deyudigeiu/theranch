import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_EMAILS = [
  "andrei.spataru2391@gmail.com",
  "poteras_denis@yahoo.com",
];

export const isAdmin = (session) =>
  ADMIN_EMAILS.includes(session?.user?.email);
